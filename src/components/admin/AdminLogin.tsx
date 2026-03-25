import { useState } from 'react';

interface AdminLoginProps {
  onLogin: (password: string) => Promise<void>;
  loginMessage: string;
}

export default function AdminLogin({ onLogin, loginMessage }: AdminLoginProps) {
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await onLogin(password);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div id="admin-login">
      <h2>Admin Login</h2>
      <input
        type="password"
        id="admin-password"
        placeholder="Enter Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button id="login-button" className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>
      {/* Always render to preserve min-height layout from CSS */}
      <p id="login-message">{loginMessage}</p>
    </div>
  );
}
