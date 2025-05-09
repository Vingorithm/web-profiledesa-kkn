import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { Search, Calendar, Tag, ArrowRight } from 'lucide-react';
import { getSemuaArtikel } from '../service';
import { useNavigate } from 'react-router-dom';
import dummyData from '../components/DummyData';
import NavbarComponent from '../components/Navbar';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeroImage from '../assets/images/artikel-hero.jpg';

const COLORS = dummyData.colors;

const ListArtikelPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [villageData, setVillageData] = useState(null);
  const [activeSection, setActiveSection] = useState('artikel');
  
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
            summary: article.text?.substring(0, 150) + "..." || "Konten tidak tersedia",
            content: article.text || "",
            image: article.gambar || "/api/placeholder/400/300",
            link: article.link || "#"
          };
        });
        
        // Sort by date (newest first) - assuming createdAt is available
        formattedArticles.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return 0;
        });
        
        // Extract unique categories
        const uniqueCategories = [...new Set(formattedArticles.map(article => article.category))];
        
        setArticles(formattedArticles);
        setFilteredArticles(formattedArticles);
        setCategories(uniqueCategories);
        
        // Load village data
        setVillageData({
          ...dummyData,
          articles: formattedArticles
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setVillageData(dummyData);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter articles based on search term and category
  useEffect(() => {
    const filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           article.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredArticles(filtered);
  }, [searchTerm, selectedCategory, articles]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border" style={{ color: COLORS.gold }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: COLORS.brown, fontWeight: 500 }}>Memuat artikel Desa Guyangan...</p>
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

      {/* Hero Section */}
      <section className="bg-image position-relative py-5" style={{ 
        backgroundImage: `url(${HeroImage})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        height: '300px'
      }}>
        <div className="overlay position-absolute w-100 h-100" 
          style={{ 
            background: 'linear-gradient(to right, rgba(76, 112, 49, 0.8), rgba(139, 94, 60, 0.7))', 
            top: 0,
            left: 0,
            zIndex: 1 
          }}>
        </div>
        <Container className="h-100 d-flex align-items-center position-relative" style={{ zIndex: 2 }}>
          <div className="text-white">
            <h1 className="display-4 fw-bold mb-3">Event & Artikel</h1>
            <div className="accent-line" style={{ width: '100px', height: '4px', backgroundColor: COLORS.gold, marginBottom: '15px' }}></div>
            <p className="lead">Berita dan kegiatan terbaru dari Desa Guyangan</p>
          </div>
        </Container>
      </section>

      {/* Filter Section */}
      <section className="py-4 shadow-sm" style={{ backgroundColor: 'white' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6} lg={8}>
              <InputGroup className="mb-3 mb-md-0">
                <InputGroup.Text style={{ backgroundColor: 'white', borderRight: 'none' }}>
                  <Search size={18} color={COLORS.gray} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Cari artikel..."
                  style={{ borderLeft: 'none', boxShadow: 'none' }}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </Col>
            <Col md={6} lg={4}>
              <InputGroup>
                <InputGroup.Text style={{ backgroundColor: 'white', borderRight: 'none' }}>
                  <Tag size={18} color={COLORS.gray} />
                </InputGroup.Text>
                <Form.Select 
                  value={selectedCategory} 
                  onChange={handleCategoryChange}
                  style={{ borderLeft: 'none', boxShadow: 'none' }}
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Articles List Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8}>
              {filteredArticles.length > 0 ? (
                <>
                  <p className="text-muted mb-4">Menampilkan {filteredArticles.length} artikel{selectedCategory ? ` dalam kategori "${selectedCategory}"` : ''}</p>
                  
                  {filteredArticles.map((article, index) => (
                    <Card key={article.id} className="mb-4 shadow-sm border-0 article-card">
                      <Row className="g-0">
                        <Col md={4}>
                          <div className="position-relative h-100">
                            <Card.Img 
                              src={article.image} 
                              alt={article.title}
                              className="h-100 w-100" 
                              style={{ objectFit: 'cover', borderTopLeftRadius: '0.375rem', borderBottomLeftRadius: '0.375rem' }}
                            />
                            <Badge 
                              className="position-absolute" 
                              style={{ 
                                top: '15px', 
                                left: '15px', 
                                backgroundColor: COLORS.orange,
                                padding: '8px 15px',
                                fontWeight: 500
                              }}
                            >
                              {article.category}
                            </Badge>
                          </div>
                        </Col>
                        <Col md={8}>
                          <Card.Body className="d-flex flex-column h-100">
                            <div className="d-flex align-items-center mb-2">
                              <Calendar size={16} className="me-2" style={{ color: COLORS.gray }} />
                              <small style={{ color: COLORS.gray }}>{article.date}</small>
                            </div>
                            <Card.Title className="fw-bold" style={{ color: COLORS.brown }}>{article.title}</Card.Title>
                            <Card.Text style={{ color: COLORS.gray }}>{article.summary}</Card.Text>
                            <div className="mt-auto">
                              <Button 
                                variant="link" 
                                className="p-0 d-flex align-items-center" 
                                style={{ color: COLORS.green, textDecoration: 'none', fontWeight: 500 }}
                                onClick={() => navigate(`/artikel/${article.id}`)}
                              >
                                Baca Selengkapnya 
                                <ArrowRight size={16} className="ms-1" />
                              </Button>
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              ) : (
                <div className="text-center py-5 my-5">
                  <div style={{ color: COLORS.gray, fontSize: '4rem', opacity: 0.2 }}>🔍</div>
                  <h3 className="mt-3" style={{ color: COLORS.brown }}>Tidak Ada Artikel Ditemukan</h3>
                  <p style={{ color: COLORS.gray }}>
                    {searchTerm && selectedCategory ? 
                      `Tidak ada artikel dengan kata kunci "${searchTerm}" dalam kategori "${selectedCategory}"` :
                      searchTerm ? 
                        `Tidak ada artikel dengan kata kunci "${searchTerm}"` :
                        selectedCategory ? 
                          `Tidak ada artikel dalam kategori "${selectedCategory}"` :
                          'Belum ada artikel tersedia saat ini.'
                    }
                  </p>
                  {(searchTerm || selectedCategory) && (
                    <Button 
                      variant="outline" 
                      onClick={() => {setSearchTerm(''); setSelectedCategory('');}}
                      style={{ borderColor: COLORS.green, color: COLORS.green }}
                    >
                      Reset Pencarian
                    </Button>
                  )}
                </div>
              )}
            </Col>
            
            <Col lg={4}>
              {/* Categories Sidebar */}
              <div className="bg-white rounded shadow-sm p-4 mb-4">
                <h4 className="fw-bold mb-3" style={{ color: COLORS.brown }}>Kategori</h4>
                <div className="accent-line" style={{ width: '60px', height: '3px', backgroundColor: COLORS.gold, marginBottom: '20px' }}></div>
                
                <div className="list-group list-group-flush">
                  <Button 
                    variant="link" 
                    className={`list-group-item list-group-item-action border-0 mb-2 d-flex justify-content-between align-items-center ${selectedCategory === '' ? 'active-category' : ''}`}
                    style={{ 
                      color: selectedCategory === '' ? COLORS.green : COLORS.gray, 
                      fontWeight: selectedCategory === '' ? '600' : 'normal',
                      textDecoration: 'none',
                      padding: '10px 15px',
                      borderRadius: '5px',
                      backgroundColor: selectedCategory === '' ? `${COLORS.cream}` : 'transparent'
                    }}
                    onClick={() => setSelectedCategory('')}
                  >
                    Semua Kategori
                    <Badge 
                      pill 
                      bg="light" 
                      style={{ 
                        color: COLORS.green, 
                        fontWeight: 'normal',
                      }}
                    >
                      {articles.length}
                    </Badge>
                  </Button>
                  
                  {categories.map((category, index) => (
                    <Button 
                      key={index}
                      variant="link" 
                      className={`list-group-item list-group-item-action border-0 mb-2 d-flex justify-content-between align-items-center ${selectedCategory === category ? 'active-category' : ''}`}
                      style={{ 
                        color: selectedCategory === category ? COLORS.green : COLORS.gray, 
                        fontWeight: selectedCategory === category ? '600' : 'normal',
                        textDecoration: 'none',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        backgroundColor: selectedCategory === category ? `${COLORS.cream}` : 'transparent'
                      }}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                      <Badge 
                        pill 
                        bg="light" 
                        style={{ 
                          color: COLORS.green, 
                          fontWeight: 'normal',
                        }}
                      >
                        {articles.filter(article => article.category === category).length}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Recent Articles */}
              <div className="bg-white rounded shadow-sm p-4 mb-4">
                <h4 className="fw-bold mb-3" style={{ color: COLORS.brown }}>Artikel Terbaru</h4>
                <div className="accent-line" style={{ width: '60px', height: '3px', backgroundColor: COLORS.gold, marginBottom: '20px' }}></div>
                
                {articles.slice(0, 4).map((article, index) => (
                  <div key={index} className={`d-flex mb-3 ${index < articles.slice(0, 4).length - 1 ? 'border-bottom pb-3' : ''}`}>
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="rounded me-3" 
                      style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-1">
                        <Button 
                          variant="link" 
                          className="p-0 text-decoration-none" 
                          style={{ color: COLORS.brown, fontWeight: '600' }}
                          onClick={() => navigate(`/artikel/${article.id}`)}
                        >
                          {article.title.length > 50 ? article.title.substring(0, 50) + '...' : article.title}
                        </Button>
                      </h6>
                      <small style={{ color: COLORS.gray }}>{article.date}</small>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* CTA Banner */}
              <div 
                className="rounded shadow-sm p-4 text-white position-relative"
                style={{ 
                  background: `linear-gradient(rgba(76, 112, 49, 0.85), rgba(76, 112, 49, 0.85)), url(/api/placeholder/400/300)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <h4 className="fw-bold mb-3">Bagikan Cerita Anda</h4>
                <p className="mb-4">Punya berita atau cerita menarik tentang Desa Guyangan? Bagikan dengan kami!</p>
                <Button 
                  style={{ 
                    backgroundColor: COLORS.gold, 
                    border: 'none',
                    padding: '10px 20px',
                    fontWeight: '500'
                  }}
                >
                  Hubungi Kami
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Component */}
      <Footer villageData={villageData} />

      {/* Custom CSS */}
      <style jsx>{`
        .article-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .article-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .active-category {
          font-weight: 600;
          color: ${COLORS.green};
        }
      `}</style>
    </div>
  );
};

export default ListArtikelPage;