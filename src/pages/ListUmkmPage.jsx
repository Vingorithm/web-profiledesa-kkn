import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { Search, Grid, List, MapPin, Phone, Tag, User, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';
import Footer from '../components/Footer';
import { getSemuaUMKM } from '../service';
import 'bootstrap/dist/css/bootstrap.min.css';
import dummyData from '../components/DummyData';
import HeroUmkmImage from '../assets/images/umkm-hero.png';

const COLORS = dummyData.colors;

// Predefined category options for filtering
const KATEGORI_OPTIONS = [
  'Semua Kategori',
  'Makanan & Minuman',
  'Kerajinan',
  'Fashion',
  'Pertanian',
  'Jasa',
  'Lain-lain'
];

const ListUmkmPage = () => {
  const navigate = useNavigate();
  const [umkmData, setUmkmData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [villageData, setVillageData] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterCategory, setFilterCategory] = useState('Semua Kategori');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Set dummy village data for Navbar and Footer
    setVillageData({
      villageName: 'Desa Guyangan',
      villageSlogan: 'Maju, Makmur, dan Lestari',
      villageInfo: {
        address: 'Jl. Raya Guyangan, Gunung Kidul',
        phone: '(0274) 123456',
        email: 'info@desaguyangan.id',
        officeHours: 'Senin - Jumat, 08.00 - 16.00 WIB'
      },
      footerDescription: 'Desa Guyangan adalah desa yang terletak di Kemiri, Tanjungsari, Gunung Kidul, Special Region of Yogyakarta yang kaya akan budaya, alam, dan tradisi.'
    });
    
    // Fetch UMKM data
    fetchUMKMData();
  }, []);

  const fetchUMKMData = async () => {
    setLoading(true);
    try {
      const data = await getSemuaUMKM();
      setUmkmData(data);
    } catch (err) {
      setError('Gagal mengambil data UMKM');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting to umkmData
  const getFilteredAndSortedUMKM = () => {
    let filtered = [...umkmData];
    
    // Apply category filter
    if (filterCategory !== 'Semua Kategori') {
      filtered = filtered.filter(umkm => umkm.kategori === filterCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(umkm => 
        umkm.nama?.toLowerCase().includes(searchLower) || 
        umkm.nama_pemilik?.toLowerCase().includes(searchLower) ||
        umkm.text?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB - dateA;
      });
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateA - dateB;
      });
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => (a.nama || '').localeCompare(b.nama || ''));
    }
    
    return filtered;
  };
  
  const filteredUMKM = getFilteredAndSortedUMKM();

  // Function to truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Calculate navbar height for main content padding
  const navbarHeight = 76;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: COLORS.cream, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Component */}
      {villageData && <NavbarComponent villageData={villageData} activeSection="umkm" setActiveSection={() => {}} />}

      {/* Hero Section */}
      <div 
        style={{ 
          paddingTop: `${navbarHeight}px`, 
          backgroundImage: `url(${HeroUmkmImage})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '60px 0'
        }}
      >
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="fw-bold mb-3">UMKM Desa Guyangan</h1>
              <div className="accent-line mx-auto" style={{ width: '100px', height: '4px', backgroundColor: COLORS.gold, marginBottom: '20px' }}></div>
              <p className="lead mb-4">Temukan berbagai UMKM unggulan di Desa Guyangan. Mari dukung ekonomi lokal dengan berbelanja produk dan layanan dari warga desa.</p>
              <div className="search-container">
                <InputGroup className="mb-3 shadow">
                  <InputGroup.Text style={{ backgroundColor: 'white', border: 'none' }}>
                    <Search size={20} color={COLORS.brown} />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Cari UMKM..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: 'none', padding: '12px 15px' }}
                  />
                  {searchTerm && (
                    <Button 
                      variant="link" 
                      className="position-absolute end-0 z-10 pe-3" 
                      onClick={() => setSearchTerm('')}
                      style={{ backgroundColor: 'transparent', border: 'none', zIndex: 10 }}
                    >
                      <span aria-hidden="true">&times;</span>
                    </Button>
                  )}
                </InputGroup>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Content with filter options */}
      <div style={{ flex: '1 0 auto', paddingTop: '40px', paddingBottom: '60px' }}>
        <Container>
          {/* Filter & Sort Options */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={3} className="mb-3 mb-md-0">
                  <div className="d-flex align-items-center">
                    <Tag size={16} className="me-2" style={{ color: COLORS.brown }} />
                    <Form.Select 
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      style={{ border: `1px solid ${COLORS.gray}` }}
                    >
                      {KATEGORI_OPTIONS.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
                <Col md={3} className="mb-3 mb-md-0">
                  <div className="d-flex align-items-center">
                    <Bookmark size={16} className="me-2" style={{ color: COLORS.brown }} />
                    <Form.Select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ border: `1px solid ${COLORS.gray}` }}
                    >
                      <option value="newest">Terbaru</option>
                      <option value="oldest">Terlama</option>
                      <option value="name">Nama (A-Z)</option>
                    </Form.Select>
                  </div>
                </Col>
                <Col className="d-flex justify-content-md-end mt-3 mt-md-0">
                  <div className="d-flex">
                    <Button 
                      variant={viewMode === 'grid' ? 'primary' : 'light'}
                      className="me-2 d-flex align-items-center justify-content-center"
                      onClick={() => setViewMode('grid')}
                      style={{ 
                        backgroundColor: viewMode === 'grid' ? COLORS.green : 'white',
                        borderColor: viewMode === 'grid' ? COLORS.green : COLORS.gray,
                        width: '40px', 
                        height: '40px',
                        padding: '0'
                      }}
                    >
                      <Grid size={18} color={viewMode === 'grid' ? 'white' : COLORS.brown} />
                    </Button>
                    <Button 
                      variant={viewMode === 'list' ? 'primary' : 'light'}
                      className="d-flex align-items-center justify-content-center"
                      onClick={() => setViewMode('list')}
                      style={{ 
                        backgroundColor: viewMode === 'list' ? COLORS.green : 'white',
                        borderColor: viewMode === 'list' ? COLORS.green : COLORS.gray,
                        width: '40px', 
                        height: '40px',
                        padding: '0'
                      }}
                    >
                      <List size={18} color={viewMode === 'list' ? 'white' : COLORS.brown} />
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Error Message */}
          {error && (
            <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          {/* UMKM Listing */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: COLORS.gold }} />
              <p className="mt-3" style={{ color: COLORS.brown }}>Memuat data UMKM...</p>
            </div>
          ) : filteredUMKM.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ color: COLORS.gray, fontSize: '48px', marginBottom: '20px' }}>
                🔍
              </div>
              <h3 style={{ color: COLORS.brown }}>UMKM Tidak Ditemukan</h3>
              <p style={{ color: COLORS.gray }}>
                {searchTerm ? `Tidak ada UMKM yang cocok dengan pencarian "${searchTerm}"` : 
                 'Tidak ada UMKM yang tersedia saat ini'}
              </p>
              {(searchTerm || filterCategory !== 'Semua Kategori') && (
                <Button 
                  variant="outline" 
                  style={{ color: COLORS.green, borderColor: COLORS.green }}
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('Semua Kategori');
                  }}
                >
                  Reset Pencarian
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Result counter */}
              <div className="mb-4">
                <p style={{ color: COLORS.gray }}>
                  Menampilkan {filteredUMKM.length} UMKM 
                  {filterCategory !== 'Semua Kategori' ? ` kategori ${filterCategory}` : ''}
                  {searchTerm ? ` dengan kata kunci "${searchTerm}"` : ''}
                </p>
              </div>

              {viewMode === 'grid' ? (
                <Row>
                  {filteredUMKM.map((umkm) => (
                    <Col md={4} className="mb-4" key={umkm.id}>
                      <Card className="h-100 border-0 shadow-sm hover-card">
                        <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                          <Card.Img 
                            variant="top" 
                            src={umkm.gambar || "https://via.placeholder.com/300x200?text=No+Image"} 
                            alt={umkm.nama}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              transition: 'transform 0.5s ease'
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                            }}
                          />
                          <Badge 
                            bg="warning" 
                            text="dark"
                            style={{ 
                              position: 'absolute', 
                              top: '15px', 
                              right: '15px',
                              backgroundColor: COLORS.orange,
                              color: 'white',
                              padding: '8px 12px',
                              fontWeight: '500'
                            }}
                          >
                            {umkm.kategori || 'Umum'}
                          </Badge>
                        </div>
                        <Card.Body>
                          <Card.Title style={{ color: COLORS.brown, fontWeight: '600', fontSize: '18px' }}>
                            {umkm.nama}
                          </Card.Title>
                          <div className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <User size={16} style={{ color: COLORS.gray, marginRight: '8px' }} />
                              <small style={{ color: COLORS.gray }}>{umkm.nama_pemilik || 'Tidak tersedia'}</small>
                            </div>
                            {umkm.no_telp && (
                              <div className="d-flex align-items-center">
                                <Phone size={16} style={{ color: COLORS.gray, marginRight: '8px' }} />
                                <small style={{ color: COLORS.gray }}>{umkm.no_telp}</small>
                              </div>
                            )}
                          </div>
                          <Card.Text style={{ color: COLORS.gray, fontSize: '0.9rem' }}>
                            {truncateText(umkm.text)}
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer style={{ backgroundColor: 'white', borderTop: `1px solid ${COLORS.cream}` }}>
                          <Button 
                            variant="outline"
                            className="w-100"
                            style={{ 
                              color: COLORS.green, 
                              borderColor: COLORS.green 
                            }}
                            onClick={() => navigate(`/umkm/${umkm.id}`)}
                          >
                            Lihat Detail
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div>
                  {filteredUMKM.map((umkm) => (
                    <Card className="mb-3 border-0 shadow-sm hover-card" key={umkm.id}>
                      <Row className="g-0">
                        <Col md={3}>
                          <div style={{ height: '100%', minHeight: '180px' }}>
                            <img 
                              src={umkm.gambar || "https://via.placeholder.com/300x200?text=No+Image"} 
                              alt={umkm.nama}
                              className="img-fluid rounded-start"
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                borderTopLeftRadius: '0.375rem',
                                borderBottomLeftRadius: '0.375rem',
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                              }}
                            />
                          </div>
                        </Col>
                        <Col md={9}>
                          <Card.Body className="d-flex flex-column h-100">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <Card.Title style={{ color: COLORS.brown, fontWeight: '600', fontSize: '20px', marginBottom: '8px' }}>
                                {umkm.nama}
                              </Card.Title>
                              <Badge 
                                style={{ 
                                  backgroundColor: COLORS.orange,
                                  color: 'white',
                                  padding: '8px 12px',
                                  fontWeight: '500'
                                }}
                              >
                                {umkm.kategori || 'Umum'}
                              </Badge>
                            </div>
                            
                            <div className="d-flex flex-wrap gap-3 mb-3">
                              <div className="d-flex align-items-center">
                                <User size={16} style={{ color: COLORS.brown, marginRight: '8px' }} />
                                <span style={{ color: COLORS.gray }}>{umkm.nama_pemilik || 'Tidak tersedia'}</span>
                              </div>
                              {umkm.no_telp && (
                                <div className="d-flex align-items-center">
                                  <Phone size={16} style={{ color: COLORS.brown, marginRight: '8px' }} />
                                  <span style={{ color: COLORS.gray }}>{umkm.no_telp}</span>
                                </div>
                              )}
                            </div>
                            
                            <Card.Text style={{ color: COLORS.gray, fontSize: '0.95rem', flex: '1' }}>
                              {truncateText(umkm.text, 150)}
                            </Card.Text>
                            
                            <div className="mt-3">
                              <Button 
                                variant="outline"
                                style={{ 
                                  color: COLORS.green, 
                                  borderColor: COLORS.green 
                                }}
                                onClick={() => navigate(`/umkm/${umkm.id}`)}
                              >
                                Lihat Detail
                              </Button>
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto' }}>
        {villageData && <Footer villageData={villageData} />}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .hover-card:hover img {
          transform: scale(1.05);
        }
        .form-control:focus, .form-select:focus {
          box-shadow: 0 0 0 0.25rem rgba(212, 175, 55, 0.25);
          border-color: ${COLORS.gold};
        }
      `}</style>
    </div>
  );
};

export default ListUmkmPage;