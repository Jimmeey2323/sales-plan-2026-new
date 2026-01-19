/**
 * Format currency values with Cr/L/K notation
 * Cr = Crore (10,000,000)
 * L = Lakh (100,000)
 * K = Thousand (1,000)
 */
export const formatCurrency = (value: number | string): string => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(num)) return '₹0';

  if (num >= 10000000) {
    // Crore
    const cr = (num / 10000000).toFixed(2);
    return `₹${parseFloat(cr).toString()}Cr`;
  } else if (num >= 100000) {
    // Lakh
    const l = (num / 100000).toFixed(2);
    return `₹${parseFloat(l).toString()}L`;
  } else if (num >= 1000) {
    // Thousand
    const k = (num / 1000).toFixed(2);
    return `₹${parseFloat(k).toString()}K`;
  }

  return `₹${num.toLocaleString()}`;
};

/**
 * Format currency for display without K/L/Cr notation (full value)
 */
export const formatCurrencyFull = (value: number | string): string => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(num)) return '₹0';
  return `₹${num.toLocaleString()}`;
};

/**
 * Format percentage discount
 */
export const formatDiscount = (percent: number): string => {
  return `${Math.round(percent)}% OFF`;
};

/**
 * Format large numbers with commas
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};
