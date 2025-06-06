import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Row, Col, Badge, Button, Breadcrumb, Card } from 'react-bootstrap';
import { ArrowLeft, MapPin, Phone, User, Tag, Clock, Share2, Bookmark, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';
import { getSemuaUMKM } from "../service";
import 'bootstrap/dist/css/bootstrap.min.css';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase";
import DummyData from '../components/DummyData';

const COLORS = DummyData.colors;

const DetailUmkm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [umkm, setUMKM] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedUMKM, setRelatedUMKM] = useState([]);
  const [villageData, setVillageData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchUMKMDetail = async () => {
      try {
        const umkmRef = doc(db, "umkm", id);
        const umkmSnap = await getDoc(umkmRef);
        
        if (umkmSnap.exists()) {
          const umkmData = {
            id: umkmSnap.id,
            ...umkmSnap.data()
          };
     
          let formattedDate = "Tanggal tidak tersedia";
          if (umkmData.createdAt) {
            const date = umkmData.createdAt.toDate ? umkmData.createdAt.toDate() : new Date(umkmData.createdAt);
            formattedDate = date.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });
            
            umkmData.formattedDate = formattedDate;
          }
          console.log(umkmData);
          setUMKM(umkmData);
          
          // For now, just using dummy data for the village info
          setVillageData(DummyData);
          
          const allUMKM = await getSemuaUMKM();
          const category = umkmData.kategori || "Umum";
          const filteredRelated = allUMKM.filter(item => 
            item.kategori === category && item.id !== umkmData.id
          ).slice(0, 3);
          
          setRelatedUMKM(filteredRelated);
        } else {
          console.error("UMKM tidak ditemukan!");
          // Redirect to 404 or homepage
          navigate('/');
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching UMKM:", error);
        setLoading(false);
      }
    };
    
    fetchUMKMDetail();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border" style={{ color: COLORS.gold }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: COLORS.brown, fontWeight: 500 }}>Memuat data UMKM...</p>
      </div>
    );
  }

  if (!umkm) {
    return (
      <Container className="text-center my-5 py-5">
        <h3 style={{ color: COLORS.brown }}>UMKM tidak ditemukan</h3>
        <Button 
          className="mt-3" 
          style={{ backgroundColor: COLORS.green, border: 'none' }}
          onClick={() => navigate('/')}
        >
          Kembali ke Beranda
        </Button>
      </Container>
    );
  }

  const formatTextWithParagraphs = (text) => {
    // Split text by newlines and wrap each part in a paragraph
    if (!text) return <p>Deskripsi tidak tersedia</p>;
    
    return text.split('\n').map((paragraph, index) => (
      paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
    ));
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: COLORS.cream }}>
      {/* Navbar Component */}
      <NavbarComponent 
        villageData={villageData} 
        activeSection="umkm" 
      />

      {/* Hero Section */}
      <section className="position-relative">
        <div 
          className="umkm-hero"
          style={{
            backgroundImage: `url(${umkm.gambar || "/api/placeholder/1200/600"})`,
            height: '500px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <div className="overlay position-absolute w-100 h-100" 
            style={{ 
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))', 
              zIndex: 1 
            }}>
          </div>
          <Container className="d-flex align-items-end h-100 position-relative pb-5" style={{ zIndex: 2 }}>
            <div className="text-white mb-4">
              <Badge 
                style={{ 
                  backgroundColor: COLORS.orange,
                  padding: '8px 15px',
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}
              >
                {umkm.kategori || "Umum"}
              </Badge>
              <h1 className="mt-3 display-4 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                {umkm.nama}
              </h1>
              <div className="d-flex flex-wrap gap-4 mt-3">
                <div className="d-flex align-items-center">
                  <User size={18} className="me-2" />
                  {umkm.nama_pemilik || "Nama pemilik tidak tersedia"}
                </div>
                <div className="d-flex align-items-center">
                  <Phone size={18} className="me-2" />
                  {umkm.no_telp || "Nomor telepon tidak tersedia"}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* Breadcrumb */}
      <Container className="py-3">
        <Breadcrumb style={{ fontSize: '0.9rem' }}>
          <Breadcrumb.Item href="/" style={{ color: COLORS.brown }}>Beranda</Breadcrumb.Item>
          <Breadcrumb.Item href="/#umkm" style={{ color: COLORS.brown }}>UMKM</Breadcrumb.Item>
          <Breadcrumb.Item active style={{ color: COLORS.green }}>{umkm.nama}</Breadcrumb.Item>
        </Breadcrumb>
      </Container>

      {/* UMKM Content */}
      <section className="py-5" style={{ backgroundColor: 'white' }}>
        <Container>
          <Row>
            {/* Main Content */}
            <Col lg={8}>
              <div className="pe-lg-4">
                {/* Back Button */}
                <Button 
                  variant="link" 
                  className="mb-4 p-0 d-flex align-items-center" 
                  style={{ color: COLORS.green, textDecoration: 'none', fontWeight: 500 }}
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft size={18} className="me-2" />
                  Kembali
                </Button>
                
                {/* UMKM Info Card */}
                <Card className="border-0 shadow-sm mb-4 p-0">
                  <Card.Body className="p-4">
                    <Row>
                      <Col md={4} className="mb-3 mb-md-0">
                        <div className="rounded h-100" style={{ overflow: 'hidden' }}>
                          <img 
                            src={umkm.gambar || "/api/placeholder/300/300"} 
                            alt={umkm.nama}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      </Col>
                      <Col md={8}>
                        <div>
                          <h4 style={{ color: COLORS.brown, fontWeight: 600 }}>{umkm.nama}</h4>
                          <Badge 
                            style={{ 
                              backgroundColor: COLORS.orange,
                              padding: '6px 12px',
                              fontWeight: 500,
                              fontSize: '0.85rem',
                              marginBottom: '15px'
                            }}
                          >
                            {umkm.kategori || "Umum"}
                          </Badge>
                          
                          <div className="d-flex align-items-center mt-3 mb-2">
                            <User size={16} className="me-2" style={{ color: COLORS.green }} />
                            <span style={{ fontWeight: 500 }}>Pemilik:</span>
                            <span className="ms-2">{umkm.nama_pemilik || "Tidak tersedia"}</span>
                          </div>
                          
                          <div className="d-flex align-items-center mb-2">
                            <Phone size={16} className="me-2" style={{ color: COLORS.green }} />
                            <span style={{ fontWeight: 500 }}>Kontak:</span>
                            <span className="ms-2">{umkm.no_telp || "Tidak tersedia"}</span>
                          </div>
                          
                          <div className="d-flex align-items-center mb-3">
                            <MapPin size={16} className="me-2" style={{ color: COLORS.green }} />
                            <span style={{ fontWeight: 500 }}>Lokasi:</span>
                            <span className="ms-2">Desa Guyangan, Kemiri, Tanjungsari</span>
                          </div>
                          
                          <div className="mt-4">
                            <Button 
                              style={{ 
                                backgroundColor: COLORS.green, 
                                border: 'none',
                                marginRight: '10px'
                              }}
                              className="px-4"
                            >
                              <Phone size={16} className="me-2" />
                              Hubungi
                            </Button>
                            <Button 
                              style={{ 
                                backgroundColor: 'transparent', 
                                borderColor: COLORS.brown,
                                color: COLORS.brown
                              }}
                              className="px-4"
                            >
                              <MapPin size={16} className="me-2" />
                              Lihat Lokasi
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                {/* UMKM Content */}
                <div className="umkm-content mt-4">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h4 style={{ color: COLORS.brown, fontWeight: 600, marginBottom: '20px' }}>Tentang UMKM Ini</h4>
                      <div style={{ color: COLORS.gray, lineHeight: 1.8 }}>
                        {formatTextWithParagraphs(umkm.text)}
                      </div>
                      
                      {/* Products Gallery */}
                      {umkm.products && umkm.products.length > 0 && (
                        <div className="mt-5">
                          <h5 style={{ color: COLORS.brown, fontWeight: 600, marginBottom: '20px' }}>Produk Unggulan</h5>
                          <Row className="g-3">
                            {umkm.products.map((product, index) => (
                              <Col key={index} md={4}>
                                <Card className="border-0 hover-card h-100">
                                  <Card.Img 
                                    variant="top" 
                                    src={product.image || "/api/placeholder/300/200"} 
                                    style={{ height: '180px', objectFit: 'cover' }}
                                  />
                                  <Card.Body>
                                    <h6 style={{ color: COLORS.brown, fontWeight: 600 }}>{product.name}</h6>
                                    <p className="text-success fw-bold mb-0">
                                      {product.price || "Rp XX.XXX"}
                                    </p>
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}
                      
                      {/* Tags */}
                      {umkm.tags && umkm.tags.length > 0 && (
                        <div className="mt-5">
                          <div className="d-flex align-items-center gap-2">
                            <Tag size={18} style={{ color: COLORS.brown }} />
                            <span style={{ color: COLORS.brown, fontWeight: 500 }}>Tags:</span>
                          </div>
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            {umkm.tags.map((tag, index) => (
                              <Badge 
                                key={index} 
                                style={{ 
                                  backgroundColor: COLORS.cream,
                                  color: COLORS.brown,
                                  padding: '8px 12px',
                                  fontWeight: 500
                                }}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Share */}
                      <div className="mt-5 pt-4 border-top">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                          <div className="d-flex align-items-center gap-3">
                            <span style={{ color: COLORS.brown, fontWeight: 500 }}>Bagikan:</span>
                            <div className="d-flex gap-2">
                              <Button 
                                variant="link" 
                                className="p-0" 
                                style={{ color: '#3b5998' }}
                              >
                                <Facebook size={20} />
                              </Button>
                              <Button 
                                variant="link" 
                                className="p-0" 
                                style={{ color: '#1DA1F2' }}
                              >
                                <Twitter size={20} />
                              </Button>
                              <Button 
                                variant="link" 
                                className="p-0" 
                                style={{ color: '#E1306C' }}
                              >
                                <Instagram size={20} />
                              </Button>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <Button 
                              className="d-flex align-items-center" 
                              size="sm"
                              style={{ 
                                backgroundColor: 'transparent', 
                                border: `1px solid ${COLORS.gray}`,
                                color: COLORS.gray
                              }}
                            >
                              <Bookmark size={16} className="me-1" />
                              Simpan
                            </Button>
                            <Button 
                              className="d-flex align-items-center" 
                              size="sm"
                              style={{ 
                                backgroundColor: COLORS.green, 
                                border: 'none' 
                              }}
                            >
                              <MessageCircle size={16} className="me-1" />
                              Diskusi
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Col>
            
            {/* Sidebar */}
            <Col lg={4} className="mt-5 mt-lg-0">
              <div className="sticky-sidebar">
                {/* Village Info Card */}
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Body>
                    <h5 className="fw-bold mb-3" style={{ color: COLORS.brown }}>Desa Guyangan</h5>
                    <p style={{ color: COLORS.gray, fontSize: '0.95rem' }}>
                      Desa yang terletak di Kemiri, Tanjungsari, Gunung Kidul, Yogyakarta dengan kekayaan alam dan budaya yang melimpah.
                    </p>
                    <Button 
                      className="w-100"
                      style={{ 
                        backgroundColor: COLORS.gold, 
                        border: 'none',
                        fontWeight: 500 
                      }}
                    >
                      Kunjungi Profil Desa
                    </Button>
                  </Card.Body>
                </Card>
                
                {/* Category Card */}
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Body>
                    <h5 className="fw-bold mb-3" style={{ color: COLORS.brown }}>Kategori UMKM</h5>
                    <div className="d-flex flex-column gap-2">
                      {['Kuliner', 'Kerajinan', 'Fashion', 'Pertanian', 'Jasa'].map((category, index) => (
                        <Button 
                          key={index}
                          variant="link" 
                          className="text-start p-2 d-flex justify-content-between align-items-center" 
                          style={{ 
                            color: COLORS.brown, 
                            textDecoration: 'none',
                            borderBottom: `1px solid ${COLORS.cream}`
                          }}
                        >
                          {category}
                          <Badge 
                            pill 
                            style={{ 
                              backgroundColor: COLORS.cream,
                              color: COLORS.brown
                            }}
                          >
                            {Math.floor(Math.random() * 10) + 1}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
                
                {/* Related UMKM */}
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="fw-bold mb-3" style={{ color: COLORS.brown }}>UMKM Sejenis</h5>
                    <div className="d-flex flex-column gap-3">
                      {relatedUMKM.length > 0 ? (
                        relatedUMKM.map((related) => (
                          <div key={related.id} className="d-flex gap-3">
                            <img 
                              src={related.gambar || "/api/placeholder/80/80"} 
                              alt={related.nama}
                              style={{ 
                                width: '80px', 
                                height: '80px', 
                                objectFit: 'cover',
                                borderRadius: '0.375rem'
                              }}
                            />
                            <div>
                              <small style={{ color: COLORS.green }}>{related.kategori}</small>
                              <h6 style={{ color: COLORS.brown, fontWeight: 600, marginBottom: '0.2rem' }}>
                                {related.nama}
                              </h6>
                              <Button 
                                variant="link" 
                                className="p-0" 
                                style={{ color: COLORS.green, textDecoration: 'none', fontSize: '0.85rem' }}
                                onClick={() => navigate(`/umkm/${related.id}`)}
                              >
                                Lihat Detail
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center" style={{ color: COLORS.gray }}>Tidak ada UMKM sejenis</p>
                      )}
                    </div>
                  </Card.Body>
                </Card>
                
                {/* CTA Card */}
                <Card className="border-0 shadow-sm mt-4 bg-light">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-3" style={{ color: COLORS.brown }}>Ingin Mendaftarkan UMKM Anda?</h5>
                    <p style={{ color: COLORS.gray, fontSize: '0.95rem' }}>
                      Promosikan UMKM Anda di website resmi Desa Guyangan untuk meningkatkan jangkauan pasar.
                    </p>
                    <Button 
                      className="w-100"
                      style={{ 
                        backgroundColor: COLORS.orange, 
                        border: 'none',
                        fontWeight: 500 
                      }}
                    >
                      Daftar Sekarang
                    </Button>
                  </Card.Body>
                </Card>
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
        .umkm-content {
          font-size: 1.05rem;
          line-height: 1.8;
        }
        
        @media (min-width: 992px) {
          .sticky-sidebar {
            position: sticky;
            top: 100px;
          }
        }
        
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default DetailUmkm;