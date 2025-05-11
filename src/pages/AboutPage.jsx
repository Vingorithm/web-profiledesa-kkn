import React, { useState, useEffect } from 'react';
import NavbarComponent from '../components/Navbar';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { MapPin, Award, Users, Book, Phone, Mail, ExternalLink, Github, Linkedin } from 'lucide-react';
import dummyData from '../components/DummyData';

const COLORS = dummyData.colors;

const AboutPage = () => {
  const [villageData, setVillageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('tentang');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load the dummy data for now
        setVillageData(dummyData);
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
        <p className="mt-3" style={{ color: COLORS.brown, fontWeight: 500 }}>Memuat data Padukuhan Guyangan...</p>
      </div>
    );
  }

  // Developer info (just you)
  const developerInfo = {
    name: "Kevin Philips Tanamas",
    role: "Full Stack Developer",
    image: "/api/placeholder/300/300",
    email: "kevinkevin.kk92@gmail.com",
    github: "https://github.com/Vingorithm",
    linkedin: "https://linkedin.com/in/kevinphilipstanamas"
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: COLORS.cream }}>
      {/* Navbar Component */}
      <NavbarComponent 
        villageData={villageData} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />

      {/* Hero Section */}
      <section className="position-relative d-flex align-items-center" style={{ 
        backgroundImage: 'url(/api/placeholder/1920/500)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '400px'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
          background: 'linear-gradient(to right, rgba(76, 112, 49, 0.8), rgba(139, 94, 60, 0.7))'
        }}></div>
        <Container className="position-relative text-white">
          <div className="text-center mx-auto" style={{ maxWidth: '700px' }}>
            <h1 className="display-4 fw-bold mb-3">Tentang Padukuhan Guyangan</h1>
            <div className="accent-line mx-auto" style={{ width: '100px', height: '4px', backgroundColor: COLORS.gold, marginBottom: '20px' }}></div>
            <p className="lead">Mengenal lebih dekat dengan desa dan masyarakat kami di Gunung Kidul, Yogyakarta</p>
          </div>
        </Container>
      </section>

      {/* History & Overview Section */}
      <section className="py-5" style={{ backgroundColor: 'white' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="pe-lg-5">
              <div className="position-relative mb-4">
                <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Sejarah dan Gambaran Umum</h2>
                <div className="accent-line" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
              </div>
              <p className="lead" style={{ color: COLORS.brown }}>Padukuhan Guyangan telah berdiri sejak tahun 1645</p>
              <p style={{ color: COLORS.gray }}>
                Padukuhan Guyangan merupakan salah satu padukuhan yang terletak di Desa Kemiri, Kecamatan Tanjungsari, Kabupaten Gunung Kidul, Daerah Istimewa Yogyakarta. Wilayah ini dikelilingi oleh keindahan alam pegunungan karst yang khas dari Gunung Kidul.
              </p>
              <p style={{ color: COLORS.gray }}>
                Nama "Guyangan" berasal dari kata "guyang" yang dalam bahasa Jawa berarti mandi atau membersihkan diri. Konon, di masa lalu terdapat mata air di wilayah ini yang menjadi tempat penduduk setempat untuk mandi dan membersihkan diri.
              </p>
              <p style={{ color: COLORS.gray }}>
                Sejak dulu, masyarakat Padukuhan Guyangan hidup dari bertani dan berladang. Hingga saat ini, sebagian besar penduduk masih mengandalkan pertanian sebagai mata pencaharian utama, meskipun seiring perkembangan zaman banyak yang beralih ke sektor lain seperti perdagangan dan jasa.
              </p>
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
                  alt="Desa Guyangan Tempo Dulu" 
                  className="img-fluid rounded shadow-lg position-relative"
                  style={{ zIndex: 1, width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Village Features Section */}
      <section className="py-5" style={{ backgroundColor: COLORS.cream }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Keunggulan Padukuhan Kami</h2>
            <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
            <p className="mt-3" style={{ color: COLORS.gray }}>Beberapa hal yang membuat Padukuhan Guyangan istimewa</p>
          </div>
          
          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm hover-card text-center p-4">
                <div className="mx-auto mb-4 p-3 rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ 
                    backgroundColor: COLORS.green, 
                    width: '80px',
                    height: '80px'
                  }}
                >
                  <MapPin size={32} color="white" />
                </div>
                <Card.Body>
                  <h4 className="fw-bold mb-3" style={{ color: COLORS.brown }}>Lokasi Strategis</h4>
                  <Card.Text style={{ color: COLORS.gray }}>
                    Terletak di jalur wisata Gunung Kidul yang strategis, dekat dengan beberapa destinasi wisata populer.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm hover-card text-center p-4">
                <div className="mx-auto mb-4 p-3 rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ 
                    backgroundColor: COLORS.green, 
                    width: '80px',
                    height: '80px'
                  }}
                >
                  <Award size={32} color="white" />
                </div>
                <Card.Body>
                  <h4 className="fw-bold mb-3" style={{ color: COLORS.brown }}>Kearifan Lokal</h4>
                  <Card.Text style={{ color: COLORS.gray }}>
                    Budaya dan tradisi yang masih terjaga dengan baik, menjadi daya tarik bagi wisatawan dan peneliti.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm hover-card text-center p-4">
                <div className="mx-auto mb-4 p-3 rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ 
                    backgroundColor: COLORS.green, 
                    width: '80px',
                    height: '80px'
                  }}
                >
                  <Users size={32} color="white" />
                </div>
                <Card.Body>
                  <h4 className="fw-bold mb-3" style={{ color: COLORS.brown }}>Masyarakat Ramah</h4>
                  <Card.Text style={{ color: COLORS.gray }}>
                    Penduduk yang terkenal ramah dan selalu siap membantu, menciptakan suasana kekeluargaan yang kental.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm hover-card text-center p-4">
                <div className="mx-auto mb-4 p-3 rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ 
                    backgroundColor: COLORS.green, 
                    width: '80px',
                    height: '80px'
                  }}
                >
                  <Book size={32} color="white" />
                </div>
                <Card.Body>
                  <h4 className="fw-bold mb-3" style={{ color: COLORS.brown }}>Potensi Wisata</h4>
                  <Card.Text style={{ color: COLORS.gray }}>
                    Memiliki berbagai potensi wisata alam dan budaya yang terus dikembangkan untuk kesejahteraan warga.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Geographic Location */}
      <section className="py-5" style={{ backgroundColor: 'white' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="order-lg-2 ps-lg-5">
              <div className="position-relative mb-4">
                <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Lokasi Geografis</h2>
                <div className="accent-line" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
              </div>
              <p style={{ color: COLORS.gray }}>
                Padukuhan Guyangan terletak di Desa Kemiri, Kecamatan Tanjungsari, Kabupaten Gunung Kidul, Daerah Istimewa Yogyakarta. Secara geografis, wilayah ini berada di dataran tinggi karst Gunung Kidul dengan ketinggian sekitar 200-300 meter di atas permukaan laut.
              </p>
              <p style={{ color: COLORS.gray }}>
                Batas-batas wilayah Padukuhan Guyangan:
              </p>
              <ul style={{ color: COLORS.gray }}>
                <li>Sebelah Utara: Padukuhan Kemiri</li>
                <li>Sebelah Timur: Padukuhan Banaran</li>
                <li>Sebelah Selatan: Padukuhan Karangtengah</li>
                <li>Sebelah Barat: Padukuhan Rejosari</li>
              </ul>
              <p style={{ color: COLORS.gray }}>
                Dengan topografi berbukit, Padukuhan Guyangan memiliki pemandangan alam yang indah dan udara yang sejuk, menjadikannya tempat yang nyaman untuk ditinggali.
              </p>
            </Col>
            <Col lg={6} className="order-lg-1 mb-5 mb-lg-0">
              <div className="position-relative">
                <div className="bg-pattern position-absolute" style={{ 
                  width: '200px', 
                  height: '200px', 
                  backgroundColor: COLORS.gold, 
                  opacity: 0.1, 
                  borderRadius: '50%',
                  bottom: '-20px',
                  right: '-20px',
                  zIndex: 0
                }}></div>
                <img 
                  src="/api/placeholder/600/400" 
                  alt="Peta Guyangan" 
                  className="img-fluid rounded shadow-lg position-relative"
                  style={{ zIndex: 1, width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

        {/* Improved KKN Team Section */}
        <section className="py-5" style={{ 
            backgroundColor: COLORS.green,
            position: 'relative',
            overflow: 'hidden'
        }}>
        <div className="position-absolute top-0 end-0 opacity-10">
        </div>
        
        <Container className="position-relative">
            <div className="text-center mb-5 text-white">
            <h2 className="fw-bold mb-0">Tim KKN Padukuhan Guyangan</h2>
            <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px', marginBottom: '15px' }}></div>
            <p className="w-75 mx-auto">Mahasiswa-mahasiswa yang berpartisipasi dalam program Kuliah Kerja Nyata di Padukuhan Guyangan</p>
            </div>
            
            <Row className="justify-content-center">
            <Col lg={10}>
                <Card className="border-0 shadow-lg rounded-lg overflow-hidden">
                <Row className="g-0">
                    <Col md={6}>
                    <img 
                        src="/api/placeholder/800/500"
                        alt="Tim KKN Padukuhan Guyangan"
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                    />
                    </Col>
                    <Col md={6}>
                    <Card.Body className="p-4 p-lg-5">
                        <div className="d-flex align-items-center mb-4">
                        <div style={{ 
                            width: '50px', 
                            height: '5px', 
                            backgroundColor: COLORS.gold,
                            marginRight: '15px'
                        }}></div>
                        <h5 className="text-uppercase fw-bold m-0" style={{ color: COLORS.brown, letterSpacing: '1px' }}>KKN 87 UAJY 2025</h5>
                        </div>
                        
                        <h3 className="fw-bold mb-3" style={{ color: COLORS.brown }}>Mahasiswa KKN Kelompok 46</h3>
                        <p className="mb-4" style={{ color: COLORS.gray }}>
                        Tim KKN kami terdiri dari 10 mahasiswa dari berbagai fakultas yang berdedikasi untuk mengembangkan 
                        program-program pemberdayaan masyarakat di Padukuhan Guyangan.
                        </p>
                        
                        <div className="d-flex flex-wrap gap-2 mb-4">
                        <span className="badge rounded-pill" style={{ backgroundColor: COLORS.green, color: 'white', padding: '8px 15px' }}>Program Kesehatan</span>
                        <span className="badge rounded-pill" style={{ backgroundColor: COLORS.green, color: 'white', padding: '8px 15px' }}>Pendidikan</span>
                        <span className="badge rounded-pill" style={{ backgroundColor: COLORS.green, color: 'white', padding: '8px 15px' }}>Pemberdayaan Ekonomi dan UMKM</span>
                        </div>
                    </Card.Body>
                    </Col>
                </Row>
                </Card>
            </Col>
            </Row>
        </Container>
        </section>

      {/* Improved Developer Section */}
        <section className="py-5" style={{ backgroundColor: COLORS.cream, position: 'relative', overflow: 'hidden' }}>
        <div className="position-absolute bottom-0 start-0 opacity-5">
        </div>

        <Container className="position-relative">
            <div className="text-center mb-5">
            <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Pengembang Website</h2>
            <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px', marginBottom: '15px' }}></div>
            </div>
            
            <Row className="justify-content-center">
            <Col md={8} lg={7}>
                <Card className="border-0 shadow-lg rounded-lg overflow-hidden">
                <Row className="g-0">
                    <Col md={5} className="position-relative">
                    <img 
                        src={developerInfo.image} 
                        alt={developerInfo.name}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 start-0 end-0 p-3" style={{ 
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                    }}>
                        <div className="d-flex justify-content-center gap-3">
                        <a href={developerInfo.github} target="_blank" rel="noopener noreferrer" 
                            className="btn btn-sm rounded-circle" 
                            style={{ 
                            backgroundColor: 'rgba(255,255,255,0.2)', 
                            width: '40px', 
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                            }}
                        >
                            <Github size={18} color="white" />
                        </a>
                        <a href={developerInfo.linkedin} target="_blank" rel="noopener noreferrer" 
                            className="btn btn-sm rounded-circle" 
                            style={{ 
                            backgroundColor: 'rgba(255,255,255,0.2)', 
                            width: '40px', 
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                            }}
                        >
                            <Linkedin size={18} color="white" />
                        </a>
                        </div>
                    </div>
                    </Col>
                    <Col md={7}>
                    <Card.Body className="p-4">
                        <div className="d-flex align-items-center mb-3">
                        <div style={{ 
                            width: '40px', 
                            height: '4px', 
                            backgroundColor: COLORS.gold,
                            marginRight: '12px'
                        }}></div>
                        <h6 className="text-uppercase fw-bold m-0" style={{ color: COLORS.green, letterSpacing: '1px', fontSize: '0.85rem' }}>Developer</h6>
                        </div>
                        
                        <h4 className="fw-bold mb-1" style={{ color: COLORS.brown }}>{developerInfo.name}</h4>
                        <p className="mb-3" style={{ color: COLORS.green, fontWeight: 500, fontSize: '0.9rem' }}>{developerInfo.role}</p>
                        
                        <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.1)', margin: '15px 0' }}></div>
                        
                        <p className="mb-3" style={{ color: COLORS.gray }}>
                        Website ini dikembangkan sebagai bagian dari program KKN untuk membantu memperkenalkan 
                        Padukuhan Guyangan dan mempromosikan potensi wisata dan budayanya.
                        </p>
                        
                        <div className="d-flex align-items-center mb-2">
                        <div className="me-3 p-2 rounded-circle" style={{ backgroundColor: 'rgba(76, 112, 49, 0.1)' }}>
                            <Mail size={16} style={{ color: COLORS.green }} />
                        </div>
                        <a href={`mailto:${developerInfo.email}`} style={{ color: COLORS.gray, textDecoration: 'none', fontSize: '0.9rem' }}>
                            {developerInfo.email}
                        </a>
                        </div>
                    </Card.Body>
                    </Col>
                </Row>
                </Card>
            </Col>
            </Row>
        </Container>
        </section>
        
      {/* Contact Information */}
      <section className="py-5" style={{ backgroundColor: 'white' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="fw-bold mb-3" style={{ color: COLORS.brown }}>Kontak Kami</h2>
              <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginBottom: '20px' }}></div>
              <p style={{ color: COLORS.gray }}>
                Untuk informasi lebih lanjut tentang Padukuhan Guyangan atau jika Anda memiliki pertanyaan,
                jangan ragu untuk menghubungi kami melalui kontak di bawah ini:
              </p>
              
              <div className="d-flex justify-content-center flex-wrap gap-4 mt-4">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle me-3 d-flex align-items-center justify-content-center" 
                    style={{ 
                      backgroundColor: COLORS.green, 
                      width: '50px',
                      height: '50px'
                    }}
                  >
                    <MapPin size={20} color="white" />
                  </div>
                  <div className="text-start">
                    <p className="mb-0 fw-bold" style={{ color: COLORS.brown }}>Kemiri, Tanjungsari, Gunung Kidul</p>
                    <p className="mb-0" style={{ color: COLORS.gray }}>Yogyakarta 55881</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle me-3 d-flex align-items-center justify-content-center" 
                    style={{ 
                      backgroundColor: COLORS.green, 
                      width: '50px',
                      height: '50px'
                    }}
                  >
                    <Phone size={20} color="white" />
                  </div>
                  <div className="text-start">
                    <p className="mb-0 fw-bold" style={{ color: COLORS.brown }}>+62 274 123456</p>
                    <p className="mb-0" style={{ color: COLORS.gray }}>Senin - Jumat, 08:00 - 16:00</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle me-3 d-flex align-items-center justify-content-center" 
                    style={{ 
                      backgroundColor: COLORS.green, 
                      width: '50px',
                      height: '50px'
                    }}
                  >
                    <Mail size={20} color="white" />
                  </div>
                  <div className="text-start">
                    <p className="mb-0 fw-bold" style={{ color: COLORS.brown }}>info@guyangan.desa.id</p>
                    <p className="mb-0" style={{ color: COLORS.gray }}>Hubungi kami kapan saja</p>
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
      `}</style>
    </div>
  );
};

export default AboutPage;