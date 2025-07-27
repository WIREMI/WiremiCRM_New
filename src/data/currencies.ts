export interface Currency {
  code: string;
  name: string;
  symbol: string;
  region?: string;
}

export const currencies: Currency[] = [
  // Major Currencies
  { code: 'USD', name: 'US Dollar', symbol: '$', region: 'North America' },
  { code: 'EUR', name: 'Euro', symbol: '€', region: 'Europe' },
  { code: 'GBP', name: 'British Pound', symbol: '£', region: 'Europe' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', region: 'Asia Pacific' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', region: 'North America' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', region: 'Oceania' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', region: 'Europe' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', region: 'Asia Pacific' },

  // African Currencies
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', region: 'Sub-Saharan Africa' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', region: 'Sub-Saharan Africa' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', region: 'Sub-Saharan Africa' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', region: 'Sub-Saharan Africa' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', region: 'Sub-Saharan Africa' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', region: 'Sub-Saharan Africa' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', region: 'Sub-Saharan Africa' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', region: 'Sub-Saharan Africa' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', region: 'Sub-Saharan Africa' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF', region: 'Sub-Saharan Africa' },

  // MENA Currencies
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', region: 'MENA' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', region: 'MENA' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼', region: 'MENA' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', region: 'MENA' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب', region: 'MENA' },
  { code: 'OMR', name: 'Omani Rial', symbol: '﷼', region: 'MENA' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا', region: 'MENA' },
  { code: 'LBP', name: 'Lebanese Pound', symbol: '£', region: 'MENA' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', region: 'MENA' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', region: 'MENA' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£', region: 'MENA' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.', region: 'MENA' },

  // Asia Pacific Currencies
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', region: 'Asia Pacific' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', region: 'Asia Pacific' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', region: 'Asia Pacific' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', region: 'Asia Pacific' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', region: 'Asia Pacific' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', region: 'Asia Pacific' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', region: 'Asia Pacific' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', region: 'Asia Pacific' },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', region: 'Asia Pacific' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', region: 'Asia Pacific' },

  // Latin America Currencies
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', region: 'LATAM' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', region: 'LATAM' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', region: 'LATAM' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', region: 'LATAM' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', region: 'LATAM' },
  { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.', region: 'LATAM' },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', region: 'LATAM' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', region: 'North America' },

  // European Currencies (Non-Euro)
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', region: 'Europe' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', region: 'Europe' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', region: 'Europe' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', region: 'Europe' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', region: 'Europe' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', region: 'Europe' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', region: 'Europe' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', region: 'Europe' },

  // Oceania Currencies
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', region: 'Oceania' },
  { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$', region: 'Oceania' },

  // Cryptocurrencies (for crypto trading features)
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', region: 'Digital' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', region: 'Digital' },
  { code: 'USDT', name: 'Tether', symbol: '₮', region: 'Digital' },
  { code: 'USDC', name: 'USD Coin', symbol: 'USDC', region: 'Digital' }
];

export const getCurrenciesByRegion = (region: string): Currency[] => {
  return currencies.filter(currency => currency.region === region);
};

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return currencies.find(currency => currency.code === code);
};

export const getMajorCurrencies = (): Currency[] => {
  const majorCodes = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];
  return currencies.filter(currency => majorCodes.includes(currency.code));
};