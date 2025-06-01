import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

const COLORS = {
  gold: '#D4AF37',
  green: '#4C7031',
  brown: '#8B5E3C',
  orange: '#F2994A',
  cream: '#F6F1E9',
  gray: '#A9A9A9'
};

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Simulate navigation (replace with actual navigation logic)
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    // In real app: useNavigate()(path)
  };

  // Simulate login service (replace with actual service)
  const login = async (username, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials
    if (username === 'admin' && password === 'password') {
      return { id: 1, username: 'admin', role: 'admin' };
    }
    return null;
  };

  // Check if user is already logged in
  useEffect(() => {
    try {
      // In browser environment, check localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        const user = localStorage.getItem('user');
        if (user) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(username, password);
      if (user) {
        // Store user data in localStorage (with error handling)
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (storageError) {
          console.warn('Could not save to localStorage:', storageError);
        }
        
        // Redirect to dashboard with a small delay to show success state
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        setError('Username atau password salah. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login. Silakan coba lagi nanti.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background overlay */}
      <div className="background-overlay" />

      <div className="container">
        <div className="login-wrapper">
          {/* Header */}
          <div className="header">
            <h1 className="title">Desa Guyangan</h1>
            <p className="subtitle">Selamat datang di Sistem Informasi Desa</p>
            <div className="accent-line" />
          </div>
          
          {/* Login Card */}
          <div className="login-card">
            <div className="card-header">
              <h2>Login Admin</h2>
              <p>Masukkan kredensial untuk mengakses sistem</p>
            </div>

            {error && (
              <div className="error-alert">
                {error}
              </div>
            )}

            <div onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Username</label>
                <div className="input-group">
                  <div className="input-icon">
                    <Mail size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-group">
                  <div className="input-icon">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Ingat saya</span>
                </label>
                <button type="button" className="forgot-password">
                  Lupa password?
                </button>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    <span>Masuk...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Masuk</span>
                  </>
                )}
              </button>
            </div>

            <div className="card-footer">
              <button
                type="button"
                className="back-button"
                onClick={() => navigate('/')}
              >
                Kembali ke Beranda
              </button>
              
              <p className="copyright">
                &copy; {new Date().getFullYear()} Desa Guyangan, Tanjungsari, Gunung Kidul
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .login-container {
          min-height: 100vh;
          min-height: 100dvh;
          background: linear-gradient(135deg, ${COLORS.green}dd, ${COLORS.brown}cc), ${COLORS.cream};
          display: flex;
          align-items: center;
          position: relative;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 1rem 0;
        }

        .background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(76, 112, 49, 0.1);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
        }

        .container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 100%;
          padding: 0 1rem;
          margin: 0 auto;
        }

        .login-wrapper {
          max-width: 500px;
          margin: 0 auto;
          width: 100%;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 1.5rem;
          padding: 0 1rem;
        }

        .title {
          font-size: clamp(1.8rem, 5vw, 3rem);
          font-weight: bold;
          margin-bottom: 0.5rem;
          margin-top: 0;
        }

        .subtitle {
          font-size: clamp(0.9rem, 2.5vw, 1.25rem);
          margin-bottom: 1rem;
          margin-top: 0;
          opacity: 0.9;
        }

        .accent-line {
          width: 60px;
          height: 3px;
          background-color: ${COLORS.gold};
          border-radius: 2px;
          margin: 0 auto;
        }

        .login-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          padding: 1.5rem;
        }

        .card-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .card-header h2 {
          color: ${COLORS.brown};
          font-weight: bold;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          margin-top: 0;
        }

        .card-header p {
          color: ${COLORS.gray};
          font-size: 0.9rem;
          margin: 0;
        }

        .error-alert {
          background-color: #fee;
          color: #c53030;
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          border: 1px solid #feb2b2;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          color: ${COLORS.brown};
          font-weight: 500;
          font-size: 0.9rem;
        }

        .input-group {
          display: flex;
          align-items: center;
          border: 1px solid rgba(169, 169, 169, 0.2);
          border-radius: 0.5rem;
          overflow: hidden;
          background: white;
          transition: all 0.3s ease;
        }

        .input-group:focus-within {
          box-shadow: 0 0 0 0.25rem rgba(212, 175, 55, 0.25);
          border-color: ${COLORS.gold};
        }

        .input-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 44px;
          background-color: ${COLORS.cream};
          color: ${COLORS.brown};
        }

        .form-input {
          flex: 1;
          border: none;
          padding: 0.6rem 0.75rem;
          font-size: 0.95rem;
          background: transparent;
          outline: none;
          min-height: 44px;
        }

        .password-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 44px;
          border: none;
          background: transparent;
          color: ${COLORS.brown};
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .password-toggle:hover {
          background-color: ${COLORS.cream};
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: ${COLORS.gray};
          font-size: 0.9rem;
          cursor: pointer;
        }

        .checkbox-label input {
          margin: 0;
        }

        .forgot-password {
          background: none;
          border: none;
          color: ${COLORS.green};
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          text-decoration: none;
          padding: 0;
          min-height: auto;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          background-color: ${COLORS.green};
          color: white;
          border: none;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: clamp(0.95rem, 2.5vw, 1.1rem);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 48px;
        }

        .login-button:hover:not(:disabled) {
          background-color: ${COLORS.brown};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(76, 112, 49, 0.3);
        }

        .login-button:active {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .card-footer {
          text-align: center;
          margin-top: 1.5rem;
        }

        .back-button {
          background: none;
          border: none;
          color: ${COLORS.green};
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          padding: 0.5rem;
          margin-bottom: 1rem;
          min-height: 40px;
        }

        .back-button:hover {
          text-decoration: underline;
        }

        .copyright {
          color: ${COLORS.gray};
          font-size: clamp(0.75rem, 2vw, 0.85rem);
          margin: 0;
        }

        /* Mobile-specific improvements */
        @media (max-width: 576px) {
          .container {
            padding: 0 0.75rem;
          }
          
          .login-card {
            padding: 1rem;
          }
          
          .header {
            margin-bottom: 1rem;
          }
          
          .card-header {
            margin-bottom: 1rem;
          }
          
          .form-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .input-icon,
          .password-toggle {
            width: 40px;
            height: 40px;
          }
          
          .form-input {
            min-height: 40px;
          }
        }

        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
          .form-input {
            font-size: 16px !important; /* Prevents zoom on iOS */
          }
        }

        /* Tablet improvements */
        @media (min-width: 577px) and (max-width: 768px) {
          .login-wrapper {
            max-width: 600px;
          }
          
          .login-card {
            padding: 2rem;
          }
        }

        /* Desktop improvements */
        @media (min-width: 769px) {
          .login-wrapper {
            max-width: 500px;
          }
          
          .login-card {
            padding: 2.5rem;
          }
          
          .header {
            margin-bottom: 2rem;
          }
          
          .card-header {
            margin-bottom: 2rem;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .input-group {
            border-width: 2px !important;
          }
          
          .login-button {
            border: 2px solid ${COLORS.green};
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
            animation: none !important;
          }
          
          .spinner {
            animation: none !important;
            border: 2px solid currentColor;
            border-radius: 50%;
          }
        }

        /* Focus visible for better keyboard navigation */
        .login-button:focus-visible,
        .back-button:focus-visible,
        .forgot-password:focus-visible,
        .password-toggle:focus-visible {
          outline: 2px solid ${COLORS.gold};
          outline-offset: 2px;
        }

        /* Ensure proper touch targets on all devices */
        button, 
        input[type="checkbox"],
        .checkbox-label {
          min-height: 44px;
          min-width: 44px;
        }

        .checkbox-label {
          min-width: auto;
          padding: 0.5rem 0;
        }

        /* Loading state improvements */
        .login-button:disabled {
          pointer-events: none;
        }

        /* Better visual hierarchy */
        .card-header h2 {
          line-height: 1.2;
        }

        .card-header p {
          line-height: 1.4;
        }

        /* Improved spacing for better readability */
        .login-form {
          gap: 1.25rem;
        }

        @media (min-width: 577px) {
          .login-form {
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;