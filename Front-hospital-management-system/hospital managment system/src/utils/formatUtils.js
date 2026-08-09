// Utility for formatting currency and dates consistently across the app

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '—';
  const numericAmount = Number(amount);
  return '₹' + numericAmount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};
