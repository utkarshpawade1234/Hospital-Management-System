import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import '../patient.css';

export default function AuthLayout() {
  return (
    <div className="auth-root">
      <div>
        <Outlet />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            borderRadius: '10px',
            padding: '12px 16px',
          },
          success: { iconTheme: { primary: '#1D9E75', secondary: '#fff' } },
          error: { iconTheme: { primary: '#E5503E', secondary: '#fff' } },
        }}
      />
    </div>
  );
}
