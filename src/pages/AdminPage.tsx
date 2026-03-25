import { useState } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import Header from '../components/Header';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';

export default function AdminPage() {
  const { isAuthenticated, verifyPassword } = useAdminAuth();
  const [loginMessage, setLoginMessage] = useState('');

  const handleLogin = async (password: string) => {
    if (!password) {
      setLoginMessage('Please enter password.');
      return;
    }

    setLoginMessage('');
    const result = await verifyPassword(password);

    if (!result.success) {
      setLoginMessage(result.errorMsg ?? 'Invalid Admin Password.');
    }
  };

  return (
    <>
      <Header title="Admin Panel" navLink={{ to: '/', label: 'View Codes' }} />
      <main>
        {!isAuthenticated ? (
          <AdminLogin onLogin={handleLogin} loginMessage={loginMessage} />
        ) : (
          <AdminDashboard isAuthenticated={isAuthenticated} />
        )}
      </main>
    </>
  );
}
