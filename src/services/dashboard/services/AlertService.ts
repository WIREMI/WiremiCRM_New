import { AlertRule, AlertLog, AlertSeverity, AlertStatus, AlertCondition } from '../models/MetricDefinition';
import { MetricService } from './MetricService';

export class AlertService {
  private metricService: MetricService;
  private notificationService: any; // Notification service

  constructor() {
    this.metricService = new MetricService();
    // TODO: Initialize notification service
  }

  /**
   * Evaluate all active alert rules
   */
  async evaluateAlerts(): Promise<void> {
    const activeRules = await this.getActiveAlertRules();
    
    for (const rule of activeRules) {
      try {
        await this.evaluateAlertRule(rule);
      } catch (error) {
        console.error(`Failed to evaluate alert rule ${rule.id}:`, error);
      }
    }
  }

  /**
   * Evaluate a specific alert rule
   */
  async evaluateAlertRule(rule: AlertRule): Promise<void> {
    // Check cooldown period
    if (await this.isInCooldown(rule)) {
      return;
    }

    // Get current metric value
    const metricValue = await this.metricService.getMetricValue(rule.metricKey);
    
    // Evaluate condition
    const shouldTrigger = this.evaluateCondition(metricValue.value, rule.condition, rule.threshold);
    
    if (shouldTrigger) {
      await this.triggerAlert(rule, metricValue.value);
    }
  }

  /**
   * Trigger an alert
   */
  async triggerAlert(rule: AlertRule, currentValue: number): Promise<void> {
    // Create alert log entry
    const alertLog = await this.createAlertLog(rule, currentValue);
    
    // Send notifications through configured channels
    await this.sendAlertNotifications(rule, alertLog);
    
    // Update rule's last triggered timestamp
    await this.updateRuleLastTriggered(rule.id);
    
    console.log(`Alert triggered: ${rule.name} - Current value: ${currentValue}, Threshold: ${rule.threshold}`);
  }

  /**
   * Test an alert rule without triggering notifications
   */
  async testAlertRule(ruleId: string): Promise<{
    wouldTrigger: boolean;
    currentValue: number;
    threshold: number;
    condition: string;
    message: string;
  }> {
    const rule = await this.getAlertRule(ruleId);
    if (!rule) {
      throw new Error(`Alert rule not found: ${ruleId}`);
    }

    const metricValue = await this.metricService.getMetricValue(rule.metricKey);
    const wouldTrigger = this.evaluateCondition(metricValue.value, rule.condition, rule.threshold);
    
    return {
      wouldTrigger,
      currentValue: metricValue.value,
      threshold: rule.threshold,
      condition: this.formatCondition(rule.condition),
      message: wouldTrigger 
        ? `Alert would trigger: ${metricValue.value} ${this.formatCondition(rule.condition)} ${rule.threshold}`
        : `Alert would not trigger: ${metricValue.value} does not meet condition ${this.formatCondition(rule.condition)} ${rule.threshold}`
    };
  }

  /**
   * Get alert history for a rule
   */
  async getAlertHistory(ruleId: string, limit: number = 50): Promise<AlertLog[]> {
    // TODO: Fetch from database
    return [
      {
        id: '1',
        ruleId,
        metricValue: 15000,
        threshold: 10000,
        condition: 'greater than',
        severity: AlertSeverity.HIGH,
        triggeredAt: new Date().toISOString(),
        payload: {
          ruleName: 'High Transaction Volume',
          metricName: 'Transaction Count',
          currentValue: 15000,
          threshold: 10000,
          condition: '> 10000',
          timestamp: new Date().toISOString()
        },
        status: AlertStatus.TRIGGERED,
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(alertLogId: string, userId: string): Promise<void> {
    // TODO: Update alert log status to acknowledged
    console.log(`Alert ${alertLogId} acknowledged by user ${userId}`);
  }

  /**
   * Resolve an alert
   */
  async resolveAlert(alertLogId: string, userId: string, resolution?: string): Promise<void> {
    // TODO: Update alert log status to resolved
    console.log(`Alert ${alertLogId} resolved by user ${userId}: ${resolution}`);
  }

  /**
   * Get alert statistics
   */
  async getAlertStatistics(timeRange: string = '7d'): Promise<{
    totalAlerts: number;
    alertsBySeverity: { [key in AlertSeverity]: number };
    alertsByStatus: { [key in AlertStatus]: number };
    topAlertRules: { ruleId: string; ruleName: string; count: number }[];
    alertTrend: { date: string; count: number }[];
  }> {
    // TODO: Calculate from database
    return {
      totalAlerts: 45,
      alertsBySeverity: {
        [AlertSeverity.LOW]: 15,
        [AlertSeverity.MEDIUM]: 20,
        [AlertSeverity.HIGH]: 8,
        [AlertSeverity.CRITICAL]: 2
      },
      alertsByStatus: {
        [AlertStatus.TRIGGERED]: 10,
        [AlertStatus.ACKNOWLEDGED]: 15,
        [AlertStatus.RESOLVED]: 18,
        [AlertStatus.SUPPRESSED]: 2
      },
      topAlertRules: [
        { ruleId: '1', ruleName: 'High Transaction Volume', count: 12 },
        { ruleId: '2', ruleName: 'Low Success Rate', count: 8 },
        { ruleId: '3', ruleName: 'High Error Rate', count: 6 }
      ],
      alertTrend: [
        { date: '2024-01-15', count: 5 },
        { date: '2024-01-16', count: 8 },
        { date: '2024-01-17', count: 3 }
      ]
    };
  }

  private evaluateCondition(value: number, condition: AlertCondition, threshold: number): boolean {
    switch (condition.operator) {
      case '>':
        return value > threshold;
      case '<':
        return value < threshold;
      case '>=':
        return value >= threshold;
      case '<=':
        return value <= threshold;
      case '==':
        return value === threshold;
      case '!=':
        return value !== threshold;
      case 'between':
        if (Array.isArray(condition.value)) {
          return value >= condition.value[0] && value <= condition.value[1];
        }
        return false;
      case 'not_between':
        if (Array.isArray(condition.value)) {
          return value < condition.value[0] || value > condition.value[1];
        }
        return false;
      default:
        return false;
    }
  }

  private formatCondition(condition: AlertCondition): string {
    switch (condition.operator) {
      case '>': return 'greater than';
      case '<': return 'less than';
      case '>=': return 'greater than or equal to';
      case '<=': return 'less than or equal to';
      case '==': return 'equal to';
      case '!=': return 'not equal to';
      case 'between': return 'between';
      case 'not_between': return 'not between';
      default: return condition.operator;
    }
  }

  private async isInCooldown(rule: AlertRule): Promise<boolean> {
    if (!rule.lastTriggeredAt) {
      return false;
    }
    
    const lastTriggered = new Date(rule.lastTriggeredAt);
    const cooldownEnd = new Date(lastTriggered.getTime() + rule.cooldownPeriod * 60 * 1000);
    
    return new Date() < cooldownEnd;
  }

  private async createAlertLog(rule: AlertRule, currentValue: number): Promise<AlertLog> {
    const alertLog: AlertLog = {
      id: this.generateId(),
      ruleId: rule.id,
      metricValue: currentValue,
      threshold: rule.threshold,
      condition: this.formatCondition(rule.condition),
      severity: rule.severity,
      triggeredAt: new Date().toISOString(),
      payload: {
        ruleName: rule.name,
        metricName: rule.metricKey,
        currentValue,
        threshold: rule.threshold,
        condition: `${rule.condition.operator} ${rule.threshold}`,
        timestamp: new Date().toISOString()
      },
      status: AlertStatus.TRIGGERED,
      createdAt: new Date().toISOString()
    };
    
    // TODO: Save to database
    return alertLog;
  }

  private async sendAlertNotifications(rule: AlertRule, alertLog: AlertLog): Promise<void> {
    for (const channel of rule.channels) {
      try {
        switch (channel.type) {
          case 'email':
            await this.sendEmailAlert(rule, alertLog, channel.config);
            break;
          case 'webhook':
            await this.sendWebhookAlert(rule, alertLog, channel.config);
            break;
          case 'slack':
            await this.sendSlackAlert(rule, alertLog, channel.config);
            break;
          case 'in_app':
            await this.sendInAppAlert(rule, alertLog);
            break;
        }
      } catch (error) {
        console.error(`Failed to send alert via ${channel.type}:`, error);
      }
    }
  }

  private async sendEmailAlert(rule: AlertRule, alertLog: AlertLog, config: any): Promise<void> {
    // TODO: Send email notification
    console.log(`Sending email alert for rule: ${rule.name}`);
  }

  private async sendWebhookAlert(rule: AlertRule, alertLog: AlertLog, config: any): Promise<void> {
    // TODO: Send webhook notification
    console.log(`Sending webhook alert for rule: ${rule.name}`);
  }

  private async sendSlackAlert(rule: AlertRule, alertLog: AlertLog, config: any): Promise<void> {
    // TODO: Send Slack notification
    console.log(`Sending Slack alert for rule: ${rule.name}`);
  }

  private async sendInAppAlert(rule: AlertRule, alertLog: AlertLog): Promise<void> {
    // TODO: Create in-app notification
    console.log(`Creating in-app alert for rule: ${rule.name}`);
  }

  private async getActiveAlertRules(): Promise<AlertRule[]> {
    // TODO: Fetch from database
    return [];
  }

  private async getAlertRule(ruleId: string): Promise<AlertRule | null> {
    // TODO: Fetch from database
    return null;
  }

  private async updateRuleLastTriggered(ruleId: string): Promise<void> {
    // TODO: Update database
    console.log(`Updated last triggered time for rule ${ruleId}`);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}