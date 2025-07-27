import { Widget, WidgetType, TimeSeriesData, TableData, MetricValue } from '../models/MetricDefinition';
import { MetricService } from './MetricService';

export class WidgetService {
  private metricService: MetricService;

  constructor() {
    this.metricService = new MetricService();
  }

  /**
   * Get widget data based on widget type and configuration
   */
  async getWidgetData(widget: Widget): Promise<any> {
    try {
      switch (widget.type) {
        case WidgetType.KPI:
          return await this.getKpiData(widget);
        
        case WidgetType.LINE_CHART:
        case WidgetType.BAR_CHART:
          return await this.getChartData(widget);
        
        case WidgetType.PIE_CHART:
          return await this.getPieChartData(widget);
        
        case WidgetType.TABLE:
          return await this.getTableData(widget);
        
        case WidgetType.GAUGE:
          return await this.getGaugeData(widget);
        
        case WidgetType.HEATMAP:
          return await this.getHeatmapData(widget);
        
        default:
          throw new Error(`Unsupported widget type: ${widget.type}`);
      }
    } catch (error) {
      console.error(`Error getting widget data for ${widget.id}:`, error);
      return this.getErrorData(widget.type);
    }
  }

  /**
   * Get KPI widget data
   */
  private async getKpiData(widget: Widget): Promise<{
    value: number;
    formattedValue: string;
    trend?: {
      direction: 'up' | 'down' | 'stable';
      percentage: number;
      comparison: string;
    };
    target?: number;
    unit: string;
  }> {
    const metricValue = await this.metricService.getMetricValue(widget.metricKey);
    
    return {
      value: metricValue.value,
      formattedValue: this.formatValue(metricValue.value, widget.settings),
      trend: metricValue.trend,
      target: widget.settings.target,
      unit: widget.settings.unit || ''
    };
  }

  /**
   * Get chart data (line/bar charts)
   */
  private async getChartData(widget: Widget): Promise<{
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
    }[];
    labels: string[];
    options: any;
  }> {
    const timeRange = widget.settings.timeRange || '24h';
    const granularity = widget.settings.granularity || 'hour';
    
    const timeSeries = await this.metricService.getMetricTimeSeries(
      widget.metricKey,
      timeRange,
      granularity
    );

    return {
      datasets: [{
        label: widget.title,
        data: timeSeries.values,
        backgroundColor: widget.settings.colors?.[0] || '#3B82F6',
        borderColor: widget.settings.colors?.[0] || '#3B82F6'
      }],
      labels: timeSeries.timestamps.map(ts => this.formatTimestamp(ts, granularity)),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: widget.settings.showLegend !== false
          }
        },
        scales: {
          y: {
            grid: {
              display: widget.settings.showGrid !== false
            }
          }
        }
      }
    };
  }

  /**
   * Get pie chart data
   */
  private async getPieChartData(widget: Widget): Promise<{
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
    labels: string[];
  }> {
    // TODO: Implement pie chart data aggregation
    // This would typically group data by a dimension
    
    return {
      datasets: [{
        data: [30, 25, 20, 15, 10],
        backgroundColor: widget.settings.colors || [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
        ]
      }],
      labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E']
    };
  }

  /**
   * Get table data
   */
  private async getTableData(widget: Widget): Promise<TableData> {
    // TODO: Implement table data query based on widget settings
    
    return {
      columns: [
        { key: 'name', label: 'Name', type: 'string', sortable: true },
        { key: 'value', label: 'Value', type: 'currency', sortable: true },
        { key: 'change', label: 'Change', type: 'percentage', sortable: true },
        { key: 'date', label: 'Date', type: 'date', sortable: true }
      ],
      rows: [
        { name: 'Item 1', value: 1000, change: 5.2, date: '2024-01-15' },
        { name: 'Item 2', value: 850, change: -2.1, date: '2024-01-14' },
        { name: 'Item 3', value: 1200, change: 8.7, date: '2024-01-13' }
      ],
      totalRows: 3,
      pagination: {
        page: 1,
        pageSize: 10,
        totalPages: 1
      }
    };
  }

  /**
   * Get gauge data
   */
  private async getGaugeData(widget: Widget): Promise<{
    value: number;
    min: number;
    max: number;
    target?: number;
    thresholds: { value: number; color: string }[];
  }> {
    const metricValue = await this.metricService.getMetricValue(widget.metricKey);
    
    return {
      value: metricValue.value,
      min: widget.settings.min || 0,
      max: widget.settings.max || 100,
      target: widget.settings.target,
      thresholds: widget.settings.thresholds || [
        { value: 30, color: '#EF4444' },
        { value: 70, color: '#F59E0B' },
        { value: 100, color: '#10B981' }
      ]
    };
  }

  /**
   * Get heatmap data
   */
  private async getHeatmapData(widget: Widget): Promise<{
    data: { x: string; y: string; value: number }[];
    xLabels: string[];
    yLabels: string[];
  }> {
    // TODO: Implement heatmap data aggregation
    
    return {
      data: [
        { x: 'Mon', y: '00:00', value: 10 },
        { x: 'Mon', y: '01:00', value: 5 },
        { x: 'Tue', y: '00:00', value: 15 },
        // ... more data points
      ],
      xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      yLabels: ['00:00', '01:00', '02:00', '03:00', '04:00']
    };
  }

  /**
   * Format value based on widget settings
   */
  private formatValue(value: number, settings: any): string {
    const { format, unit, decimals = 2 } = settings;
    
    switch (format) {
      case 'CURRENCY':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: decimals
        }).format(value);
      
      case 'PERCENTAGE':
        return `${(value * 100).toFixed(decimals)}%`;
      
      case 'NUMBER':
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals
        }).format(value);
      
      default:
        return `${value.toFixed(decimals)}${unit ? ` ${unit}` : ''}`;
    }
  }

  /**
   * Format timestamp for chart labels
   */
  private formatTimestamp(timestamp: string, granularity: string): string {
    const date = new Date(timestamp);
    
    switch (granularity) {
      case 'hour':
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      case 'day':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'week':
        return `Week ${Math.ceil(date.getDate() / 7)}`;
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      default:
        return date.toLocaleString();
    }
  }

  /**
   * Get error data for failed widget loads
   */
  private getErrorData(widgetType: WidgetType): any {
    switch (widgetType) {
      case WidgetType.KPI:
        return {
          value: 0,
          formattedValue: 'Error',
          error: true
        };
      
      case WidgetType.LINE_CHART:
      case WidgetType.BAR_CHART:
        return {
          datasets: [],
          labels: [],
          error: true
        };
      
      case WidgetType.TABLE:
        return {
          columns: [],
          rows: [],
          error: true
        };
      
      default:
        return { error: true };
    }
  }

  /**
   * Validate widget configuration
   */
  validateWidgetConfig(widget: Widget): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!widget.metricKey) {
      errors.push('Metric key is required');
    }
    
    if (!widget.type) {
      errors.push('Widget type is required');
    }
    
    // Type-specific validations
    switch (widget.type) {
      case WidgetType.GAUGE:
        if (!widget.settings.max) {
          errors.push('Gauge widget requires max value');
        }
        break;
      
      case WidgetType.TABLE:
        if (!widget.settings.columns || widget.settings.columns.length === 0) {
          errors.push('Table widget requires column configuration');
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}