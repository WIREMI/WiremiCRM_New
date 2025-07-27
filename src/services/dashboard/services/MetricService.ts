import { prisma, redis } from '../../../config/database';
import { MetricDefinition, MetricCache } from '@prisma/client';

export interface MetricValue {
  value: number;
  timestamp: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    comparison: string;
  };
  metadata?: Record<string, any>;
}

export interface TimeSeriesData {
  timestamps: string[];
  values: number[];
  labels?: string[];
  metadata?: Record<string, any>;
}

export interface MetricAggregation {
  sum: number;
  avg: number;
  min: number;
  max: number;
  count: number;
  stdDev?: number;
  percentiles?: { p50: number; p90: number; p95: number; p99: number };
}

export interface AnomalyDetection {
  isAnomaly: boolean;
  score: number;
  expectedRange: { min: number; max: number };
  confidence: number;
}

export interface MetricAggregation {
  sum: number;
  avg: number;
  min: number;
  max: number;
  count: number;
  stdDev?: number;
  percentiles?: { p50: number; p90: number; p95: number; p99: number };
}

export interface AnomalyDetection {
  isAnomaly: boolean;
  score: number;
  expectedRange: { min: number; max: number };
  confidence: number;
}
export class MetricService {
  private readonly cachePrefix = 'metric:';
  private readonly defaultTTL = parseInt(process.env.METRIC_CACHE_TTL_DEFAULT || '300');
  private readonly maxConcurrency = parseInt(process.env.METRIC_CONCURRENCY || '10');
  private readonly maxConcurrency = parseInt(process.env.METRIC_CONCURRENCY || '10');

  /**
   * Calculate metric value with intelligent caching and performance optimization
   */
  async calculateMetric(
    metricKey: string, 
    filters: Record<string, any> = {}, 
    useCache: boolean = true,
    forceRefresh: boolean = false
  ): Promise<MetricValue> {
    const cacheKey = this.generateCacheKey(metricKey, filters);
    
    // Try cache first if enabled and not forcing refresh
    if (useCache && !forceRefresh) {
      const cached = await this.getCachedValue(cacheKey);
      if (cached) {
        // Update cache hit metrics
        await this.recordCacheHit(metricKey);
        return cached;
      }
    }

    // Get metric definition
    const metricDef = await this.getMetricDefinition(metricKey);
    if (!metricDef) {
      throw new Error(`Metric definition not found: ${metricKey}`);
    }

    // Validate metric is active
    if (!metricDef.isActive) {
      throw new Error(`Metric ${metricKey} is not active`);
    }

    // Calculate fresh value
    const value = await this.executeCalculation(metricDef, filters);
    
    // Calculate trend if possible
    const trend = await this.calculateTrend(metricKey, value.value, filters);
    
    // Detect anomalies
    const anomaly = await this.detectAnomaly(metricKey, value.value, filters);
    
    const result: MetricValue = {
      ...value,
      trend,
      timestamp: new Date().toISOString(),
      metadata: {
        ...value.metadata,
        anomaly,
        cacheKey,
        calculationDuration: Date.now() - (value.metadata?.calculationTime || Date.now())
      }
    };

    // Cache the result
    if (useCache) {
      await this.cacheValue(cacheKey, result, metricDef.refreshInterval);
      await this.recordCacheMiss(metricKey);
    }

    return result;
  }

  /**
   * Get historical data for trending and charts with advanced aggregations
   */
  async getHistoricalData(
    metricKey: string,
    timeRange: string = '24h',
    granularity: string = 'hour',
    filters: Record<string, any> = {},
    aggregations: string[] = ['avg']
  ): Promise<TimeSeriesData> {
    const cacheKey = `${this.cachePrefix}timeseries:${metricKey}:${timeRange}:${granularity}:${aggregations.join(',')}:${JSON.stringify(filters)}`;
    
    // Try cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const metricDef = await this.getMetricDefinition(metricKey);
    if (!metricDef) {
      throw new Error(`Metric definition not found: ${metricKey}`);
    }

    // Generate time series data
    const timeSeries = await this.generateTimeSeries(metricDef, timeRange, granularity, filters, aggregations);
    
    // Cache for shorter duration (5 minutes for time series)
    await redis.setex(cacheKey, 300, JSON.stringify(timeSeries));
    
    return timeSeries;
  }

  /**
   * Batch calculate multiple metrics with concurrency control
   */
  async batchCalculateMetrics(
    metricKeys: string[],
    filters: Record<string, any> = {},
    useCache: boolean = true,
    forceRefresh: boolean = false
  ): Promise<Record<string, MetricValue>> {
    const results: Record<string, MetricValue> = {};
    
    // Process in parallel with configurable concurrency limit
    const chunks = this.chunkArray(metricKeys, this.maxConcurrency);
    
    for (const chunk of chunks) {
      const promises = chunk.map(key => 
        this.calculateMetric(key, filters, useCache).catch(error => ({
          error: error.message,
          key
        }))
      );
      
      const chunkResults = await Promise.all(promises);
      
      chunkResults.forEach((result, index) => {
        const key = chunk[index];
        if ('error' in result) {
          console.error(`Error calculating metric ${key}:`, result.error);
          // Store error result for debugging
          results[key] = {
            value: 0,
            timestamp: new Date().toISOString(),
            metadata: { error: result.error }
          };
        } else {
          results[key] = result as MetricValue;
        }
      });
    }
    
    return results;
  }

  /**
   * Get metric aggregations for advanced analytics
   */
  async getMetricAggregations(
    metricKey: string,
    timeRange: string = '24h',
    filters: Record<string, any> = {}
  ): Promise<MetricAggregation> {
    const cacheKey = `${this.cachePrefix}agg:${metricKey}:${timeRange}:${JSON.stringify(filters)}`;
    
    // Try cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const metricDef = await this.getMetricDefinition(metricKey);
    if (!metricDef) {
      throw new Error(`Metric definition not found: ${metricKey}`);
    }

    // Calculate aggregations
    const aggregations = await this.calculateAggregations(metricDef, timeRange, filters);
    
    // Cache for 10 minutes
    await redis.setex(cacheKey, 600, JSON.stringify(aggregations));
    
    return aggregations;
  }

  /**
   * Detect anomalies in metric values
   */
  async detectAnomaly(
    metricKey: string,
    currentValue: number,
    filters: Record<string, any> = {}
  ): Promise<AnomalyDetection> {
    try {
      // Get historical data for anomaly detection
      const historicalData = await this.getHistoricalData(metricKey, '7d', 'hour', filters);
      
      if (historicalData.values.length < 24) {
        return {
          isAnomaly: false,
          score: 0,
          expectedRange: { min: currentValue, max: currentValue },
          confidence: 0
        };
      }

      // Simple statistical anomaly detection
      const values = historicalData.values;
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      
      const zScore = Math.abs((currentValue - mean) / stdDev);
      const threshold = 2.5; // 2.5 standard deviations
      
      return {
        isAnomaly: zScore > threshold,
        score: zScore,
        expectedRange: {
          min: mean - (threshold * stdDev),
          max: mean + (threshold * stdDev)
        },
        confidence: Math.min(zScore / threshold, 1)
      };
    } catch (error) {
      console.error('Error detecting anomaly:', error);
      return {
        isAnomaly: false,
        score: 0,
        expectedRange: { min: currentValue, max: currentValue },
        confidence: 0
      };
    }
  }
  /**
   * Invalidate cache for specific metric
   */
  async invalidateCache(metricKey: string, filters?: Record<string, any>): Promise<void> {
    if (filters) {
      const cacheKey = this.generateCacheKey(metricKey, filters);
      await redis.del(cacheKey);
    } else {
      // Invalidate all cache entries for this metric
      const pattern = `${this.cachePrefix}${metricKey}:*`;
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }
    
    // Also invalidate time series cache
    const timeSeriesPattern = `${this.cachePrefix}timeseries:${metricKey}:*`;
    const timeSeriesKeys = await redis.keys(timeSeriesPattern);
    if (timeSeriesKeys.length > 0) {
      await redis.del(...timeSeriesKeys);
    }

    // Invalidate aggregation cache
    const aggPattern = `${this.cachePrefix}agg:${metricKey}:*`;
    const aggKeys = await redis.keys(aggPattern);
    if (aggKeys.length > 0) {
      await redis.del(...aggKeys);
    }

    // Update database cache entries
    await prisma.metricCache.deleteMany({
      where: {
        metricKey,
        ...(filters && { filters })
      }
    });
  }

  /**
   * Enhanced query validation for security and performance
   */
  validateCalculationQuery(query: string): boolean {
    // Enhanced SQL injection prevention
    const dangerousPatterns = [
      /;\s*(drop|delete|truncate|alter|create|insert|update)\s+/i,
      /union\s+select/i,
      /exec\s*\(/i,
      /xp_cmdshell/i,
      /sp_executesql/i,
      /--/,
      /\/\*/,
      /\*\//,
      /\bor\s+1\s*=\s*1/i,
      /\band\s+1\s*=\s*1/i,
      /\bselect\s+.*\bfrom\s+information_schema/i,
      /\bselect\s+.*\bfrom\s+sys\./i
    ];
    
    const isValid = !dangerousPatterns.some(pattern => pattern.test(query));
    
    // Additional validation for performance
    if (isValid) {
      // Check for potentially expensive operations
      const expensivePatterns = [
        /\bcross\s+join\b/i,
        /\bselect\s+\*\s+from\s+\w+\s*$/i, // SELECT * without WHERE
        /\bgroup\s+by\s+.*\bhaving\s+count\(\*\)\s*>\s*\d{4}/i // Large GROUP BY
      ];
      
      if (expensivePatterns.some(pattern => pattern.test(query))) {
        console.warn(`Potentially expensive query detected: ${query.substring(0, 100)}...`);
      }
    }
    
    return isValid;
  }

  /**
   * Get available metrics with metadata
   */
  async getAvailableMetrics(
    category?: string,
    includeInactive: boolean = false,
    userId?: string
  ): Promise<MetricDefinition[]> {
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (!includeInactive) {
      where.isActive = true;
    }
    
    if (userId) {
      where.OR = [
        { createdBy: userId },
        { metadata: { path: ['isPublic'], equals: true } }
      ];
    }
    
    return prisma.metricDefinition.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: {
            widgets: true,
            alertRules: true
          }
        }
      }
    });
  }

  /**
   * Get metric usage statistics
   */
  async getMetricUsageStats(metricKey: string): Promise<{
    widgetCount: number;
    alertCount: number;
    cacheHitRate: number;
    avgCalculationTime: number;
    lastCalculated: Date | null;
  }> {
    const [widgetCount, alertCount, cacheStats] = await Promise.all([
      prisma.widget.count({ where: { metricKey } }),
      prisma.alertRule.count({ where: { metricKey } }),
      this.getCacheStats(metricKey)
    ]);

    return {
      widgetCount,
      alertCount,
      cacheHitRate: cacheStats.hitRate,
      avgCalculationTime: cacheStats.avgCalculationTime,
      lastCalculated: cacheStats.lastCalculated
    };
  }
  /**
   * Create or update metric definition
   */
  async saveMetricDefinition(data: Partial<MetricDefinition>): Promise<MetricDefinition> {
    // Validate calculation query
    if (data.calculationQuery && !this.validateCalculationQuery(data.calculationQuery)) {
      throw new Error('Invalid calculation query detected');
    }

    if (data.id) {
      // Update existing
      const updated = await prisma.metricDefinition.update({
        where: { id: data.id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });
      
      // Invalidate cache
      if (updated.key) {
        await this.invalidateCache(updated.key);
      }
      
      return updated;
    } else {
      // Create new
      return prisma.metricDefinition.create({
        data: data as any
      });
    }
  }

  // Private helper methods - Enhanced
  private generateCacheKey(metricKey: string, filters: Record<string, any>): string {
    const filtersHash = Object.keys(filters).length > 0 
      ? `:${Buffer.from(JSON.stringify(filters)).toString('base64')}`
      : '';
    return `${this.cachePrefix}${metricKey}${filtersHash}`;
  }

  private async getCachedValue(cacheKey: string): Promise<MetricValue | null> {
    try {
      const cached = await redis.get(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  private async cacheValue(cacheKey: string, value: MetricValue, ttl: number): Promise<void> {
    try {
      await redis.setex(cacheKey, ttl, JSON.stringify(value));
      
      // Also store in database cache for persistence
      const metricKey = cacheKey.split(':')[1];
      await prisma.metricCache.upsert({
        where: {
          metricKey_filters: {
            metricKey,
            filters: value.metadata?.filters || {}
          }
        },
        update: {
          value: value.value,
          metadata: value.metadata,
          expiresAt: new Date(Date.now() + ttl * 1000)
        },
        create: {
          metricKey,
          filters: value.metadata?.filters || {},
          value: value.value,
          metadata: value.metadata,
          expiresAt: new Date(Date.now() + ttl * 1000)
        }
      });
    } catch (error) {
      console.error('Cache storage error:', error);
    }
  }

  private async getMetricDefinition(metricKey: string): Promise<MetricDefinition | null> {
    return prisma.metricDefinition.findUnique({
      where: { key: metricKey }
    });
  }

  private async executeCalculation(
    metricDef: MetricDefinition, 
    filters: Record<string, any>
  ): Promise<Omit<MetricValue, 'timestamp' | 'trend'>> {
    try {
      const startTime = Date.now();
      
      // This would execute the actual SQL query against your data warehouse
      // For now, we'll simulate with mock data
      const mockValue = this.generateRealisticMockValue(metricDef.category);
      
      const calculationTime = Date.now() - startTime;
      
      return {
        value: mockValue,
        metadata: {
          calculationTime: startTime,
          calculationDuration: calculationTime,
          filters,
          source: metricDef.dataSource,
          category: metricDef.category,
          unit: metricDef.metadata?.unit || 'count'
        }
      };
    } catch (error) {
      console.error(`Error executing calculation for ${metricDef.key}:`, error);
      throw new Error(`Failed to calculate metric: ${error.message}`);
    }
  }

  private generateRealisticMockValue(category: string): number {
    const baseValues = {
      'revenue': 50000 + Math.random() * 100000,
      'users': 1000 + Math.random() * 5000,
      'performance': 0.8 + Math.random() * 0.2,
      'transactions': 100 + Math.random() * 500,
      'default': Math.random() * 1000
    };
    
    return baseValues[category] || baseValues.default;
  }

  private async calculateTrend(
    metricKey: string,
    currentValue: number,
    filters: Record<string, any>
  ): Promise<MetricValue['trend']> {
    try {
      // Get previous period value for comparison
      const historicalData = await this.getHistoricalData(metricKey, '7d', 'day', filters);
      
      if (historicalData.values.length < 2) {
        return undefined;
      }
      
      const previousValue = historicalData.values[historicalData.values.length - 2];
      
      if (previousValue === 0) return undefined;
      
      const change = currentValue - previousValue;
      const percentage = (change / previousValue) * 100;
      
      return {
        direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
        percentage: Math.abs(percentage),
        comparison: 'vs previous period'
      };
    } catch (error) {
      console.error('Error calculating trend:', error);
      return undefined;
    }
  }

  private async calculateAggregations(
    metricDef: MetricDefinition,
    timeRange: string,
    filters: Record<string, any>
  ): Promise<MetricAggregation> {
    // This would execute aggregation queries against your data warehouse
    // For now, we'll simulate with mock data
    const values = Array.from({ length: 100 }, () => Math.random() * 1000);
    
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const count = values.length;
    
    // Calculate standard deviation
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Calculate percentiles
    const sorted = values.sort((a, b) => a - b);
    const percentiles = {
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p90: sorted[Math.floor(sorted.length * 0.9)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
    
    return {
      sum,
      avg,
      min,
      max,
      count,
      stdDev,
      percentiles
    };
  }

  private async generateTimeSeries(
    metricDef: MetricDefinition,
    timeRange: string,
    granularity: string,
    filters: Record<string, any>,
    aggregations: string[] = ['avg']
  ): Promise<TimeSeriesData> {
    // Generate time points based on range and granularity
    const points = this.generateTimePoints(timeRange, granularity);
    
    // Generate realistic mock data with trends
    const baseValue = this.generateRealisticMockValue(metricDef.category);
    const values = points.map((point, index) => {
      const trend = Math.sin(index * 0.1) * 0.2; // Simulate cyclical pattern
      const noise = (Math.random() - 0.5) * 0.1; // Add some randomness
      return baseValue * (1 + trend + noise);
    });
    
    return {
      timestamps: points.map(p => p.toISOString()),
      values,
      metadata: {
        timeRange,
        granularity,
        metricKey: metricDef.key,
        aggregations,
        dataPoints: points.length,
        generatedAt: new Date().toISOString()
      }
    };
  }

  private generateTimePoints(timeRange: string, granularity: string): Date[] {
    const now = new Date();
    const points: Date[] = [];
    
    // Parse time range
    const rangeMatch = timeRange.match(/^(\d+)([hdwmy])$/);
    if (!rangeMatch) {
      throw new Error(`Invalid time range format: ${timeRange}`);
    }
    
    const [, amount, unit] = rangeMatch;
    const numAmount = parseInt(amount);
    
    // Calculate start time
    let startTime = new Date(now);
    switch (unit) {
      case 'h':
        startTime.setHours(startTime.getHours() - numAmount);
        break;
      case 'd':
        startTime.setDate(startTime.getDate() - numAmount);
        break;
      case 'w':
        startTime.setDate(startTime.getDate() - (numAmount * 7));
        break;
      case 'm':
        startTime.setMonth(startTime.getMonth() - numAmount);
        break;
      case 'y':
        startTime.setFullYear(startTime.getFullYear() - numAmount);
        break;
    }
    
    // Generate points based on granularity
    let current = new Date(startTime);
    while (current <= now) {
      points.push(new Date(current));
      
      switch (granularity) {
        case 'minute':
          current.setMinutes(current.getMinutes() + 1);
          break;
        case 'hour':
          current.setHours(current.getHours() + 1);
          break;
        case 'day':
          current.setDate(current.getDate() + 1);
          break;
        case 'week':
          current.setDate(current.getDate() + 7);
          break;
        case 'month':
          current.setMonth(current.getMonth() + 1);
          break;
      }
    }
    
    return points;
  }

  private async recordCacheHit(metricKey: string): Promise<void> {
    const key = `${this.cachePrefix}stats:${metricKey}:hits`;
    await redis.incr(key);
    await redis.expire(key, 86400); // Expire after 24 hours
  }

  private async recordCacheMiss(metricKey: string): Promise<void> {
    const key = `${this.cachePrefix}stats:${metricKey}:misses`;
    await redis.incr(key);
    await redis.expire(key, 86400); // Expire after 24 hours
  }

  private async getCacheStats(metricKey: string): Promise<{
    hitRate: number;
    avgCalculationTime: number;
    lastCalculated: Date | null;
  }> {
    const [hits, misses] = await Promise.all([
      redis.get(`${this.cachePrefix}stats:${metricKey}:hits`),
      redis.get(`${this.cachePrefix}stats:${metricKey}:misses`)
    ]);

    const hitCount = parseInt(hits || '0');
    const missCount = parseInt(misses || '0');
    const total = hitCount + missCount;
    
    const hitRate = total > 0 ? hitCount / total : 0;

    // Get last calculation time from cache
    const lastCache = await prisma.metricCache.findFirst({
      where: { metricKey },
      orderBy: { createdAt: 'desc' }
    });

    return {
      hitRate,
      avgCalculationTime: 150, // Mock value - would calculate from actual data
      lastCalculated: lastCache?.createdAt || null
    };
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Get metric value with fallback to database cache
   */
  async getMetricValue(metricKey: string, filters: Record<string, any> = {}): Promise<MetricValue> {
    try {
      return await this.calculateMetric(metricKey, filters);
    } catch (error) {
      // Fallback to database cache
      const cached = await prisma.metricCache.findFirst({
        where: {
          metricKey,
          filters,
          expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (cached) {
        return {
          value: cached.value,
          timestamp: cached.createdAt.toISOString(),
          metadata: { ...cached.metadata, fromCache: true }
        };
      }

      throw error;
    }
  }

  /**
   * Get metric time series with fallback
   */
  async getMetricTimeSeries(
    metricKey: string,
    timeRange: string = '24h',
    granularity: string = 'hour',
    filters: Record<string, any> = {}
  ): Promise<TimeSeriesData> {
    try {
      return await this.getHistoricalData(metricKey, timeRange, granularity, filters);
    } catch (error) {
      console.error(`Error getting time series for ${metricKey}:`, error);
      // Return empty time series as fallback
      return {
        timestamps: [],
        values: [],
        metadata: { error: error.message }
      };
    }
  }
}

export const metricService = new MetricService();