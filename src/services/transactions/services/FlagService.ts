import { prisma } from '../../../config/database';
import { TransactionService } from './TransactionService';

export class FlagService {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  /**
   * Flags a specific transaction with a reason and severity.
   * Notifies compliance admin.
   */
  async flagTransaction(
    transactionId: string,
    reason: string,
    severity: string,
    flaggedBy: string
  ): Promise<any> {
    const flag = await prisma.transactionFlag.create({
      data: {
        transactionId,
        reason,
        severity: severity as any,
        flaggedBy,
      },
    });

    // TODO: Notify Compliance Admin (e.g., via email, Slack, or in-app notification)
    console.log(`[FlagService] Notifying Compliance Admin: Transaction ${transactionId} flagged with severity ${severity}`);
    return flag;
  }

  /**
   * Flags multiple transactions based on provided filters.
   */
  async bulkFlagTransactions(
    filters: Record<string, any>,
    reason: string,
    severity: string,
    flaggedBy: string
  ): Promise<{ count: number }> {
    // First, get the IDs of transactions matching the filters
    const transactionsToFlag = await this.transactionService.getTransactions(filters, 1, 999999, 'createdAt', 'desc');
    const transactionIds = transactionsToFlag.transactions.map(t => t.id);

    if (transactionIds.length === 0) {
      return { count: 0 };
    }

    // Create flags for all selected transactions
    const data = transactionIds.map(id => ({
      transactionId: id,
      reason,
      severity: severity as any,
      flaggedBy,
    }));

    const result = await prisma.transactionFlag.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(`[FlagService] Bulk flagged ${result.count} transactions with severity ${severity}`);
    return { count: result.count };
  }

  /**
   * Resolves a flag
   */
  async resolveFlag(flagId: string, resolvedBy: string): Promise<any> {
    const flag = await prisma.transactionFlag.update({
      where: { id: flagId },
      data: {
        resolved: true,
        resolvedBy,
        resolvedAt: new Date(),
      },
    });
    return flag;
  }
}