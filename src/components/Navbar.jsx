import React, { useState, useEffect } from 'react';
import { Nav, Navbar, Container, Button, Dropdown } from 'react-bootstrap';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  gold: '#D4AF37',
  green: '#4C7031',
  brown: '#8B5E3C',
  orange: '#F2994A',
  cream: '#F6F1E9',
  gray: '#A9A9A9'
};

const NavbarComponent = ({ villageData, activeSection, setActiveSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Check if user is logged in from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (path) => {
    navigate(path);
    setExpanded(false);
  };  

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    
    // Optional: redirect to login page or stay on the current page
    navigate('/login');
  };

  return (
    <Navbar 
      expand="lg" 
      expanded={expanded}
      onToggle={setExpanded}
      className={`py-3 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}
      style={{ 
        backgroundColor: scrolled ? 'white' : 'transparent',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}
    >
      <Container>
        <Navbar.Brand 
          href="#beranda" 
          className="d-flex align-items-center"
          onClick={() => handleNavClick('/')}
        >
          <div className="position-relative">
            <div className="position-absolute" style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: COLORS.gold,
              borderRadius: '50%',
              top: '5px',
              left: '5px',
              zIndex: -1
            }}></div>
            <img
              src="/api/placeholder/40/40"
              width="40"
              height="40"
              className="d-inline-block align-top rounded-circle"
              alt="Logo Desa"
              style={{ 
                border: `2px solid ${COLORS.cream}`,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
          </div>
          <div className="ms-3">
            <div className="fw-bold" style={{ 
              color: scrolled ? COLORS.brown : 'white',
              fontSize: '1.2rem',
              textShadow: scrolled ? 'none' : '1px 1px 3px rgba(0,0,0,0.5)'
            }}>
              {villageData.villageName}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: scrolled ? COLORS.green : COLORS.gold,
              fontStyle: 'italic',
              textShadow: scrolled ? 'none' : '1px 1px 3px rgba(0,0,0,0.5)'
            }}>
              {villageData.villageSlogan}
            </div>
          </div>
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="navbar-nav" 
          className="border-0 shadow-none"
          style={{ color: scrolled ? COLORS.brown : 'white' }}
        >
          {expanded ? 
            <X size={24} color={scrolled ? COLORS.brown : 'white'} /> : 
            <Menu size={24} color={scrolled ? COLORS.brown : 'white'} />
          }
        </Navbar.Toggle>
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
          {[
              { label: 'beranda', path: '/' },
              { label: 'artikel', path: '/artikel' },
              { label: 'galeri', path: '/galeri' },
              { label: 'umkm', path: '/umkm' },
              { label: 'tentang kami', path: '/about' }
            ].map(({ label, path }) => (
              <Nav.Link 
                key={label}
                onClick={() => handleNavClick(path)}
                className={`mx-lg-2 position-relative ${activeSection === label ? 'active' : ''}`}
                style={{
                  color: scrolled ? (activeSection === label ? COLORS.green : COLORS.brown) : 'white',
                  fontWeight: activeSection === label ? '600' : '400',
                  textShadow: scrolled ? 'none' : '1px 1px 3px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s ease',
                  textTransform: 'capitalize'
                }}
              >
                {label}
                {activeSection === label && (
                  <div className="position-absolute" style={{
                    height: '3px',
                    width: '50%',
                    backgroundColor: COLORS.gold,
                    bottom: '0',
                    left: '25%',
                    borderRadius: '2px'
                  }}></div>
                )}
              </Nav.Link>
            ))}
            {currentUser ? (
              <Dropdown className="ms-lg-3 mt-3 mt-lg-0">
                <Dropdown.Toggle 
                  id="dropdown-user"
                  className="d-flex align-items-center"
                  style={{ 
                    backgroundColor: COLORS.green, 
                    border: 'none',
                    borderRadius: '30px',
                    padding: '8px 16px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <User size={16} className="me-2" />
                  {currentUser.nama || 'Admin'}
                  <ChevronDown size={16} className="ms-1" />
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-lg border-0" style={{ minWidth: '220px' }}>
                  <div className="px-3 py-2">
                    <div className="fw-bold" style={{ color: COLORS.brown }}>
                      {currentUser.nama || 'Admin'}
                    </div>
                    <div className="small text-muted">
                      {currentUser.username}
                    </div>
                  </div>
                  <Dropdown.Divider />
                  <Dropdown.Item 
                    href="/admin/galeri"
                    style={{ color: COLORS.brown }}
                  >
                    Kelola Galeri
                  </Dropdown.Item>
                  <Dropdown.Item 
                    href="/admin/artikel"
                    style={{ color: COLORS.brown }}
                  >
                    Kelola Artikel
                  </Dropdown.Item>
                  <Dropdown.Item 
                    href="/admin/umkm"
                    style={{ color: COLORS.brown }}
                  >
                    Kelola UMKM
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item 
                    onClick={handleLogout}
                    className="d-flex align-items-center"
                    style={{ color: '#dc3545' }}
                  >
                    <LogOut size={16} className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button 
                className="ms-lg-3 mt-3 mt-lg-0 d-flex align-items-center"
                onClick={handleLogin}
                style={{ 
                  backgroundColor: COLORS.green, 
                  border: 'none',
                  borderRadius: '30px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              >
                Login Admin
                <ChevronDown size={16} className="ms-1" />
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;