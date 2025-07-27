import express from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import { validateRequest, commonSchemas } from '../../middleware/validation';
import { pricingService } from '../../services/pricing-billing/services/PricingService';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const regionSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  code: Joi.string().min(2).max(10).required(),
  currency: Joi.string().length(3).required(),
  timezone: Joi.string().min(1).max(50).required(),
  isActive: Joi.boolean().optional()
});

const countrySchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  code: Joi.string().length(2).required(),
  regionId: Joi.string().uuid().required(),
  isActive: Joi.boolean().optional()
});
const subscriptionPlanSchema = Joi.object({
  name: Joi.string().valid('FREE', 'PREMIUM', 'BUSINESS').required(),
  accountType: Joi.string().valid('PERSONAL', 'BUSINESS').required(),
  description: Joi.string().max(1000).optional(),
  price: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  billingCycle: Joi.string().valid('MONTHLY', 'QUARTERLY', 'ANNUALLY').required(),
  features: Joi.array().items(Joi.string()).required(),
  maxTransactions: Joi.number().integer().positive().optional(),
  maxCards: Joi.number().integer().positive().optional(),
  maxSavingsGoals: Joi.number().integer().positive().optional(),
  virtualCardIssuanceFee: Joi.number().min(0).optional(),
  virtualCardMaintenanceFee: Joi.number().min(0).optional(),
  regionId: Joi.string().uuid().optional(),
  isActive: Joi.boolean().optional(),
  sortOrder: Joi.number().integer().optional()
});

const feeDefinitionSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  feeType: Joi.string().valid(
    'CARD_DEPOSIT', 'MOMO_DEPOSIT_ORANGE', 'MOMO_DEPOSIT_MTN', 'BANK_DEPOSIT', 
    'INTERAC_DEPOSIT', 'PAYPAL_DEPOSIT', 'GOOGLE_PAY_DEPOSIT', 'OPAY_DEPOSIT',
    'MOMO_TRANSFER', 'WIREMI_TRANSFER', 'BANK_WIRE', 'BANK_TRANSFER', 'INTERAC_TRANSFER',
    'VIRTUAL_CARDS_WITHDRAWALS', 'ON_RAMP', 'OFF_RAMP', 'LOAN_REFINANCE', 
    'LOAN_PROCESSING', 'LOAN_DEFAULT', 'CAPITAL', 'DONATION', 'INVESTMENT', 'SUBSCRIPTION'
  ).required(),
  feeSubType: Joi.string().optional(),
  feeMethod: Joi.string().optional(),
  valueType: Joi.string().valid('PERCENTAGE', 'FLAT').required(),
  value: Joi.number().positive().required(),
  cap: Joi.number().positive().optional(),
  minFee: Joi.number().positive().optional(),
  currency: Joi.string().length(3).required(),
  regionId: Joi.string().uuid().optional(),
  countryCodes: Joi.array().items(Joi.string().length(2)).optional(),
  isActive: Joi.boolean().optional(),
  effectiveFrom: Joi.date().optional(),
  effectiveTo: Joi.date().optional()
});

const discountRuleSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  discountType: Joi.string().valid('PERCENTAGE_OFF', 'FLAT_OFF').required(),
  value: Joi.number().positive().required(),
  maxDiscount: Joi.number().positive().optional(),
  appliesToFeeType: Joi.string().optional(),
  appliesToSubType: Joi.string().optional(),
  appliesToMethod: Joi.string().optional(),
  appliesToAccountType: Joi.string().valid('PERSONAL', 'BUSINESS').optional(),
  appliesToCountries: Joi.array().items(Joi.string().length(2)).optional(),
  regionId: Joi.string().uuid().optional(),
  minTransactionAmount: Joi.number().positive().optional(),
  maxTransactionAmount: Joi.number().positive().optional(),
  usageLimit: Joi.number().integer().positive().optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().optional(),
  isActive: Joi.boolean().optional()
});

const feeCalculationSchema = Joi.object({
  userId: Joi.string().required(),
  accountType: Joi.string().valid('PERSONAL', 'BUSINESS').required(),
  feeType: Joi.string().valid(
    'CARD_DEPOSIT', 'MOMO_DEPOSIT_ORANGE', 'MOMO_DEPOSIT_MTN', 'BANK_DEPOSIT', 
    'INTERAC_DEPOSIT', 'PAYPAL_DEPOSIT', 'GOOGLE_PAY_DEPOSIT', 'OPAY_DEPOSIT',
    'MOMO_TRANSFER', 'WIREMI_TRANSFER', 'BANK_WIRE', 'BANK_TRANSFER', 'INTERAC_TRANSFER',
    'VIRTUAL_CARDS_WITHDRAWALS', 'ON_RAMP', 'OFF_RAMP', 'LOAN_REFINANCE', 
    'LOAN_PROCESSING', 'LOAN_DEFAULT', 'CAPITAL', 'DONATION', 'INVESTMENT', 'SUBSCRIPTION'
  ).required(),
  feeSubType: Joi.string().optional(),
  feeMethod: Joi.string().optional(),
  baseAmount: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  countryCode: Joi.string().length(2).required(),
  regionId: Joi.string().uuid().optional(),
  transactionId: Joi.string().optional()
});

// Apply authentication to all routes
router.use(authenticate);

// Region Management Routes
router.get('/regions',
  authorize(['admin', 'finance_manager', 'analyst']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const regions = await pricingService.getRegions();
      res.json({ success: true, data: regions });
    } catch (error) {
      console.error('Error fetching regions:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch regions' });
    }
  }
);

router.post('/regions',
  authorize(['admin', 'finance_manager']),
  validateRequest(regionSchema),
  auditLog('region', 'create'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const region = await pricingService.createRegion(req.body);
      res.status(201).json({ success: true, data: region });
    } catch (error) {
      console.error('Error creating region:', error);
      res.status(500).json({ success: false, error: 'Failed to create region' });
    }
  }
);

router.put('/regions/:id',
  authorize(['admin', 'finance_manager']),
  validateRequest(regionSchema),
  auditLog('region', 'update'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const region = await pricingService.updateRegion(req.params.id, req.body);
      res.json({ success: true, data: region });
    } catch (error) {
      console.error('Error updating region:', error);
      res.status(500).json({ success: false, error: 'Failed to update region' });
    }
  }
);

router.delete('/regions/:id',
  authorize(['admin', 'finance_manager']),
  auditLog('region', 'delete'),
  async (req: AuthenticatedRequest, res) => {
    try {
      await pricingService.deleteRegion(req.params.id);
      res.json({ success: true, message: 'Region deleted successfully' });
    } catch (error) {
      console.error('Error deleting region:', error);
      res.status(500).json({ success: false, error: 'Failed to delete region' });
    }
  }
);

// Country Management Routes
router.get('/countries',
  authorize(['admin', 'finance_manager', 'analyst']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const regionId = req.query.regionId as string;
      const countries = await pricingService.getCountries(regionId);
      res.json({ success: true, data: countries });
    } catch (error) {
      console.error('Error fetching countries:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch countries' });
    }
  }
);

router.post('/countries',
  authorize(['admin', 'finance_manager']),
  validateRequest(countrySchema),
  auditLog('country', 'create'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const country = await pricingService.createCountry(req.body);
      res.status(201).json({ success: true, data: country });
    } catch (error) {
      console.error('Error creating country:', error);
      res.status(500).json({ success: false, error: 'Failed to create country' });
    }
  }
);

router.put('/countries/:id',
  authorize(['admin', 'finance_manager']),
  validateRequest(countrySchema),
  auditLog('country', 'update'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const country = await pricingService.updateCountry(req.params.id, req.body);
      res.json({ success: true, data: country });
    } catch (error) {
      console.error('Error updating country:', error);
      res.status(500).json({ success: false, error: 'Failed to update country' });
    }
  }
);

router.delete('/countries/:id',
  authorize(['admin', 'finance_manager']),
  auditLog('country', 'delete'),
  async (req: AuthenticatedRequest, res) => {
    try {
      await pricingService.deleteCountry(req.params.id);
      res.json({ success: true, message: 'Country deleted successfully' });
    } catch (error) {
      console.error('Error deleting country:', error);
      res.status(500).json({ success: false, error: 'Failed to delete country' });
    }
  }
);
// Subscription Plan Routes
router.get('/subscriptions',
  authorize(['admin', 'finance_manager', 'analyst']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const regionId = req.query.regionId as string;
      const accountType = req.query.accountType as any;
      const plans = await pricingService.getSubscriptionPlans(regionId, accountType);
      res.json({ success: true, data: plans });
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch subscription plans' });
    }
  }
);

router.post('/subscriptions',
  authorize(['admin', 'finance_manager']),
  validateRequest(subscriptionPlanSchema),
  auditLog('subscription_plan', 'create'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const plan = await pricingService.createSubscriptionPlan(req.body);
      res.status(201).json({ success: true, data: plan });
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      res.status(500).json({ success: false, error: 'Failed to create subscription plan' });
    }
  }
);

router.put('/subscriptions/:id',
  authorize(['admin', 'finance_manager']),
  validateRequest(subscriptionPlanSchema),
  auditLog('subscription_plan', 'update'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const plan = await pricingService.updateSubscriptionPlan(req.params.id, req.body);
      res.json({ success: true, data: plan });
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      res.status(500).json({ success: false, error: 'Failed to update subscription plan' });
    }
  }
);

router.delete('/subscriptions/:id',
  authorize(['admin', 'finance_manager']),
  auditLog('subscription_plan', 'delete'),
  async (req: AuthenticatedRequest, res) => {
    try {
      await pricingService.deleteSubscriptionPlan(req.params.id);
      res.json({ success: true, message: 'Subscription plan deleted successfully' });
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      res.status(500).json({ success: false, error: 'Failed to delete subscription plan' });
    }
  }
);

// Fee Definition Routes
router.get('/fees',
  authorize(['admin', 'finance_manager', 'analyst']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const filters = {
        feeType: req.query.feeType as any,
        feeSubType: req.query.feeSubType as any,
        feeMethod: req.query.feeMethod as any,
        regionId: req.query.regionId as string,
        countryCode: req.query.countryCode as string,
        isActive: req.query.isActive ? req.query.isActive === 'true' : undefined
      };
      const fees = await pricingService.getFeeDefinitions(filters);
      res.json({ success: true, data: fees });
    } catch (error) {
      console.error('Error fetching fee definitions:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch fee definitions' });
    }
  }
);

router.post('/fees',
  authorize(['admin', 'finance_manager']),
  validateRequest(feeDefinitionSchema),
  auditLog('fee_definition', 'create'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const fee = await pricingService.createFeeDefinition(req.body);
      res.status(201).json({ success: true, data: fee });
    } catch (error) {
      console.error('Error creating fee definition:', error);
      res.status(500).json({ success: false, error: 'Failed to create fee definition' });
    }
  }
);

router.put('/fees/:id',
  authorize(['admin', 'finance_manager']),
  validateRequest(feeDefinitionSchema),
  auditLog('fee_definition', 'update'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const fee = await pricingService.updateFeeDefinition(req.params.id, req.body);
      res.json({ success: true, data: fee });
    } catch (error) {
      console.error('Error updating fee definition:', error);
      res.status(500).json({ success: false, error: 'Failed to update fee definition' });
    }
  }
);

router.delete('/fees/:id',
  authorize(['admin', 'finance_manager']),
  auditLog('fee_definition', 'delete'),
  async (req: AuthenticatedRequest, res) => {
    try {
      await pricingService.deleteFeeDefinition(req.params.id);
      res.json({ success: true, message: 'Fee definition deleted successfully' });
    } catch (error) {
      console.error('Error deleting fee definition:', error);
      res.status(500).json({ success: false, error: 'Failed to delete fee definition' });
    }
  }
);

// Discount Rule Routes
router.get('/discounts',
  authorize(['admin', 'finance_manager', 'analyst']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const filters = {
        appliesToFeeType: req.query.appliesToFeeType as any,
        appliesToAccountType: req.query.appliesToAccountType as any,
        countryCode: req.query.countryCode as string,
        regionId: req.query.regionId as string,
        isActive: req.query.isActive ? req.query.isActive === 'true' : undefined
      };
      const discounts = await pricingService.getDiscountRules(filters);
      res.json({ success: true, data: discounts });
    } catch (error) {
      console.error('Error fetching discount rules:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch discount rules' });
    }
  }
);

router.post('/discounts',
  authorize(['admin', 'finance_manager']),
  validateRequest(discountRuleSchema),
  auditLog('discount_rule', 'create'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const discount = await pricingService.createDiscountRule(req.body);
      res.status(201).json({ success: true, data: discount });
    } catch (error) {
      console.error('Error creating discount rule:', error);
      res.status(500).json({ success: false, error: 'Failed to create discount rule' });
    }
  }
);

router.put('/discounts/:id',
  authorize(['admin', 'finance_manager']),
  validateRequest(discountRuleSchema),
  auditLog('discount_rule', 'update'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const discount = await pricingService.updateDiscountRule(req.params.id, req.body);
      res.json({ success: true, data: discount });
    } catch (error) {
      console.error('Error updating discount rule:', error);
      res.status(500).json({ success: false, error: 'Failed to update discount rule' });
    }
  }
);

router.delete('/discounts/:id',
  authorize(['admin', 'finance_manager']),
  auditLog('discount_rule', 'delete'),
  async (req: AuthenticatedRequest, res) => {
    try {
      await pricingService.deleteDiscountRule(req.params.id);
      res.json({ success: true, message: 'Discount rule deleted successfully' });
    } catch (error) {
      console.error('Error deleting discount rule:', error);
      res.status(500).json({ success: false, error: 'Failed to delete discount rule' });
    }
  }
);

// Fee Calculation Route
router.post('/calculate-fee',
  authorize(['admin', 'finance_manager', 'analyst', 'operations']),
  validateRequest(feeCalculationSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const result = await pricingService.calculateFee(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error calculating fee:', error);
      res.status(500).json({ success: false, error: 'Failed to calculate fee' });
    }
  }
);

// Analytics Routes
router.get('/analytics/fees',
  authorize(['admin', 'finance_manager', 'analyst']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const filters = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        feeType: req.query.feeType as any,
        countryCode: req.query.countryCode as string,
        regionId: req.query.regionId as string
      };
      const analytics = await pricingService.getFeeAnalytics(filters);
      res.json({ success: true, data: analytics });
    } catch (error) {
      console.error('Error fetching fee analytics:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch fee analytics' });
    }
  }
);

router.get('/analytics/subscriptions',
  authorize(['admin', 'finance_manager', 'analyst']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const regionId = req.query.regionId as string;
      const analytics = await pricingService.getSubscriptionAnalytics(regionId);
      res.json({ success: true, data: analytics });
    } catch (error) {
      console.error('Error fetching subscription analytics:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch subscription analytics' });
    }
  }
);

// FX Configuration Routes
router.get('/fx/rates',
  authorize(['admin', 'finance_manager', 'analyst']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const filters = {
        fromCurrency: req.query.fromCurrency as string,
        toCurrency: req.query.toCurrency as string,
        isActive: req.query.isActive ? req.query.isActive === 'true' : undefined
      };
      const rates = await pricingService.getExchangeRates(filters);
      res.json({ success: true, data: rates });
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch exchange rates' });
    }
  }
);

router.put('/fx/rates',
  authorize(['admin', 'finance_manager']),
  auditLog('exchange_rate', 'update'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const rate = await pricingService.updateExchangeRate(req.body);
      res.json({ success: true, data: rate });
    } catch (error) {
      console.error('Error updating exchange rate:', error);
      res.status(500).json({ success: false, error: 'Failed to update exchange rate' });
    }
  }
);

router.get('/fx/pairs',
  authorize(['admin', 'finance_manager', 'analyst']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const pairs = await pricingService.getCurrencyPairConfigurations();
      res.json({ success: true, data: pairs });
    } catch (error) {
      console.error('Error fetching currency pairs:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch currency pairs' });
    }
  }
);

router.post('/fx/pairs',
  authorize(['admin', 'finance_manager']),
  validateRequest(currencyPairSchema),
  auditLog('currency_pair', 'create'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const pair = await pricingService.createCurrencyPairConfiguration(req.body);
      res.status(201).json({ success: true, data: pair });
    } catch (error) {
      console.error('Error creating currency pair:', error);
      res.status(500).json({ success: false, error: 'Failed to create currency pair' });
    }
  }
);

router.put('/fx/pairs/:id',
  authorize(['admin', 'finance_manager']),
  validateRequest(currencyPairSchema),
  auditLog('currency_pair', 'update'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const pair = await pricingService.updateCurrencyPairConfiguration(req.params.id, req.body);
      res.json({ success: true, data: pair });
    } catch (error) {
      console.error('Error updating currency pair:', error);
      res.status(500).json({ success: false, error: 'Failed to update currency pair' });
    }
  }
);

router.delete('/fx/pairs/:id',
  authorize(['admin', 'finance_manager']),
  auditLog('currency_pair', 'delete'),
  async (req: AuthenticatedRequest, res) => {
    try {
      await pricingService.deleteCurrencyPairConfiguration(req.params.id);
      res.json({ success: true, message: 'Currency pair deleted successfully' });
    } catch (error) {
      console.error('Error deleting currency pair:', error);
      res.status(500).json({ success: false, error: 'Failed to delete currency pair' });
    }
  }
);

router.post('/fx/convert',
  authorize(['admin', 'finance_manager', 'analyst', 'operations']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const result = await pricingService.convertCurrency(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error converting currency:', error);
      res.status(500).json({ success: false, error: 'Failed to convert currency' });
    }
  }
);
export default router;