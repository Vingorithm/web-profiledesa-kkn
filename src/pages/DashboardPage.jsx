import React, { useState, useEffect } from 'react';
import NavbarComponent from '../components/Navbar';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Container, Row, Col, Card, Badge, Button, Form } from 'react-bootstrap';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { getSemuaArtikel, getSemuaUMKM, getSemuaGaleri } from '../service'; // Import the gallery service
import { useNavigate } from 'react-router-dom';
import dummyData from '../components/DummyData';

const COLORS = dummyData.colors;

const DashboardPage = () => {
  const [villageData, setVillageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('beranda');
  const [articles, setArticles] = useState([]);
  const [umkmData, setUmkmData] = useState([]);
  const [galleryData, setGalleryData] = useState([]); // New state for gallery data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch articles from Firebase
        const artikelData = await getSemuaArtikel();
        
        // Format the date and sort by newest
        const formattedArticles = artikelData.map(article => {
          // Handle Firestore timestamp
          let formattedDate = "Tanggal tidak tersedia";
          if (article.createdAt) {
            // Handle both Firestore timestamp and JavaScript Date objects
            const date = article.createdAt.toDate ? article.createdAt.toDate() : new Date(article.createdAt);
            formattedDate = date.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });
          }
          
          return {
            id: article.id,
            title: article.judul,
            date: formattedDate,
            category: article.kategori || "Umum",
            summary: article.text?.substring(0, 100) + "..." || "Konten tidak tersedia",
            image: article.gambar || "/api/placeholder/400/300",
            link: article.link || "#"
          };
        });
        
        // Sort by date (newest first)
        formattedArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setArticles(formattedArticles);
        
        // Fetch UMKM data from Firebase
        const umkmData = await getSemuaUMKM();
        
        // Format UMKM data
        const formattedUMKM = umkmData.map(umkm => ({
          id: umkm.id,
          name: umkm.nama,
          category: umkm.kategori || "Umum",
          owner: umkm.nama_pemilik,
          phone: umkm.no_telp,
          description: umkm.text,
          image: umkm.gambar || "/api/placeholder/300/200"
        }));
        
        setUmkmData(formattedUMKM);
        
        // Fetch Gallery data from Firebase - NEW CODE
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
          
          return {
            id: item.id,
            src: item.foto || "/api/placeholder/400/400",
            alt: item.judul || "Galeri Desa Guyangan",
            caption: item.judul || "Foto Desa",
            date: formattedDate
          };
        });
        
        setGalleryData(formattedGallery);
        
        // Load the rest of the village data
        setVillageData({
          ...dummyData,
          // Replace article data with the fetched and formatted data
          articles: formattedArticles,
          // Replace UMKM data with the fetched data
          umkm: formattedUMKM,
          // Replace gallery data with the fetched data
          gallery: formattedGallery
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setVillageData(dummyData); // Fallback to dummy data on error
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border" style={{ color: COLORS.gold }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: COLORS.brown, fontWeight: 500 }}>Memuat data Desa Guyangan...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: COLORS.cream }}>
      {/* Navbar Component */}
      <NavbarComponent 
        villageData={villageData} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />

      {/* Hero Section with Enhanced Carousel */}
      <section id="beranda" className="position-relative">
        <Carousel fade interval={5000} className="hero-carousel">
          {villageData.carouselImages.map((image) => (
            <Carousel.Item key={image.id}>
              <div className="overlay position-absolute w-100 h-100" 
                style={{ background: 'linear-gradient(to right, rgba(76, 112, 49, 0.7), rgba(139, 94, 60, 0.4))', zIndex: 1 }}>
              </div>
              <img
                className="d-block w-100"
                src={image.src}
                alt={image.alt}
                style={{ height: '600px', objectFit: 'cover' }}
              />
              <Carousel.Caption className="text-start pb-5 position-absolute" style={{ maxWidth: '600px', zIndex: 2, bottom: '20%' }}>
                <h1 className="display-4 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{image.caption}</h1>
                <p className="lead" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{image.description}</p>
                <Button 
                  size="lg" 
                  className="mt-3 fw-bold px-4 py-3 shadow-sm" 
                  style={{ backgroundColor: COLORS.gold, border: 'none' }}
                >
                  Jelajahi Desa
                </Button>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Welcome Section with Enhanced Design */}
      <section id="welcome" className="py-5" style={{ backgroundColor: 'white' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="pe-lg-5">
              <div className="position-relative mb-4">
                <h2 className="display-5 fw-bold mb-0" style={{ color: COLORS.brown }}>Selamat Datang di</h2>
                <h2 className="display-5 fw-bold" style={{ color: COLORS.green }}>{villageData.villageName}</h2>
                <div className="accent-line" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
              </div>
              <p className="lead mb-4" style={{ color: COLORS.brown }}>{villageData.welcome.description}</p>
              <p style={{ color: COLORS.gray }}>{villageData.welcome.additionalInfo}</p>
              <div className="d-flex gap-3 mt-4">
                <Button size="lg" style={{ backgroundColor: COLORS.green, border: 'none' }}>Tentang Kami</Button>
                <Button size="lg" style={{ backgroundColor: 'transparent', border: `2px solid ${COLORS.green}`, color: COLORS.green }}>Potensi Desa</Button>
              </div>
            </Col>
            <Col lg={6} className="mt-5 mt-lg-0">
              <div className="position-relative">
                <div className="bg-pattern position-absolute" style={{ 
                  width: '200px', 
                  height: '200px', 
                  backgroundColor: COLORS.gold, 
                  opacity: 0.1, 
                  borderRadius: '50%',
                  top: '-20px',
                  left: '-20px',
                  zIndex: 0
                }}></div>
                <img 
                  src="/api/placeholder/600/400" 
                  alt="Desa Guyangan" 
                  className="img-fluid rounded shadow-lg position-relative"
                  style={{ zIndex: 1, width: '100%', height: 'auto', objectFit: 'cover' }}
                />
                <div className="position-absolute p-4 rounded shadow-lg" 
                  style={{ 
                    backgroundColor: COLORS.green, 
                    color: 'white', 
                    bottom: '-30px', 
                    right: '-20px',
                    zIndex: 2
                  }}>
                  <h4 className="mb-0" style={{ fontSize: '1.1rem' }}>Didirikan Tahun</h4>
                  <div className="display-5 fw-bold">1957</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section - New Addition */}
      <section className="py-5" style={{ backgroundColor: COLORS.green }}>
        <Container>
          <Row className="text-center text-white">
            <Col md={3} className="mb-4 mb-md-0">
              <div className="display-4 fw-bold" style={{ color: COLORS.gold }}>{villageData.profile.population}</div>
              <div className="fw-bold mt-2">Penduduk</div>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <div className="display-4 fw-bold" style={{ color: COLORS.gold }}>{villageData.profile.area}</div>
              <div className="fw-bold mt-2">Luas Wilayah</div>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <div className="display-4 fw-bold" style={{ color: COLORS.gold }}>{villageData.profile.families}</div>
              <div className="fw-bold mt-2">Keluarga</div>
            </Col>
            <Col md={3}>
              <div className="display-4 fw-bold" style={{ color: COLORS.gold }}>{villageData.profile.hamlets}</div>
              <div className="fw-bold mt-2">Dusun</div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Event Section with Enhanced Design - NOW USING API DATA */}
      <section id="artikel" className="py-5" style={{ backgroundColor: 'white' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Event Terbaru</h2>
            <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
            <p className="mt-3" style={{ color: COLORS.gray }}>Kegiatan dan berita terbaru dari Desa Guyangan</p>
          </div>
          <Row>
            {villageData.articles.length > 0 ? (
              villageData.articles.slice(0, 3).map((article) => (
                <Col lg={4} key={article.id} className="mb-4">
                  <Card className="h-100 shadow-sm border-0 hover-card">
                    <div className="position-relative">
                      <Card.Img 
                        variant="top" 
                        src={article.image}
                        style={{ height: '220px', objectFit: 'cover' }}
                      />
                      <Badge 
                        className="position-absolute" 
                        style={{ 
                          top: '15px', 
                          right: '15px', 
                          backgroundColor: COLORS.orange,
                          padding: '8px 15px',
                          fontWeight: 500
                        }}
                      >
                        {article.category}
                      </Badge>
                    </div>
                    <Card.Body>
                      <small className="text-muted d-block mb-2" style={{ color: COLORS.gray }}>{article.date}</small>
                      <Card.Title className="fw-bold" style={{ color: COLORS.brown }}>{article.title}</Card.Title>
                      <Card.Text style={{ color: COLORS.gray }}>{article.summary}</Card.Text>
                    </Card.Body>
                    <Card.Footer style={{ backgroundColor: 'white', borderTop: 'none' }}>
                      <Button 
                        variant="link" 
                        className="p-0 d-flex align-items-center" 
                        style={{ color: COLORS.green, textDecoration: 'none', fontWeight: 500 }}
                        href={article.link}
                        onClick={() => navigate(`/artikel/${article.id}`)}
                      >
                        Baca Selengkapnya 
                        <ArrowRight size={16} className="ms-1" />
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center py-5">
                <p style={{ color: COLORS.gray }}>Belum ada artikel tersedia.</p>
              </Col>
            )}
          </Row>
          <div className="text-center mt-4">
            <Button 
              variant="outline" 
              size="lg" 
              style={{ 
                borderColor: COLORS.green, 
                color: COLORS.green, 
                padding: '10px 30px',
                borderRadius: '30px'
              }}
              onClick={() => navigate('/artikel')}
            >
              Lihat Semua Kegiatan
            </Button>
          </div>
        </Container>
      </section>

      {/* Gallery Section with Enhanced Design - NOW USING API DATA */}
      <section id="galeri" className="py-5" style={{ backgroundColor: COLORS.cream }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Galeri Desa</h2>
            <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
            <p className="mt-3" style={{ color: COLORS.gray }}>Keindahan dan Kearifan Lokal Desa Guyangan</p>
          </div>
          <Row className="g-4">
            {galleryData.length > 0 ? (
              // Display gallery data fetched from Firebase
              galleryData.slice(0, 8).map((item) => (
                <Col key={item.id} xs={6} md={4} lg={3}>
                  <div className="gallery-item position-relative rounded shadow-sm">
                    <img 
                      src={item.src} 
                      alt={item.alt}
                      className="img-fluid rounded"
                      style={{ aspectRatio: '1 / 1', objectFit: 'cover', width: '100%' }}
                    />
                    <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded opacity-0"
                      style={{ background: 'linear-gradient(to bottom, rgba(76, 112, 49, 0.8), rgba(139, 94, 60, 0.8))' }}
                    >
                      <div className="text-white text-center p-3">
                        <div className="fw-bold mb-1">{item.caption}</div>
                        <small>{item.date}</small>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              // Fallback message when no gallery data is available
              <Col className="text-center py-5">
                <p style={{ color: COLORS.gray }}>Belum ada foto galeri tersedia.</p>
              </Col>
            )}
          </Row>
          <div className="text-center mt-5">
            <Button 
              variant="outline" 
              size="lg" 
              style={{ 
                borderColor: COLORS.brown, 
                color: COLORS.brown, 
                padding: '10px 30px',
                borderRadius: '30px'
              }}
              onClick={() => navigate('/galeri')}
            >
              Lihat Semua Foto
            </Button>
          </div>
        </Container>
      </section>

      {/* UMKM Section with Real Firebase Data */}
      <section id="umkm" className="py-5" style={{ backgroundColor: 'white' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>UMKM Desa</h2>
            <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
            <p className="mt-3" style={{ color: COLORS.gray }}>Usaha Mikro, Kecil, dan Menengah Desa Guyangan</p>
          </div>
          <Row>
            {umkmData.length > 0 ? (
              umkmData.map((business) => (
                <Col key={business.id} md={6} lg={3} className="mb-4">
                  <Card className="h-100 shadow border-0 hover-card">
                    <div className="position-relative">
                      <Card.Img 
                        variant="top" 
                        src={business.image}
                        style={{ height: '180px', objectFit: 'cover' }}
                      />
                      <Badge 
                        className="position-absolute" 
                        style={{ 
                          top: '15px', 
                          left: '15px', 
                          backgroundColor: COLORS.green,
                          padding: '6px 12px'
                        }}
                      >
                        {business.category}
                      </Badge>
                    </div>
                    <Card.Body>
                      <Card.Title className="fw-bold" style={{ color: COLORS.brown }}>{business.name}</Card.Title>
                      <div className="d-flex align-items-center mb-3">
                        <small style={{ color: COLORS.gray }}>{business.owner}</small>
                      </div>
                      <Card.Text className="small d-flex align-items-center" style={{ color: COLORS.gray }}>
                        <Phone size={16} className="me-2" />
                        {business.phone}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer style={{ backgroundColor: 'white', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <div className="d-flex justify-content-between">
                        <Button 
                          style={{ 
                            backgroundColor: COLORS.gold, 
                            border: 'none',
                            fontWeight: 500,
                            fontSize: '0.9rem'
                          }}
                        >
                          Hubungi
                        </Button>
                        <Button 
                          variant="link" 
                          className="d-flex align-items-center" 
                          style={{ 
                            color: COLORS.green, 
                            textDecoration: 'none',
                            fontWeight: 500,
                            fontSize: '0.9rem'
                          }}
                        >
                          Detail 
                          <ArrowRight size={16} className="ms-1" />
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center py-5">
                <p style={{ color: COLORS.gray }}>Belum ada data UMKM tersedia.</p>
              </Col>
            )}
          </Row>
          <div className="text-center mt-4">
            <Button 
              variant="outline" 
              size="lg" 
              style={{ 
                borderColor: COLORS.green, 
                color: COLORS.green, 
                padding: '10px 30px',
                borderRadius: '30px'
              }}
            >
              Lihat Semua UMKM
            </Button>
          </div>
        </Container>
      </section>

      {/* Profile Section with Enhanced Design */}
      <section id="profil" className="py-5" style={{ 
        backgroundColor: COLORS.brown, 
        backgroundImage: 'url(/api/placeholder/1920/800)', 
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
          backgroundColor: 'rgba(139, 94, 60, 0.9)'
        }}></div>
        <Container className="position-relative">
          <Row>
            <Col lg={6} className="text-white">
              <h2 className="fw-bold mb-3">Profil Desa</h2>
              <div className="accent-line" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginBottom: '20px' }}></div>
              <p className="lead">{villageData.profile.description}</p>
            </Col>
            <Col lg={6} className="mt-5 mt-lg-0">
              <div className="bg-white p-4 rounded shadow">
                <h4 className="fw-bold mb-4" style={{ color: COLORS.brown }}>Visi & Misi</h4>
                <div className="mb-4">
                  <h5 className="fw-bold" style={{ color: COLORS.green }}>Visi</h5>
                  <p style={{ color: COLORS.gray }}>{villageData.profile.vision}</p>
                </div>
                <div>
                  <h5 className="fw-bold" style={{ color: COLORS.green }}>Misi</h5>
                  <ul style={{ color: COLORS.gray, paddingLeft: '1.2rem' }}>
                    {villageData.profile.missions.map((mission, index) => (
                      <li key={index} className="mb-2">{mission}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section with Enhanced Design */}
      <section id="kontak" className="py-5" style={{ backgroundColor: 'white' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Hubungi Kami</h2>
            <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
            <p className="mt-3" style={{ color: COLORS.gray }}>Jangan ragu untuk menghubungi kami</p>
          </div>
          <Row>
            <Col lg={6}>
              <Form className="contact-form p-4 rounded shadow-sm" style={{ backgroundColor: COLORS.cream }}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>Nama</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Nama lengkap" 
                        style={{ 
                          border: `1px solid ${COLORS.gray}`,
                          padding: '12px',
                          backgroundColor: 'white'
                        }} 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="Email anda" 
                        style={{ 
                          border: `1px solid ${COLORS.gray}`,
                          padding: '12px',
                          backgroundColor: 'white'
                        }} 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>Subjek</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Subjek pesan" 
                    style={{ 
                      border: `1px solid ${COLORS.gray}`,
                      padding: '12px',
                      backgroundColor: 'white'
                    }} 
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>Pesan</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={5} 
                    placeholder="Tuliskan pesan anda" 
                    style={{ 
                      border: `1px solid ${COLORS.gray}`,
                      padding: '12px',
                      backgroundColor: 'white'
                    }} 
                  />
                </Form.Group>
                <Button 
                  type="submit" 
                  className="fw-bold px-4 py-3 w-100" 
                  style={{ backgroundColor: COLORS.green, border: 'none' }}
                >
                  Kirim Pesan
                </Button>
              </Form>
            </Col>
            <Col lg={6} className="mt-4 mt-lg-0">
              <div className="p-4 rounded shadow-sm h-100" style={{ backgroundColor: COLORS.cream }}>
                <h4 className="fw-bold mb-4" style={{ color: COLORS.brown }}>Informasi Kontak</h4>
                
                <div className="d-flex mb-4">
                  <div className="p-3 rounded-circle me-3 d-flex align-items-center justify-content-center" 
                    style={{ 
                      backgroundColor: COLORS.green, 
                      width: '60px',
                      height: '60px'
                    }}
                  >
                    <MapPin size={24} color="white" />
                  </div>
                  <div>
                    <h5 className="fw-bold" style={{ color: COLORS.brown }}>Alamat</h5>
                    <p style={{ color: COLORS.gray }}>{villageData.villageInfo.address}</p>
                  </div>
                </div>
                
                <div className="d-flex mb-4">
                  <div className="p-3 rounded-circle me-3 d-flex align-items-center justify-content-center" 
                    style={{ 
                      backgroundColor: COLORS.green, 
                      width: '60px',
                      height: '60px'
                    }}
                  >
                    <Phone size={24} color="white" />
                  </div>
                  <div>
                    <h5 className="fw-bold" style={{ color: COLORS.brown }}>Telepon</h5>
                    <p style={{ color: COLORS.gray }}>{villageData.villageInfo.phone}</p>
                  </div>
                </div>
                
                <div className="d-flex mb-4">
                  <div className="p-3 rounded-circle me-3 d-flex align-items-center justify-content-center" 
                    style={{ 
                      backgroundColor: COLORS.green, 
                      width: '60px',
                      height: '60px'
                    }}
                  >
                    <Mail size={24} color="white" />
                  </div>
                  <div>
                    <h5 className="fw-bold" style={{ color: COLORS.brown }}>Email</h5>
                    <p style={{ color: COLORS.gray }}>{villageData.villageInfo.email}</p>
                  </div>
                </div>
                
                <div className="d-flex">
                  <div className="p-3 rounded-circle me-3 d-flex align-items-center justify-content-center" 
                    style={{ 
                      backgroundColor: COLORS.green, 
                      width: '60px',
                      height: '60px'
                    }}
                  >
                    <Clock size={24} color="white" />
                  </div>
                  <div>
                    <h5 className="fw-bold" style={{ color: COLORS.brown }}>Jam Operasional</h5>
                    <p style={{ color: COLORS.gray }}>{villageData.villageInfo.officeHours}</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Component */}
      <Footer 
        villageData={villageData} 
      />

      {/* Custom CSS */}
      <style jsx>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .gallery-item {
          cursor: pointer;
          overflow: hidden;
          border-radius: 0.375rem;
        }
        .gallery-overlay {
          transition: opacity 0.3s ease;
        }
        .gallery-item:hover .gallery-overlay {
          opacity: 1 !important;
        }
        .gallery-item img {
          transition: transform 0.5s ease;
        }
        .gallery-item:hover img {
          transform: scale(1.1);
        }
        .contact-form input:focus, 
        .contact-form textarea:focus {
          box-shadow: 0 0 0 0.25rem rgba(212, 175, 55, 0.25);
          border-color: ${COLORS.gold};
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;