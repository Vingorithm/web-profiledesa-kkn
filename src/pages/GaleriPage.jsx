import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Breadcrumb } from 'react-bootstrap';
import NavbarComponent from '../components/Navbar';
import Footer from '../components/Footer';
import { getSemuaGaleri } from '../service';
import { Search, Filter, ArrowRight, EyeIcon } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import dummyData from '../components/DummyData';

const COLORS = dummyData.colors;

const GaleriPage = () => {
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('galeri');
  const [villageData, setVillageData] = useState(null);
  const [filter, setFilter] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState(['Kegiatan', 'Pemandangan', 'Budaya', 'Infrastruktur']);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch gallery data from Firebase
        const galeriData = await getSemuaGaleri();
        
        // Format Gallery data
        const formattedGallery = galeriData.map(item => {
          // Handle Firestore timestamp for gallery date
          let formattedDate = "Tanggal tidak tersedia";
          if (item.createdAt) {
            const date = item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt);
            formattedDate = date.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });
          }
          
          // Assign a random category for demo purposes
          // In a real app, you would use the actual category from the database
          const randomCategory = categories[Math.floor(Math.random() * categories.length)];
          
          return {
            id: item.id,
            src: item.foto || "/api/placeholder/800/800",
            alt: item.judul || "Galeri Desa Guyangan",
            caption: item.judul || "Foto Desa",
            date: formattedDate,
            category: randomCategory
          };
        });
        
        setGalleryData(formattedGallery);
        setVillageData({
          ...dummyData,
          gallery: formattedGallery
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
        // Fallback to dummy data
        setVillageData(dummyData);
        setGalleryData(dummyData.gallery || []);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const filteredGallery = galleryData.filter(item => {
    const matchesFilter = filter === 'semua' || item.category === filter;
    const matchesSearch = searchTerm === '' || 
      item.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border" style={{ color: COLORS.gold }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: COLORS.brown, fontWeight: 500 }}>Memuat galeri Desa Guyangan...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: COLORS.cream, minHeight: '100vh' }}>
      {/* Navbar Component */}
      <NavbarComponent 
        villageData={villageData} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />

      {/* Hero Section */}
      <section 
        className="py-5 position-relative text-center text-white" 
        style={{ 
          backgroundImage: 'url(/api/placeholder/1920/400)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundColor: COLORS.green,
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ backgroundColor: 'rgba(76, 112, 49, 0.7)' }}></div>
        <Container className="position-relative py-5">
          <h1 className="display-4 fw-bold">Galeri Desa Guyangan</h1>
          <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
          <p className="lead mt-3">Keindahan dan Kearifan Lokal yang Memukau</p>
          
          <Breadcrumb className="justify-content-center bg-transparent mt-4">
            <Breadcrumb.Item href="/" style={{ color: 'white' }}>Beranda</Breadcrumb.Item>
            <Breadcrumb.Item active style={{ color: COLORS.gold }}>Galeri</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </section>

      {/* Gallery Filter Section */}
      <section className="py-4" style={{ backgroundColor: 'white' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-3 mb-lg-0">
              <div className="d-flex flex-wrap gap-2">
                <Button 
                  variant={filter === 'semua' ? 'primary' : 'outline-secondary'}
                  style={{ 
                    backgroundColor: filter === 'semua' ? COLORS.green : 'transparent',
                    borderColor: filter === 'semua' ? COLORS.green : COLORS.gray,
                    color: filter === 'semua' ? 'white' : COLORS.gray,
                    borderRadius: '30px',
                    padding: '8px 20px',
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                  onClick={() => setFilter('semua')}
                >
                  Semua
                </Button>
                
                {categories.map((category, index) => (
                  <Button 
                    key={index}
                    variant={filter === category ? 'primary' : 'outline-secondary'}
                    style={{ 
                      backgroundColor: filter === category ? COLORS.green : 'transparent',
                      borderColor: filter === category ? COLORS.green : COLORS.gray,
                      color: filter === category ? 'white' : COLORS.gray,
                      borderRadius: '30px',
                      padding: '8px 20px',
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}
                    onClick={() => setFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Cari galeri..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    backgroundColor: COLORS.cream,
                    border: 'none',
                    borderRadius: '30px',
                    padding: '12px 20px',
                    paddingRight: '50px'
                  }}
                />
                <div 
                  className="position-absolute" 
                  style={{ 
                    top: '50%', 
                    right: '20px', 
                    transform: 'translateY(-50%)',
                    color: COLORS.gray
                  }}
                >
                  <Search size={18} />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Gallery Main Content */}
      <section className="py-5" style={{ backgroundColor: COLORS.cream }}>
        <Container>
          {filteredGallery.length > 0 ? (
            <>
              <Row className="g-4 mb-4">
                {filteredGallery.slice(0, 3).map((item, index) => (
                  <Col key={item.id} lg={index === 0 ? 12 : 6}>
                    <div 
                      className="gallery-item-featured position-relative rounded shadow overflow-hidden"
                      onClick={() => handleImageClick(item)}
                      style={{ cursor: 'pointer', height: index === 0 ? '500px' : '350px' }}
                    >
                      <img 
                        src={item.src} 
                        alt={item.alt}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="position-absolute bottom-0 w-100 p-4 text-white"
                        style={{ 
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                          minHeight: '40%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end'
                        }}
                      >
                        <div className="d-flex align-items-center mb-2">
                          <span className="badge" style={{ backgroundColor: COLORS.gold, padding: '6px 12px' }}>
                            {item.category}
                          </span>
                          <small className="ms-3">{item.date}</small>
                        </div>
                        <h4 className="mb-0 fw-bold">{item.caption}</h4>
                        <div className="position-absolute top-0 end-0 m-3 bg-white rounded-circle p-2 gallery-view-icon opacity-0">
                          <EyeIcon size={18} color={COLORS.green} />
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              <Row className="g-4">
                {filteredGallery.slice(3).map((item) => (
                  <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                    <div 
                      className="gallery-item position-relative rounded shadow overflow-hidden"
                      onClick={() => handleImageClick(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img 
                        src={item.src} 
                        alt={item.alt}
                        className="img-fluid rounded"
                        style={{ 
                          aspectRatio: '1 / 1', 
                          objectFit: 'cover', 
                          width: '100%',
                          transition: 'transform 0.5s ease'
                        }}
                      />
                      <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-3 opacity-0"
                        style={{ 
                          background: 'linear-gradient(to bottom, rgba(76, 112, 49, 0.8), rgba(139, 94, 60, 0.8))',
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        <div className="badge" style={{ backgroundColor: COLORS.gold, alignSelf: 'flex-start', padding: '6px 12px' }}>
                          {item.category}
                        </div>
                        <div>
                          <h5 className="text-white fw-bold mb-1">{item.caption}</h5>
                          <small className="text-white">{item.date}</small>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <div className="text-center py-5">
              <div className="mb-4" style={{ color: COLORS.gray }}>
                <Filter size={48} />
              </div>
              <h4 style={{ color: COLORS.brown }}>Tidak ada gambar yang ditemukan</h4>
              <p style={{ color: COLORS.gray }}>Coba gunakan filter atau pencarian yang berbeda</p>
              <Button 
                variant="outline" 
                onClick={() => { setFilter('semua'); setSearchTerm(''); }}
                style={{ 
                  borderColor: COLORS.green, 
                  color: COLORS.green,
                  borderRadius: '30px',
                  padding: '8px 20px'
                }}
              >
                Reset Filter
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Image Modal */}
      {showModal && selectedImage && (
        <div className="modal-backdrop show" style={{ zIndex: 1050 }}></div>
      )}
      <div 
        className={`modal ${showModal ? 'd-block' : 'd-none'}`} 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 1051 }}
        onClick={closeModal}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
          <div className="modal-content border-0 bg-transparent">
            <div className="modal-body p-0 position-relative">
              <Button 
                variant="light" 
                className="position-absolute end-0 top-0 rounded-circle p-2 m-2" 
                style={{ width: '40px', height: '40px', zIndex: 1052 }}
                onClick={closeModal}
              >
                &times;
              </Button>
              <img 
                src={selectedImage?.src} 
                alt={selectedImage?.alt} 
                className="img-fluid rounded"
                style={{ width: '100%' }}
              />
              <div className="bg-white p-3 rounded-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1" style={{ color: COLORS.brown }}>{selectedImage?.caption}</h5>
                    <div className="d-flex align-items-center">
                      <span className="badge me-2" style={{ backgroundColor: COLORS.green }}>{selectedImage?.category}</span>
                      <small style={{ color: COLORS.gray }}>{selectedImage?.date}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section - Pemandangan Terbaik */}
      <section className="py-5" style={{ backgroundColor: 'white' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Pemandangan Terbaik</h2>
            <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
            <p className="mt-3" style={{ color: COLORS.gray }}>Panorama indah yang menjadi kebanggaan Desa Guyangan</p>
          </div>
          
          <Row className="g-4">
            <Col lg={8}>
              <Card className="border-0 shadow-sm h-100 overflow-hidden">
                <div className="position-relative">
                  <Card.Img 
                    src={galleryData.length > 0 ? galleryData[0].src : "/api/placeholder/800/500"} 
                    style={{ height: '400px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute bottom-0 start-0 w-100 p-4"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
                  >
                    <h3 className="text-white fw-bold">Pesona Alam Desa Guyangan</h3>
                    <p className="text-white mb-0">Kehijauan yang membentang luas dan udara sejuk khas pedesaan</p>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={4}>
              <Row className="g-4 h-100">
                <Col xs={12} className="h-50">
                  <Card className="border-0 shadow-sm h-100 overflow-hidden">
                    <div className="position-relative h-100">
                      <Card.Img 
                        src={galleryData.length > 1 ? galleryData[1].src : "/api/placeholder/400/250"} 
                        className="h-100"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="position-absolute bottom-0 start-0 w-100 p-3"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
                      >
                        <h5 className="text-white fw-bold">Budaya Tradisional</h5>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} className="h-50">
                  <Card className="border-0 shadow-sm h-100 overflow-hidden">
                    <div className="position-relative h-100">
                      <Card.Img 
                        src={galleryData.length > 2 ? galleryData[2].src : "/api/placeholder/400/250"} 
                        className="h-100"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="position-absolute bottom-0 start-0 w-100 p-3"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
                      >
                        <h5 className="text-white fw-bold">Aktivitas Warga</h5>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5" style={{ 
        backgroundColor: COLORS.brown, 
        backgroundImage: 'url(/api/placeholder/1920/500)', 
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
          backgroundColor: 'rgba(139, 94, 60, 0.9)'
        }}></div>
        <Container className="position-relative text-center text-white py-5">
          <h2 className="display-5 fw-bold mb-3">Memiliki Foto Menarik Tentang Desa?</h2>
          <p className="lead mb-4">Bagikan keindahan Desa Guyangan dengan kami dan bantu promosikan potensi wisata desa</p>
          <Button 
            size="lg" 
            style={{ 
              backgroundColor: COLORS.gold, 
              border: 'none',
              padding: '12px 30px',
              borderRadius: '30px',
              fontWeight: 500
            }}
          >
            Bagikan Foto Anda <ArrowRight size={16} className="ms-2" />
          </Button>
        </Container>
      </section>

      {/* Footer Component */}
      <Footer villageData={villageData} />

      {/* Custom CSS */}
      <style jsx>{`
        .gallery-item:hover .gallery-overlay {
          opacity: 1 !important;
        }
        .gallery-item:hover img {
          transform: scale(1.1);
        }
        .gallery-item-featured:hover .gallery-view-icon {
          opacity: 1 !important;
          transition: opacity 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default GaleriPage;