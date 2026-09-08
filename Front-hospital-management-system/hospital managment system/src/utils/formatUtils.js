// Utility for formatting currency, dates, and times consistently across the app

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '—';
  const numericAmount = Number(amount);
  return '₹' + numericAmount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
};

// Safe date parser handling arrays [yyyy, mm, dd], strings "yyyy-mm-dd", and timestamps
export const parseDateSafe = (val) => {
  if (!val) return null;
  if (Array.isArray(val)) {
    // Java Jackson array: [yyyy, mm, dd, hh, mm, ss] or [yyyy, mm, dd]
    const year = val[0];
    const month = (val[1] || 1) - 1; // 0-indexed in JS
    const day = val[2] || 1;
    const hours = val[3] || 0;
    const minutes = val[4] || 0;
    const seconds = val[5] || 0;
    return new Date(year, month, day, hours, minutes, seconds);
  }
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const [y, m, d] = val.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

// Formats full date and time: "10 Aug 2026, 02:30 PM"
export const formatDate = (dateVal) => {
  if (!dateVal) return '—';
  const d = parseDateSafe(dateVal);
  if (!d) return String(dateVal);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Formats date only: "10 Aug 2026"
export const formatDateOnly = (dateVal) => {
  if (!dateVal) return '—';
  const d = parseDateSafe(dateVal);
  if (!d) return String(dateVal);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Formats time: "10:30:00" -> "10:30 AM"
export const formatTime = (timeVal) => {
  if (!timeVal) return '—';
  if (Array.isArray(timeVal)) {
    const h = timeVal[0] || 0;
    const m = timeVal[1] || 0;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
  }
  if (typeof timeVal === 'string' && timeVal.includes(':')) {
    const parts = timeVal.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (!isNaN(h) && !isNaN(m)) {
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
    }
  }
  return String(timeVal);
};

// Safe age calculation from any DOB representation
export const calcAgeSafe = (dob) => {
  if (!dob) return '—';
  const birth = parseDateSafe(dob);
  if (!birth) return '—';
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return isNaN(age) || age < 0 ? '—' : `${age} yrs`;
};

