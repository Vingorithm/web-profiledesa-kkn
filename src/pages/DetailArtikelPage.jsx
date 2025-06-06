import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Row, Col, Badge, Button, Breadcrumb, Card } from 'react-bootstrap';
import { ArrowLeft, Calendar, User, Tag, Clock, Share2, Copy, Facebook, Twitter, Instagram, ThumbsUp, Check } from 'lucide-react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import DummyData from '../components/DummyData';

const COLORS = {
  gold: '#D4AF37',
  green: '#4C7031',
  brown: '#8B5E3C',
  orange: '#F2994A',
  cream: '#F6F1E9',
  gray: '#A9A9A9'
};

const DetailArtikelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [villageData, setVillageData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    const fetchArticleDetail = async () => {
      try {
        // Fetch the specific article data from Firebase
        const articleRef = doc(db, "artikel", id);
        const articleSnap = await getDoc(articleRef);
        
        if (articleSnap.exists()) {
          const articleData = {
            id: articleSnap.id,
            ...articleSnap.data()
          };
          
          // Format the date
          let formattedDate = "Tanggal tidak tersedia";
          if (articleData.createdAt) {
            const date = articleData.createdAt.toDate ? articleData.createdAt.toDate() : new Date(articleData.createdAt);
            formattedDate = date.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });
            
            // Also add time
            const formattedTime = date.toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            });
            
            articleData.formattedDate = formattedDate;
            articleData.formattedTime = formattedTime;
          }
          
          setArticle(articleData);
          
          // For now, just using dummy data for the village info and related articles
          setVillageData(DummyData);
          
          // Get related articles (same category, excluding current)
          const category = articleData.kategori || "Umum";
          const dummyRelated = dummyData.articles.filter(a => 
            a.category === category && a.id !== articleData.id
          ).slice(0, 3);
          
          setRelatedArticles(dummyRelated);
        } else {
          console.error("Artikel tidak ditemukan!");
          // Redirect to 404 or homepage
          navigate('/');
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching article:", error);
        setLoading(false);
      }
    };
    
    fetchArticleDetail();
  }, [id, navigate]);

  // Function to get current article URL
  const getCurrentUrl = () => {
    return window.location.href;
  };

  // Function to handle Facebook share
  const handleFacebookShare = () => {
    const url = getCurrentUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  // Function to handle Twitter share
  const handleTwitterShare = () => {
    const url = getCurrentUrl();
    const text = `${article.judul} - Desa Guyangan`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  // Function to handle Instagram share (opens Instagram web)
  const handleInstagramShare = () => {
    // Instagram doesn't have direct URL sharing, so we'll open Instagram web
    const instagramUrl = 'https://www.instagram.com/';
    window.open(instagramUrl, '_blank');
  };

  // Function to copy link to clipboard
  const handleCopyLink = async () => {
    try {
      const url = getCurrentUrl();
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy link: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getCurrentUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border" style={{ color: COLORS.gold }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: COLORS.brown, fontWeight: 500 }}>Memuat artikel...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <Container className="text-center my-5 py-5">
        <h3 style={{ color: COLORS.brown }}>Artikel tidak ditemukan</h3>
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
    if (!text) return <p>Konten tidak tersedia</p>;
    
    return text.split('\n').map((paragraph, index) => (
      paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
    ));
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: COLORS.cream }}>
      {/* Navbar Component */}
      <NavbarComponent 
        villageData={villageData} 
        activeSection="artikel" 
      />

      {/* Hero Section */}
      <section className="position-relative">
        <div 
          className="article-hero"
          style={{
            backgroundImage: `url(${article.gambar || "/api/placeholder/1200/600"})`,
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
                {article.kategori || "Umum"}
              </Badge>
              <h1 className="mt-3 display-4 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                {article.judul}
              </h1>
              <div className="d-flex flex-wrap gap-4 mt-3">
                <div className="d-flex align-items-center">
                  <Calendar size={18} className="me-2" />
                  {article.formattedDate || "Tanggal tidak tersedia"}
                </div>
                <div className="d-flex align-items-center">
                  <Clock size={18} className="me-2" />
                  {article.formattedTime || "Waktu tidak tersedia"}
                </div>
                <div className="d-flex align-items-center">
                  <User size={18} className="me-2" />
                  Admin Desa
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
          <Breadcrumb.Item href="/#artikel" style={{ color: COLORS.brown }}>Artikel</Breadcrumb.Item>
          <Breadcrumb.Item active style={{ color: COLORS.green }}>{article.judul}</Breadcrumb.Item>
        </Breadcrumb>
      </Container>

      {/* Article Content */}
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
                
                {/* Article Content */}
                <div className="article-content">
                  <div style={{ color: COLORS.gray, lineHeight: 1.8 }}>
                    {formatTextWithParagraphs(article.text)}
                  </div>
                  
                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="mt-5">
                      <div className="d-flex align-items-center gap-2">
                        <Tag size={18} style={{ color: COLORS.brown }} />
                        <span style={{ color: COLORS.brown, fontWeight: 500 }}>Tags:</span>
                      </div>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {article.tags.map((tag, index) => (
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
                            onClick={handleFacebookShare}
                            title="Bagikan ke Facebook"
                          >
                            <Facebook size={20} />
                          </Button>
                          <Button 
                            variant="link" 
                            className="p-0" 
                            style={{ color: '#1DA1F2' }}
                            onClick={handleTwitterShare}
                            title="Bagikan ke Twitter"
                          >
                            <Twitter size={20} />
                          </Button>
                          <Button 
                            variant="link" 
                            className="p-0" 
                            style={{ color: '#E1306C' }}
                            onClick={handleInstagramShare}
                            title="Buka Instagram"
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
                            color: copied ? COLORS.green : COLORS.gray
                          }}
                          onClick={handleCopyLink}
                          title="Salin link artikel"
                        >
                          {copied ? <Check size={16} className="me-1" /> : <Copy size={16} className="me-1" />}
                          {copied ? 'Tersalin!' : 'Salin Link'}
                        </Button>
                        <Button 
                          className="d-flex align-items-center" 
                          size="sm"
                          style={{ 
                            backgroundColor: COLORS.green, 
                            border: 'none' 
                          }}
                        >
                          <ThumbsUp size={16} className="me-1" />
                          Suka
                        </Button>
                      </div>
                    </div>
                  </div>
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
                    <h5 className="fw-bold mb-3" style={{ color: COLORS.brown }}>Kategori</h5>
                    <div className="d-flex flex-column gap-2">
                      {['Budaya', 'Ekonomi', 'Infrastruktur', 'Pendidikan', 'Kesehatan'].map((category, index) => (
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
                
                {/* Related Articles */}
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="fw-bold mb-3" style={{ color: COLORS.brown }}>Artikel Terkait</h5>
                    <div className="d-flex flex-column gap-3">
                      {relatedArticles.length > 0 ? (
                        relatedArticles.map((related) => (
                          <div key={related.id} className="d-flex gap-3">
                            <img 
                              src={related.image || "/api/placeholder/80/80"} 
                              alt={related.title}
                              style={{ 
                                width: '80px', 
                                height: '80px', 
                                objectFit: 'cover',
                                borderRadius: '0.375rem'
                              }}
                            />
                            <div>
                              <small style={{ color: COLORS.gray }}>{related.date}</small>
                              <h6 style={{ color: COLORS.brown, fontWeight: 600, marginBottom: '0.2rem' }}>
                                {related.title}
                              </h6>
                              <Button 
                                variant="link" 
                                className="p-0" 
                                style={{ color: COLORS.green, textDecoration: 'none', fontSize: '0.85rem' }}
                                onClick={() => navigate(`/artikel/${related.id}`)}
                              >
                                Baca Artikel
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center" style={{ color: COLORS.gray }}>Tidak ada artikel terkait</p>
                      )}
                    </div>
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
        .article-content {
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

export default DetailArtikelPage;