import { prisma } from '../../../config/database';

export class ReversalService {
  /**
   * Requests a reversal for a transaction, enqueuing it for approval if necessary.
   */
  async requestReversal(transactionId: string, requestedBy: string, reason: string): Promise<any> {
    const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } });

    if (!transaction) {
      throw new Error('Transaction not found.');
    }

    const requiresApproval = this.determineApprovalNeeded(transaction, requestedBy);

    if (requiresApproval) {
      console.log(`[ReversalService] Reversal for ${transactionId} requires approval. Reason: ${reason}`);
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { 
          status: 'PENDING_APPROVAL',
          metadata: { 
            ...transaction.metadata as object, 
            reversalReason: reason, 
            reversalRequestedBy: requestedBy 
          }
        }
      });
      return { status: 'PENDING_APPROVAL', message: 'Reversal request submitted for approval.' };
    } else {
      console.log(`[ReversalService] Reversal for ${transactionId} processed directly. Reason: ${reason}`);
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { 
          status: 'REVERSED',
          metadata: { 
            ...transaction.metadata as object, 
            reversalReason: reason, 
            reversalProcessedBy: requestedBy 
          }
        }
      });
      return { status: 'PROCESSED', message: 'Transaction reversed successfully.' };
    }
  }

  /**
   * Determines if a transaction reversal requires manual approval.
   */
  private determineApprovalNeeded(transaction: any, requestedBy: string): boolean {
    // Example rules - replace with actual business logic
    if (parseFloat(transaction.amount.toString()) > 10000) {
      return true;
    }
    if (transaction.type === 'WITHDRAWAL' && transaction.status === 'SUCCESS') {
      return true;
    }
    return false;
  }

  /**
   * Approves a pending reversal request
   */
  async approveReversal(reversalRequestId: string, approvedBy: string): Promise<any> {
    // TODO: Implement approval logic
    console.log(`[ReversalService] Approving reversal request ${reversalRequestId} by ${approvedBy}`);
  }

  /**
   * Rejects a pending reversal request
   */
  async rejectReversal(reversalRequestId: string, rejectedBy: string, reason: string): Promise<any> {
    // TODO: Implement rejection logic
    console.log(`[ReversalService] Rejecting reversal request ${reversalRequestId} by ${rejectedBy}: ${reason}`);
  }
}