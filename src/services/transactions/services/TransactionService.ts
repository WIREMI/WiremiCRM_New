
export interface TransactionWithRelations {
  id: string;
  userId: string;
  type: string;
  method: string;
  amount: number;
  currency: string;
  fees: number;
  exchangeRate?: number;
  referenceId?: string;
  metadata?: any;
  timeline?: any;
  walletBefore?: any;
  walletAfter?: any;
  status: string;
  adminInitiatedBy?: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  flags?: any[];
  notes?: any[];
}

export class TransactionService {
  /**
   * Retrieves a paginated list of transactions with optional filters and sorting.
   */
  async getTransactions(
    filters: Record<string, any>,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: string
  ): Promise<{ transactions: TransactionWithRelations[], total: number, page: number, limit: number }> {
    const skip = (page - 1) * limit;
    const orderBy: any = { [sortBy]: sortOrder };

    // Build Prisma where clause dynamically based on filters
    const where: any = {};
    if (filters.type) where.type = filters.type;
    if (filters.method) where.method = filters.method;
    if (filters.status) where.status = filters.status;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }
    if (filters.minAmount || filters.maxAmount) {
      where.amount = {};
      if (filters.minAmount) where.amount.gte = parseFloat(filters.minAmount);
      if (filters.maxAmount) where.amount.lte = parseFloat(filters.maxAmount);
    }
    if (filters.currency) where.currency = filters.currency;
    if (filters.minExchangeRate) where.exchangeRate = { gte: parseFloat(filters.minExchangeRate) };
    if (filters.maxExchangeRate) {
      where.exchangeRate = { ...where.exchangeRate, lte: parseFloat(filters.maxExchangeRate) };
    }
    if (filters.referenceId) where.referenceId = filters.referenceId;

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          flags: true,
          notes: true,
        }
      }),
      prisma.transaction.count({ where }),
    ]);

    return { 
      transactions: transactions.map(t => ({
        ...t,
        amount: parseFloat(t.amount.toString()),
        fees: parseFloat(t.fees.toString()),
        exchangeRate: t.exchangeRate ? parseFloat(t.exchangeRate.toString()) : undefined,
      })), 
      total, 
      page, 
      limit 
    };
  }

  /**
   * Retrieves a single transaction by its ID with all related details.
   */
  async getTransactionById(id: string): Promise<TransactionWithRelations | null> {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        flags: { orderBy: { createdAt: 'desc' } },
        notes: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!transaction) return null;

    return {
      ...transaction,
      amount: parseFloat(transaction.amount.toString()),
      fees: parseFloat(transaction.fees.toString()),
      exchangeRate: transaction.exchangeRate ? parseFloat(transaction.exchangeRate.toString()) : undefined,
    };
  }

  /**
   * Adds an admin note to a specific transaction.
   */
  async addTransactionNote(transactionId: string, content: string, createdBy: string): Promise<any> {
    return prisma.transactionNote.create({
      data: {
        transactionId,
        content,
        createdBy,
      },
    });
  }

  /**
   * Creates a direct deposit initiated by an admin.
   */
  async createDeposit(
    userId: string,
    amount: number,
    currency: string,
    method: string,
    fees: number = 0,
    referenceId?: string,
    metadata?: any,
    adminInitiatedBy?: string
  ): Promise<TransactionWithRelations> {
    console.log(`[TransactionService] Processing direct deposit for user ${userId} of ${amount} ${currency} via ${method}`);

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount,
        currency,
        method,
        fees,
        referenceId,
        metadata: { ...metadata, adminInitiatedBy },
        type: 'DEPOSIT',
        status: 'SUCCESS',
        adminInitiatedBy,
        timeline: [
          { timestamp: new Date(), status: 'INITIATED', description: 'Deposit initiated by admin' },
          { timestamp: new Date(), status: 'SUCCESS', description: 'Deposit completed' },
        ],
        walletBefore: { [currency]: 0 }, // Mock wallet state
        walletAfter: { [currency]: amount }, // Mock wallet state
      },
      include: {
        flags: true,
        notes: true,
      }
    });

    return {
      ...transaction,
      amount: parseFloat(transaction.amount.toString()),
      fees: parseFloat(transaction.fees.toString()),
      exchangeRate: transaction.exchangeRate ? parseFloat(transaction.exchangeRate.toString()) : undefined,
    };
  }
}