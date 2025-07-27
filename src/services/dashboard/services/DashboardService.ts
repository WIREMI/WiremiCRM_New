import { prisma } from '../../../config/database';
import { DashboardConfig, Widget } from '@prisma/client';
import { metricService } from './MetricService';

export interface DashboardWithWidgets extends DashboardConfig {
  widgets: Widget[];
}

export interface DashboardData extends DashboardWithWidgets {
  widgetData: Record<string, any>;
}

export class DashboardService {
  /**
   * Load complete dashboard with widgets and their data
   */
  async loadDashboard(configId: string, userId: string): Promise<DashboardData> {
    // Get dashboard configuration with widgets
    const dashboard = await prisma.dashboardConfig.findFirst({
      where: {
        id: configId,
        OR: [
          { userId },
          { isShared: true }
        ]
      },
      include: {
        widgets: {
          where: { isVisible: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!dashboard) {
      throw new Error('Dashboard not found or access denied');
    }

    // Load data for all widgets
    const widgetData: Record<string, any> = {};
    
    // Process widgets in batches for performance
    const batchSize = 5;
    const widgetBatches = this.chunkArray(dashboard.widgets, batchSize);
    
    for (const batch of widgetBatches) {
      const promises = batch.map(async (widget) => {
        try {
          const data = await this.loadWidgetData(widget);
          return { widgetId: widget.id, data };
        } catch (error) {
          console.error(`Error loading data for widget ${widget.id}:`, error);
          return { widgetId: widget.id, data: { error: error.message } };
        }
      });
      
      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ widgetId, data }) => {
        widgetData[widgetId] = data;
      });
    }

    return {
      ...dashboard,
      widgetData
    };
  }

  /**
   * Save dashboard configuration
   */
  async saveDashboard(
    config: Partial<DashboardConfig> & { widgets?: Partial<Widget>[] },
    userId: string
  ): Promise<DashboardConfig> {
    const { widgets, ...dashboardData } = config;

    if (config.id) {
      // Update existing dashboard
      const updated = await prisma.dashboardConfig.update({
        where: { 
          id: config.id,
          userId // Ensure user owns the dashboard
        },
        data: {
          ...dashboardData,
          updatedAt: new Date()
        }
      });

      // Update widgets if provided
      if (widgets) {
        await this.updateWidgets(config.id, widgets);
      }

      return updated;
    } else {
      // Create new dashboard
      const created = await prisma.dashboardConfig.create({
        data: {
          ...dashboardData,
          userId,
          createdAt: new Date(),
          updatedAt: new Date()
        } as any
      });

      // Create widgets if provided
      if (widgets) {
        await this.createWidgets(created.id, widgets);
      }

      return created;
    }
  }

  /**
   * Clone dashboard with new ownership
   */
  async cloneDashboard(sourceId: string, userId: string, newName: string): Promise<DashboardConfig> {
    const source = await prisma.dashboardConfig.findUnique({
      where: { id: sourceId },
      include: { widgets: true }
    });

    if (!source) {
      throw new Error('Source dashboard not found');
    }

    // Create new dashboard
    const cloned = await prisma.dashboardConfig.create({
      data: {
        userId,
        name: newName,
        description: `Cloned from: ${source.name}`,
        layout: source.layout,
        isDefault: false,
        isShared: false,
        tags: source.tags
      }
    });

    // Clone widgets
    if (source.widgets.length > 0) {
      const widgetData = source.widgets.map(widget => ({
        configId: cloned.id,
        metricKey: widget.metricKey,
        type: widget.type,
        title: widget.title,
        settings: widget.settings,
        position: widget.position,
        refreshInterval: widget.refreshInterval,
        filters: widget.filters,
        isVisible: widget.isVisible
      }));

      await prisma.widget.createMany({
        data: widgetData
      });
    }

    return cloned;
  }

  /**
   * Get user's dashboards
   */
  async getUserDashboards(userId: string): Promise<DashboardConfig[]> {
    return prisma.dashboardConfig.findMany({
      where: {
        OR: [
          { userId },
          { isShared: true }
        ]
      },
      orderBy: [
        { isDefault: 'desc' },
        { updatedAt: 'desc' }
      ]
    });
  }

  /**
   * Delete dashboard
   */
  async deleteDashboard(configId: string, userId: string): Promise<void> {
    const dashboard = await prisma.dashboardConfig.findFirst({
      where: { id: configId, userId }
    });

    if (!dashboard) {
      throw new Error('Dashboard not found or access denied');
    }

    // Delete dashboard (widgets will be cascade deleted)
    await prisma.dashboardConfig.delete({
      where: { id: configId }
    });
  }

  /**
   * Share dashboard
   */
  async shareDashboard(configId: string, userId: string, isShared: boolean): Promise<string | null> {
    const dashboard = await prisma.dashboardConfig.findFirst({
      where: { id: configId, userId }
    });

    if (!dashboard) {
      throw new Error('Dashboard not found or access denied');
    }

    let shareToken = null;
    if (isShared) {
      shareToken = this.generateShareToken();
    }

    await prisma.dashboardConfig.update({
      where: { id: configId },
      data: {
        isShared,
        shareToken,
        updatedAt: new Date()
      }
    });

    return shareToken;
  }

  /**
   * Get dashboard by share token
   */
  async getDashboardByShareToken(shareToken: string): Promise<DashboardWithWidgets | null> {
    return prisma.dashboardConfig.findUnique({
      where: { shareToken },
      include: {
        widgets: {
          where: { isVisible: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  /**
   * Export dashboard configuration
   */
  async exportDashboard(configId: string, userId: string, format: 'json' | 'yaml' = 'json'): Promise<string> {
    const dashboard = await prisma.dashboardConfig.findFirst({
      where: {
        id: configId,
        OR: [
          { userId },
          { isShared: true }
        ]
      },
      include: {
        widgets: true
      }
    });

    if (!dashboard) {
      throw new Error('Dashboard not found or access denied');
    }

    const exportData = {
      dashboard: {
        name: dashboard.name,
        description: dashboard.description,
        layout: dashboard.layout,
        tags: dashboard.tags
      },
      widgets: dashboard.widgets.map(widget => ({
        metricKey: widget.metricKey,
        type: widget.type,
        title: widget.title,
        settings: widget.settings,
        position: widget.position,
        filters: widget.filters
      })),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    } else {
      // TODO: Implement YAML export
      throw new Error('YAML export not yet implemented');
    }
  }

  // Private helper methods
  private async loadWidgetData(widget: Widget): Promise<any> {
    const filters = widget.filters as Record<string, any> || {};
    
    switch (widget.type) {
      case 'KPI':
        return metricService.calculateMetric(widget.metricKey, filters);
      
      case 'LINE_CHART':
      case 'BAR_CHART':
        const settings = widget.settings as any;
        return metricService.getHistoricalData(
          widget.metricKey,
          settings.timeRange || '24h',
          settings.granularity || 'hour',
          filters
        );
      
      case 'TABLE':
        // For tables, we might need different data structure
        return this.loadTableData(widget);
      
      case 'GAUGE':
        const gaugeData = await metricService.calculateMetric(widget.metricKey, filters);
        return {
          ...gaugeData,
          min: (widget.settings as any).min || 0,
          max: (widget.settings as any).max || 100,
          target: (widget.settings as any).target
        };
      
      default:
        return metricService.calculateMetric(widget.metricKey, filters);
    }
  }

  private async loadTableData(widget: Widget): Promise<any> {
    // This would implement table-specific data loading
    // For now, return mock table data
    return {
      columns: [
        { key: 'name', label: 'Name', type: 'string' },
        { key: 'value', label: 'Value', type: 'number' },
        { key: 'change', label: 'Change', type: 'percentage' }
      ],
      rows: [
        { name: 'Item 1', value: 1000, change: 5.2 },
        { name: 'Item 2', value: 850, change: -2.1 },
        { name: 'Item 3', value: 1200, change: 8.7 }
      ],
      totalRows: 3
    };
  }

  private async updateWidgets(configId: string, widgets: Partial<Widget>[]): Promise<void> {
    for (const widget of widgets) {
      if (widget.id) {
        // Update existing widget
        await prisma.widget.update({
          where: { id: widget.id },
          data: {
            ...widget,
            updatedAt: new Date()
          }
        });
      } else {
        // Create new widget
        await prisma.widget.create({
          data: {
            ...widget,
            configId
          } as any
        });
      }
    }
  }

  private async createWidgets(configId: string, widgets: Partial<Widget>[]): Promise<void> {
    const widgetData = widgets.map(widget => ({
      ...widget,
      configId
    }));

    await prisma.widget.createMany({
      data: widgetData as any
    });
  }

  private generateShareToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export const dashboardService = new DashboardService();