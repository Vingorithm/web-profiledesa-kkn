import React from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { Facebook, Instagram, Youtube, Twitter, ArrowRight, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Logo from '../assets/images/logo.jpg';

const COLORS = {
  gold: '#D4AF37',
  green: '#4C7031',
  brown: '#8B5E3C',
  darkBrown: '#6B4C2C', // Darker variant for footer background
  orange: '#F2994A',
  cream: '#F6F1E9',
  gray: '#A9A9A9'
};

const Footer = ({ villageData }) => {
  return (
    <footer>
      {/* Top Footer Section */}
      <div className="py-5" style={{ 
        backgroundColor: COLORS.darkBrown, 
        backgroundImage: 'url(/api/placeholder/1920/800)', 
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
          backgroundColor: 'rgba(107, 76, 44, 0.92)'
        }}></div>
        
        <div className="position-absolute top-0 start-0 w-100" style={{ 
          height: '5px', 
          background: `linear-gradient(to right, ${COLORS.green}, ${COLORS.gold}, ${COLORS.green})`
        }}></div>
        
        <Container className="position-relative">
          <Row>
            <Col lg={4} className="mb-5 mb-lg-0 text-white">
              <div className="d-flex align-items-center mb-4">
                <div className="position-relative">
                  <div className="position-absolute" style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: COLORS.gold,
                    borderRadius: '50%',
                    top: '5px',
                    left: '5px',
                    zIndex: 0
                  }}></div>
                  <img
                    src={Logo}
                    width="60"
                    height="60"
                    className="d-inline-block align-top rounded-circle position-relative"
                    alt="Logo Desa"
                    style={{ 
                      border: `2px solid ${COLORS.cream}`,
                      zIndex: 1
                    }}
                  />
                </div>
                <div className="ms-3">
                  <div className="h4 mb-0 fw-bold" style={{ color: COLORS.cream }}>{villageData.villageName}</div>
                  <div style={{ color: COLORS.gold, fontStyle: 'italic' }}>{villageData.villageSlogan}</div>
                </div>
              </div>
              <p className="mb-4" style={{ color: COLORS.cream, lineHeight: '1.7' }}>{villageData.footerDescription}</p>
              <div className="d-flex gap-3 mb-4">
                <a href="#" className="social-icon-link" style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}>
                  <Facebook size={18} />
                </a>
                <a href="#" className="social-icon-link" style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}>
                  <Instagram size={18} />
                </a>
                <a href="#" className="social-icon-link" style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}>
                  <Youtube size={18} />
                </a>
                <a href="#" className="social-icon-link" style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}>
                  <Twitter size={18} />
                </a>
              </div>

              <div className="p-4 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <h5 className="fw-bold mb-3" style={{ color: COLORS.gold }}>Informasi Kontak</h5>
                <div className="d-flex align-items-center mb-3">
                  <MapPin size={18} style={{ color: COLORS.gold, marginRight: '15px', flexShrink: 0 }} />
                  <div style={{ color: COLORS.cream, fontSize: '0.9rem' }}>{villageData.villageInfo.address}</div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <Phone size={18} style={{ color: COLORS.gold, marginRight: '15px', flexShrink: 0 }} />
                  <div style={{ color: COLORS.cream, fontSize: '0.9rem' }}>{villageData.villageInfo.phone}</div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <Mail size={18} style={{ color: COLORS.gold, marginRight: '15px', flexShrink: 0 }} />
                  <div style={{ color: COLORS.cream, fontSize: '0.9rem' }}>{villageData.villageInfo.email}</div>
                </div>
                <div className="d-flex align-items-center">
                  <Clock size={18} style={{ color: COLORS.gold, marginRight: '15px', flexShrink: 0 }} />
                  <div style={{ color: COLORS.cream, fontSize: '0.9rem' }}>{villageData.villageInfo.officeHours}</div>
                </div>
              </div>
            </Col>
            
            <Col lg={8}>
              <Row>
                <Col md={4} className="mb-4 mb-md-0">
                  <h5 className="fw-bold mb-4" style={{ color: COLORS.gold }}>Navigasi</h5>
                  <ul className="list-unstyled">
                    {['beranda', 'profil', 'artikel', 'galeri', 'umkm', 'kontak'].map((item, index) => (
                      <li key={index} className="mb-2">
                        <a 
                          href={`#${item}`} 
                          className="d-flex align-items-center footer-link"
                          style={{ 
                            color: COLORS.cream, 
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            textTransform: 'capitalize'
                          }}
                        >
                          <ArrowRight size={14} className="me-2" style={{ color: COLORS.gold }} />
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Col>
                
                <Col md={4} className="mb-4 mb-md-0">
                  <h5 className="fw-bold mb-4" style={{ color: COLORS.gold }}>Layanan</h5>
                  <ul className="list-unstyled">
                    {[
                      'Informasi Publik', 
                      'Potensi Desa', 
                      'Data Penduduk'
                    ].map((item, index) => (
                      <li key={index} className="mb-2">
                        <a 
                          href="#" 
                          className="d-flex align-items-center footer-link"
                          style={{ 
                            color: COLORS.cream, 
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <ArrowRight size={14} className="me-2" style={{ color: COLORS.gold }} />
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Col>
                
                <Col md={4}>
                  <h5 className="fw-bold mb-4" style={{ color: COLORS.gold }}>Newsletter</h5>
                  <p style={{ color: COLORS.cream }}>Dapatkan informasi terbaru tentang Padukuhan Guyangan</p>
                  <Form className="mt-3">
                    <InputGroup className="mb-3">
                      <Form.Control 
                        type="email" 
                        placeholder="Email anda" 
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          border: 'none',
                          color: COLORS.cream,
                          padding: '12px 15px'
                        }}
                      />
                      <Button 
                        variant="primary" 
                        style={{ 
                          backgroundColor: COLORS.gold, 
                          border: 'none',
                          padding: '0 20px'
                        }}
                      >
                        <ArrowRight size={18} />
                      </Button>
                    </InputGroup>
                  </Form>
                  
                  <div className="mt-4 p-4 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <h5 className="text-white mb-3">Peta Desa</h5>
                    <div className="ratio ratio-16x9 rounded overflow-hidden">
                      <img 
                        src="/api/placeholder/400/200" 
                        alt="Peta Desa Guyangan"
                        className="img-fluid"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <Button 
                      className="w-100 mt-3" 
                      style={{ 
                        backgroundColor: COLORS.gold, 
                        border: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Lihat di Google Maps
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Copyright Section */}
      <div className="py-4" style={{ backgroundColor: COLORS.brown }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                © 2025 {villageData.villageName}. Seluruh Hak Cipta Dilindungi.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                Dikembangkan oleh <span style={{ color: COLORS.gold }}>Tim KKN GUYANGAN 87 UAJY</span>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Custom CSS */}
      <style jsx>{`
        .footer-link:hover {
          color: ${COLORS.gold} !important;
          transform: translateX(5px);
        }
        .social-icon-link:hover {
          background-color: ${COLORS.gold} !important;
          transform: translateY(-3px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;