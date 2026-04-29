// Static exchange rates (base: USD). Update periodically.
export const EXCHANGE_RATES = {
  USD: 1,
  UZS: 12800,
  RUB: 91,
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  UZS: "so'm",
  RUB: '₽',
};

export const CURRENCY_LOCALES = {
  USD: 'en-US',
  UZS: 'uz-UZ',
  RUB: 'ru-RU',
};

/**
 * Convert a USD price to target currency
 */
export const convertPrice = (usdAmount, currency = 'USD') => {
  const rate = EXCHANGE_RATES[currency] ?? 1;
  return usdAmount * rate;
};

/**
 * Format a converted price with the correct symbol
 */
export const formatCurrency = (usdAmount, currency = 'USD') => {
  const converted = convertPrice(usdAmount, currency);
  const symbol = CURRENCY_SYMBOLS[currency] ?? '$';

  if (currency === 'UZS') {
    return `${Math.round(converted).toLocaleString('uz-UZ')} ${symbol}`;
  }
  if (currency === 'RUB') {
    return `${Math.round(converted).toLocaleString('ru-RU')} ${symbol}`;
  }
  // USD
  return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};
