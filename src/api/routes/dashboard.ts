import express from 'express';
import { dashboardService } from '../../services/dashboard/services/DashboardService';
import { metricService } from '../../services/dashboard/services/MetricService';
import { authenticate, authorize } from '../../middleware/auth';
import { rateLimit } from '../../middleware/rateLimit';
import { validateRequest } from '../../middleware/validation';
import { auditLog } from '../../middleware/audit';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const dashboardConfigSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  layout: Joi.object().required(),
  isShared: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  widgets: Joi.array().items(Joi.object({
    metricKey: Joi.string().required(),
    type: Joi.string().valid('KPI', 'LINE_CHART', 'BAR_CHART', 'PIE_CHART', 'TABLE', 'GAUGE').required(),
    title: Joi.string().required(),
    settings: Joi.object().required(),
    position: Joi.object().required(),
    filters: Joi.object().optional()
  })).optional()
});

const metricFiltersSchema = Joi.object({
  timeRange: Joi.string().pattern(/^\d+[hdwmy]$/).optional(),
  granularity: Joi.string().valid('minute', 'hour', 'day', 'week', 'month').optional(),
  filters: Joi.object().optional()
});

// Apply authentication to all routes
router.use(authenticate);

/**
 * GET /api/v1/dashboard/configs
 * List user's dashboards
 */
router.get('/configs', 
  authorize(['admin', 'analyst', 'viewer']),
  rateLimit({ windowMs: 60000, max: 100 }),
  async (req, res) => {
    try {
      const dashboards = await dashboardService.getUserDashboards(req.user.id);
      res.json({
        success: true,
        data: dashboards,
        count: dashboards.length
      });
    } catch (error) {
      console.error('Error fetching dashboards:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboards'
      });
    }
  }
);

/**
 * POST /api/v1/dashboard/configs
 * Create new dashboard
 */
router.post('/configs',
  authorize(['admin', 'analyst']),
  rateLimit({ windowMs: 60000, max: 10 }),
  validateRequest(dashboardConfigSchema),
  auditLog('dashboard', 'create'),
  async (req, res) => {
    try {
      const dashboard = await dashboardService.saveDashboard(req.body, req.user.id);
      res.status(201).json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      console.error('Error creating dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create dashboard'
      });
    }
  }
);

/**
 * GET /api/v1/dashboard/configs/:id
 * Get specific dashboard with data
 */
router.get('/configs/:id',
  authorize(['admin', 'analyst', 'viewer']),
  rateLimit({ windowMs: 60000, max: 200 }),
  async (req, res) => {
    try {
      const dashboard = await dashboardService.loadDashboard(req.params.id, req.user.id);
      res.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      if (error.message.includes('not found') || error.message.includes('access denied')) {
        res.status(404).json({
          success: false,
          error: 'Dashboard not found'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to load dashboard'
        });
      }
    }
  }
);

/**
 * PUT /api/v1/dashboard/configs/:id
 * Update dashboard
 */
router.put('/configs/:id',
  authorize(['admin', 'analyst']),
  rateLimit({ windowMs: 60000, max: 20 }),
  validateRequest(dashboardConfigSchema),
  auditLog('dashboard', 'update'),
  async (req, res) => {
    try {
      const dashboard = await dashboardService.saveDashboard(
        { ...req.body, id: req.params.id },
        req.user.id
      );
      res.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      console.error('Error updating dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update dashboard'
      });
    }
  }
);

/**
 * DELETE /api/v1/dashboard/configs/:id
 * Delete dashboard
 */
router.delete('/configs/:id',
  authorize(['admin', 'analyst']),
  rateLimit({ windowMs: 60000, max: 10 }),
  auditLog('dashboard', 'delete'),
  async (req, res) => {
    try {
      await dashboardService.deleteDashboard(req.params.id, req.user.id);
      res.json({
        success: true,
        message: 'Dashboard deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete dashboard'
      });
    }
  }
);

/**
 * POST /api/v1/dashboard/configs/:id/clone
 * Clone dashboard
 */
router.post('/configs/:id/clone',
  authorize(['admin', 'analyst']),
  rateLimit({ windowMs: 60000, max: 5 }),
  validateRequest(Joi.object({ name: Joi.string().required() })),
  auditLog('dashboard', 'clone'),
  async (req, res) => {
    try {
      const cloned = await dashboardService.cloneDashboard(
        req.params.id,
        req.user.id,
        req.body.name
      );
      res.status(201).json({
        success: true,
        data: cloned
      });
    } catch (error) {
      console.error('Error cloning dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clone dashboard'
      });
    }
  }
);

/**
 * POST /api/v1/dashboard/configs/:id/share
 * Share/unshare dashboard
 */
router.post('/configs/:id/share',
  authorize(['admin', 'analyst']),
  rateLimit({ windowMs: 60000, max: 10 }),
  validateRequest(Joi.object({ isShared: Joi.boolean().required() })),
  auditLog('dashboard', 'share'),
  async (req, res) => {
    try {
      const shareToken = await dashboardService.shareDashboard(
        req.params.id,
        req.user.id,
        req.body.isShared
      );
      res.json({
        success: true,
        data: { shareToken }
      });
    } catch (error) {
      console.error('Error sharing dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to share dashboard'
      });
    }
  }
);

/**
 * GET /api/v1/dashboard/shared/:token
 * Get shared dashboard
 */
router.get('/shared/:token',
  rateLimit({ windowMs: 60000, max: 50 }),
  async (req, res) => {
    try {
      const dashboard = await dashboardService.getDashboardByShareToken(req.params.token);
      if (!dashboard) {
        return res.status(404).json({
          success: false,
          error: 'Shared dashboard not found'
        });
      }
      res.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      console.error('Error loading shared dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to load shared dashboard'
      });
    }
  }
);

/**
 * GET /api/v1/dashboard/metrics
 * List available metrics
 */
router.get('/metrics',
  authorize(['admin', 'analyst', 'viewer']),
  rateLimit({ windowMs: 60000, max: 100 }),
  async (req, res) => {
    try {
      const category = req.query.category as string;
      const metrics = await metricService.getAvailableMetrics(category);
      res.json({
        success: true,
        data: metrics,
        count: metrics.length
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch metrics'
      });
    }
  }
);

/**
 * GET /api/v1/dashboard/metrics/:key
 * Get metric definition
 */
router.get('/metrics/:key',
  authorize(['admin', 'analyst', 'viewer']),
  rateLimit({ windowMs: 60000, max: 200 }),
  async (req, res) => {
    try {
      const metric = await metricService.calculateMetric(req.params.key);
      res.json({
        success: true,
        data: metric
      });
    } catch (error) {
      console.error('Error fetching metric:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch metric'
      });
    }
  }
);

/**
 * GET /api/v1/dashboard/metrics/:key/data
 * Get metric data with filters
 */
router.get('/metrics/:key/data',
  authorize(['admin', 'analyst', 'viewer']),
  rateLimit({ windowMs: 60000, max: 500 }),
  validateRequest(metricFiltersSchema, 'query'),
  async (req, res) => {
    try {
      const { timeRange, granularity, ...filters } = req.query;
      
      if (timeRange && granularity) {
        // Get time series data
        const data = await metricService.getHistoricalData(
          req.params.key,
          timeRange as string,
          granularity as string,
          filters
        );
        res.json({
          success: true,
          data,
          type: 'timeseries'
        });
      } else {
        // Get current value
        const data = await metricService.calculateMetric(req.params.key, filters);
        res.json({
          success: true,
          data,
          type: 'current'
        });
      }
    } catch (error) {
      console.error('Error fetching metric data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch metric data'
      });
    }
  }
);

/**
 * POST /api/v1/dashboard/metrics/:key/refresh
 * Force refresh metric cache
 */
router.post('/metrics/:key/refresh',
  authorize(['admin', 'analyst']),
  rateLimit({ windowMs: 60000, max: 10 }),
  auditLog('metric', 'refresh'),
  async (req, res) => {
    try {
      await metricService.invalidateCache(req.params.key);
      const refreshedData = await metricService.calculateMetric(req.params.key, {}, false);
      res.json({
        success: true,
        data: refreshedData,
        message: 'Metric cache refreshed'
      });
    } catch (error) {
      console.error('Error refreshing metric:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to refresh metric'
      });
    }
  }
);

/**
 * GET /api/v1/dashboard/export/:id
 * Export dashboard configuration
 */
router.get('/export/:id',
  authorize(['admin', 'analyst']),
  rateLimit({ windowMs: 60000, max: 5 }),
  async (req, res) => {
    try {
      const format = (req.query.format as string) || 'json';
      const exportData = await dashboardService.exportDashboard(
        req.params.id,
        req.user.id,
        format as 'json' | 'yaml'
      );
      
      res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/yaml');
      res.setHeader('Content-Disposition', `attachment; filename="dashboard-${req.params.id}.${format}"`);
      res.send(exportData);
    } catch (error) {
      console.error('Error exporting dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to export dashboard'
      });
    }
  }
);

export default router;