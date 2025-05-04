import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Spinner, Alert, Image as BootstrapImage } from 'react-bootstrap';
import { Plus, Edit, Trash2, Image, FileText, Link as LinkIcon, Tag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';
import Footer from '../components/Footer';
import { getSemuaArtikel, tambahArtikel, editArtikel, hapusArtikel } from '../service';
import 'bootstrap/dist/css/bootstrap.min.css';

const COLORS = {
  gold: '#D4AF37',
  green: '#4C7031',
  brown: '#8B5E3C',
  orange: '#F2994A',
  cream: '#F6F1E9',
  gray: '#A9A9A9'
};

const ManageArtikel = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [villageData, setVillageData] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // Image preview states
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    gambar: '',
    judul: '',
    text: '',
    link: '',
    kategori: ''
  });
  
  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    } else {
      // Dummy village data for Navbar and Footer
      setVillageData({
        villageName: 'Desa Guyangan',
        villageSlogan: 'Bersatu Membangun Desa',
        villageInfo: {
          address: 'Jl. Raya Guyangan, Gunung Kidul',
          phone: '(0274) 123456',
          email: 'info@desaguyangan.id',
          officeHours: 'Senin - Jumat, 08.00 - 16.00 WIB'
        },
        footerDescription: 'Desa Guyangan adalah desa yang kaya akan budaya dan tradisi. Kami berkomitmen untuk memajukan kesejahteraan warga melalui pembangunan berkelanjutan.'
      });
      
      // Load articles
      fetchArticles();
    }
  }, [navigate]);

  // Update image preview when form gambar URL changes
  useEffect(() => {
    if (formData.gambar) {
      setImagePreview(formData.gambar);
      setImageError(false);
    } else {
      setImagePreview('');
    }
  }, [formData.gambar]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getSemuaArtikel();
      setArticles(data);
    } catch (err) {
      setError('Gagal mengambil data artikel');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      gambar: '',
      judul: '',
      text: '',
      link: '',
      kategori: ''
    });
    setImagePreview('');
    setImageError(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleAddArticle = () => {
    setModalMode('add');
    resetForm();
    setShowModal(true);
  };

  const handleEditArticle = (article) => {
    setModalMode('edit');
    setSelectedArticle(article);
    setFormData({
      gambar: article.gambar || '',
      judul: article.judul || '',
      text: article.text || '',
      link: article.link || '',
      kategori: article.kategori || ''
    });
    setImagePreview(article.gambar || '');
    setImageError(false);
    setShowModal(true);
  };

  const confirmDeleteArticle = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    
    setProcessing(true);
    try {
      await hapusArtikel(articleToDelete.id);
      setSuccess('Artikel berhasil dihapus');
      fetchArticles();
    } catch (err) {
      setError('Gagal menghapus artikel');
      console.error(err);
    } finally {
      setProcessing(false);
      setShowDeleteModal(false);
      setArticleToDelete(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleTestImageUrl = () => {
    if (formData.gambar) {
      const img = new Image();
      img.onload = () => {
        setImageError(false);
      };
      img.onerror = () => {
        setImageError(true);
      };
      img.src = formData.gambar;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');
    
    try {
      if (modalMode === 'add') {
        await tambahArtikel(formData.gambar, formData.judul, formData.text, formData.link, formData.kategori);
        setSuccess('Artikel berhasil ditambahkan');
      } else {
        await editArtikel(selectedArticle.id, formData);
        setSuccess('Artikel berhasil diperbarui');
      }
      
      handleModalClose();
      fetchArticles();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(modalMode === 'add' ? 'Gagal menambahkan artikel' : 'Gagal memperbarui artikel');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  // Format date string for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Truncate long text for table display
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Calculate navbar height for main content padding (typically 76px)
  const navbarHeight = 76;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: COLORS.cream, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Component */}
      {villageData && <NavbarComponent villageData={villageData} activeSection="admin" setActiveSection={() => {}} />}

      {/* Main Content with proper spacing */}
      <div style={{ paddingTop: `${navbarHeight}px`, flex: '1 0 auto' }}>
        <Container className="py-5">
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Kelola Artikel</h2>
                  <div className="accent-line" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '10px' }}></div>
                </div>
                <Button
                  className="d-flex align-items-center"
                  style={{ backgroundColor: COLORS.green, border: 'none' }}
                  onClick={handleAddArticle}
                >
                  <Plus size={18} className="me-2" />
                  Tambah Artikel
                </Button>
              </div>
            </Col>
          </Row>

          {/* Alert Messages */}
          {error && (
            <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="mb-4" onClose={() => setSuccess('')} dismissible>
              {success}
            </Alert>
          )}

          {/* Content Card */}
          <Card className="border-0 shadow-sm mb-5">
            <Card.Body className="p-4">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" style={{ color: COLORS.gold }} />
                  <p className="mt-3" style={{ color: COLORS.brown }}>Memuat data artikel...</p>
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-5">
                  <FileText size={48} style={{ color: COLORS.gray }} />
                  <p className="mt-3" style={{ color: COLORS.gray }}>Belum ada artikel yang ditambahkan</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    style={{ color: COLORS.green, borderColor: COLORS.green }}
                    onClick={handleAddArticle}
                  >
                    Tambah Artikel Pertama
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr style={{ backgroundColor: COLORS.cream }}>
                        <th style={{ color: COLORS.brown }}>No</th>
                        <th style={{ color: COLORS.brown }}>Gambar</th>
                        <th style={{ color: COLORS.brown }}>Judul</th>
                        <th style={{ color: COLORS.brown }}>Kategori</th>
                        <th style={{ color: COLORS.brown }}>Text</th>
                        <th style={{ color: COLORS.brown }}>Link</th>
                        <th style={{ color: COLORS.brown }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((article, index) => (
                        <tr key={article.id}>
                          <td>{index + 1}</td>
                          <td>
                            {article.gambar ? (
                              <div style={{ width: '60px', height: '40px', position: 'relative' }}>
                                <img
                                  src={article.gambar}
                                  alt={article.judul}
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover', 
                                    borderRadius: '4px',
                                    display: 'block'
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: COLORS.gray,
                                    borderRadius: '4px',
                                    display: 'none', // Initially hidden
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                  }}
                                >
                                  <Image size={18} color="white" />
                                </div>
                              </div>
                            ) : (
                              <div
                                style={{
                                  width: '60px',
                                  height: '40px',
                                  backgroundColor: COLORS.gray,
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Image size={18} color="white" />
                              </div>
                            )}
                          </td>
                          <td className="fw-medium" style={{ color: COLORS.brown }}>
                            {article.judul}
                          </td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                backgroundColor: COLORS.orange,
                                color: 'white',
                                padding: '6px 12px'
                              }}
                            >
                              {article.kategori || 'Umum'}
                            </span>
                          </td>
                          <td style={{ color: COLORS.gray }}>
                            {truncateText(article.text)}
                          </td>
                          <td>
                            {article.link ? (
                              <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: COLORS.green }}
                              >
                                {truncateText(article.link, 20)}
                              </a>
                            ) : (
                              <span style={{ color: COLORS.gray }}>-</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="d-flex align-items-center"
                                style={{ color: COLORS.green, borderColor: COLORS.green }}
                                onClick={() => handleEditArticle(article)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="d-flex align-items-center"
                                style={{ color: '#dc3545', borderColor: '#dc3545' }}
                                onClick={() => confirmDeleteArticle(article)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Add/Edit Article Modal */}
      <Modal show={showModal} onHide={handleModalClose} size="lg" centered>
        <Modal.Header style={{ backgroundColor: COLORS.cream, border: 'none' }}>
          <Modal.Title style={{ color: COLORS.brown, fontWeight: 'bold' }}>
            {modalMode === 'add' ? 'Tambah Artikel Baru' : 'Edit Artikel'}
          </Modal.Title>
          <Button
            variant="link"
            className="p-0 ms-auto"
            onClick={handleModalClose}
            style={{ color: COLORS.gray }}
          >
            <X size={24} />
          </Button>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group controlId="articleJudul">
                  <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>
                    Judul Artikel <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    placeholder="Masukkan judul artikel"
                    required
                    style={{
                      border: `1px solid ${COLORS.gray}`,
                      padding: '12px'
                    }}
                  />
                </Form.Group>
              </Col>

              <Col md={12} className="mb-3">
                <Form.Group controlId="articleGambar">
                  <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>
                    URL Gambar <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: COLORS.cream }}>
                      <Image size={18} color={COLORS.brown} />
                    </span>
                    <Form.Control
                      type="text"
                      name="gambar"
                      value={formData.gambar}
                      onChange={handleInputChange}
                      placeholder="Masukkan URL gambar"
                      required
                      style={{
                        border: `1px solid ${COLORS.gray}`,
                        padding: '12px'
                      }}
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={handleTestImageUrl}
                      style={{
                        borderColor: COLORS.gray,
                        color: COLORS.brown
                      }}
                    >
                      Test URL
                    </Button>
                  </div>
                  <Form.Text style={{ color: COLORS.gray }}>
                    Gunakan URL gambar yang valid (contoh: https://example.com/image.jpg)
                  </Form.Text>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-3">
                      <p className="mb-2" style={{ color: COLORS.brown }}>Preview:</p>
                      <div 
                        className="position-relative" 
                        style={{ 
                          height: '150px', 
                          width: '100%', 
                          backgroundColor: '#f8f9fa',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          border: imageError ? '1px solid #dc3545' : '1px solid #ddd'
                        }}
                      >
                        {!imageError ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="d-flex flex-column align-items-center justify-content-center h-100">
                            <X size={32} color="#dc3545" />
                            <p className="text-danger mt-2 mb-0">Gambar tidak dapat dimuat</p>
                            <small>Periksa URL dan coba lagi</small>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={12} className="mb-3">
                <Form.Group controlId="articleKategori">
                  <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>
                    Kategori <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: COLORS.cream }}>
                      <Tag size={18} color={COLORS.brown} />
                    </span>
                    <Form.Control
                      type="text"
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      placeholder="Masukkan kategori"
                      required
                      style={{
                        border: `1px solid ${COLORS.gray}`,
                        padding: '12px'
                      }}
                    />
                  </div>
                  <Form.Text style={{ color: COLORS.gray }}>
                    Contoh: Event, Berita, Pengumuman, dll.
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={12} className="mb-3">
                <Form.Group controlId="articleText">
                  <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>
                    Konten Artikel <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    placeholder="Tulis konten artikel di sini..."
                    required
                    style={{
                      border: `1px solid ${COLORS.gray}`,
                      padding: '12px'
                    }}
                  />
                </Form.Group>
              </Col>

              <Col md={12} className="mb-3">
                <Form.Group controlId="articleLink">
                  <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>
                    Link Terkait
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: COLORS.cream }}>
                      <LinkIcon size={18} color={COLORS.brown} />
                    </span>
                    <Form.Control
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      placeholder="Masukkan link terkait (opsional)"
                      style={{
                        border: `1px solid ${COLORS.gray}`,
                        padding: '12px'
                      }}
                    />
                  </div>
                  <Form.Text style={{ color: COLORS.gray }}>
                    Link tambahan yang terkait dengan artikel (opsional)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleModalClose}
                style={{
                  color: COLORS.gray,
                  borderColor: COLORS.gray,
                  padding: '10px 20px'
                }}
                disabled={processing}
              >
                Batal
              </Button>
              <Button
                type="submit"
                style={{
                  backgroundColor: COLORS.gold,
                  border: 'none',
                  padding: '10px 30px'
                }}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    {modalMode === 'add' ? 'Menyimpan...' : 'Memperbarui...'}
                  </>
                ) : (
                  modalMode === 'add' ? 'Simpan Artikel' : 'Perbarui Artikel'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header style={{ backgroundColor: COLORS.cream, border: 'none' }}>
          <Modal.Title style={{ color: COLORS.brown, fontWeight: 'bold' }}>
            Konfirmasi Hapus
          </Modal.Title>
          <Button
            variant="link"
            className="p-0 ms-auto"
            onClick={() => setShowDeleteModal(false)}
            style={{ color: COLORS.gray }}
          >
            <X size={24} />
          </Button>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          <p>Apakah Anda yakin ingin menghapus artikel "<strong>{articleToDelete?.judul}</strong>"?</p>
          <p className="text-danger mb-0">Tindakan ini tidak dapat dibatalkan.</p>
        </Modal.Body>
        <Modal.Footer style={{ border: 'none' }}>
          <Button
            variant="outline"
            onClick={() => setShowDeleteModal(false)}
            style={{
              color: COLORS.gray,
              borderColor: COLORS.gray
            }}
            disabled={processing}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteArticle}
            disabled={processing}
          >
            {processing ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Menghapus...
              </>
            ) : (
              'Hapus Artikel'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Footer */}
      <div style={{ marginTop: 'auto' }}>
        {villageData && <Footer villageData={villageData} />}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .table th {
          font-weight: 600;
        }
        .table tbody tr {
          transition: background-color 0.2s ease;
        }
        .table tbody tr:hover {
          background-color: rgba(246, 241, 233, 0.5);
        }
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(212, 175, 55, 0.25);
          border-color: ${COLORS.gold};
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

export default ManageArtikel;