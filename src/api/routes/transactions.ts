import express from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import { validateRequest, commonSchemas } from '../../middleware/validation';
import { TransactionService } from '../../services/transactions/services/TransactionService';
import { FlagService } from '../../services/transactions/services/FlagService';
import { ReversalService } from '../../services/transactions/services/ReversalService';
import { ExportService } from '../../services/transactions/services/ExportService';
import Joi from 'joi';

const router = express.Router();
const transactionService = new TransactionService();
const flagService = new FlagService();
const reversalService = new ReversalService();
const exportService = new ExportService();

// Validation schemas
const transactionListSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().valid('createdAt', 'amount', 'status').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  type: Joi.string().valid('DEPOSIT', 'TRANSFER', 'WITHDRAWAL', 'CARD_SERVICE', 'SAVINGS').optional(),
  method: Joi.string().optional(),
  status: Joi.string().valid('PROCESSING', 'SUCCESS', 'FAILED', 'PENDING_APPROVAL', 'REVERSED', 'CANCELLED').optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  minAmount: Joi.number().min(0).optional(),
  maxAmount: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).uppercase().optional(),
  minExchangeRate: Joi.number().min(0).optional(),
  maxExchangeRate: Joi.number().min(0).optional(),
  country: Joi.string().optional(),
  region: Joi.string().optional(),
  referenceId: Joi.string().optional(),
  accountNumber: Joi.string().optional(),
  counterpartyName: Joi.string().optional(),
  counterpartyId: Joi.string().optional(),
});

const flagTransactionSchema = Joi.object({
  reason: Joi.string().min(5).max(500).required(),
  severity: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').required(),
});

const addNoteSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
});

const exportTransactionsSchema = Joi.object({
  format: Joi.string().valid('CSV', 'XLSX', 'PDF').default('CSV'),
  filters: transactionListSchema.optional(),
});

const depositRequestSchema = Joi.object({
  userId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).uppercase().required(),
  method: Joi.string().valid('MOMO_MTN', 'MOMO_ORANGE', 'INTERAC', 'BANK', 'PAYPAL', 'CARD', 'ADMIN_INITIATED').required(),
  fees: Joi.number().min(0).default(0),
  referenceId: Joi.string().optional(),
  metadata: Joi.object().optional(),
});

// Apply authentication to all routes
router.use(authenticate);

/**
 * GET /api/v1/transactions
 * Get paginated list of transactions with filters & sorting
 */
router.get('/',
  authorize(['admin', 'analyst', 'operations', 'compliance', 'viewer']),
  validateRequest(transactionListSchema, 'query'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { page, limit, sortBy, sortOrder, ...filters } = req.query;
      const transactions = await transactionService.getTransactions(
        filters as any,
        parseInt(page as string),
        parseInt(limit as string),
        sortBy as string,
        sortOrder as string
      );
      res.json({ success: true, data: transactions });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
    }
  }
);

/**
 * GET /api/v1/transactions/:id
 * Get full transaction details including timeline & wallet balances
 */
router.get('/:id',
  authorize(['admin', 'analyst', 'operations', 'compliance', 'viewer']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const transaction = await transactionService.getTransactionById(req.params.id);
      if (!transaction) {
        return res.status(404).json({ success: false, error: 'Transaction not found' });
      }
      res.json({ success: true, data: transaction });
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch transaction details' });
    }
  }
);

/**
 * POST /api/v1/transactions/:id/flag
 * Record a flag for a specific transaction
 */
router.post('/:id/flag',
  authorize(['admin', 'compliance', 'operations']),
  validateRequest(flagTransactionSchema),
  auditLog('transaction', 'flag'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { reason, severity } = req.body;
      const flag = await flagService.flagTransaction(
        req.params.id,
        reason,
        severity,
        req.user!.id
      );
      res.status(201).json({ success: true, data: flag, message: 'Transaction flagged successfully' });
    } catch (error) {
      console.error('Error flagging transaction:', error);
      res.status(500).json({ success: false, error: 'Failed to flag transaction' });
    }
  }
);

/**
 * POST /api/v1/transactions/bulk-flag
 * Record flags for multiple transactions based on criteria
 */
router.post('/bulk-flag',
  authorize(['admin', 'compliance', 'operations']),
  validateRequest(Joi.object({
    filters: transactionListSchema.optional(),
    reason: Joi.string().min(5).max(500).required(),
    severity: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').required(),
  })),
  auditLog('transaction', 'bulk-flag'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { filters, reason, severity } = req.body;
      const result = await flagService.bulkFlagTransactions(
        filters,
        reason,
        severity,
        req.user!.id
      );
      res.status(201).json({ success: true, data: result, message: 'Transactions bulk flagged successfully' });
    } catch (error) {
      console.error('Error bulk flagging transactions:', error);
      res.status(500).json({ success: false, error: 'Failed to bulk flag transactions' });
    }
  }
);

/**
 * POST /api/v1/transactions/:id/reverse
 * Enqueue reversal workflow for a transaction
 */
router.post('/:id/reverse',
  authorize(['admin', 'operations']),
  auditLog('transaction', 'reverse'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const reversalRequest = await reversalService.requestReversal(
        req.params.id,
        req.user!.id,
        req.body.reason
      );
      res.status(202).json({ success: true, data: reversalRequest, message: 'Reversal request enqueued' });
    } catch (error) {
      console.error('Error requesting reversal:', error);
      res.status(500).json({ success: false, error: 'Failed to enqueue reversal request' });
    }
  }
);

/**
 * POST /api/v1/transactions/:id/note
 * Add an admin note to a transaction
 */
router.post('/:id/note',
  authorize(['admin', 'analyst', 'operations', 'compliance']),
  validateRequest(addNoteSchema),
  auditLog('transaction', 'add-note'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { content } = req.body;
      const note = await transactionService.addTransactionNote(
        req.params.id,
        content,
        req.user!.id
      );
      res.status(201).json({ success: true, data: note, message: 'Note added successfully' });
    } catch (error) {
      console.error('Error adding note:', error);
      res.status(500).json({ success: false, error: 'Failed to add note' });
    }
  }
);

/**
 * POST /api/v1/transactions/export
 * Schedule CSV/XLSX/PDF export job for transactions
 */
router.post('/export',
  authorize(['admin', 'analyst', 'operations', 'compliance']),
  validateRequest(exportTransactionsSchema),
  auditLog('transaction', 'export'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { format, filters } = req.body;
      const exportJob = await exportService.scheduleExport(
        format,
        filters,
        req.user!.id
      );
      res.status(202).json({ success: true, data: exportJob, message: 'Export job scheduled' });
    } catch (error) {
      console.error('Error scheduling export:', error);
      res.status(500).json({ success: false, error: 'Failed to schedule export' });
    }
  }
);

/**
 * GET /api/v1/transactions/:id/receipt
 * Generate and download a PDF receipt for a single transaction
 */
router.get('/:id/receipt',
  authorize(['admin', 'analyst', 'operations', 'viewer']),
  auditLog('transaction', 'download-receipt'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const transactionId = req.params.id;
      const receiptBuffer = await exportService.generatePdfReceipt(transactionId);

      if (!receiptBuffer) {
        return res.status(404).json({ success: false, error: 'Receipt not found or could not be generated' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=transaction_receipt_${transactionId}.pdf`);
      res.send(receiptBuffer);
    } catch (error) {
      console.error('Error generating PDF receipt:', error);
      res.status(500).json({ success: false, error: 'Failed to generate PDF receipt' });
    }
  }
);

/**
 * POST /api/v1/transactions/deposit
 * Admin initiates a direct deposit for a user
 */
router.post('/deposit',
  authorize(['admin', 'operations']),
  validateRequest(depositRequestSchema),
  auditLog('transaction', 'admin-deposit'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const deposit = await transactionService.createDeposit(
        req.body.userId,
        req.body.amount,
        req.body.currency,
        req.body.method,
        req.body.fees,
        req.body.referenceId,
        req.body.metadata,
        req.user!.id
      );
      res.status(201).json({ success: true, data: deposit, message: 'Deposit created successfully' });
    } catch (error) {
      console.error('Error creating deposit:', error);
      res.status(500).json({ success: false, error: 'Failed to create deposit' });
    }
  }
);

export default router;