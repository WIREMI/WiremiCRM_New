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
          <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 800px; margin: auto; border: 2px solid #2563eb; border-radius: 10px; background: #f8fafc;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e40af; margin: 0; font-size: 28px;">WIREMI FINTECH</h1>
              <h2 style="color: #333; margin: 10px 0; font-size: 20px;">Transaction Receipt</h2>
              <p style="color: #666; margin: 0;">Official Transaction Confirmation</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1e40af; margin-top: 0;">Transaction Information</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 40%;"><strong>Transaction ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${transaction.id}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Wiremi ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${transaction.userId}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatTransactionType(transaction.type, transaction.method)}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Method:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatMethod(transaction.method)}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Amount:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 18px; font-weight: bold; color: #059669;">${this.formatCurrency(transaction.amount, transaction.currency)}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Fees:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatCurrency(transaction.fees, transaction.currency)}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Status:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${transaction.status}</span></td></tr>
                <tr><td style="padding: 8px 0;"><strong>Date & Time:</strong></td><td style="padding: 8px 0;">${transaction.createdAt.toLocaleString()}</td></tr>
              </table>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1e40af; margin-top: 0;">Wallet Balance</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                ${this.formatWalletBalance(transaction.walletBefore, transaction.walletAfter)}
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

  private generateDepositDetails(transaction: any, metadata: any): string { // 🏦 DEPOSIT RECEIPTS
    let details = `
      <div class="section">
        <h3>💳 ${this.getDepositIcon(transaction.method)} Deposit Details</h3>
        <table class="info-table">
          <tr><td>Account Name:</td><td>${transaction.userId}</td></tr>
          <tr><td>Deposit Method:</td><td>${this.formatMethod(transaction.method)}</td></tr>
    `;

    // Add method-specific details
    if (transaction.method.includes('MOMO')) {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Account Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.accountName || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Mobile Money Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.momoNumber || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'BANK') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Account Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.accountName || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Bank Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.bankName || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Bank Account Holder:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.bankAccountHolder || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Account Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.accountNumber || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'INTERAC') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Interac Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.interacEmail || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'CARD') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Card Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.cardType || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Card Scheme:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.cardScheme || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Last 4 Digits:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">****${metadata.cardLast4 || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Card Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.maskCardNumber(metadata.cardNumber || '')}</td></tr>`;
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
      const provider = transaction.method.includes('MTN') ? 'MTN' : 'ORANGE';
      details += `<tr><td>Provider:</td><td>${provider}</td></tr>`;
      details += `<tr><td>Phone Number:</td><td>${metadata.momoNumber || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'BANK') {
      details += `<tr><td>Bank Name:</td><td>${metadata.bankName || 'N/A'}</td></tr>`;
      details += `<tr><td>Bank Account Holder:</td><td>${metadata.accountHolderName || transaction.userId}</td></tr>`;
      details += `<tr><td>Account Number:</td><td>${metadata.accountNumber || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'INTERAC') {
      details += `<tr><td>Interac Email:</td><td>${metadata.interacEmail || 'N/A'}</td></tr>`;
      details += `<tr><td>Bank Name:</td><td>${metadata.bankName || 'N/A'}</td></tr>`;
      details += `<tr><td>Transfer Type:</td><td>${metadata.transferType || 'Email Transfer'}</td></tr>`;
    } else if (transaction.method === 'ATM') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>ATM Location:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.atmLocation || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>ATM ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.atmId || 'N/A'}</td></tr>`;
    }

    details += `</table></div>`;
    return details;
  }

  private generateTransferDetails(transaction: any, metadata: any): string { // 🔄 TRANSFER RECEIPTS
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
    if (transaction.method === 'BANK_TRANSFER') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Sender Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.senderName || transaction.userId}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Receiver Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.receiverName || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Receiver Bank:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.receiverBank || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Account Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.receiverAccountNumber || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Receiver Country:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.receiverCountry || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Amount Sent:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatCurrency(transaction.amount, transaction.currency)}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Receiver Amount (Local Currency):</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatCurrency(metadata.receiverAmount || transaction.amount, metadata.receiverCurrency || transaction.currency)}</td></tr>`;
    } else if (transaction.method === 'MOBILE_MONEY_TRANSFER') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Sender Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.senderName || transaction.userId}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Receiver Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.receiverName || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Receiver MoMo Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.receiverMomoNumber || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Receiver Country:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.receiverCountry || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Receiver Amount:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatCurrency(metadata.receiverAmount || transaction.amount, metadata.receiverCurrency || transaction.currency)}</td></tr>`;
    } else if (transaction.method === 'WIREMI_INTERNAL_TRANSFER') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Sender Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.senderName || transaction.userId}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Receiver Wiremi ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.receiverWiremiId || 'N/A'}</td></tr>`;
    } else if (transaction.method === 'INTERAC_TRANSFER') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Sender Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.senderName || transaction.userId}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Recipient Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.receiverInteracEmail || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Bank (Optional):</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.bankName || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Amount Sent:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatCurrency(transaction.amount, transaction.currency)}</td></tr>`;
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
      details += `<tr><td>Card Scheme:</td><td>${metadata.cardScheme || 'N/A'}</td></tr>`;
      details += `<tr><td>Card Type:</td><td>${metadata.cardType || 'N/A'}</td></tr>`;
      details += `<tr><td>PayPal Email:</td><td>${metadata.paypalEmail || 'N/A'}</td></tr>`;
      details += `<tr><td>Account Email:</td><td>${metadata.accountEmail || transaction.userId}</td></tr>`;
    } else if (transaction.method === 'CARD_FUNDING') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Card Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">****-****-****-${metadata.cardLast4 || 'N/A'}</td></tr>`;
    details += `</table></div>`;
    } else if (transaction.method === 'CARD_MAINTENANCE') {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Card Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">****-****-****-${metadata.cardLast4 || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Maintenance Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.maintenanceType || 'N/A'}</td></tr>`;
    }

      <div class="section">
        <h3>💸 Withdrawal Details</h3>
        <table class="info-table">
          <tr><td>Account Name:</td><td>${transaction.userId}</td></tr>
          <tr><td>Withdrawal Method:</td><td>${this.formatMethod(transaction.method)}</td></tr>
    let details = `
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin-top: 0;">Savings Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
      details += `<tr><td>Mobile Money Number:</td><td>${metadata.momoNumber || 'N/A'}</td></tr>`;
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Savings Operation:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatMethod(transaction.method)}</td></tr>
      details += `<tr><td>Bank Name:</td><td>${metadata.bankName || 'N/A'}</td></tr>`;
      details += `<tr><td>Account Number:</td><td>${metadata.accountNumber || 'N/A'}</td></tr>`;
    if (metadata.savingsGoalId) {
      details += `<tr><td>Interac Email:</td><td>${metadata.interacEmail || 'N/A'}</td></tr>`;
    }
      details += `<tr><td>ATM Location:</td><td>${metadata.atmLocation || 'N/A'}</td></tr>`;
      details += `<tr><td>ATM ID:</td><td>${metadata.atmId || 'N/A'}</td></tr>`;
    }
    if (metadata.interestRate) {
    details += `</table></div>`;
    }
    if (metadata.maturityDate) {
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Maturity Date:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date(metadata.maturityDate).toLocaleDateString()}</td></tr>`;
    }

      <div class="section">
        <h3>🔄 Transfer Details</h3>
        <table class="info-table">
          <tr><td>Sender Name:</td><td>${transaction.userId}</td></tr>
          <tr><td>Sender Wiremi ID:</td><td>${transaction.userId}</td></tr>
          <tr><td>Transfer Method:</td><td>${this.formatMethod(transaction.method)}</td></tr>
    let details = `
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin-top: 0;">Subscription Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
      details += `<tr><td>Exchange Rate:</td><td>${transaction.exchangeRate}</td></tr>`;
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Subscription Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatMethod(transaction.method)}</td></tr>
    `;

    if (metadata.subscriptionPeriod) {
      details += `<tr><td>Receiver Name:</td><td>${metadata.receiverName || 'N/A'}</td></tr>`;
      details += `<tr><td>Receiver Wiremi ID:</td><td>${metadata.receiverWiremiId || 'N/A'}</td></tr>`;
    }
      details += `<tr><td>Receiver Name:</td><td>${metadata.receiverName || 'N/A'}</td></tr>`;
      details += `<tr><td>Receiver MoMo Number:</td><td>${metadata.receiverMomoNumber || 'N/A'}</td></tr>`;
      details += `<tr><td>Receiver Country:</td><td>${metadata.receiverCountry || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Start Date:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date(metadata.subscriptionStartDate).toLocaleDateString()}</td></tr>`;
      details += `<tr><td>Receiver Name:</td><td>${metadata.receiverName || 'N/A'}</td></tr>`;
      details += `<tr><td>Receiver Bank:</td><td>${metadata.receiverBank || 'N/A'}</td></tr>`;
      details += `<tr><td>Account Number:</td><td>${metadata.receiverAccountNumber || 'N/A'}</td></tr>`;
      details += `<tr><td>Receiver Country:</td><td>${metadata.receiverCountry || 'N/A'}</td></tr>`;
    }
      details += `<tr><td>Receiver Name:</td><td>${metadata.receiverName || 'N/A'}</td></tr>`;
      details += `<tr><td>Receiver Interac Email:</td><td>${metadata.receiverInteracEmail || 'N/A'}</td></tr>`;
      details += `<tr><td>Bank:</td><td>${metadata.bankName || 'N/A'}</td></tr>`;
      details += `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Features:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${metadata.features.join(', ')}</td></tr>`;
    }
    // Add amount details
    details += `<tr><td>Amount Sent:</td><td class="amount-highlight">${this.formatCurrency(transaction.amount, transaction.currency)}</td></tr>`;
    if (metadata.receiverAmount && metadata.receiverCurrency) {
      details += `<tr><td>Receiver Amount:</td><td class="amount-highlight">${this.formatCurrency(metadata.receiverAmount, metadata.receiverCurrency)}</td></tr>`;
    }

    details += `</table></div>`;
    details += `</table></div>`;
    return details;
  }
  /**
   * Get deposit icon based on method
   */
  private getDepositIcon(method: string): string {
    if (method.includes('MOMO')) return '📱';
    if (method === 'BANK') return '🏦';
    if (method === 'CARD') return '💳';
    if (method === 'PAYPAL') return '💰';
    if (method === 'INTERAC') return '🇨🇦';
    return '💳';
  }

  private formatTransactionType(type: string, method: string): string { // Helper to format transaction type
    const typeMap: { [key: string]: string } = {
      'DEPOSIT': 'Deposit',
      'WITHDRAWAL': 'Withdrawal',
      'TRANSFER': 'Transfer',
      'CARD_SERVICE': 'Card Service',
      'SAVINGS': 'Savings',
      'SUBSCRIPTION': 'Subscription',
      'PAYMENT': 'Payment' // Assuming PAYMENT is a type
    };
    return typeMap[type] || type;
  }

  private formatMethod(method: string): string { // Helper to format method
    const methodMap: { [key: string]: string } = {

  private formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }
      'MOMO_MTN': 'MoMo (MTN)',
      'MOMO_ORANGE': 'MoMo (ORANGE)',
      'BANK': 'Bank',
      'PAYPAL': 'PayPal',
      'CARD': 'Card',
      'INTERAC': 'Interac',
      'ADMIN_INITIATED': 'Admin Initiated',
      'BANK_TRANSFER': 'Bank Transfer',
      'MOBILE_MONEY_TRANSFER': 'Mobile Money Transfer',
      'WIREMI_INTERNAL_TRANSFER': 'Wiremi Internal',
      'INTERAC_TRANSFER': 'Interac Transfer',
      'CARD_ISSUANCE': 'Card Issuance',
      'CARD_FUNDING': 'Card Funding',
      'CARD_MAINTENANCE': 'Card Maintenance',
      'ATM': 'ATM',
      'SAVINGS': 'Savings',
      'SUBSCRIPTION': 'Subscription'
    };
    return methodMap[method] || method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private formatCurrency(amount: number, currency: string): string { // Helper to format currency
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }

  private formatWalletBalance(before: any, after: any): string { // Helper to format wallet balance
    let html = '';
    for (const currency in before) {
      html += `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${currency} Balance (Previous):</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatCurrency(before[currency], currency)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${currency} Balance (Current):</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${this.formatCurrency(after[currency], currency)}</td>
        </tr>
      `;
    }
    return html;
  }

  private maskCardNumber(cardNumber: string): string { // Helper to mask card number
    if (!cardNumber || cardNumber.length < 4) return 'N/A';
    return `**** **** **** ${cardNumber.slice(-4)}`;
  }
}