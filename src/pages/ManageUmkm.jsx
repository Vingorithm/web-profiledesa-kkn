
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Spinner, Alert } from 'react-bootstrap';
import { Plus, Edit, Trash2, Image, Store, Upload, Phone, User, FileText, X, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';
import Footer from '../components/Footer';
import { getSemuaUMKM, tambahUMKM, editUMKM, hapusUMKM } from '../service';
import 'bootstrap/dist/css/bootstrap.min.css';

const COLORS = {
  gold: '#D4AF37',
  green: '#4C7031',
  brown: '#8B5E3C',
  orange: '#F2994A',
  cream: '#F6F1E9',
  gray: '#A9A9A9'
};

// Predefined category options for UMKM
const KATEGORI_OPTIONS = [
  'Makanan',
  'Minuman',
  'Kerajinan',
  'Fashion',
  'Pertanian',
  'Peternakan',
  'Jasa',
  'Lain-lain'
];

// Maximum image size in bytes (1MB)
const MAX_IMAGE_SIZE = 1024 * 1024;

const ManageUmkm = () => {
  const navigate = useNavigate();
  const [umkmList, setUmkmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [villageData, setVillageData] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUmkm, setSelectedUmkm] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // File upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [fileError, setFileError] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState('');
  const [compressing, setCompressing] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    nama: '',
    nama_pemilik: '',
    no_telp: '',
    text: '',
    kategori: KATEGORI_OPTIONS[0]
  });
  
  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [umkmToDelete, setUmkmToDelete] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    } else {
      // Dummy village data for Navbar and Footer
      setVillageData({
        villageName: 'Padukuhan Guyangan',
        villageSlogan: 'Maju, Makmur, dan Lestari',
        villageInfo: {
          address: "Jl. Raya Guyangan, Kemiri, Tanjungsari, Kabupaten Gunung Kidul, Daerah Istimewa Yogyakarta 55881",
          phone: "(0274) 123456",
          email: "Padukuhanguyangan@gmail.com",
          officeHours: "Senin - Jumat: 08.00 - 15.00 WIB"
        },
        footerDescription: 'Padukuhan Guyangan adalah Padukuhan yang terletak di Kemiri, Tanjungsari, Gunung Kidul, Special Region of Yogyakarta yang kaya akan budaya, alam, dan tradisi.'
      });
      
      // Load UMKM data
      fetchUmkmData();
    }
  }, [navigate]);

  const fetchUmkmData = async () => {
    setLoading(true);
    try {
      const data = await getSemuaUMKM();
      setUmkmList(data);
    } catch (err) {
      setError('Gagal mengambil data UMKM');
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
      nama: '',
      nama_pemilik: '',
      no_telp: '',
      text: '',
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

  const handleAddUmkm = () => {
    setModalMode('add');
    resetForm();
    setShowModal(true);
  };

  const handleEditUmkm = (umkm) => {
    setModalMode('edit');
    setSelectedUmkm(umkm);
    setFormData({
      nama: umkm.nama || '',
      nama_pemilik: umkm.nama_pemilik || '',
      no_telp: umkm.no_telp || '',
      text: umkm.text || '',
      kategori: umkm.kategori || KATEGORI_OPTIONS[0]
    });
    
    // Set existing image as preview
    if (umkm.gambar) {
      setFilePreview(umkm.gambar);
    } else {
      setFilePreview('');
    }
    
    setSelectedFile(null); // Reset selected file since we're using existing image
    setFileError(false);
    setFileErrorMessage('');
    setShowModal(true);
  };

  const confirmDeleteUmkm = (umkm) => {
    setUmkmToDelete(umkm);
    setShowDeleteModal(true);
  };

  const handleDeleteUmkm = async () => {
    if (!umkmToDelete) return;
    
    setProcessing(true);
    try {
      await hapusUMKM(umkmToDelete.id);
      setSuccess('UMKM berhasil dihapus');
      fetchUmkmData();
    } catch (err) {
      setError('Gagal menghapus UMKM');
      console.error(err);
    } finally {
      setProcessing(false);
      setShowDeleteModal(false);
      setUmkmToDelete(null);
      
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
          setError('Gambar UMKM wajib diupload');
          setProcessing(false);
          return;
        }
        
        await tambahUMKM(
          selectedFile, 
          formData.nama, 
          formData.kategori, 
          formData.nama_pemilik, 
          formData.no_telp, 
          formData.text
        );
        setSuccess('UMKM berhasil ditambahkan');
      } else {
        // For edit mode, prepare update data
        const updatedData = { ...formData };
        
        if (selectedFile) {
          await editUMKM(selectedUmkm.id, updatedData, selectedFile);
        } else {
          await editUMKM(selectedUmkm.id, updatedData);
        }
        
        setSuccess('UMKM berhasil diperbarui');
      }
      
      handleModalClose();
      fetchUmkmData();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(modalMode === 'add' ? 'Gagal menambahkan UMKM' : 'Gagal memperbarui UMKM');
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

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };
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
                  <h2 className="fw-bold mb-0" style={{ color: COLORS.brown }}>Kelola UMKM</h2>
                  <div className="accent-line" style={{ width: '80px', height: '4px', backgroundColor: COLORS.gold, marginTop: '10px' }}></div>
                </div>
                <Button
                  className="d-flex align-items-center"
                  style={{ backgroundColor: COLORS.green, border: 'none' }}
                  onClick={handleAddUmkm}
                >
                  <Plus size={18} className="me-2" />
                  Tambah UMKM
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
                  <p className="mt-3" style={{ color: COLORS.brown }}>Memuat data UMKM...</p>
                </div>
              ) : umkmList.length === 0 ? (
                <div className="text-center py-5">
                  <Store size={48} style={{ color: COLORS.gray }} />
                  <p className="mt-3" style={{ color: COLORS.gray }}>Belum ada UMKM yang ditambahkan</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    style={{ color: COLORS.green, borderColor: COLORS.green }}
                    onClick={handleAddUmkm}
                  >
                    Tambah UMKM Pertama
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr style={{ backgroundColor: COLORS.cream }}>
                        <th style={{ color: COLORS.brown }}>No</th>
                        <th style={{ color: COLORS.brown }}>Gambar</th>
                        <th style={{ color: COLORS.brown }}>Nama UMKM</th>
                        <th style={{ color: COLORS.brown }}>Kategori</th>
                        <th style={{ color: COLORS.brown }}>Pemilik</th>
                        <th style={{ color: COLORS.brown }}>No. Telepon</th>
                        <th style={{ color: COLORS.brown }}>Deskripsi</th>
                        <th style={{ color: COLORS.brown }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {umkmList.map((umkm, index) => (
                        <tr key={umkm.id}>
                          <td>{index + 1}</td>
                          <td>
                            {umkm.gambar ? (
                              <div style={{ width: '60px', height: '40px', position: 'relative' }}>
                                <img
                                  src={umkm.gambar}
                                  alt={umkm.nama}
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
                            {umkm.nama}
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
                              {umkm.kategori || 'Umum'}
                            </span>
                          </td>
                          <td style={{ color: COLORS.gray }}>
                            {umkm.nama_pemilik || '-'}
                          </td>
                          <td style={{ color: COLORS.gray }}>
                            {umkm.no_telp || '-'}
                          </td>
                          <td style={{ color: COLORS.gray }}>
                            {truncateText(umkm.text)}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="d-flex align-items-center"
                                style={{ color: COLORS.green, borderColor: COLORS.green }}
                                onClick={() => handleEditUmkm(umkm)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="d-flex align-items-center"
                                style={{ color: '#dc3545', borderColor: '#dc3545' }}
                                onClick={() => confirmDeleteUmkm(umkm)}
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

      {/* Add/Edit UMKM Modal */}
      <Modal show={showModal} onHide={handleModalClose} size="lg" centered>
        <Modal.Header style={{ backgroundColor: COLORS.cream, border: 'none' }}>
          <Modal.Title style={{ color: COLORS.brown, fontWeight: 'bold' }}>
            {modalMode === 'add' ? 'Tambah UMKM Baru' : 'Edit UMKM'}
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
                <Form.Group controlId="umkmNama">
                  <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>
                    Nama UMKM <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: COLORS.cream }}>
                      <Store size={18} color={COLORS.brown} />
                    </span>
                    <Form.Control
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama UMKM"
                      required
                      style={{
                        border: `1px solid ${COLORS.gray}`,
                        padding: '12px'
                      }}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group controlId="umkmPemilik">
                  <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>
                    Nama Pemilik <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: COLORS.cream }}>
                      <User size={18} color={COLORS.brown} />
                    </span>
                    <Form.Control
                      type="text"
                      name="nama_pemilik"
                      value={formData.nama_pemilik}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama pemilik"
                      required
                      style={{
                        border: `1px solid ${COLORS.gray}`,
                        padding: '12px'
                      }}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group controlId="umkmNoTelp">
                  <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>
                    Nomor Telepon <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: COLORS.cream }}>
                      <Phone size={18} color={COLORS.brown} />
                    </span>
                    <Form.Control
                      type="text"
                      name="no_telp"
                      value={formData.no_telp}
                      onChange={handleInputChange}
                      placeholder="Contoh: 081234567890"
                      required
                      style={{
                        border: `1px solid ${COLORS.gray}`,
                        padding: '12px'
                      }}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col md={12} className="mb-3">
                <Form.Group controlId="umkmKategori">
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
                <Form.Group controlId="umkmGambar">
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
                      ? 'Upload gambar untuk UMKM (format: JPG, PNG, GIF, maks 1MB)' 
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
                <Form.Group controlId="umkmDeskripsi">
                  <Form.Label style={{ color: COLORS.brown, fontWeight: 500 }}>
                    Deskripsi <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: COLORS.cream }}>
                      <FileText size={18} color={COLORS.brown} />
                    </span>
                    <Form.Control
                      as="textarea"
                      name="text"
                      value={formData.text}
                      onChange={handleInputChange}
                      placeholder="Masukkan deskripsi UMKM..."
                      required
                      style={{
                        border: `1px solid ${COLORS.gray}`,
                        padding: '12px',
                        minHeight: '120px'
                      }}
                    />
                  </div>
                  <Form.Text style={{ color: COLORS.gray }}>
                    Berikan deskripsi singkat tentang produk dan layanan UMKM
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={handleModalClose}
                style={{ 
                  borderColor: COLORS.gray, 
                  color: COLORS.gray,
                  padding: '8px 20px'
                }}
              >
                Batal
              </Button>
              <Button
                type="submit"
                style={{ 
                  backgroundColor: COLORS.green, 
                  border: 'none',
                  padding: '8px 20px' 
                }}
                disabled={processing || compressing || fileError}
              >
                {processing ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    {modalMode === 'add' ? 'Menambahkan...' : 'Memperbarui...'}
                  </>
                ) : (
                  modalMode === 'add' ? 'Tambah UMKM' : 'Perbarui UMKM'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} size="sm" centered>
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
          <p className="mb-4">
            Apakah Anda yakin ingin menghapus UMKM <strong>{umkmToDelete?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="d-flex justify-content-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              style={{ 
                borderColor: COLORS.gray, 
                color: COLORS.gray,
                padding: '8px 20px'
              }}
            >
              Batal
            </Button>
            <Button
              style={{ 
                backgroundColor: '#dc3545', 
                border: 'none',
                padding: '8px 20px' 
              }}
              onClick={handleDeleteUmkm}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Menghapus...
                </>
              ) : (
                'Hapus'
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Footer Component */}
      {villageData && <Footer villageData={villageData} />}
    </div>
  );
};

export default ManageUmkm;