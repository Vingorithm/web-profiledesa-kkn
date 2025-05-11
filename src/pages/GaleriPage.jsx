import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import NavbarComponent from '../components/Navbar';
import Footer from '../components/Footer';
import { getSemuaGaleri } from '../service';
import { Search, Filter, EyeIcon } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import dummyData from '../components/DummyData';

const COLORS = dummyData.colors;

// Define categories that might be useful for the gallery
// Note: Since API doesn't provide categories, we'll use tags based on photo titles
const CATEGORIES = ['Kegiatan', 'Pemandangan', 'Budaya', 'Infrastruktur', 'Masyarakat'];

const GaleriPage = () => {
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('galeri');
  const [villageData, setVillageData] = useState(null);
  const [filter, setFilter] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch gallery data from Firebase
        const galeriData = await getSemuaGaleri();
        
        // Format Gallery data and intelligently assign categories based on title keywords
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
          
          // Assign category based on title keywords
          let category = 'Kegiatan'; // Default category
          const title = (item.judul || "").toLowerCase();
          
          if (title.includes('alam') || title.includes('pemandangan') || title.includes('sawah') || 
              title.includes('gunung') || title.includes('pantai')) {
            category = 'Pemandangan';
          } else if (title.includes('budaya') || title.includes('tradisi') || title.includes('adat') || 
                     title.includes('seni') || title.includes('tari')) {
            category = 'Budaya';
          } else if (title.includes('jalan') || title.includes('bangunan') || title.includes('fasilitas') || 
                     title.includes('jembatan') || title.includes('gedung') || title.includes('kantor')) {
            category = 'Infrastruktur';
          } else if (title.includes('warga') || title.includes('masyarakat') || title.includes('penduduk') || 
                     title.includes('gotong royong') || title.includes('kerjasama')) {
            category = 'Masyarakat';
          }
          
          return {
            id: item.id,
            src: item.foto || "/api/placeholder/800/800", // Use the correct API field name
            alt: item.judul || "Galeri Desa Guyangan",
            caption: item.judul || "Foto Desa",
            date: formattedDate,
            category: category
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

  // Function to get category counts for displaying in UI
  const getCategoryCounts = () => {
    const counts = {};
    galleryData.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  };
  
  const categoryCounts = getCategoryCounts();

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border" style={{ color: COLORS.gold }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: COLORS.brown, fontWeight: 500 }}>Memuat galeri Padukuhan Guyangan...</p>
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
          backgroundImage: galleryData.length > 0 ? `url(${galleryData[0].src})` : 'url(/api/placeholder/1920/400)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundColor: COLORS.green,
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ backgroundColor: 'rgba(76, 112, 49, 0.8)' }}></div>
        <Container className="position-relative py-5">
          <h1 className="display-4 fw-bold">Galeri Padukuhan Guyangan</h1>
          <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
          <p className="lead mt-3">Keindahan dan Kearifan Lokal yang Memukau</p>
          <p className="mt-3 mb-0">{galleryData.length} foto dalam koleksi</p>
        </Container>
      </section>

      {/* Gallery Stats & Filter Section */}
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
                  Semua ({galleryData.length})
                </Button>
                
                {CATEGORIES.map((category, index) => {
                  // Only show categories that have photos
                  const count = categoryCounts[category] || 0;
                  if (count === 0) return null;
                  
                  return (
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
                      {category} ({count})
                    </Button>
                  );
                })}
              </div>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Cari galeri berdasarkan judul atau tanggal..."
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
              {/* Featured gallery items (first 3) */}
              {filteredGallery.length >= 3 && (
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
              )}

              {/* Regular gallery grid */}
              <Row className="g-4">
                {filteredGallery.slice(filteredGallery.length >= 3 ? 3 : 0).map((item) => (
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
        <>
          <div className="modal-backdrop show" style={{ zIndex: 1050 }}></div>
          <div 
            className="modal d-block" 
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
                    src={selectedImage.src} 
                    alt={selectedImage.alt} 
                    className="img-fluid rounded"
                    style={{ width: '100%' }}
                  />
                  <div className="bg-white p-3 rounded-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1" style={{ color: COLORS.brown }}>{selectedImage.caption}</h5>
                        <div className="d-flex align-items-center">
                          <span className="badge me-2" style={{ backgroundColor: COLORS.green }}>{selectedImage.category}</span>
                          <small style={{ color: COLORS.gray }}>{selectedImage.date}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Category Highlights Section */}
      {galleryData.length > 3 && (
        <section className="py-5" style={{ backgroundColor: 'white' }}>
          <Container>
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Sorotan Kategori</h2>
              <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
              <p className="mt-3" style={{ color: COLORS.gray }}>Berbagai momen dan keindahan dari Desa Guyangan</p>
            </div>
            
            <Row className="g-4">
              {/* Dynamically find representative images for each main category */}
              {CATEGORIES.slice(0, 3).map((category, index) => {
                // Find an image for this category
                const image = galleryData.find(item => item.category === category);
                if (!image) return null;
                
                return (
                  <Col key={index} lg={4} md={6}>
                    <Card className="border-0 shadow-sm h-100 overflow-hidden" onClick={() => setFilter(category)} style={{ cursor: 'pointer' }}>
                      <div className="position-relative">
                        <Card.Img 
                          src={image.src} 
                          style={{ height: '250px', objectFit: 'cover' }}
                        />
                        <div className="position-absolute bottom-0 start-0 w-100 p-3"
                          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <h5 className="text-white fw-bold mb-0">{category}</h5>
                            <span className="badge rounded-pill" style={{ backgroundColor: COLORS.gold }}>
                              {categoryCounts[category] || 0} foto
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </section>
      )}

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