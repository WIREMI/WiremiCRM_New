import { 
  Region, 
  Country,
  SubscriptionPlan, 
  FeeDefinition, 
  DiscountRule, 
  FeeCalculationResult,
  FeeType,
  FeeSubType,
  FeeMethod,
  FeeValueType,
  DiscountType
} from '../../../types';

export class PricingService {
  
  // Region Management
  async getRegions(): Promise<Region[]> {
    return prisma.region.findMany({
      orderBy: { name: 'asc' },
      include: {
        countries: true,
        _count: {
          select: {
            subscriptionPlans: true,
            feeDefinitions: true,
            discountRules: true
          }
        }
      }
    });
  }

  async createRegion(data: Partial<Region>): Promise<Region> {
    return prisma.region.create({
      data: {
        name: data.name!,
        code: data.code!,
        currency: data.currency!,
        timezone: data.timezone!,
        isActive: data.isActive ?? true
      },
      include: {
        countries: true
      }
    });
  }

  async updateRegion(id: string, data: Partial<Region>): Promise<Region> {
    return prisma.region.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        countries: true
      }
    });
  }

  async deleteRegion(id: string): Promise<void> {
    await prisma.region.delete({
      where: { id }
    });
  }

  // Country Management
  async getCountries(regionId?: string): Promise<Country[]> {
    return prisma.country.findMany({
      where: regionId ? { regionId } : {},
      include: {
        region: true
      },
      orderBy: { name: 'asc' }
    });
  }

  async createCountry(data: Partial<Country>): Promise<Country> {
    return prisma.country.create({
      data: {
        name: data.name!,
        code: data.code!,
        regionId: data.regionId!,
        isActive: data.isActive ?? true
      },
      include: {
        region: true
      }
    });
  }

  async updateCountry(id: string, data: Partial<Country>): Promise<Country> {
    return prisma.country.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        region: true
      }
    });
  }

  async deleteCountry(id: string): Promise<void> {
    await prisma.country.delete({
      where: { id }
    });
  }
  // Subscription Plan Management
  async getSubscriptionPlans(regionId?: string, accountType?: AccountType): Promise<SubscriptionPlan[]> {
    return prisma.subscriptionPlan.findMany({
      where: {
        ...(regionId && { regionId }),
        ...(accountType && { accountType })
      },
      include: {
        region: true
      },
      orderBy: [
        { accountType: 'asc' },
        { sortOrder: 'asc' },
        { price: 'asc' }
      ]
    });
  }

  async createSubscriptionPlan(data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    return prisma.subscriptionPlan.create({
      data: {
        name: data.name!,
        accountType: data.accountType!,
        description: data.description,
        price: data.price!,
        currency: data.currency!,
        billingCycle: data.billingCycle!,
        features: data.features!,
        maxTransactions: data.maxTransactions,
        maxCards: data.maxCards,
        maxSavingsGoals: data.maxSavingsGoals,
        virtualCardIssuanceFee: data.virtualCardIssuanceFee,
        virtualCardMaintenanceFee: data.virtualCardMaintenanceFee,
        regionId: data.regionId,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0
      },
      include: {
        region: true
      }
    });
  }

  async updateSubscriptionPlan(id: string, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    return prisma.subscriptionPlan.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        region: true
      }
    });
  }

  async deleteSubscriptionPlan(id: string): Promise<void> {
    await prisma.subscriptionPlan.delete({
      where: { id }
    });
  }

  // Fee Definition Management
  async getFeeDefinitions(filters?: {
    feeType?: FeeType;
    feeSubType?: FeeSubType;
    feeMethod?: FeeMethod;
    regionId?: string;
    countryCode?: string;
    isActive?: boolean;
  }): Promise<FeeDefinition[]> {
    return prisma.feeDefinition.findMany({
      where: {
        ...(filters?.feeType && { feeType: filters.feeType }),
        ...(filters?.feeSubType && { feeSubType: filters.feeSubType }),
        ...(filters?.feeMethod && { feeMethod: filters.feeMethod }),
        ...(filters?.regionId && { regionId: filters.regionId }),
        ...(filters?.countryCode && { countryCodes: { has: filters.countryCode } }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive })
      },
      include: {
        region: true
      },
      orderBy: [
        { feeType: 'asc' },
        { feeSubType: 'asc' },
        { name: 'asc' }
      ]
    });
  }

  async createFeeDefinition(data: Partial<FeeDefinition>): Promise<FeeDefinition> {
    return prisma.feeDefinition.create({
      data: {
        name: data.name!,
        description: data.description,
        feeType: data.feeType!,
        feeSubType: data.feeSubType,
        feeMethod: data.feeMethod,
        valueType: data.valueType!,
        value: data.value!,
        cap: data.cap,
        minFee: data.minFee,
        currency: data.currency!,
        regionId: data.regionId,
        countryCodes: data.countryCodes || [],
        isActive: data.isActive ?? true,
        effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : new Date(),
        effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : undefined
      },
      include: {
        region: true
      }
    });
  }

  async updateFeeDefinition(id: string, data: Partial<FeeDefinition>): Promise<FeeDefinition> {
    return prisma.feeDefinition.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
        effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : undefined,
        effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : undefined
      },
      include: {
        region: true
      }
    });
  }

  async deleteFeeDefinition(id: string): Promise<void> {
    await prisma.feeDefinition.delete({
      where: { id }
    });
  }

  // Discount Rule Management
  async getDiscountRules(filters?: {
    appliesToFeeType?: FeeType;
    appliesToAccountType?: AccountType;
    countryCode?: string;
    regionId?: string;
    isActive?: boolean;
  }): Promise<DiscountRule[]> {
    return prisma.discountRule.findMany({
      where: {
        ...(filters?.appliesToFeeType && { appliesToFeeType: filters.appliesToFeeType }),
        ...(filters?.appliesToAccountType && { appliesToAccountType: filters.appliesToAccountType }),
        ...(filters?.countryCode && { appliesToCountries: { has: filters.countryCode } }),
        ...(filters?.regionId && { regionId: filters.regionId }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive })
      },
      include: {
        region: true
      },
      orderBy: [
        { startDate: 'desc' },
        { name: 'asc' }
      ]
    });
  }

  async createDiscountRule(data: Partial<DiscountRule>): Promise<DiscountRule> {
    return prisma.discountRule.create({
      data: {
        name: data.name!,
        description: data.description,
        discountType: data.discountType!,
        value: data.value!,
        maxDiscount: data.maxDiscount,
        appliesToFeeType: data.appliesToFeeType,
        appliesToSubType: data.appliesToSubType,
        appliesToMethod: data.appliesToMethod,
        appliesToAccountType: data.appliesToAccountType,
        appliesToCountries: data.appliesToCountries || [],
        regionId: data.regionId,
        minTransactionAmount: data.minTransactionAmount,
        maxTransactionAmount: data.maxTransactionAmount,
        usageLimit: data.usageLimit,
        startDate: new Date(data.startDate!),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        isActive: data.isActive ?? true
      },
      include: {
        region: true
      }
    });
  }

  async updateDiscountRule(id: string, data: Partial<DiscountRule>): Promise<DiscountRule> {
    return prisma.discountRule.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined
      },
      include: {
        region: true
      }
    });
  }

  async deleteDiscountRule(id: string): Promise<void> {
    await prisma.discountRule.delete({
      where: { id }
    });
  }

  // Fee Calculation Engine
  async calculateFee(params: {
    userId: string;
    accountType: AccountType;
    feeType: FeeType;
    feeSubType?: FeeSubType;
    feeMethod?: FeeMethod;
    baseAmount: number;
    currency: string;
    countryCode: string;
    regionId?: string;
    transactionId?: string;
  }): Promise<FeeCalculationResult> {
    const {
      userId,
      accountType,
      feeType,
      feeSubType,
      feeMethod,
      baseAmount,
      currency,
      countryCode,
      regionId,
      transactionId
    } = params;

    // Get region from country code if not provided
    let effectiveRegionId = regionId;
    if (!effectiveRegionId) {
      const country = await prisma.country.findUnique({
        where: { code: countryCode },
        include: { region: true }
      });
      effectiveRegionId = country?.regionId;
    }

    // Get applicable fee definitions
    const feeDefinitions = await this.getFeeDefinitions({
      feeType,
      feeSubType,
      feeMethod,
      regionId: effectiveRegionId,
      countryCode,
      isActive: true
    });

    // Filter fee definitions by country and date validity
    const applicableFees = feeDefinitions.filter(fee => {
      const countryMatch = fee.countryCodes.length === 0 || fee.countryCodes.includes(countryCode);
      const dateMatch = new Date() >= new Date(fee.effectiveFrom) && 
                       (!fee.effectiveTo || new Date() <= new Date(fee.effectiveTo));
      
      return countryMatch && dateMatch;
    });

    // Calculate base fee
    let totalFeeAmount = 0;
    const appliedFeeRules: string[] = [];
    const calculationSteps: any[] = [];

    for (const feeDefinition of applicableFees) {
      let feeAmount = 0;
      
      if (feeDefinition.valueType === FeeValueType.PERCENTAGE) {
        feeAmount = baseAmount * (feeDefinition.value / 100);
      } else {
        feeAmount = feeDefinition.value;
      }

      // Apply cap and minimum fee
      if (feeDefinition.cap && feeAmount > feeDefinition.cap) {
        feeAmount = feeDefinition.cap;
      }
      if (feeDefinition.minFee && feeAmount < feeDefinition.minFee) {
        feeAmount = feeDefinition.minFee;
      }

      totalFeeAmount += feeAmount;
      appliedFeeRules.push(feeDefinition.id);
      
      calculationSteps.push({
        feeDefinitionId: feeDefinition.id,
        feeName: feeDefinition.name,
        valueType: feeDefinition.valueType,
        value: feeDefinition.value,
        calculatedAmount: feeAmount,
        cap: feeDefinition.cap,
        minFee: feeDefinition.minFee
      });
    }

    // Get applicable discount rules
    const discountRules = await this.getDiscountRules({
      appliesToFeeType: feeType,
      appliesToAccountType: accountType,
      countryCode,
      regionId: effectiveRegionId,
      isActive: true
    });

    // Filter discount rules by country, date, transaction amount, and usage limits
    const applicableDiscounts = discountRules.filter(discount => {
      const countryMatch = discount.appliesToCountries.length === 0 || discount.appliesToCountries.includes(countryCode);
      const dateMatch = new Date() >= new Date(discount.startDate) && 
                       (!discount.endDate || new Date() <= new Date(discount.endDate));
      const amountMatch = (!discount.minTransactionAmount || baseAmount >= discount.minTransactionAmount) &&
                         (!discount.maxTransactionAmount || baseAmount <= discount.maxTransactionAmount);
      const usageMatch = !discount.usageLimit || discount.usageCount < discount.usageLimit;
      const subTypeMatch = !discount.appliesToSubType || discount.appliesToSubType === feeSubType;
      const methodMatch = !discount.appliesToMethod || discount.appliesToMethod === feeMethod;
      const accountTypeMatch = !discount.appliesToAccountType || discount.appliesToAccountType === accountType;
      
      return countryMatch && dateMatch && amountMatch && usageMatch && subTypeMatch && methodMatch && accountTypeMatch;
    });

    // Calculate discounts
    let totalDiscountAmount = 0;
    const appliedDiscounts: string[] = [];

    for (const discountRule of applicableDiscounts) {
      let discountAmount = 0;
      
      if (discountRule.discountType === DiscountType.PERCENTAGE_OFF) {
        discountAmount = totalFeeAmount * (discountRule.value / 100);
      } else {
        discountAmount = discountRule.value;
      }

      // Apply maximum discount limit
      if (discountRule.maxDiscount && discountAmount > discountRule.maxDiscount) {
        discountAmount = discountRule.maxDiscount;
      }

      // Don't allow discount to exceed the fee amount
      if (totalDiscountAmount + discountAmount > totalFeeAmount) {
        discountAmount = totalFeeAmount - totalDiscountAmount;
      }

      totalDiscountAmount += discountAmount;
      appliedDiscounts.push(discountRule.id);

      calculationSteps.push({
        discountRuleId: discountRule.id,
        discountName: discountRule.name,
        discountType: discountRule.discountType,
        value: discountRule.value,
        calculatedDiscount: discountAmount,
        maxDiscount: discountRule.maxDiscount
      });

      // Update usage count
      await prisma.discountRule.update({
        where: { id: discountRule.id },
        data: { usageCount: { increment: 1 } }
      });
    }

    const finalFeeAmount = Math.max(0, totalFeeAmount - totalDiscountAmount);

    // Log the calculation
    await prisma.feeCalculationLog.create({
      data: {
        userId,
        transactionId,
        feeType,
        feeSubType,
        feeMethod,
        baseAmount,
        feeAmount: totalFeeAmount,
        discountAmount: totalDiscountAmount,
        finalFeeAmount,
        currency,
        regionId: effectiveRegionId,
        countryCode,
        appliedFeeRules,
        appliedDiscounts,
        calculationDetails: {
          steps: calculationSteps,
          countryCode,
          regionId: effectiveRegionId,
          timestamp: new Date().toISOString()
        }
      }
    });

    return {
      baseAmount,
      feeAmount: totalFeeAmount,
      discountAmount: totalDiscountAmount,
      finalFeeAmount,
      currency,
      appliedFeeRules,
      appliedDiscounts,
      calculationDetails: {
        steps: calculationSteps,
        accountType,
        countryCode,
        regionId: effectiveRegionId,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Analytics and Reporting
  async getFeeAnalytics(filters?: {
    startDate?: string;
    endDate?: string;
    feeType?: FeeType;
    countryCode?: string;
    regionId?: string;
  }) {
    const whereClause: any = {};
    
    if (filters?.startDate) {
      whereClause.createdAt = { gte: new Date(filters.startDate) };
    }
    if (filters?.endDate) {
      whereClause.createdAt = { 
        ...whereClause.createdAt, 
        lte: new Date(filters.endDate) 
      };
    }
    if (filters?.feeType) {
      whereClause.feeType = filters.feeType;
    }
    if (filters?.countryCode) {
      whereClause.countryCode = filters.countryCode;
    }
    if (filters?.regionId) {
      whereClause.regionId = filters.regionId;
    }

    const [
      totalFees,
      totalDiscounts,
      feesByType,
      topDiscountRules
    ] = await Promise.all([
      // Total fees collected
      prisma.feeCalculationLog.aggregate({
        where: whereClause,
        _sum: { finalFeeAmount: true },
        _count: true
      }),

      // Total discounts given
      prisma.feeCalculationLog.aggregate({
        where: whereClause,
        _sum: { discountAmount: true }
      }),

      // Fees by type
      prisma.feeCalculationLog.groupBy({
        by: ['feeType'],
        where: whereClause,
        _sum: { finalFeeAmount: true },
        _count: true
      }),

      // Top discount rules by usage
      prisma.discountRule.findMany({
        where: { isActive: true },
        orderBy: { usageCount: 'desc' },
        take: 10,
        include: { region: true }
      })
    ]);

    return {
      totalFeesCollected: totalFees._sum.finalFeeAmount || 0,
      totalTransactions: totalFees._count,
      totalDiscountsGiven: totalDiscounts._sum.discountAmount || 0,
      feesByType: feesByType.map(item => ({
        feeType: item.feeType,
        totalAmount: item._sum.finalFeeAmount || 0,
        transactionCount: item._count
      })),
      topDiscountRules
    };
  }

  async getSubscriptionAnalytics(regionId?: string) {
    const whereClause = regionId ? { regionId } : {};

    const [
      planStats,
      revenueByPlan,
      planPopularity
    ] = await Promise.all([
      // Basic plan statistics
      prisma.subscriptionPlan.aggregate({
        where: { ...whereClause, isActive: true },
        _count: true,
        _avg: { price: true },
        _min: { price: true },
        _max: { price: true }
      }),

      // Revenue by billing cycle
      prisma.subscriptionPlan.groupBy({
        by: ['billingCycle'],
        where: { ...whereClause, isActive: true },
        _sum: { price: true },
        _count: true
      }),

      // Plan popularity (mock data - would need subscription tracking)
      prisma.subscriptionPlan.findMany({
        where: { ...whereClause, isActive: true },
        include: { region: true },
        orderBy: { price: 'asc' }
      })
    ]);

    return {
      totalPlans: planStats._count,
      averagePrice: planStats._avg.price || 0,
      priceRange: {
        min: planStats._min.price || 0,
        max: planStats._max.price || 0
      },
      revenueByBillingCycle: revenueByPlan.map(item => ({
        billingCycle: item.billingCycle,
        totalRevenue: item._sum.price || 0,
        planCount: item._count
      })),
      plans: planPopularity
    };
  }

  // FX Configuration Management
  async getExchangeRates(filters?: {
    fromCurrency?: string;
    toCurrency?: string;
    isActive?: boolean;
  }): Promise<ExchangeRate[]> {
    return prisma.exchangeRate.findMany({
      where: {
        ...(filters?.fromCurrency && { fromCurrency: filters.fromCurrency }),
        ...(filters?.toCurrency && { toCurrency: filters.toCurrency }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive })
      },
      orderBy: [
        { fromCurrency: 'asc' },
        { toCurrency: 'asc' }
      ]
    });
  }

  async updateExchangeRate(data: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    source?: string;
  }): Promise<ExchangeRate> {
    return prisma.exchangeRate.upsert({
      where: {
        fromCurrency_toCurrency: {
          fromCurrency: data.fromCurrency,
          toCurrency: data.toCurrency
        }
      },
      update: {
        rate: data.rate,
        source: data.source || 'manual',
        lastUpdated: new Date(),
        updatedAt: new Date()
      },
      create: {
        fromCurrency: data.fromCurrency,
        toCurrency: data.toCurrency,
        rate: data.rate,
        source: data.source || 'manual',
        isActive: true
      }
    });
  }

  async getCurrencyPairConfigurations(): Promise<CurrencyPairConfiguration[]> {
    return prisma.currencyPairConfiguration.findMany({
      orderBy: [
        { baseCurrency: 'asc' },
        { targetCurrency: 'asc' }
      ]
    });
  }

  async createCurrencyPairConfiguration(data: Partial<CurrencyPairConfiguration>): Promise<CurrencyPairConfiguration> {
    return prisma.currencyPairConfiguration.create({
      data: {
        baseCurrency: data.baseCurrency!,
        targetCurrency: data.targetCurrency!,
        isActive: data.isActive ?? true,
        refreshInterval: data.refreshInterval ?? 3600,
        autoUpdate: data.autoUpdate ?? false,
        tolerance: data.tolerance,
        markup: data.markup,
        spread: data.spread
      }
    });
  }

  async convertCurrency(request: CurrencyConversionRequest): Promise<CurrencyConversionResult> {
    const exchangeRate = await prisma.exchangeRate.findUnique({
      where: {
        fromCurrency_toCurrency: {
          fromCurrency: request.fromCurrency,
          toCurrency: request.toCurrency
        }
      }
    });

    if (!exchangeRate) {
      throw new Error(`Exchange rate not found for ${request.fromCurrency} to ${request.toCurrency}`);
    }

    const convertedAmount = request.amount * parseFloat(exchangeRate.rate.toString());

    return {
      fromCurrency: request.fromCurrency,
      toCurrency: request.toCurrency,
      fromAmount: request.amount,
      toAmount: convertedAmount,
      rate: parseFloat(exchangeRate.rate.toString()),
      timestamp: new Date().toISOString()
    };
  }

  async updateCurrencyPairConfiguration(id: string, data: Partial<CurrencyPairConfiguration>): Promise<CurrencyPairConfiguration> {
    return prisma.currencyPairConfiguration.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  async deleteCurrencyPairConfiguration(id: string): Promise<void> {
    await prisma.currencyPairConfiguration.delete({
      where: { id }
    });
  }
}

export const pricingService = new PricingService();