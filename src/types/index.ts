// Core Types for Wiremi Fintech CRM

export interface Customer {
  id: string;
  userId: string;
  kycStatus: KYCStatus;
  riskScore: number;
  totalBalance: number;
  accountOpenDate: string;
  signupDate: string;
  accountType: AccountType;
  phone?: string;
}

// Enhanced User interfaces for different account types
export interface PersonalAccount {
  id: string;
  wiremiId: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  country: string;
  region: string;
  city: string;
  postalCode: string;
  dateOfBirth: string;
  accountPin: string; // Encrypted
  transactionPin: string; // Encrypted
  transactionPinLastChanged: string;
  referralCode?: string;
  kycStatus: KYCStatus;
  kycDocuments: KYCDocuments;
  accountStatus: AccountStatus;
  userTier: CustomerTier;
  accountCreationDate: string;
  lastLogin: LastLoginInfo;
  riskScore: number;
  creditScore: number;
  wallets: Wallet[];
  cashBalance: number;
  savingsBalance: number;
  investmentBalance: number;
  accruedInterest: number;
  profilePhotoUrl?: string;
  birthdayNotificationFlag: boolean;
}

export interface BusinessAccount {
  id: string;
  wiremiBusinessId: string;
  businessName: string;
  businessRegistrationNumber: string;
  businessType: BusinessType;
  primaryContact: ContactPerson;
  businessOwner: BusinessOwner;
  country: string;
  region: string;
  city: string;
  postalCode: string;
  businessAddress: BusinessAddress;
  taxIdentificationNumber: string;
  accountPin: string; // Encrypted
  transactionPin: string; // Encrypted
  referralCode?: string;
  kycStatus: KYCStatus;
  kycDocuments: BusinessKYCDocuments;
  accountStatus: BusinessAccountStatus;
  userTier: CustomerTier;
  accountCreationDate: string;
  lastLogin: LastLoginInfo;
  riskScore: number;
  creditScore: number;
  wallets: Wallet[];
  cashBalance: number;
  savingsBalance: number;
  investmentBalance: number;
  accruedInterest: number;
  profileLogoUrl?: string;
}

export interface Wallet {
  id: string;
  currency: string;
  balance: number;
  isBaseCurrency: boolean;
  createdAt: string;
  lastTransactionAt?: string;
}

export interface BusinessOwner {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  kycStatus: KYCStatus;
  kycDocuments: KYCDocuments;
  isDirector: boolean;
  shareholdingPercentage: number;
}

export interface Lead {
  id: string;
  contactInfo: ContactInfo;
  leadSource: string;
  leadStatus: LeadStatus;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
}

export interface CustomerNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  isInternal: boolean;
}

export interface CustomerFlag {
  id: string;
  type: 'VIP' | 'ABUSE' | 'RISK' | 'PRIORITY';
  reason: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

// Supporting interfaces
export interface ContactInfo {
  email?: string;
  phone?: string;
}

export interface ContactPerson {
  name: string;
  email: string;
  phone: string;
}

export interface BusinessAddress {
  street: string;
  suite?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}


export interface KYCDocuments {
  idType: IDType;
  idNumber?: string; // Document ID number
  frontImageUrl: string;
  backImageUrl: string;
  selfieUrl: string;
  submissionDate: string;
  reviewDate?: string;
}

export interface BusinessKYCDocuments {
  certificateOfIncorporation: string;
  taxRegistrationCertificate: string;
  directorId: {
    idNumber?: string; // Director's ID number
    frontImageUrl: string;
    backImageUrl: string;
    selfieUrl: string;
  };
  submissionDate: string;
  reviewDate?: string;
}

export interface LastLoginInfo {
  timestamp: string;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
}

// Enums
export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DORMANT = 'DORMANT'
}

export enum BusinessAccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

export enum BusinessType {
  MERCHANT = 'MERCHANT',
  SCHOOL = 'SCHOOL',
  OTHER = 'OTHER'
}

export enum IDType {
  NATIONAL_ID = 'NATIONAL_ID',
  PASSPORT = 'PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE'
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  CONVERTED = 'CONVERTED'
}
export interface Transaction {
  id: string;
  customerId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  timestamp: string;
  description: string;
  riskFlags?: string[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
}

export interface ComplianceCase {
  id: string;
  customerId: string;
  type: ComplianceCaseType;
  status: ComplianceStatus;
  priority: Priority;
  assignedTo?: string;
  createdAt: string;
  dueDate: string;
}

export interface FraudAlert {
  id: string;
  transactionId: string;
  riskScore: number;
  alertType: FraudAlertType;
  status: AlertStatus;
  createdAt: string;
  reviewedBy?: string;
}

export interface VirtualCard {
  id: string;
  customerId: string;
  cardNumber: string;
  expiryDate: string;
  status: CardStatus;
  spendLimits: SpendLimits;
  createdAt: string;
}

export interface VirtualCardDetailed {
  id: string;
  userId: string;
  cardNumber: string;
  cardBrand: CardBrand;
  cardType: CardType;
  expiryDate: string;
  cvv: string;
  status: VirtualCardStatus;
  issueDate: string;
  terminationDate?: string;
  spendLimit: number;
  transactionVolume: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  transactions: CardTransaction[];
}

export interface CardTransaction {
  id: string;
  virtualCardId: string;
  transactionId: string;
  description: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: TransactionStatus;
}

export interface SavingsInstance {
  id: string;
  customerId: string;
  name: string;
  type: SavingsType;
  targetAmount: number;
  currentAmount: number;
  expectedAmount: number;
  frequency: SavingsFrequency;
  startDate: string;
  endDate?: string;
  interestEarned: number;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}
export interface Loan {
  id: string;
  customerId: string;
  amount: number;
  interestRate: number;
  term: number;
  status: LoanStatus;
  creditScore: number;
  applicationDate: string;
}


export interface SupportTicket {
  id: string;
  customerId: string;
  subject: string;
  priority: Priority;
  status: TicketStatus;
  assignedTo?: string;
  createdAt: string;
  category: string;
}

// Enums
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER',
  FRAUD_ANALYST = 'FRAUD_ANALYST',
  CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  RISK_ANALYST = 'RISK_ANALYST'
}

export enum CardBrand {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMEX = 'AMEX',
  VERVE = 'VERVE'
}

export enum VirtualCardStatus {
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED',
  BLOCKED = 'BLOCKED',
  PENDING = 'PENDING'
}

export enum SavingsType {
  REGULAR = 'REGULAR',
  BLOCKED = 'BLOCKED',
  RECURRENT = 'RECURRENT',
  GROUP = 'GROUP'
}

export enum SavingsFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  ONE_TIME = 'ONE_TIME'
}
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum CustomerTier {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  VIP = 'VIP'
}

export enum KYCStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  REQUIRES_REVIEW = 'REQUIRES_REVIEW'
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum ComplianceCaseType {
  AML = 'AML',
  SANCTIONS = 'SANCTIONS',
  PEP = 'PEP',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY'
}

export enum ComplianceStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  ESCALATED = 'ESCALATED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum FraudAlertType {
  VELOCITY = 'VELOCITY',
  LOCATION = 'LOCATION',
  DEVICE = 'DEVICE',
  AMOUNT = 'AMOUNT',
  PATTERN = 'PATTERN'
}

export enum AlertStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  FALSE_POSITIVE = 'FALSE_POSITIVE'
}

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface SpendLimits {
  daily: number;
  monthly: number;
  perTransaction: number;
}

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED',
  REPAID = 'REPAID',
  DEFAULTED = 'DEFAULTED'
}

export enum GoalStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

// Pricing & Billing Types
export interface Country {
  id: string;
  name: string;
  code: string; // ISO 3166-1 alpha-2 code
  regionId: string;
  region?: Region;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Region {
  id: string;
  name: string;
  code: string; // e.g., "NA", "SSA", "EU", "MENA", "APAC", "LATAM", "OCE"
  currency: string;
  timezone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  countries?: Country[];
}

export interface SubscriptionPlan {
  id: string;
  name: string; // "FREE", "PREMIUM", or "BUSINESS"
  accountType: AccountType;
  description?: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  features: string[];
  maxTransactions?: number;
  maxCards?: number;
  maxSavingsGoals?: number;
  virtualCardIssuanceFee?: number;
  virtualCardMaintenanceFee?: number;
  regionId?: string;
  region?: Region;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface FeeDefinition {
  id: string;
  name: string;
  description?: string;
  feeType: FeeType;
  feeSubType?: FeeSubType;
  feeMethod?: FeeMethod;
  valueType: FeeValueType;
  value: number;
  cap?: number;
  minFee?: number;
  currency: string;
  regionId?: string;
  region?: Region;
  countryCodes: string[]; // ISO 3166-1 alpha-2 country codes
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountRule {
  id: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  value: number;
  maxDiscount?: number;
  appliesToFeeType?: FeeType;
  appliesToSubType?: FeeSubType;
  appliesToMethod?: FeeMethod;
  appliesToAccountType?: AccountType;
  appliesToCountries: string[]; // ISO 3166-1 alpha-2 country codes
  regionId?: string;
  region?: Region;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  usageLimit?: number;
  usageCount: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeeCalculationResult {
  baseAmount: number;
  feeAmount: number;
  discountAmount: number;
  finalFeeAmount: number;
  currency: string;
  appliedFeeRules: string[];
  appliedDiscounts: string[];
  calculationDetails: any;
}

export interface FeeCalculationLog {
  id: string;
  userId: string;
  transactionId?: string;
  feeType: FeeType;
  feeSubType?: FeeSubType;
  feeMethod?: FeeMethod;
  baseAmount: number;
  feeAmount: number;
  discountAmount: number;
  finalFeeAmount: number;
  currency: string;
  regionId?: string;
  countryCode?: string;
  appliedFeeRules: any;
  appliedDiscounts: any;
  calculationDetails: any;
  createdAt: string;
}

// Pricing & Billing Enums
export enum FeeType {
  // Deposit Types
  CARD_DEPOSIT = 'CARD_DEPOSIT',
  MOMO_DEPOSIT_ORANGE = 'MOMO_DEPOSIT_ORANGE',
  MOMO_DEPOSIT_MTN = 'MOMO_DEPOSIT_MTN',
  BANK_DEPOSIT = 'BANK_DEPOSIT',
  INTERAC_DEPOSIT = 'INTERAC_DEPOSIT',
  PAYPAL_DEPOSIT = 'PAYPAL_DEPOSIT',
  GOOGLE_PAY_DEPOSIT = 'GOOGLE_PAY_DEPOSIT',
  OPAY_DEPOSIT = 'OPAY_DEPOSIT',

  // Transfer Types
  MOMO_TRANSFER = 'MOMO_TRANSFER',
  WIREMI_TRANSFER = 'WIREMI_TRANSFER',
  BANK_WIRE = 'BANK_WIRE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  INTERAC_TRANSFER = 'INTERAC_TRANSFER',

  // Withdrawal Types
  VIRTUAL_CARDS_WITHDRAWALS = 'VIRTUAL_CARDS_WITHDRAWALS',

  // Crypto Types
  ON_RAMP = 'ON_RAMP',
  OFF_RAMP = 'OFF_RAMP',

  // Loan Types
  LOAN_REFINANCE = 'LOAN_REFINANCE',
  LOAN_PROCESSING = 'LOAN_PROCESSING',
  LOAN_DEFAULT = 'LOAN_DEFAULT',

  // Investment & Other Types
  CAPITAL = 'CAPITAL',
  DONATION = 'DONATION',
  INVESTMENT = 'INVESTMENT',

  // Subscription
  SUBSCRIPTION = 'SUBSCRIPTION'
}

export enum FeeSubType {
  // Transaction Fees
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',

  // Card Service Fees
  ISSUANCE = 'ISSUANCE',
  FUNDING = 'FUNDING',
  MAINTENANCE = 'MAINTENANCE',
  CARD_WITHDRAWAL = 'CARD_WITHDRAWAL',

  // Savings Fees
  SAVINGS_DEBIT = 'SAVINGS_DEBIT',
  SAVINGS_WITHDRAWAL = 'SAVINGS_WITHDRAWAL',
  SAVINGS_TERMINATION = 'SAVINGS_TERMINATION',
  SAVINGS_LATE = 'SAVINGS_LATE',
  GROUP_SAVINGS_JOINING = 'GROUP_SAVINGS_JOINING',

  // Investment & Donation Fees
  INVESTMENT_APPLICATION = 'INVESTMENT_APPLICATION',
  INVESTMENT_MANAGEMENT = 'INVESTMENT_MANAGEMENT',
  DONATION_PROCESSING = 'DONATION_PROCESSING',

  // Fundraiser Fees
  FUNDRAISER_APPLICATION = 'FUNDRAISER_APPLICATION',

  // Loan Fees
  LOAN_PROCESSING = 'LOAN_PROCESSING',
  LOAN_INTEREST = 'LOAN_INTEREST',

  // Crypto Fees
  CRYPTO_ON_RAMP = 'CRYPTO_ON_RAMP',
  CRYPTO_OFF_RAMP = 'CRYPTO_OFF_RAMP'
}

export enum FeeMethod {
  // Transaction Methods
  MOMO_DEPOSIT = 'MOMO_DEPOSIT',
  INTERAC_DEPOSIT = 'INTERAC_DEPOSIT',
  BANK_DEPOSIT = 'BANK_DEPOSIT',
  CARD_DEPOSIT = 'CARD_DEPOSIT',
  PAYPAL_DEPOSIT = 'PAYPAL_DEPOSIT',
  MOMO_WITHDRAWAL = 'MOMO_WITHDRAWAL',
  BANK_WITHDRAWAL = 'BANK_WITHDRAWAL',
  ATM_WITHDRAWAL = 'ATM_WITHDRAWAL',
  INTERAC_TRANSFER = 'INTERAC_TRANSFER',
  WIREMI_INTERNAL_TRANSFER = 'WIREMI_INTERNAL_TRANSFER',
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOBILE_MONEY_TRANSFER = 'MOBILE_MONEY_TRANSFER',

  // Card Service Methods
  VIRTUAL_CARD = 'VIRTUAL_CARD',
  PHYSICAL_CARD = 'PHYSICAL_CARD',
  VISA_CARD = 'VISA_CARD',
  MASTERCARD = 'MASTERCARD',
  AMEX_CARD = 'AMEX_CARD',
  VERVE_CARD = 'VERVE_CARD',

  // Savings Methods
  REGULAR_SAVINGS = 'REGULAR_SAVINGS',
  BLOCKED_SAVINGS = 'BLOCKED_SAVINGS',
  RECURRENT_SAVINGS = 'RECURRENT_SAVINGS',
  GROUP_SAVINGS = 'GROUP_SAVINGS',

  // Investment Methods
  STOCK_INVESTMENT = 'STOCK_INVESTMENT',
  BOND_INVESTMENT = 'BOND_INVESTMENT',
  MUTUAL_FUND = 'MUTUAL_FUND',
  ETF_INVESTMENT = 'ETF_INVESTMENT',

  // Crypto Methods
  BITCOIN = 'BITCOIN',
  ETHEREUM = 'ETHEREUM',
  USDT = 'USDT',
  USDC = 'USDC',
  LITECOIN = 'LITECOIN',

  // Loan Methods
  PERSONAL_LOAN = 'PERSONAL_LOAN',
  BUSINESS_LOAN = 'BUSINESS_LOAN',
  MORTGAGE_LOAN = 'MORTGAGE_LOAN'
}

export enum FeeValueType {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT'
}

export enum DiscountType {
  PERCENTAGE_OFF = 'PERCENTAGE_OFF',
  FLAT_OFF = 'FLAT_OFF'
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY'
}

export enum AccountType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS'
}

// FX Configuration Types
export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
  source: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyPairConfiguration {
  id: string;
  baseCurrency: string;
  targetCurrency: string;
  isActive: boolean;
  refreshInterval: number;
  autoUpdate: boolean;
  tolerance?: number;
  markup?: number;
  spread?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyConversionRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export interface CurrencyConversionResult {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  timestamp: string;
}

// Compliance & AML Types
export interface ComplianceCase {
  id: string;
  caseNumber: string;
  customerId: string;
  type: ComplianceCaseType;
  status: ComplianceCaseStatus;
  priority: Priority;
  subject: string;
  description: string;
  assignedTo?: string;
  relatedEntities?: any;
  riskScore?: number;
  resolution?: string;
  dueDate?: string;
  closedAt?: string;
  closedBy?: string;
  escalatedAt?: string;
  escalatedBy?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  notes?: ComplianceCaseNote[];
  actions?: ComplianceCaseAction[];
}

export interface ComplianceCaseNote {
  id: string;
  caseId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  createdBy: string;
}

export interface ComplianceCaseAction {
  id: string;
  caseId: string;
  actionType: ComplianceActionType;
  description: string;
  performedBy: string;
  metadata?: any;
  createdAt: string;
}

export interface KYCReview {
  id: string;
  customerId: string;
  customerType: string;
  kycStatus: KYCReviewStatus;
  submissionDate: string;
  reviewDate?: string;
  reviewedBy?: string;
  priority: Priority;
  notes?: string;
  rejectionReason?: string;
  documentsUrl?: any;
  riskFlags: string[];
  complianceScore?: number;
  dueDate?: string;
  escalatedAt?: string;
  escalatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceAlert {
  id: string;
  alertType: string;
  severity: AlertSeverity;
  customerId?: string;
  transactionId?: string;
  subject: string;
  description: string;
  status: AlertStatus;
  assignedTo?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface SanctionsScreening {
  id: string;
  customerId: string;
  screeningType: string;
  matchFound: boolean;
  matchDetails?: any;
  screenedAt: string;
  screenedBy: string;
}

// Compliance & AML Enums
export enum ComplianceCaseType {
  AML_SUSPICIOUS_ACTIVITY = 'AML_SUSPICIOUS_ACTIVITY',
  KYC_NON_COMPLIANCE = 'KYC_NON_COMPLIANCE',
  SANCTIONS_SCREENING = 'SANCTIONS_SCREENING',
  PEP_MATCH = 'PEP_MATCH',
  FRAUD_RELATED = 'FRAUD_RELATED',
  TRANSACTION_MONITORING = 'TRANSACTION_MONITORING',
  CUSTOMER_DUE_DILIGENCE = 'CUSTOMER_DUE_DILIGENCE',
  ENHANCED_DUE_DILIGENCE = 'ENHANCED_DUE_DILIGENCE',
  OTHER = 'OTHER'
}

export enum ComplianceCaseStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED',
  SUSPENDED = 'SUSPENDED'
}

export enum ComplianceActionType {
  CASE_CREATED = 'CASE_CREATED',
  CASE_ASSIGNED = 'CASE_ASSIGNED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  NOTE_ADDED = 'NOTE_ADDED',
  DOCUMENT_REQUESTED = 'DOCUMENT_REQUESTED',
  DOCUMENT_RECEIVED = 'DOCUMENT_RECEIVED',
  ACCOUNT_FROZEN = 'ACCOUNT_FROZEN',
  ACCOUNT_UNFROZEN = 'ACCOUNT_UNFROZEN',
  TRANSACTION_BLOCKED = 'TRANSACTION_BLOCKED',
  TRANSACTION_RELEASED = 'TRANSACTION_RELEASED',
  KYC_APPROVED = 'KYC_APPROVED',
  KYC_REJECTED = 'KYC_REJECTED',
  ESCALATED_TO_SUPERVISOR = 'ESCALATED_TO_SUPERVISOR',
  CASE_CLOSED = 'CASE_CLOSED'
}

export enum KYCReviewStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REQUIRES_MORE_INFO = 'REQUIRES_MORE_INFO',
  ESCALATED = 'ESCALATED'
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AlertStatus {
  TRIGGERED = 'TRIGGERED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  SUPPRESSED = 'SUPPRESSED',
  ESCALATED = 'ESCALATED'
}