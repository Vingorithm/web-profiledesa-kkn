import React, { useState, useEffect } from 'react';
import NavbarComponent from '../components/Navbar';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { MapPin, Award, Users, Book, Phone, Mail, ExternalLink, Github, Linkedin, TreePine, Home, Heart, Star, Droplets, Mountain, Sun } from 'lucide-react';
import TimKKNImage from '../assets/images/kkn_tentang_kami.jpg';
import dummyData from '../components/DummyData';
import DevImage from '../assets/images/dev1.jpg';

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
    image: DevImage,
    email: "kevinkevin.kk92@gmail.com",
    github: "https://github.com/Vingorithm",
    linkedin: "https://linkedin.com/in/kevinphilipstanamas"
  };

  // Village statistics data
  const villageStats = [
    { number: "1,245", label: "Jumlah Penduduk", icon: Users },
    { number: "312", label: "Kepala Keluarga", icon: Home },
    { number: "95%", label: "Tingkat Literasi", icon: Book },
    { number: "15", label: "UMKM Aktif", icon: Star }
  ];

  // Natural attractions data
  const naturalAttractions = [
    {
      name: "Gua Kubon",
      description: "Gua alami dengan stalaktit dan stalagmit yang menawan, menjadi destinasi wisata alam utama.",
      icon: Mountain,
      image: "/api/placeholder/400/250"
    },
    {
      name: "Pantai Baron",
      description: "Sumber mata air alami yang jernih, tempat asal nama Padukuhan Guyangan.",
      icon: Droplets,
      image: "/api/placeholder/400/250"
    },
    {
      name: "Green Village Gedangsari",
      description: "Destinasi wisata dengan pemandangan perbukitan hijau dan spot foto menarik. Tempat yang tepat untuk menikmati alam dan berfoto ria.",
      icon: Sun,
      image: "/api/placeholder/400/250"
    }
  ];

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
      <section className="py-5" style={{ backgroundColor: COLORS.cream }}>
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
                  style={{ zIndex: 1, width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '15px' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Village Features Section */}
      <section className="py-5" style={{ backgroundColor: 'white' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Keunggulan Padukuhan Kami</h2>
            <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
            <p className="mt-3" style={{ color: COLORS.gray }}>Beberapa hal yang membuat Padukuhan Guyangan istimewa</p>
          </div>
          
          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm hover-card text-center p-4" style={{ borderRadius: '15px' }}>
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
              <Card className="h-100 border-0 shadow-sm hover-card text-center p-4" style={{ borderRadius: '15px' }}>
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
              <Card className="h-100 border-0 shadow-sm hover-card text-center p-4" style={{ borderRadius: '15px' }}>
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
              <Card className="h-100 border-0 shadow-sm hover-card text-center p-4" style={{ borderRadius: '15px' }}>
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

      {/* Natural Attractions Section */}
      <section className="py-5" style={{ backgroundColor: COLORS.cream }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Wisata Alam Sekitar Padukuhan Guyangan</h2>
            <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
            <p className="mt-3" style={{ color: COLORS.gray }}>Destinasi wisata alam yang mempesona di sekitar Padukuhan Guyangan</p>
          </div>
          
          <Row className="g-4">
            {naturalAttractions.map((attraction, index) => (
              <Col md={6} lg={4} key={index}>
                <Card className="h-100 border-0 shadow-sm hover-card overflow-hidden" style={{ borderRadius: '15px' }}>
                  <div className="position-relative" style={{ height: '200px' }}>
                    <img 
                      src={attraction.image} 
                      alt={attraction.name}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-3 start-3">
                      <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                        <attraction.icon size={20} color={COLORS.green} />
                      </div>
                    </div>
                  </div>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-3" style={{ color: COLORS.brown }}>{attraction.name}</h5>
                    <p className="mb-0" style={{ color: COLORS.gray }}>{attraction.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
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
                  style={{ zIndex: 1, width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '15px' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Culture & Traditions Section */}
      <section className="py-5" style={{ backgroundColor: COLORS.cream }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Budaya dan Tradisi</h2>
            <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px' }}></div>
            <p className="mt-3" style={{ color: COLORS.gray }}>Kearifan lokal yang masih terjaga hingga saat ini</p>
          </div>
          
          <Row className="g-4">
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100 p-4" style={{ borderRadius: '15px' }}>
                <div className="d-flex align-items-start">
                  <div className="me-3 p-3 rounded-circle flex-shrink-0" style={{ backgroundColor: `${COLORS.green}15` }}>
                    <Heart size={24} color={COLORS.green} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2" style={{ color: COLORS.brown }}>Gotong Royong</h5>
                    <p className="mb-0" style={{ color: COLORS.gray }}>
                      Tradisi gotong royong masih sangat kental dalam kehidupan sehari-hari masyarakat, terutama dalam kegiatan pembangunan dan acara-acara desa.
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100 p-4" style={{ borderRadius: '15px' }}>
                <div className="d-flex align-items-start">
                  <div className="me-3 p-3 rounded-circle flex-shrink-0" style={{ backgroundColor: `${COLORS.green}15` }}>
                    <TreePine size={24} color={COLORS.green} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2" style={{ color: COLORS.brown }}>Upacara Adat</h5>
                    <p className="mb-0" style={{ color: COLORS.gray }}>
                      Berbagai upacara adat seperti Slametan Desa dan ritual syukur hasil panen masih rutin dilaksanakan sebagai bentuk rasa syukur kepada Tuhan.
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100 p-4" style={{ borderRadius: '15px' }}>
                <div className="d-flex align-items-start">
                  <div className="me-3 p-3 rounded-circle flex-shrink-0" style={{ backgroundColor: `${COLORS.green}15` }}>
                    <Users size={24} color={COLORS.green} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2" style={{ color: COLORS.brown }}>Kesenian Lokal</h5>
                    <p className="mb-0" style={{ color: COLORS.gray }}>
                      Karawitan dan tari tradisional Jawa masih dilestarikan oleh generasi muda melalui sanggar seni yang aktif di desa.
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100 p-4" style={{ borderRadius: '15px' }}>
                <div className="d-flex align-items-start">
                  <div className="me-3 p-3 rounded-circle flex-shrink-0" style={{ backgroundColor: `${COLORS.green}15` }}>
                    <Book size={24} color={COLORS.green} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2" style={{ color: COLORS.brown }}>Bahasa Jawa</h5>
                    <p className="mb-0" style={{ color: COLORS.gray }}>
                      Penggunaan bahasa Jawa Krama masih sangat dihormati dalam pergaulan sehari-hari, terutama dalam berinteraksi dengan orang yang lebih tua.
                    </p>
                  </div>
                </div>
              </Card>
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
              <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                <Row className="g-0 align-items-center">
                  <Col md={6}>
                    <div style={{ height: '400px', overflow: 'hidden' }}>
                      <img 
                        src={TimKKNImage}
                        alt="Tim KKN Padukuhan Guyangan"
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
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
                        <span className="badge rounded-pill" style={{ backgroundColor: COLORS.green, color: 'white', padding: '8px 15px' }}>Pemberdayaan Ekonomi</span>
                        <span className="badge rounded-pill" style={{ backgroundColor: COLORS.green, color: 'white', padding: '8px 15px' }}>UMKM</span>
                      </div>
                      
                      <div className="d-flex align-items-center" style={{ color: COLORS.gray }}>
                        <Users size={16} className="me-2" />
                        <small>10 Mahasiswa • 5 Fakultas • 1 Misi Bersama</small>
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
      <section className="py-5" style={{ backgroundColor: 'white', position: 'relative', overflow: 'hidden' }}>
        <div className="position-absolute bottom-0 start-0 opacity-5">
        </div>

        <Container className="position-relative">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Pengembang Website</h2>
            <div className="accent-line mx-auto" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '15px', marginBottom: '15px' }}></div>
          </div>
          
          <Row className="justify-content-center">
            <Col md={8} lg={7}>
              <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                <Row className="g-0">
                  <Col md={5} className="position-relative">
                    <div style={{ height: '350px', overflow: 'hidden' }}>
                      <img 
                        src={developerInfo.image} 
                        alt={developerInfo.name}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
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
                    <Card.Body className="p-4 d-flex flex-column justify-content-center" style={{ height: '350px' }}>
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
          box-shadow: 0 15px 30px rgba(0,0,0,0.15) !important;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .badge {
          transition: all 0.3s ease;
        }
        
        .badge:hover {
          transform: scale(1.05);
        }
        
        .btn {
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default AboutPage;