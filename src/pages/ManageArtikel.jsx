import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Spinner, Alert, Image as BootstrapImage } from 'react-bootstrap';
import { Plus, Edit, Trash2, Image, FileText, Link as LinkIcon, Tag, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';
import Footer from '../components/Footer';
import { getSemuaArtikel, tambahArtikel, editArtikel, hapusArtikel } from '../service';
import 'bootstrap/dist/css/bootstrap.min.css';
import dummyData from '../components/DummyData';

const COLORS = dummyData.colors;

// Predefined category options
const KATEGORI_OPTIONS = [
  'Sosial & Budaya',
  'Kesehatan',
  'Pendidikan',
  'UMKM',
  'Pertanian',
  'Teknologi',
  'Lain-lain'
];

// Maximum image size in bytes (1MB)
const MAX_IMAGE_SIZE = 1024 * 1024;

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
  
  // File upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [fileError, setFileError] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState('');
  const [compressing, setCompressing] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    judul: '',
    text: '',
    link: '',
    kategori: KATEGORI_OPTIONS[0]
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
        ...dummyData,
      });
      
      // Load articles
      fetchArticles();
    }
  }, [navigate]);

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

  // Function to compress image
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      setCompressing(true);
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          // Set maximum dimension to 1200px
          const MAX_DIMENSION = 1200;
          if (width > height && width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
          
          // Set canvas dimensions and draw image
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with quality 0.8 (80%)
          canvas.toBlob((blob) => {
            setCompressing(false);
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', 0.8);
        };
        
        img.onerror = (error) => {
          setCompressing(false);
          reject(error);
        };
      };
      
      reader.onerror = (error) => {
        setCompressing(false);
        reject(error);
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setSelectedFile(null);
      setFilePreview('');
      setFileError(false);
      setFileErrorMessage('');
      return;
    }
    
    // Check file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!validImageTypes.includes(file.type)) {
      setFileError(true);
      setFileErrorMessage('Format file tidak valid. Gunakan JPG, PNG, atau GIF.');
      setSelectedFile(null);
      setFilePreview('');
      return;
    }
    
    // Check file size
    if (file.size > MAX_IMAGE_SIZE) {
      try {
        // Compress the image if it's too large
        const compressedFile = await compressImage(file);
        setSelectedFile(compressedFile);
        
        // Create file preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
          setFileError(false);
          setFileErrorMessage('');
        };
        reader.readAsDataURL(compressedFile);
        
        // Show success message about compression
        setSuccess(`Gambar berhasil dikompresi dari ${(file.size / 1024).toFixed(2)} KB menjadi ${(compressedFile.size / 1024).toFixed(2)} KB`);
        setTimeout(() => setSuccess(''), 3000);
        
      } catch (err) {
        setFileError(true);
        setFileErrorMessage('Gagal mengompresi gambar. Silakan coba gambar lain.');
        setSelectedFile(null);
        setFilePreview('');
      }
    } else {
      // If file size is already small enough
      setSelectedFile(file);
      
      // Create file preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        setFileError(false);
        setFileErrorMessage('');
      };
      reader.onerror = () => {
        setFileError(true);
        setFileErrorMessage('Gagal membaca file gambar');
        setFilePreview('');
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      judul: '',
      text: '',
      link: '',
      kategori: KATEGORI_OPTIONS[0]
    });
    setSelectedFile(null);
    setFilePreview('');
    setFileError(false);
    setFileErrorMessage('');
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
      judul: article.judul || '',
      text: article.text || '',
      link: article.link || '',
      kategori: article.kategori || KATEGORI_OPTIONS[0]
    });
    
    // Set existing image as preview
    if (article.gambar) {
      setFilePreview(article.gambar);
    } else {
      setFilePreview('');
    }
    
    setSelectedFile(null); // Reset selected file since we're using existing image
    setFileError(false);
    setFileErrorMessage('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');
    
    try {
      if (modalMode === 'add') {
        // Check if file is selected for add mode
        if (!selectedFile) {
          setError('Gambar artikel wajib diupload');
          setProcessing(false);
          return;
        }
        
        // Call service to add article with file
        await tambahArtikel(selectedFile, formData.judul, formData.text, formData.link, formData.kategori);
        setSuccess('Artikel berhasil ditambahkan');
      } else {
        // For edit mode, prepare update data
        const updatedData = { ...formData };
        
        // If a new file is selected, it will be handled by the service
        if (selectedFile) {
          // We need to implement special handling in editArtikel to replace image
          await editArtikel(selectedArticle.id, updatedData, selectedFile);
        } else {
          // No new file, just update the text fields
          await editArtikel(selectedArticle.id, updatedData);
        }
        
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
                    Upload Gambar {modalMode === 'add' && <span className="text-danger">*</span>}
                  </Form.Label>
                  <div className="input-group mb-3">
                    <input
                      type="file"
                      className="form-control"
                      id="imageUpload"
                      accept="image/jpeg,image/png,image/gif,image/jpg"
                      onChange={handleFileChange}
                      required={modalMode === 'add'}
                      style={{
                        border: `1px solid ${COLORS.gray}`,
                        padding: '12px'
                      }}
                    />
                    <label 
                      className="input-group-text" 
                      htmlFor="imageUpload"
                      style={{ backgroundColor: COLORS.cream }}
                    >
                      <Upload size={18} color={COLORS.brown} />
                    </label>
                  </div>
                  <Form.Text style={{ color: COLORS.gray }}>
                    {modalMode === 'add' 
                      ? 'Upload gambar untuk artikel (format: JPG, PNG, GIF, maks 1MB)' 
                      : 'Upload gambar baru untuk mengganti gambar saat ini (opsional, maks 1MB)'}
                  </Form.Text>
                  
                  {/* File Error Message */}
                  {fileError && fileErrorMessage && (
                    <div className="text-danger mt-2 mb-2 small">
                      <i className="bi bi-exclamation-triangle me-1"></i> {fileErrorMessage}
                    </div>
                  )}
                  
                  {/* Compressing indicator */}
                  {compressing && (
                    <div className="d-flex align-items-center mt-2 mb-2">
                      <Spinner animation="border" size="sm" className="me-2" style={{ color: COLORS.gold }} />
                      <span style={{ color: COLORS.brown }}>Mengompresi gambar...</span>
                    </div>
                  )}
                  
                  {/* Image Preview */}
                  {filePreview && (
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
                          border: fileError ? '1px solid #dc3545' : '1px solid #ddd'
                        }}
                      >
                        {!fileError ? (
                          <img
                            src={filePreview}
                            alt="Preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                            onError={() => setFileError(true)}
                          />
                        ) : (
                          <div className="d-flex flex-column align-items-center justify-content-center h-100">
                            <X size={32} color="#dc3545" />
                            <p className="text-danger mt-2 mb-0">Gambar tidak dapat dimuat</p>
                            <small>Periksa file dan coba lagi</small>
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
                    <Form.Select
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      required
                      style={{
                        border: `1px solid ${COLORS.gray}`,
                        padding: '12px'
                      }}
                    >
                      {KATEGORI_OPTIONS.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
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
                disabled={processing || compressing}
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
                disabled={processing || compressing}
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