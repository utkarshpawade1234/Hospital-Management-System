// Centralized Pure Session Storage utility for HMS Frontend
// Strictly uses window.sessionStorage to ensure isolated tab-level session lifetimes.

export const getSessionItem = (key) => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(key);
};

export const setSessionItem = (key, value) => {
  if (typeof window === 'undefined') return;
  if (value !== undefined && value !== null) {
    sessionStorage.setItem(key, String(value));
  }
};

export const removeSessionItem = (key) => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(key);
  // Clean up any legacy localStorage entries if present
  localStorage.removeItem(key);
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.clear();
  // Clean up any legacy localStorage auth entries
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  localStorage.removeItem('patientId');
  localStorage.removeItem('firstTimeLogin');
};
