import { prisma } from '../../../config/database';
import { TransactionService } from './TransactionService';
import path from 'path';
import fs from 'fs/promises';

export class ExportService {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  /**
   * Schedules an export job for transactions.
   */
  async scheduleExport(
    format: 'CSV' | 'XLSX' | 'PDF',
    filters: Record<string, any>,
    requestedBy: string
  ): Promise<any> {
    const job = await prisma.exportJob.create({
      data: {
        type: `transactions_${format.toLowerCase()}`,
        filters,
        status: 'PENDING',
        requestedBy,
      },
    });

    // Simulate immediate processing for demo
    this.processExportJob(job.id).catch(console.error);

    return job;
  }

  /**
   * Processes an export job, generates the file, and updates the job status.
   */
  private async processExportJob(jobId: string): Promise<void> {
    const job = await prisma.exportJob.findUnique({ where: { id: jobId } });
    if (!job) return;

    try {
      const { transactions } = await this.transactionService.getTransactions(
        job.filters,
        1,
        10000 // Large limit for export
      );

      let fileBuffer: Buffer;
      let filePath: string | null = null;

      switch (job.type) {
        case 'transactions_csv':
          fileBuffer = await this.generateCsv(transactions);
          filePath = `/exports/${job.id}.csv`;
          break;
        case 'transactions_xlsx':
          fileBuffer = await this.generateXlsx(transactions);
          filePath = `/exports/${job.id}.xlsx`;
          break;
        case 'transactions_pdf':
          fileBuffer = await this.generatePdfReport(transactions);
          filePath = `/exports/${job.id}.pdf`;
          break;
        default:
          throw new Error('Unsupported export type');
      }

      // Save the file
      const exportDir = path.join(process.cwd(), 'exports');
      await fs.mkdir(exportDir, { recursive: true });
      await fs.writeFile(path.join(process.cwd(), filePath), fileBuffer);

      await prisma.exportJob.update({
        where: { id: jobId },
        data: {
          status: 'COMPLETED',
          filePath,
          completedAt: new Date(),
        },
      });
      console.log(`[ExportService] Export job ${jobId} completed. File: ${filePath}`);
    } catch (error: any) {
      console.error(`[ExportService] Error processing export job ${jobId}:`, error);
      await prisma.exportJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          error: error.message,
          completedAt: new Date(),
        },
      });
    }
  }

  /**
   * Generates a CSV file from transaction data.
   */
  private async generateCsv(transactions: any[]): Promise<Buffer> {
    const headers = ['ID', 'User ID', 'Type', 'Method', 'Amount', 'Currency', 'Status', 'Created At'];
    const rows = transactions.map(t => [
      t.id, t.userId, t.type, t.method, t.amount, t.currency, t.status, t.createdAt.toISOString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    return Buffer.from(csvContent);
  }

  /**
   * Generates an XLSX file from transaction data.
   */
  private async generateXlsx(transactions: any[]): Promise<Buffer> {
    // Mock XLSX generation - in real implementation, use xlsx library
    const csvContent = await this.generateCsv(transactions);
    return csvContent; // Simplified for demo
  }

  /**
   * Generates a PDF report from transaction data.
   */
  private async generatePdfReport(transactions: any[]): Promise<Buffer> {
    const htmlContent = `
      <h1>Transaction Report</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Type</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map(t => `
            <tr>
              <td>${t.id}</td>
              <td>${t.userId}</td>
              <td>${t.type}</td>
              <td>${t.method}</td>
              <td>${t.amount} ${t.currency}</td>
              <td>${t.status}</td>
              <td>${t.createdAt.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Mock PDF generation - in real implementation, use puppeteer
    return Buffer.from(htmlContent);
  }

  /**
   * Generates a single PDF receipt for a given transaction.
   */
  async generatePdfReceipt(transactionId: string): Promise<Buffer | null> {
    const transaction = await this.transactionService.getTransactionById(transactionId);
    if (!transaction) {
      return null;
    }

    // Generate transaction-specific details based on type and method
    const transactionDetails = this.generateTransactionDetails(transaction);

    const htmlContent = `
          <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 700px; margin: auto; border: 2px solid #2563eb; border-radius: 10px; background: #f8fafc;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e40af; margin: 0; font-size: 28px;">WIREMI FINTECH</h1>
              <h2 style="color: #333; margin: 10px 0; font-size: 20px;">Transaction Receipt</h2>
              <p style="color: #666; margin: 0;">Official Transaction Confirmation</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1e40af; margin-top: 0;">Transaction Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Transaction ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${transaction.id}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatTransactionType(transaction.type, transaction.method)}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Amount:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 18px; font-weight: bold; color: #059669;">${transaction.amount} ${transaction.currency}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Fees:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${transaction.fees} ${transaction.currency}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Status:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${transaction.status}</span></td></tr>
                <tr><td style="padding: 8px 0;"><strong>Date & Time:</strong></td><td style="padding: 8px 0;">${transaction.createdAt.toLocaleString()}</td></tr>
              </table>
            </div>
            
            ${transactionDetails}
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1e40af; margin-top: 0;">Transaction Timeline</h3>
              ${(transaction.timeline as any[] || []).map(event => `
                <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                  <div style="font-weight: bold; color: #1e40af;">${event.status}</div>
                  <div style="color: #666; font-size: 14px;">${event.description}</div>
                  <div style="color: #999; font-size: 12px;">${new Date(event.timestamp).toLocaleString()}</div>
                </div>
              `).join('')}
            </div>
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p>Thank you for choosing Wiremi Fintech</p>
              <p style="font-size: 12px; margin: 10px 0;">This is an official transaction receipt. Keep it for your records.</p>
              <p style="font-size: 12px; color: #999;">Generated on ${new Date().toLocaleString()}</p>
            </div>
          </div>
    `;

    // Mock PDF generation - in real implementation, use puppeteer
    return Buffer.from(htmlContent);
  }

  /**
   * Generates transaction-specific details for the receipt based on type and method
   */
  private generateTransactionDetails(transaction: any): string {
    const metadata = transaction.metadata || {};
    let details = '';

    switch (transaction.type) {
      case 'DEPOSIT':
        details = this.generateDepositDetails(transaction, metadata);
        break;
      case 'WITHDRAWAL':
        details = this.generateWithdrawalDetails(transaction, metadata);
        break;
      case 'TRANSFER':
        details = this.generateTransferDetails(transaction, metadata);
        break;
      case 'CARD_SERVICE':
        details = this.generateCardServiceDetails(transaction, metadata);
        break;
      case 'SAVINGS':
        details = this.generateSavingsDetails(transaction, metadata);
        break;
      case 'SUBSCRIPTION':
        details = this.generateSubscriptionDetails(transaction, metadata);
        break;
      default:
        details = '<div style="background: white; padding: 20px; border-radius: 8px;"><h3 style="color: #1e40af; margin-top: 0;">Transaction Details</h3><p>Standard transaction processed successfully.</p></div>';
    }

    return details;
  }

  private generateDepositDetails(transaction: any, metadata: any): string {
    let details = `
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin-top: 0;">Deposit Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Depositor Wiremi ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${transaction.userId}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Deposit Method:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatMethod(transaction.method)}</td></tr>
    `;

    // Add method-specific details
    if (transaction.method.includes('MOMO')) {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Mobile Money Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.momoNumber || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'BANK') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Bank Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.bankName || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Account Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.accountNumber || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'INTERAC') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Interac Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.interacEmail || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'CARD') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Card Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.cardType || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Card Scheme:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.cardScheme || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Last 4 Digits:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">****${metadata.cardLast4 || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'PAYPAL') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>PayPal Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.paypalEmail || 'N/A'}</td></tr>`;
    }

    details += `</table></div>`;
    return details;
  }

  private generateWithdrawalDetails(transaction: any, metadata: any): string {
    let details = `
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin-top: 0;">Withdrawal Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Withdrawer Wiremi ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${transaction.userId}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Withdrawal Method:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatMethod(transaction.method)}</td></tr>
    `;

    // Add method-specific details
    if (transaction.method.includes('MOMO')) {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Mobile Money Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.momoNumber || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'BANK') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Bank Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.bankName || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Account Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.accountNumber || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'INTERAC') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Interac Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.interacEmail || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'ATM') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>ATM Location:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.atmLocation || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>ATM ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.atmId || 'N/A'}</td></tr>`;
    }

    details += `</table></div>`;
    return details;
  }

  private generateTransferDetails(transaction: any, metadata: any): string {
    let details = `
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin-top: 0;">Transfer Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Sender Wiremi ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${transaction.userId}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Transfer Method:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatMethod(transaction.method)}</td></tr>
    `;

    // Always include exchange rate for transfers
    if (transaction.exchangeRate) {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Exchange Rate:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${transaction.exchangeRate}</td></tr>`;
    }

    // Add method-specific details
    if (transaction.method === 'WIREMI_INTERNAL') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Receiver Wiremi ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.receiverWiremiId || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'MOBILE_MONEY_TRANSFER') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Receiver Mobile Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.receiverMomoNumber || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'BANK_TRANSFER') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Recipient Bank:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.recipientBankName || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Recipient Account:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.recipientAccountNumber || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Recipient Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.recipientName || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'INTERAC') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Recipient Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.recipientInteracEmail || 'N/A'}</td></tr>`;
    }

    details += `</table></div>`;
    return details;
  }

  private generateCardServiceDetails(transaction: any, metadata: any): string {
    let details = `
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin-top: 0;">Card Service Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Cardholder Wiremi ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${transaction.userId}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatMethod(transaction.method)}</td></tr>
    `;

    if (transaction.method === 'CARD_ISSUANCE') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Card Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.cardType || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Card Scheme:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.cardScheme || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Card Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">****-****-****-${metadata.cardLast4 || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'CARD_FUNDING') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Card Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">****-****-****-${metadata.cardLast4 || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Funding Source:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.fundingSource || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'CARD_MAINTENANCE') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Card Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">****-****-****-${metadata.cardLast4 || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Maintenance Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.maintenanceType || 'N/A'}</td></tr>`;
    }

    details += `</table></div>`;
    return details;
  }

  private generateSavingsDetails(transaction: any, metadata: any): string {
    let details = `
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin-top: 0;">Savings Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Account Holder Wiremi ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${transaction.userId}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Savings Operation:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatMethod(transaction.method)}</td></tr>
    `;

    if (metadata.savingsGoalId) {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Savings Goal ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.savingsGoalId}</td></tr>`;
    }
    if (metadata.savingsGoalName) {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Goal Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.savingsGoalName}</td></tr>`;
    }
    if (metadata.interestRate) {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Interest Rate:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.interestRate}%</td></tr>`;
    }
    if (metadata.maturityDate) {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Maturity Date:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date(metadata.maturityDate).toLocaleDateString()}</td></tr>`;
    }

    details += `</table></div>`;
    return details;
  }

  private generateSubscriptionDetails(transaction: any, metadata: any): string {
    let details = `
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin-top: 0;">Subscription Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Subscriber Wiremi ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${transaction.userId}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Subscription Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatMethod(transaction.method)}</td></tr>
    `;

    if (metadata.subscriptionPeriod) {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Billing Period:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.subscriptionPeriod}</td></tr>`;
    }
    if (metadata.subscriptionStartDate) {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Start Date:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date(metadata.subscriptionStartDate).toLocaleDateString()}</td></tr>`;
    }
    if (metadata.subscriptionEndDate) {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>End Date:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date(metadata.subscriptionEndDate).toLocaleDateString()}</td></tr>`;
    }
    if (metadata.features) {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Features:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.features.join(', ')}</td></tr>`;
    }

    details += `</table></div>`;
    return details;
  }

  private formatTransactionType(type: string, method: string): string {
    const typeMap: { [key: string]: string } = {
      'DEPOSIT': 'Deposit',
      'WITHDRAWAL': 'Withdrawal',
      'TRANSFER': 'Transfer',
      'CARD_SERVICE': 'Card Service',
      'SAVINGS': 'Savings',
      'SUBSCRIPTION': 'Subscription'
    };
    return typeMap[type] || type;
  }

  private formatMethod(method: string): string {
    return method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}