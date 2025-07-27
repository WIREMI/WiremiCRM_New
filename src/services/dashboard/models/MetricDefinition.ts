export interface MetricDefinition {
  id: string;
  key: string; // e.g. 'total_revenue', 'active_users', 'transaction_volume'
  name: string;
  description: string;
  calculationQuery: string; // SQL query or aggregation definition
  refreshInterval: number; // seconds
  category: MetricCategory;
  unit: string; // '$', '%', 'count', etc.
  format: MetricFormat;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardConfig {
  id: string;
  userId: string;
  name: string;
  layout: DashboardLayout; // JSON for widget positions and grid settings
  isDefault: boolean;
  isShared: boolean;
  permissions: string[]; // roles that can view this dashboard
  createdAt: string;
  updatedAt: string;
}

export interface Widget {
  id: string;
  configId: string;
  metricKey: string;
  type: WidgetType;
  settings: WidgetSettings; // JSON configuration for the widget
  position: WidgetPosition;
  title: string;
  description?: string;
  refreshInterval?: number; // override metric default
  createdAt: string;
  updatedAt: string;
}

export interface SavedReport {
  id: string;
  name: string;
  description?: string;
  queryDefinition: ReportQuery; // JSON query configuration
  schedule: string; // cron expression
  recipients: string[]; // email addresses
  format: ReportFormat;
  isActive: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertRule {
  id: string;
  name: string;
  metricKey: string;
  condition: AlertCondition;
  threshold: number;
  frequency: string; // cron expression for evaluation
  channels: AlertChannel[];
  severity: AlertSeverity;
  isActive: boolean;
  cooldownPeriod: number; // minutes before re-alerting
  lastTriggeredAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertLog {
  id: string;
  ruleId: string;
  metricValue: number;
  threshold: number;
  condition: string;
  severity: AlertSeverity;
  triggeredAt: string;
  payload: AlertPayload;
  status: AlertStatus;
  resolvedAt?: string;
  createdAt: string;
}

// Enums and Types
export enum MetricCategory {
  FINANCIAL = 'FINANCIAL',
  OPERATIONAL = 'OPERATIONAL',
  CUSTOMER = 'CUSTOMER',
  RISK = 'RISK',
  COMPLIANCE = 'COMPLIANCE',
  PERFORMANCE = 'PERFORMANCE'
}

export enum MetricFormat {
  CURRENCY = 'CURRENCY',
  PERCENTAGE = 'PERCENTAGE',
  NUMBER = 'NUMBER',
  DECIMAL = 'DECIMAL',
  DURATION = 'DURATION'
}

export enum WidgetType {
  KPI = 'KPI',
  LINE_CHART = 'LINE_CHART',
  BAR_CHART = 'BAR_CHART',
  PIE_CHART = 'PIE_CHART',
  TABLE = 'TABLE',
  GAUGE = 'GAUGE',
  HEATMAP = 'HEATMAP',
  FUNNEL = 'FUNNEL'
}

export enum ReportFormat {
  PDF = 'PDF',
  XLSX = 'XLSX',
  CSV = 'CSV',
  JSON = 'JSON'
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AlertStatus {
  TRIGGERED = 'TRIGGERED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  SUPPRESSED = 'SUPPRESSED'
}

export interface DashboardLayout {
  gridSize: { cols: number; rows: number };
  breakpoints: { [key: string]: number };
  margin: [number, number];
  containerPadding: [number, number];
}

export interface WidgetSettings {
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  timeRange?: string; // '1h', '24h', '7d', '30d', etc.
  aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
  groupBy?: string;
  filters?: { [key: string]: any };
  displayOptions?: {
    showTrend?: boolean;
    showComparison?: boolean;
    comparisonPeriod?: string;
  };
}

export interface WidgetPosition {
  x: number;
  y: number;
  w: number; // width in grid units
  h: number; // height in grid units
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface ReportQuery {
  metrics: string[];
  dimensions: string[];
  filters: { [key: string]: any };
  timeRange: {
    start: string;
    end: string;
    granularity: 'hour' | 'day' | 'week' | 'month';
  };
  sorting: {
    field: string;
    direction: 'asc' | 'desc';
  }[];
  limit?: number;
}

export interface AlertCondition {
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'between' | 'not_between';
  value: number | [number, number];
  timeWindow?: string; // '5m', '1h', etc.
  aggregation?: 'avg' | 'sum' | 'min' | 'max' | 'count';
}

export interface AlertChannel {
  type: 'email' | 'webhook' | 'slack' | 'in_app';
  config: { [key: string]: any };
}

export interface AlertPayload {
  ruleName: string;
  metricName: string;
  currentValue: number;
  threshold: number;
  condition: string;
  timestamp: string;
  dashboardUrl?: string;
  additionalContext?: { [key: string]: any };
}

// Metric Data Interfaces
export interface MetricValue {
  value: number;
  timestamp: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    comparison: string; // vs previous period
  };
  metadata?: { [key: string]: any };
}

export interface TimeSeriesData {
  timestamps: string[];
  values: number[];
  labels?: string[];
  metadata?: { [key: string]: any };
}

export interface TableData {
  columns: {
    key: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'currency' | 'percentage';
    sortable?: boolean;
  }[];
  rows: { [key: string]: any }[];
  totalRows?: number;
  pagination?: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
}