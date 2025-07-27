# Admin Dashboard & Analytics Module

A comprehensive analytics and dashboard system for Wiremi Fintech CRM with real-time metrics, customizable widgets, automated reporting, and intelligent alerting.

## Features

### 🎯 Core Dashboard Features
- **Customizable Dashboards**: Drag-and-drop widget layout with grid-based positioning
- **Real-time Metrics**: Live data updates with WebSocket integration
- **Multiple Widget Types**: KPI cards, charts (line, bar, pie, gauge), tables, heatmaps
- **Time Range Controls**: Flexible time range selection for all widgets
- **Responsive Design**: Optimized for desktop and mobile viewing

### 📊 Widget System
- **KPI Widgets**: Key performance indicators with trend analysis
- **Chart Widgets**: Interactive charts with multiple visualization types
- **Table Widgets**: Sortable, paginated data tables
- **Gauge Widgets**: Progress indicators with threshold-based coloring
- **Custom Settings**: Per-widget configuration for colors, formats, and display options

### 📈 Metrics Engine
- **Metric Definitions**: Configurable metric calculations with SQL queries
- **Caching System**: Redis-based caching with configurable TTL
- **Time Series Data**: Historical data with multiple granularities
- **Trend Analysis**: Automatic trend calculation and comparison

### 📋 Automated Reporting
- **Scheduled Reports**: Cron-based report generation
- **Multiple Formats**: PDF, Excel, CSV, JSON export options
- **Email Distribution**: Automated report delivery to recipients
- **Report Templates**: Pre-built report configurations

### 🚨 Intelligent Alerting
- **Rule-based Alerts**: Configurable threshold-based alerting
- **Multiple Channels**: Email, Slack, webhook, in-app notifications
- **Severity Levels**: Low, Medium, High, Critical alert classification
- **Cooldown Periods**: Prevent alert spam with configurable cooldowns
- **Alert History**: Complete audit trail of triggered alerts

## Architecture

### Data Models
```typescript
// Core metric definition
interface MetricDefinition {
  key: string;
  calculationQuery: string;
  refreshInterval: number;
  category: MetricCategory;
}

// Dashboard configuration
interface DashboardConfig {
  layout: DashboardLayout;
  widgets: Widget[];
  permissions: string[];
}

// Widget configuration
interface Widget {
  type: WidgetType;
  metricKey: string;
  settings: WidgetSettings;
  position: WidgetPosition;
}
```

### Service Layer
- **MetricService**: Handles metric calculation and caching
- **WidgetService**: Processes widget data based on type and settings
- **ReportService**: Manages report generation and distribution
- **AlertService**: Evaluates alert rules and sends notifications

### Component Architecture
```
dashboard/
├── components/
│   ├── DashboardPage.tsx      # Main dashboard view
│   ├── WidgetContainer.tsx    # Widget wrapper with controls
│   ├── widgets/               # Individual widget components
│   ├── ReportsPage.tsx        # Report management
│   └── AlertsPage.tsx         # Alert configuration
├── services/                  # Business logic services
├── models/                    # TypeScript interfaces
└── README.md                  # This file
```

## Widget Types

### KPI Widget
- Displays single metric value with trend indicator
- Supports target tracking and progress visualization
- Configurable formatting (currency, percentage, number)

### Chart Widgets
- **Line Charts**: Time series data visualization
- **Bar Charts**: Categorical data comparison
- **Pie Charts**: Proportional data representation
- **Gauge Charts**: Progress indicators with thresholds

### Table Widget
- Sortable columns with type-aware formatting
- Pagination for large datasets
- Configurable column display and formatting

## Metrics System

### Predefined Metrics
- **Financial**: Total revenue, transaction volume, average transaction value
- **Operational**: Success rate, error rate, response time
- **Customer**: Active users, new signups, churn rate
- **Risk**: Fraud alerts, compliance violations, risk score

### Custom Metrics
- SQL-based metric definitions
- Configurable refresh intervals
- Category-based organization
- Unit and format specifications

## Real-time Updates

### WebSocket Integration
- Live metric updates without page refresh
- Subscription-based data streaming
- Cross-instance synchronization via Redis Pub/Sub

### Caching Strategy
- Redis-based metric caching
- Configurable TTL per metric
- Cache invalidation on data changes
- Background refresh jobs

## Security & Performance

### Access Control
- Role-based dashboard access
- Widget-level permissions
- Audit logging for configuration changes

### Performance Optimization
- Efficient data aggregation
- Lazy loading for large datasets
- Optimized chart rendering
- Background job processing

## Configuration

### Environment Variables
```bash
# Redis Configuration
REDIS_URL=redis://localhost:6379
METRIC_CACHE_TTL_DEFAULT=300

# Report Configuration
REPORT_CRON_WORKER_CONCURRENCY=5
MAILER_CONFIG=smtp://...

# Alert Configuration
ALERT_CRON_INTERVAL=60000
WEBSOCKET_PATH=/ws/dashboard
```

### Metric Configuration
```typescript
const metricDefinitions = [
  {
    key: 'total_revenue',
    name: 'Total Revenue',
    calculationQuery: 'SELECT SUM(amount) FROM transactions WHERE status = "completed"',
    refreshInterval: 300,
    category: 'FINANCIAL',
    format: 'CURRENCY'
  }
];
```

## Usage Examples

### Creating a Dashboard
```typescript
const dashboard = {
  name: 'Executive Dashboard',
  widgets: [
    {
      type: 'KPI',
      metricKey: 'total_revenue',
      position: { x: 0, y: 0, w: 3, h: 2 },
      settings: { format: 'CURRENCY', showTrend: true }
    }
  ]
};
```

### Setting up Alerts
```typescript
const alertRule = {
  name: 'High Transaction Volume',
  metricKey: 'transaction_count',
  condition: { operator: '>', value: 10000 },
  channels: [
    { type: 'email', config: { recipients: ['ops@wiremi.com'] } }
  ],
  severity: 'HIGH'
};
```

## Development

### Adding New Widget Types
1. Define widget interface in models
2. Create widget component in `widgets/` directory
3. Add rendering logic to `WidgetContainer`
4. Update `WidgetService` for data processing

### Adding New Metrics
1. Define metric in database or configuration
2. Implement calculation query
3. Set appropriate refresh interval
4. Configure caching strategy

## Future Enhancements

- **Advanced Analytics**: Machine learning-based insights
- **Custom Visualizations**: Plugin system for custom widgets
- **Data Connectors**: Integration with external data sources
- **Mobile App**: Native mobile dashboard application
- **Collaboration**: Dashboard sharing and commenting features

## API Endpoints

### Dashboard Management
- `GET /api/dashboard/config` - Load dashboard configuration
- `POST /api/dashboard/config` - Save dashboard layout
- `GET /api/widgets/:id/data` - Get widget data

### Metrics
- `GET /api/metrics/:key` - Get metric value
- `GET /api/metrics/:key/timeseries` - Get time series data

### Reports
- `GET /api/reports` - List saved reports
- `POST /api/reports` - Create new report
- `POST /api/reports/:id/run` - Execute report

### Alerts
- `GET /api/alerts` - List alert rules
- `POST /api/alerts` - Create alert rule
- `POST /api/alerts/:id/test` - Test alert rule

This dashboard module provides a comprehensive analytics platform that scales with your fintech operations while maintaining performance and security standards.