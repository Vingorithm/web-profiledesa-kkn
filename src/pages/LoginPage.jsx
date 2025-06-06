import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { login } from "../service";
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const navigate = useNavigate();

  // Check if user is already logged in, redirect to home if true
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(username, password);
      if (user) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: COLORS.cream,
      backgroundImage: 'url(/api/placeholder/1920/1080)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* Overlay */}
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(76, 112, 49, 0.7)',
        backdropFilter: 'blur(5px)'
      }} />

      <Container className="position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="text-center text-white mb-4">
              <h1 className="display-4 fw-bold mb-2">Padukuhan Guyangan</h1>
              <p className="lead">Selamat datang di Sistem Informasi Padukuhan</p>
              <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '5px' }}></div>
            </div>
            
            <Card className="shadow border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: COLORS.brown }}>Login Admin</h2>
                  <p style={{ color: COLORS.gray }}>Masukkan kredensial untuk mengakses sistem</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>Username</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: COLORS.cream, border: `1px solid ${COLORS.gray}`, borderRight: 'none' }}>
                        <Mail size={18} color={COLORS.brown} />
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Masukkan username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ 
                          border: `1px solid ${COLORS.gray}`,
                          borderLeft: 'none',
                          padding: '12px',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: COLORS.cream, border: `1px solid ${COLORS.gray}`, borderRight: 'none' }}>
                        <Lock size={18} color={COLORS.brown} />
                      </span>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ 
                          border: `1px solid ${COLORS.gray}`,
                          borderLeft: 'none',
                          borderRight: 'none',
                          padding: '12px',
                          backgroundColor: 'white'
                        }}
                      />
                      <Button
                        variant="light"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ 
                          border: `1px solid ${COLORS.gray}`,
                          borderLeft: 'none',
                          backgroundColor: 'white'
                        }}
                      >
                        {showPassword ? 'Tutup' : 'Lihat'}
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4 d-flex justify-content-between align-items-center">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      label="Ingat saya"
                      style={{ color: COLORS.gray }}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-100 py-3 mb-3 d-flex align-items-center justify-content-center"
                    disabled={loading}
                    style={{ 
                      backgroundColor: COLORS.green, 
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem'
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        <span>Masuk...</span>
                      </>
                    ) : (
                      <>
                        <LogIn size={20} className="me-2" />
                        <span>Masuk</span>
                      </>
                    )}
                  </Button>
                </Form>

                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    className="text-decoration-none"
                    onClick={() => navigate('/')}
                    style={{ color: COLORS.green, fontWeight: 500 }}
                  >
                    Kembali ke Beranda
                  </Button>
                </div>

                <div className="mt-3 text-center" style={{ color: COLORS.gray }}>
                  <p className="mb-0">
                    &copy; {new Date().getFullYear()} Padukuhan Guyangan, Tanjungsari, Gunung Kidul
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>

      {/* Custom CSS */}
      <style jsx>{`
        .form-control:focus,
        .input-group-text:focus {
          box-shadow: 0 0 0 0.25rem rgba(212, 175, 55, 0.25);
          border-color: ${COLORS.gold};
        }
        .btn-primary:hover {
          background-color: ${COLORS.brown} !important;
          transition: background-color 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;