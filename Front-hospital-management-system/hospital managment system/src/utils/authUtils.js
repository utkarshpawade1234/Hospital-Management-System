import { clearSession } from './sessionStorage';

export const handleSharedLogout = (navigate) => {
  clearSession();
  navigate('/login', { replace: true });
};
