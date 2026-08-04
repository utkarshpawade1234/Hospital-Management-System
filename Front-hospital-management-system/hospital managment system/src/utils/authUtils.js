export const handleSharedLogout = (navigate) => {
  // Clear all authentication data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  localStorage.removeItem('patientId');
  
  // Clear sessionStorage if anything is stored there
  sessionStorage.clear();

  // Redirect to login page and replace history so they can't hit back
  navigate('/login', { replace: true });
};
