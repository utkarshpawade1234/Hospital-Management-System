import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import TopNavbar from '../../components/TopNavbar';
import '../admin.css';

export default function AdminLayout() {
  return (
    <div className="admin-root">
      <TopNavbar role="ADMIN" />
      <main className="admin-content">
        <Outlet />
      </main>
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
          success: {
            iconTheme: { primary: '#1D9E75', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#E5503E', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
}
