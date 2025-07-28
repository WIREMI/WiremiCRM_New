import { 
  KYCReview, 
  KYCReviewStatus, 
  Priority,
  ComplianceActionType 
} from '../../../types';
import { ComplianceService } from './ComplianceService';

export class KYCReviewService {
  private complianceService: ComplianceService;

  constructor() {
    this.complianceService = new ComplianceService();
  }

  /**
   * Get pending KYC reviews with filtering and pagination
   */
  async getPendingReviews(filters: {
    kycStatus?: KYCReviewStatus;
    priority?: Priority;
    customerType?: string;
    reviewedBy?: string;
    overdue?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{
    reviews: KYCReview[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      kycStatus,
      priority,
      customerType,
      reviewedBy,
      overdue,
      page = 1,
      limit = 20,
      sortBy = 'submissionDate',
      sortOrder = 'asc'
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (kycStatus) where.kycStatus = kycStatus;
    if (priority) where.priority = priority;
    if (customerType) where.customerType = customerType;
    if (reviewedBy) where.reviewedBy = reviewedBy;
    if (overdue) {
      where.dueDate = { lt: new Date() };
      where.kycStatus = { in: [KYCReviewStatus.PENDING_REVIEW, KYCReviewStatus.IN_REVIEW] };
    }

    const [reviews, total] = await prisma.$transaction([
      prisma.kycReview.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.kycReview.count({ where })
    ]);

    return {
      reviews: reviews as any,
      total,
      page,
      limit
    };
  }

  /**
   * Get a specific KYC review by ID
   */
  async getReviewById(id: string): Promise<KYCReview | null> {
    const review = await prisma.kycReview.findUnique({
      where: { id }
    });

    return review as any;
  }

  /**
   * Approve a KYC review
   */
  async approveReview(
    id: string,
    reviewedBy: string,
    notes?: string
  ): Promise<KYCReview> {
    const review = await prisma.kycReview.update({
      where: { id },
      data: {
        kycStatus: KYCReviewStatus.APPROVED,
        reviewDate: new Date(),
        reviewedBy,
        notes,
        updatedAt: new Date()
      }
    });

    // Create compliance case action if there's an associated case
    await this.complianceService.addCaseAction(
      `kyc-${id}`, // Use KYC review ID as case reference
      ComplianceActionType.KYC_APPROVED,
      `KYC review approved for customer ${review.customerId}`,
      reviewedBy,
      { reviewId: id, notes }
    );

    // TODO: Update customer KYC status in customer table
    // This would typically update the customer's kycStatus to VERIFIED

    return review as any;
  }

  /**
   * Reject a KYC review
   */
  async rejectReview(
    id: string,
    reviewedBy: string,
    rejectionReason: string,
    notes?: string
  ): Promise<KYCReview> {
    const review = await prisma.kycReview.update({
      where: { id },
      data: {
        kycStatus: KYCReviewStatus.REJECTED,
        reviewDate: new Date(),
        reviewedBy,
        rejectionReason,
        notes,
        updatedAt: new Date()
      }
    });

    // Create compliance case action
    await this.complianceService.addCaseAction(
      `kyc-${id}`,
      ComplianceActionType.KYC_REJECTED,
      `KYC review rejected for customer ${review.customerId}: ${rejectionReason}`,
      reviewedBy,
      { reviewId: id, rejectionReason, notes }
    );

    // TODO: Update customer KYC status in customer table
    // This would typically update the customer's kycStatus to REJECTED

    return review as any;
  }

  /**
   * Request more information for a KYC review
   */
  async requestMoreInfo(
    id: string,
    reviewedBy: string,
    details: string,
    notes?: string
  ): Promise<KYCReview> {
    const review = await prisma.kycReview.update({
      where: { id },
      data: {
        kycStatus: KYCReviewStatus.REQUIRES_MORE_INFO,
        reviewDate: new Date(),
        reviewedBy,
        notes,
        updatedAt: new Date()
      }
    });

    // Create compliance case action
    await this.complianceService.addCaseAction(
      `kyc-${id}`,
      ComplianceActionType.DOCUMENT_REQUESTED,
      `Additional information requested for customer ${review.customerId}: ${details}`,
      reviewedBy,
      { reviewId: id, requestDetails: details, notes }
    );

    // TODO: Send notification to customer requesting additional information

    return review as any;
  }

  /**
   * Escalate a KYC review
   */
  async escalateReview(
    id: string,
    escalatedBy: string,
    reason: string
  ): Promise<KYCReview> {
    const review = await prisma.kycReview.update({
      where: { id },
      data: {
        kycStatus: KYCReviewStatus.ESCALATED,
        escalatedAt: new Date(),
        escalatedBy,
        updatedAt: new Date()
      }
    });

    // Create compliance case action
    await this.complianceService.addCaseAction(
      `kyc-${id}`,
      ComplianceActionType.ESCALATED_TO_SUPERVISOR,
      `KYC review escalated for customer ${review.customerId}: ${reason}`,
      escalatedBy,
      { reviewId: id, reason }
    );

    return review as any;
  }

  /**
   * Get KYC review statistics
   */
  async getKYCStats(): Promise<{
    totalReviews: number;
    pendingReviews: number;
    overdueReviews: number;
    approvedToday: number;
    rejectedToday: number;
    averageReviewTime: number;
    reviewsByStatus: { status: string; count: number }[];
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalReviews,
      pendingReviews,
      overdueReviews,
      approvedToday,
      rejectedToday,
      reviewsByStatus
    ] = await Promise.all([
      prisma.kycReview.count(),
      prisma.kycReview.count({
        where: { kycStatus: { in: [KYCReviewStatus.PENDING_REVIEW, KYCReviewStatus.IN_REVIEW] } }
      }),
      prisma.kycReview.count({
        where: {
          dueDate: { lt: new Date() },
          kycStatus: { in: [KYCReviewStatus.PENDING_REVIEW, KYCReviewStatus.IN_REVIEW] }
        }
      }),
      prisma.kycReview.count({
        where: {
          kycStatus: KYCReviewStatus.APPROVED,
          reviewDate: { gte: today, lt: tomorrow }
        }
      }),
      prisma.kycReview.count({
        where: {
          kycStatus: KYCReviewStatus.REJECTED,
          reviewDate: { gte: today, lt: tomorrow }
        }
      }),
      prisma.kycReview.groupBy({
        by: ['kycStatus'],
        _count: true
      })
    ]);

    // Calculate average review time (mock calculation)
    const averageReviewTime = 2.5; // days - would be calculated from actual data

    return {
      totalReviews,
      pendingReviews,
      overdueReviews,
      approvedToday,
      rejectedToday,
      averageReviewTime,
      reviewsByStatus: reviewsByStatus.map(item => ({
        status: item.kycStatus,
        count: item._count
      }))
    };
  }

  /**
   * Bulk assign KYC reviews
   */
  async bulkAssignReviews(
    reviewIds: string[],
    assignedTo: string,
    assignedBy: string
  ): Promise<number> {
    const result = await prisma.kycReview.updateMany({
      where: { id: { in: reviewIds } },
      data: {
        reviewedBy: assignedTo,
        kycStatus: KYCReviewStatus.IN_REVIEW,
        updatedAt: new Date()
      }
    });

    // Log bulk assignment
    for (const reviewId of reviewIds) {
      await this.complianceService.addCaseAction(
        `kyc-${reviewId}`,
        ComplianceActionType.CASE_ASSIGNED,
        `KYC review bulk assigned to ${assignedTo}`,
        assignedBy,
        { bulkAssignment: true, assignedTo }
      );
    }

    return result.count;
  }
}