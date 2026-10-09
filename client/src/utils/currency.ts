// src/utils/currency.ts

/**
 * Formats a numeric price into Sri Lankan Rupee (LKR) format.
 * Example: 2450 => "Rs. 2,450.00"
 */
export const formatPrice = (price: number | string | undefined | null): string => {
  if (price === undefined || price === null || isNaN(Number(price))) {
    return 'Rs. 0.00';
  }
  const num = Number(price);
  return `Rs. ${num.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const CURRENCY_SYMBOL = 'Rs.';
export const CURRENCY_CODE = 'LKR';
