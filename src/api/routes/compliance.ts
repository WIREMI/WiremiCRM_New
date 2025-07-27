import express from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import { validateRequest, commonSchemas } from '../../middleware/validation';
import { ComplianceService } from '../../services/compliance/services/ComplianceService';
import { KYCReviewService } from '../../services/compliance/services/KYCReviewService';
import Joi from 'joi';

const router = express.Router();
const complianceService = new ComplianceService();
const kycReviewService = new KYCReviewService();

// Validation schemas
const createCaseSchema = Joi.object({
  customerId: Joi.string().required(),
  type: Joi.string().valid(
    'AML_SUSPICIOUS_ACTIVITY',
    'KYC_NON_COMPLIANCE',
    'SANCTIONS_SCREENING',
    'PEP_MATCH',
    'FRAUD_RELATED',
    'TRANSACTION_MONITORING',
    'CUSTOMER_DUE_DILIGENCE',
    'ENHANCED_DUE_DILIGENCE',
    'OTHER'
  ).required(),
  subject: Joi.string().min(5).max(500).required(),
  description: Joi.string().min(10).max(5000).required(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').optional(),
  assignedTo: Joi.string().optional(),
  relatedEntities: Joi.object().optional(),
  riskScore: Joi.number().integer().min(0).max(100).optional(),
  dueDate: Joi.date().optional()
});

const updateCaseSchema = Joi.object({
  type: Joi.string().valid(
    'AML_SUSPICIOUS_ACTIVITY',
    'KYC_NON_COMPLIANCE',
    'SANCTIONS_SCREENING',
    'PEP_MATCH',
    'FRAUD_RELATED',
    'TRANSACTION_MONITORING',
    'CUSTOMER_DUE_DILIGENCE',
    'ENHANCED_DUE_DILIGENCE',
    'OTHER'
  ).optional(),
  status: Joi.string().valid(
    'OPEN',
    'IN_REVIEW',
    'PENDING_APPROVAL',
    'RESOLVED',
    'CLOSED',
    'ESCALATED',
    'SUSPENDED'
  ).optional(),
  subject: Joi.string().min(5).max(500).optional(),
  description: Joi.string().min(10).max(5000).optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').optional(),
  assignedTo: Joi.string().optional(),
  relatedEntities: Joi.object().optional(),
  riskScore: Joi.number().integer().min(0).max(100).optional(),
  dueDate: Joi.date().optional()
});

const addNoteSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
  isInternal: Joi.boolean().optional()
});

const closeCaseSchema = Joi.object({
  resolution: Joi.string().min(10).max(5000).required()
});

const kycReviewActionSchema = Joi.object({
  notes: Joi.string().max(5000).optional(),
  rejectionReason: Joi.string().min(5).max(1000).when('action', {
    is: 'reject',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  requestDetails: Joi.string().min(5).max(1000).when('action', {
    is: 'request-info',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  escalationReason: Joi.string().min(5).max(1000).when('action', {
    is: 'escalate',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

// Apply authentication to all routes
router.use(authenticate);

/**
 * GET /api/v1/compliance/cases
 * Get compliance cases with filtering and pagination
 */
router.get('/cases',
  authorize(['admin', 'compliance_officer', 'fraud_analyst']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const filters = {
        type: req.query.type as any,
        status: req.query.status as any,
        priority: req.query.priority as any,
        assignedTo: req.query.assignedTo as string,
        customerId: req.query.customerId as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'desc'
      };

      const result = await complianceService.getCases(filters);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error fetching compliance cases:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch compliance cases' });
    }
  }
);

/**
 * POST /api/v1/compliance/cases
 * Create a new compliance case
 */
router.post('/cases',
  authorize(['admin', 'compliance_officer', 'fraud_analyst']),
  validateRequest(createCaseSchema),
  auditLog('compliance_case', 'create'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const caseData = {
        ...req.body,
        createdBy: req.user!.id
      };

      const complianceCase = await complianceService.createCase(caseData);
      res.status(201).json({ success: true, data: complianceCase });
    } catch (error) {
      console.error('Error creating compliance case:', error);
      res.status(500).json({ success: false, error: 'Failed to create compliance case' });
    }
  }
);

/**
 * GET /api/v1/compliance/cases/:id
 * Get a specific compliance case
 */
router.get('/cases/:id',
  authorize(['admin', 'compliance_officer', 'fraud_analyst']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const complianceCase = await complianceService.getCaseById(req.params.id);
      if (!complianceCase) {
        return res.status(404).json({ success: false, error: 'Compliance case not found' });
      }
      res.json({ success: true, data: complianceCase });
    } catch (error) {
      console.error('Error fetching compliance case:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch compliance case' });
    }
  }
);

/**
 * PUT /api/v1/compliance/cases/:id
 * Update a compliance case
 */
router.put('/cases/:id',
  authorize(['admin', 'compliance_officer', 'fraud_analyst']),
  validateRequest(updateCaseSchema),
  auditLog('compliance_case', 'update'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const updatedCase = await complianceService.updateCase(
        req.params.id,
        req.body,
        req.user!.id
      );
      res.json({ success: true, data: updatedCase });
    } catch (error) {
      console.error('Error updating compliance case:', error);
      res.status(500).json({ success: false, error: 'Failed to update compliance case' });
    }
  }
);

/**
 * POST /api/v1/compliance/cases/:id/notes
 * Add a note to a compliance case
 */
router.post('/cases/:id/notes',
  authorize(['admin', 'compliance_officer', 'fraud_analyst']),
  validateRequest(addNoteSchema),
  auditLog('compliance_case', 'add-note'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { content, isInternal = true } = req.body;
      const note = await complianceService.addCaseNote(
        req.params.id,
        content,
        req.user!.id,
        isInternal
      );
      res.status(201).json({ success: true, data: note });
    } catch (error) {
      console.error('Error adding case note:', error);
      res.status(500).json({ success: false, error: 'Failed to add case note' });
    }
  }
);

/**
 * POST /api/v1/compliance/cases/:id/close
 * Close a compliance case
 */
router.post('/cases/:id/close',
  authorize(['admin', 'compliance_officer']),
  validateRequest(closeCaseSchema),
  auditLog('compliance_case', 'close'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { resolution } = req.body;
      const closedCase = await complianceService.closeCase(
        req.params.id,
        resolution,
        req.user!.id
      );
      res.json({ success: true, data: closedCase });
    } catch (error) {
      console.error('Error closing compliance case:', error);
      res.status(500).json({ success: false, error: 'Failed to close compliance case' });
    }
  }
);

/**
 * POST /api/v1/compliance/cases/:id/escalate
 * Escalate a compliance case
 */
router.post('/cases/:id/escalate',
  authorize(['admin', 'compliance_officer', 'fraud_analyst']),
  validateRequest(Joi.object({ reason: Joi.string().min(5).max(1000).required() })),
  auditLog('compliance_case', 'escalate'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { reason } = req.body;
      const escalatedCase = await complianceService.escalateCase(
        req.params.id,
        req.user!.id,
        reason
      );
      res.json({ success: true, data: escalatedCase });
    } catch (error) {
      console.error('Error escalating compliance case:', error);
      res.status(500).json({ success: false, error: 'Failed to escalate compliance case' });
    }
  }
);

/**
 * GET /api/v1/compliance/stats
 * Get compliance statistics
 */
router.get('/stats',
  authorize(['admin', 'compliance_officer', 'fraud_analyst']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const stats = await complianceService.getComplianceStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Error fetching compliance stats:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch compliance stats' });
    }
  }
);

/**
 * GET /api/v1/compliance/kyc-reviews
 * Get KYC reviews with filtering and pagination
 */
router.get('/kyc-reviews',
  authorize(['admin', 'compliance_officer']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const filters = {
        kycStatus: req.query.kycStatus as any,
        priority: req.query.priority as any,
        customerType: req.query.customerType as string,
        reviewedBy: req.query.reviewedBy as string,
        overdue: req.query.overdue === 'true',
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        sortBy: req.query.sortBy as string || 'submissionDate',
        sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'asc'
      };

      const result = await kycReviewService.getPendingReviews(filters);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error fetching KYC reviews:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch KYC reviews' });
    }
  }
);

/**
 * GET /api/v1/compliance/kyc-reviews/:id
 * Get a specific KYC review
 */
router.get('/kyc-reviews/:id',
  authorize(['admin', 'compliance_officer']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const review = await kycReviewService.getReviewById(req.params.id);
      if (!review) {
        return res.status(404).json({ success: false, error: 'KYC review not found' });
      }
      res.json({ success: true, data: review });
    } catch (error) {
      console.error('Error fetching KYC review:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch KYC review' });
    }
  }
);

/**
 * POST /api/v1/compliance/kyc-reviews/:id/approve
 * Approve a KYC review
 */
router.post('/kyc-reviews/:id/approve',
  authorize(['admin', 'compliance_officer']),
  validateRequest(kycReviewActionSchema),
  auditLog('kyc_review', 'approve'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { notes } = req.body;
      const review = await kycReviewService.approveReview(
        req.params.id,
        req.user!.id,
        notes
      );
      res.json({ success: true, data: review, message: 'KYC review approved successfully' });
    } catch (error) {
      console.error('Error approving KYC review:', error);
      res.status(500).json({ success: false, error: 'Failed to approve KYC review' });
    }
  }
);

/**
 * POST /api/v1/compliance/kyc-reviews/:id/reject
 * Reject a KYC review
 */
router.post('/kyc-reviews/:id/reject',
  authorize(['admin', 'compliance_officer']),
  validateRequest(kycReviewActionSchema),
  auditLog('kyc_review', 'reject'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { rejectionReason, notes } = req.body;
      const review = await kycReviewService.rejectReview(
        req.params.id,
        req.user!.id,
        rejectionReason,
        notes
      );
      res.json({ success: true, data: review, message: 'KYC review rejected successfully' });
    } catch (error) {
      console.error('Error rejecting KYC review:', error);
      res.status(500).json({ success: false, error: 'Failed to reject KYC review' });
    }
  }
);

/**
 * POST /api/v1/compliance/kyc-reviews/:id/request-info
 * Request more information for a KYC review
 */
router.post('/kyc-reviews/:id/request-info',
  authorize(['admin', 'compliance_officer']),
  validateRequest(kycReviewActionSchema),
  auditLog('kyc_review', 'request-info'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { requestDetails, notes } = req.body;
      const review = await kycReviewService.requestMoreInfo(
        req.params.id,
        req.user!.id,
        requestDetails,
        notes
      );
      res.json({ success: true, data: review, message: 'Additional information requested successfully' });
    } catch (error) {
      console.error('Error requesting more info for KYC review:', error);
      res.status(500).json({ success: false, error: 'Failed to request more information' });
    }
  }
);

/**
 * POST /api/v1/compliance/kyc-reviews/:id/escalate
 * Escalate a KYC review
 */
router.post('/kyc-reviews/:id/escalate',
  authorize(['admin', 'compliance_officer']),
  validateRequest(Joi.object({ reason: Joi.string().min(5).max(1000).required() })),
  auditLog('kyc_review', 'escalate'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { reason } = req.body;
      const review = await kycReviewService.escalateReview(
        req.params.id,
        req.user!.id,
        reason
      );
      res.json({ success: true, data: review, message: 'KYC review escalated successfully' });
    } catch (error) {
      console.error('Error escalating KYC review:', error);
      res.status(500).json({ success: false, error: 'Failed to escalate KYC review' });
    }
  }
);

/**
 * POST /api/v1/compliance/kyc-reviews/bulk-assign
 * Bulk assign KYC reviews
 */
router.post('/kyc-reviews/bulk-assign',
  authorize(['admin', 'compliance_officer']),
  validateRequest(Joi.object({
    reviewIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
    assignedTo: Joi.string().required()
  })),
  auditLog('kyc_review', 'bulk-assign'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { reviewIds, assignedTo } = req.body;
      const count = await kycReviewService.bulkAssignReviews(
        reviewIds,
        assignedTo,
        req.user!.id
      );
      res.json({ 
        success: true, 
        data: { assignedCount: count },
        message: `${count} KYC reviews assigned successfully` 
      });
    } catch (error) {
      console.error('Error bulk assigning KYC reviews:', error);
      res.status(500).json({ success: false, error: 'Failed to bulk assign KYC reviews' });
    }
  }
);

/**
 * GET /api/v1/compliance/kyc-stats
 * Get KYC review statistics
 */
router.get('/kyc-stats',
  authorize(['admin', 'compliance_officer']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const stats = await kycReviewService.getKYCStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Error fetching KYC stats:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch KYC stats' });
    }
  }
);

export default router;