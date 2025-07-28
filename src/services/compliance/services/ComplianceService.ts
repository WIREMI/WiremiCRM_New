import { 
  ComplianceCase, 
  ComplianceCaseNote, 
  ComplianceCaseAction,
  ComplianceCaseType,
  ComplianceCaseStatus,
  ComplianceActionType,
  Priority 
} from '../../../types';

export class ComplianceService {
  
  /**
   * Create a new compliance case
   */
  async createCase(data: {
    customerId: string;
    type: ComplianceCaseType;
    subject: string;
    description: string;
    priority?: Priority;
    assignedTo?: string;
    relatedEntities?: any;
    riskScore?: number;
    dueDate?: string;
    createdBy: string;
  }): Promise<ComplianceCase> {
    // Generate case number
    const caseNumber = await this.generateCaseNumber();
    
    const complianceCase = await prisma.complianceCase.create({
      data: {
        caseNumber,
        customerId: data.customerId,
        type: data.type,
        subject: data.subject,
        description: data.description,
        priority: data.priority || Priority.MEDIUM,
        assignedTo: data.assignedTo,
        relatedEntities: data.relatedEntities,
        riskScore: data.riskScore,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        createdBy: data.createdBy
      },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        actions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // Log case creation action
    await this.addCaseAction(
      complianceCase.id,
      ComplianceActionType.CASE_CREATED,
      `Case ${caseNumber} created`,
      data.createdBy,
      { caseType: data.type, priority: data.priority }
    );

    return complianceCase as any;
  }

  /**
   * Get compliance cases with filtering and pagination
   */
  async getCases(filters: {
    type?: ComplianceCaseType;
    status?: ComplianceCaseStatus;
    priority?: Priority;
    assignedTo?: string;
    customerId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{
    cases: ComplianceCase[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      type,
      status,
      priority,
      assignedTo,
      customerId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (type) where.type = type;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;
    if (customerId) where.customerId = customerId;

    const [cases, total] = await prisma.$transaction([
      prisma.complianceCase.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          notes: {
            orderBy: { createdAt: 'desc' },
            take: 3 // Latest 3 notes for list view
          },
          actions: {
            orderBy: { createdAt: 'desc' },
            take: 5 // Latest 5 actions for list view
          }
        }
      }),
      prisma.complianceCase.count({ where })
    ]);

    return {
      cases: cases as any,
      total,
      page,
      limit
    };
  }

  /**
   * Get a specific compliance case by ID
   */
  async getCaseById(id: string): Promise<ComplianceCase | null> {
    const complianceCase = await prisma.complianceCase.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        actions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return complianceCase as any;
  }

  /**
   * Update a compliance case
   */
  async updateCase(
    id: string, 
    data: Partial<ComplianceCase>,
    updatedBy: string
  ): Promise<ComplianceCase> {
    const currentCase = await prisma.complianceCase.findUnique({
      where: { id }
    });

    if (!currentCase) {
      throw new Error('Compliance case not found');
    }

    const updatedCase = await prisma.complianceCase.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
        ...(data.status === ComplianceCaseStatus.CLOSED && {
          closedAt: new Date(),
          closedBy: updatedBy
        }),
        ...(data.status === ComplianceCaseStatus.ESCALATED && {
          escalatedAt: new Date(),
          escalatedBy: updatedBy
        })
      },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        actions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // Log status change if status was updated
    if (data.status && data.status !== currentCase.status) {
      await this.addCaseAction(
        id,
        ComplianceActionType.STATUS_CHANGED,
        `Case status changed from ${currentCase.status} to ${data.status}`,
        updatedBy,
        { previousStatus: currentCase.status, newStatus: data.status }
      );
    }

    // Log assignment change if assignedTo was updated
    if (data.assignedTo && data.assignedTo !== currentCase.assignedTo) {
      await this.addCaseAction(
        id,
        ComplianceActionType.CASE_ASSIGNED,
        `Case assigned to ${data.assignedTo}`,
        updatedBy,
        { previousAssignee: currentCase.assignedTo, newAssignee: data.assignedTo }
      );
    }

    return updatedCase as any;
  }

  /**
   * Add a note to a compliance case
   */
  async addCaseNote(
    caseId: string,
    content: string,
    createdBy: string,
    isInternal: boolean = true
  ): Promise<ComplianceCaseNote> {
    const note = await prisma.complianceCaseNote.create({
      data: {
        caseId,
        content,
        isInternal,
        createdBy
      }
    });

    // Log note addition action
    await this.addCaseAction(
      caseId,
      ComplianceActionType.NOTE_ADDED,
      `${isInternal ? 'Internal' : 'External'} note added`,
      createdBy
    );

    return note as any;
  }

  /**
   * Add an action to a compliance case
   */
  async addCaseAction(
    caseId: string,
    actionType: ComplianceActionType,
    description: string,
    performedBy: string,
    metadata?: any
  ): Promise<ComplianceCaseAction> {
    const action = await prisma.complianceCaseAction.create({
      data: {
        caseId,
        actionType,
        description,
        performedBy,
        metadata
      }
    });

    return action as any;
  }

  /**
   * Close a compliance case
   */
  async closeCase(
    id: string,
    resolution: string,
    closedBy: string
  ): Promise<ComplianceCase> {
    const updatedCase = await prisma.complianceCase.update({
      where: { id },
      data: {
        status: ComplianceCaseStatus.CLOSED,
        resolution,
        closedAt: new Date(),
        closedBy,
        updatedAt: new Date()
      },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        actions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // Log case closure action
    await this.addCaseAction(
      id,
      ComplianceActionType.CASE_CLOSED,
      `Case closed: ${resolution}`,
      closedBy,
      { resolution }
    );

    return updatedCase as any;
  }

  /**
   * Get compliance statistics
   */
  async getComplianceStats(): Promise<{
    totalCases: number;
    openCases: number;
    highPriorityCases: number;
    overdueReviews: number;
    casesByType: { type: string; count: number }[];
    casesByStatus: { status: string; count: number }[];
  }> {
    const [
      totalCases,
      openCases,
      highPriorityCases,
      overdueReviews,
      casesByType,
      casesByStatus
    ] = await Promise.all([
      prisma.complianceCase.count(),
      prisma.complianceCase.count({
        where: { status: { in: [ComplianceCaseStatus.OPEN, ComplianceCaseStatus.IN_REVIEW] } }
      }),
      prisma.complianceCase.count({
        where: { 
          priority: { in: [Priority.HIGH, Priority.CRITICAL] },
          status: { not: ComplianceCaseStatus.CLOSED }
        }
      }),
      prisma.kycReview.count({
        where: {
          dueDate: { lt: new Date() },
          kycStatus: { in: ['PENDING_REVIEW', 'IN_REVIEW'] }
        }
      }),
      prisma.complianceCase.groupBy({
        by: ['type'],
        _count: true
      }),
      prisma.complianceCase.groupBy({
        by: ['status'],
        _count: true
      })
    ]);

    return {
      totalCases,
      openCases,
      highPriorityCases,
      overdueReviews,
      casesByType: casesByType.map(item => ({
        type: item.type,
        count: item._count
      })),
      casesByStatus: casesByStatus.map(item => ({
        status: item.status,
        count: item._count
      }))
    };
  }

  /**
   * Generate a unique case number
   */
  private async generateCaseNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Get the count of cases created this month
    const startOfMonth = new Date(year, new Date().getMonth(), 1);
    const endOfMonth = new Date(year, new Date().getMonth() + 1, 0);
    
    const monthlyCount = await prisma.complianceCase.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    const sequence = String(monthlyCount + 1).padStart(4, '0');
    return `COMP-${year}${month}-${sequence}`;
  }

  /**
   * Escalate a case to supervisor
   */
  async escalateCase(
    id: string,
    escalatedBy: string,
    reason: string
  ): Promise<ComplianceCase> {
    const updatedCase = await prisma.complianceCase.update({
      where: { id },
      data: {
        status: ComplianceCaseStatus.ESCALATED,
        escalatedAt: new Date(),
        escalatedBy,
        updatedAt: new Date()
      },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        actions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // Log escalation action
    await this.addCaseAction(
      id,
      ComplianceActionType.ESCALATED_TO_SUPERVISOR,
      `Case escalated: ${reason}`,
      escalatedBy,
      { reason }
    );

    return updatedCase as any;
  }
}