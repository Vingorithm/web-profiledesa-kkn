import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Spinner, Alert, Image as BootstrapImage } from 'react-bootstrap';
import { Plus, Edit, Trash2, Image, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';
import Footer from '../components/Footer';
import { getSemuaGaleri, tambahGaleri, editGaleri, hapusGaleri } from '../service';
import 'bootstrap/dist/css/bootstrap.min.css';
import dummyData from '../components/DummyData';

const COLORS = dummyData.colors;

// Maximum image size in bytes (1MB)
const MAX_IMAGE_SIZE = 1024 * 1024;

const ManageGaleriPage = () => {
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [villageData, setVillageData] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // File upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [fileError, setFileError] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState('');
  const [compressing, setCompressing] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    judul: ''
  });
  
  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState(null);

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
      
      // Load galleries
      fetchGalleries();
    }
  }, [navigate]);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const data = await getSemuaGaleri();
      setGalleries(data);
    } catch (err) {
      setError('Gagal mengambil data galeri');
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
      judul: ''
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

  const handleAddGallery = () => {
    setModalMode('add');
    resetForm();
    setShowModal(true);
  };

  const handleEditGallery = (gallery) => {
    setModalMode('edit');
    setSelectedGallery(gallery);
    setFormData({
      judul: gallery.judul || ''
    });
    
    // Set existing image as preview
    if (gallery.foto) {
      setFilePreview(gallery.foto);
    } else {
      setFilePreview('');
    }
    
    setSelectedFile(null); // Reset selected file since we're using existing image
    setFileError(false);
    setFileErrorMessage('');
    setShowModal(true);
  };

  const confirmDeleteGallery = (gallery) => {
    setGalleryToDelete(gallery);
    setShowDeleteModal(true);
  };

  const handleDeleteGallery = async () => {
    if (!galleryToDelete) return;
    
    setProcessing(true);
    try {
      await hapusGaleri(galleryToDelete.id);
      setSuccess('Foto galeri berhasil dihapus');
      fetchGalleries();
    } catch (err) {
      setError('Gagal menghapus foto galeri');
      console.error(err);
    } finally {
      setProcessing(false);
      setShowDeleteModal(false);
      setGalleryToDelete(null);
      
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
          setError('Foto galeri wajib diupload');
          setProcessing(false);
          return;
        }
        
        // Call service to add gallery with file
        await tambahGaleri(selectedFile, formData.judul);
        setSuccess('Foto galeri berhasil ditambahkan');
      } else {
        // For edit mode, prepare update data
        const updatedData = { ...formData };
        
        // If a new file is selected, it will be handled by the service
        if (selectedFile) {
          await editGaleri(selectedGallery.id, updatedData, selectedFile);
        } else {
          // No new file, just update the text fields
          await editGaleri(selectedGallery.id, updatedData);
        }
        
        setSuccess('Foto galeri berhasil diperbarui');
      }
      
      handleModalClose();
      fetchGalleries();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(modalMode === 'add' ? 'Gagal menambahkan foto galeri' : 'Gagal memperbarui foto galeri');
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
                  <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Kelola Galeri</h2>
                  <div className="accent-line" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '10px' }}></div>
                </div>
                <Button
                  className="d-flex align-items-center"
                  style={{ backgroundColor: COLORS.green, border: 'none' }}
                  onClick={handleAddGallery}
                >
                  <Plus size={18} className="me-2" />
                  Tambah Foto
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
                  <p className="mt-3" style={{ color: COLORS.brown }}>Memuat data galeri...</p>
                </div>
              ) : galleries.length === 0 ? (
                <div className="text-center py-5">
                  <Image size={48} style={{ color: COLORS.gray }} />
                  <p className="mt-3" style={{ color: COLORS.gray }}>Belum ada foto yang ditambahkan</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    style={{ color: COLORS.green, borderColor: COLORS.green }}
                    onClick={handleAddGallery}
                  >
                    Tambah Foto Pertama
                  </Button>
                </div>
              ) : (
                <div>
                  {/* Gallery Grid View */}
                  <Row xs={1} sm={2} md={3} lg={4} className="g-4 mb-4">
                    {galleries.map((gallery) => (
                      <Col key={gallery.id}>
                        <Card className="h-100 border-0 shadow-sm hover-card">
                          <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                            {gallery.foto ? (
                              <Card.Img
                                variant="top"
                                src={gallery.foto}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                                alt={gallery.judul}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/api/placeholder/400/400";
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  backgroundColor: COLORS.gray,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Image size={28} color="white" />
                              </div>
                            )}
                          </div>
                          <Card.Body>
                            <Card.Title style={{ color: COLORS.brown, fontSize: '1rem' }} className="fw-bold">
                              {gallery.judul || 'Untitled'}
                            </Card.Title>
                            {gallery.createdAt && (
                              <Card.Text className="text-muted small">
                                Ditambahkan: {formatDate(gallery.createdAt)}
                              </Card.Text>
                            )}
                          </Card.Body>
                          <Card.Footer style={{ backgroundColor: 'white', border: 'none' }}>
                            <div className="d-flex justify-content-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="d-flex align-items-center"
                                style={{ color: COLORS.green, borderColor: COLORS.green }}
                                onClick={() => handleEditGallery(gallery)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="d-flex align-items-center"
                                style={{ color: '#dc3545', borderColor: '#dc3545' }}
                                onClick={() => confirmDeleteGallery(gallery)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </Card.Footer>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Add/Edit Gallery Modal */}
      <Modal show={showModal} onHide={handleModalClose} size="lg" centered>
        <Modal.Header style={{ backgroundColor: COLORS.cream, border: 'none' }}>
          <Modal.Title style={{ color: COLORS.brown, fontWeight: 'bold' }}>
            {modalMode === 'add' ? 'Tambah Foto Galeri' : 'Edit Foto Galeri'}
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
                <Form.Group controlId="galleryTitle">
                  <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>
                    Judul Foto <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    placeholder="Masukkan judul foto"
                    required
                    style={{
                      border: `1px solid ${COLORS.gray}`,
                      padding: '12px'
                    }}
                  />
                </Form.Group>
              </Col>

              <Col md={12} className="mb-3">
                <Form.Group controlId="galleryPhoto">
                  <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>
                    Upload Foto {modalMode === 'add' && <span className="text-danger">*</span>}
                  </Form.Label>
                  <div className="input-group mb-3">
                    <input
                      type="file"
                      className="form-control"
                      id="photoUpload"
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
                      htmlFor="photoUpload"
                      style={{ backgroundColor: COLORS.cream }}
                    >
                      <Upload size={18} color={COLORS.brown} />
                    </label>
                  </div>
                  <Form.Text style={{ color: COLORS.gray }}>
                    {modalMode === 'add' 
                      ? 'Upload foto untuk galeri (format: JPG, PNG, GIF, maks 1MB)' 
                      : 'Upload foto baru untuk mengganti foto saat ini (opsional, maks 1MB)'}
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
                          height: '250px', 
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
                  modalMode === 'add' ? 'Simpan Foto' : 'Perbarui Foto'
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
          <p>Apakah Anda yakin ingin menghapus foto "<strong>{galleryToDelete?.judul || 'Untitled'}</strong>" dari galeri?</p>
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
            onClick={handleDeleteGallery}
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
              'Hapus Foto'
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
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(212, 175, 55, 0.25);
          border-color: ${COLORS.gold};
        }
      `}</style>
    </div>
  );
};

export default ManageGaleriPage;