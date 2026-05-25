const formatQuoteNumber = (value) => {
  const safeValue = Number(value) || 0;
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
};

const formatQuoteMoney = (value, currency, options = {}) => {
  const { withSymbol = true, withCurrency = true } = options;
  const safeCurrency = currency === 'USD' ? 'USD' : 'ARS';
  const formatted = formatQuoteNumber(value);
  const symbol = withSymbol ? '$' : '';
  const suffix = withCurrency ? ` ${safeCurrency}` : '';

  return `${symbol}${formatted}${suffix}`;
};

module.exports = {
  formatQuoteNumber,
  formatQuoteMoney,
};
