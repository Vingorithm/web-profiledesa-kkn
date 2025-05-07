import { db, storage } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { query, where, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export const login = async (username, password) => {
    try {
      const akunRef = collection(db, "akun");
      const q = query(akunRef, where("username", "==", username), where("password", "==", password));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        console.log("Login berhasil:", user);
        return user;
      } else {
        console.warn("Login gagal: Username atau password salah");
        return null;
      }
    } catch (e) {
      console.error("Gagal login:", e);
      return null;
    }
};  

export const tambahAkun = async (nama, username, password) => {
  try {
    await addDoc(collection(db, "akun"), {
      nama,
      username,
      password
    });
    console.log("Akun berhasil ditambahkan");
  } catch (e) {
    console.error("Gagal tambah akun:", e);
  }
};


export const tambahArtikel = async (fileGambar, judul, text, link, kategori) => {
  try {
    // 1. Upload ke Cloudinary
    const cloudinaryData = new FormData();
    cloudinaryData.append("file", fileGambar);
    cloudinaryData.append("upload_preset", "kkn_guyangan"); // upload preset unsigned

    const res = await fetch("https://api.cloudinary.com/v1_1/drfu296s7/image/upload", {
      method: "POST",
      body: cloudinaryData,
    });

    if (!res.ok) throw new Error("Gagal upload ke Cloudinary");
    const { secure_url } = await res.json();

    // 2. Simpan metadata ke Firestore
    await addDoc(collection(db, "artikel"), {
      gambar: secure_url, // URL Cloudinary
      judul,
      kategori,
      text,
      link,
      createdAt: new Date(),
    });

    console.log("Artikel berhasil ditambahkan");
    return true;
  } catch (e) {
    console.error("Gagal tambah artikel:", e);
    throw e;
  }
};

export const hapusArtikel = async (id) => {
  try {
    const artikelRef = doc(db, "artikel", id);
    await deleteDoc(artikelRef);
    console.log("Artikel berhasil dihapus");
  } catch (e) {
    console.error("Gagal hapus artikel:", e);
    throw e;
  }
};


export const editArtikel = async (id, updatedData, gambarFile = null) => {
  try {
    const artikelRef = doc(db, "artikel", id);

    if (gambarFile) {
      // Upload gambar baru ke Cloudinary
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", gambarFile);
      cloudinaryData.append("upload_preset", "kkn_guyangan");

      const res = await fetch("https://api.cloudinary.com/v1_1/drfu296s7/image/upload", {
        method: "POST",
        body: cloudinaryData,
      });

      if (!res.ok) throw new Error("Gagal upload gambar ke Cloudinary");
      const data = await res.json();
      updatedData.gambar = data.secure_url;
    }

    updatedData.updatedAt = new Date();
    await updateDoc(artikelRef, updatedData);
    console.log("Artikel berhasil diperbarui");
    return true;
  } catch (e) {
    console.error("Gagal update artikel:", e);
    throw e;
  }
};


export const getSemuaArtikel = async () => {
    try {
      const artikelSnapshot = await getDocs(collection(db, "artikel"));
      const data = artikelSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return data;
    } catch (e) {
      console.error("Gagal mengambil artikel:", e);
      return [];
    }
};

// Section UMKM
export const tambahUMKM = async (fileGambar, nama, kategori, nama_pemilik, no_telp, text) => {
  try {
    // Upload gambar ke Cloudinary
    const cloudinaryData = new FormData();
    cloudinaryData.append("file", fileGambar);
    cloudinaryData.append("upload_preset", "kkn_guyangan"); // preset Cloudinary

    const res = await fetch("https://api.cloudinary.com/v1_1/drfu296s7/image/upload", {
      method: "POST",
      body: cloudinaryData,
    });

    if (!res.ok) throw new Error("Gagal upload gambar ke Cloudinary");
    const { secure_url } = await res.json();

    // Simpan ke Firestore
    await addDoc(collection(db, "umkm"), {
      nama,
      gambar: secure_url,
      kategori,
      nama_pemilik,
      no_telp,
      text,
      createdAt: new Date(),
    });

    console.log("UMKM berhasil ditambahkan");
    return true;
  } catch (e) {
    console.error("Gagal tambah UMKM:", e);
    throw e;
  }
};

// Ambil semua UMKM
export const getSemuaUMKM = async () => {
  try {
    const snapshot = await getDocs(collection(db, "umkm"));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.error("Gagal mengambil data UMKM:", e);
    return [];
  }
};

// Hapus UMKM
export const hapusUMKM = async (id) => {
  try {
    await deleteDoc(doc(db, "umkm", id));
    console.log("UMKM berhasil dihapus");
  } catch (e) {
    console.error("Gagal hapus UMKM:", e);
    throw e;
  }
};

// Edit UMKM
export const editUMKM = async (id, updatedData, gambarFile = null) => {
  try {
    const umkmRef = doc(db, "umkm", id);

    if (gambarFile) {
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", gambarFile);
      cloudinaryData.append("upload_preset", "kkn_guyangan");

      const res = await fetch("https://api.cloudinary.com/v1_1/drfu296s7/image/upload", {
        method: "POST",
        body: cloudinaryData,
      });

      if (!res.ok) throw new Error("Gagal upload gambar ke Cloudinary");
      const data = await res.json();
      updatedData.gambar = data.secure_url;
    }

    updatedData.updatedAt = new Date();
    await updateDoc(umkmRef, updatedData);
    console.log("UMKM berhasil diperbarui");
    return true;
  } catch (e) {
    console.error("Gagal update UMKM:", e);
    throw e;
  }
};

// Section Galeri
export const tambahGaleri = async (fileFoto, judul) => {
  try {
    // Upload foto ke Cloudinary
    const cloudinaryData = new FormData();
    cloudinaryData.append("file", fileFoto);
    cloudinaryData.append("upload_preset", "kkn_guyangan"); // preset Cloudinary

    const res = await fetch("https://api.cloudinary.com/v1_1/drfu296s7/image/upload", {
      method: "POST",
      body: cloudinaryData,
    });

    if (!res.ok) throw new Error("Gagal upload foto ke Cloudinary");
    const { secure_url } = await res.json();

    // Simpan ke Firestore
    await addDoc(collection(db, "galeri"), {
      judul,
      foto: secure_url,
      createdAt: new Date(),
    });

    console.log("Galeri berhasil ditambahkan");
    return true;
  } catch (e) {
    console.error("Gagal tambah galeri:", e);
    throw e;
  }
};

// Ambil semua Galeri
export const getSemuaGaleri = async () => {
  try {
    const snapshot = await getDocs(collection(db, "galeri"));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.error("Gagal mengambil galeri:", e);
    return [];
  }
};

// Hapus Galeri
export const hapusGaleri = async (id) => {
  try {
    await deleteDoc(doc(db, "galeri", id));
    console.log("Galeri berhasil dihapus");
  } catch (e) {
    console.error("Gagal hapus galeri:", e);
    throw e;
  }
};

// Edit Galeri
export const editGaleri = async (id, updatedData, fotoFile = null) => {
  try {
    const galeriRef = doc(db, "galeri", id);

    if (fotoFile) {
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", fotoFile);
      cloudinaryData.append("upload_preset", "kkn_guyangan");

      const res = await fetch("https://api.cloudinary.com/v1_1/drfu296s7/image/upload", {
        method: "POST",
        body: cloudinaryData,
      });

      if (!res.ok) throw new Error("Gagal upload foto ke Cloudinary");
      const data = await res.json();
      updatedData.foto = data.secure_url;
    }

    updatedData.updatedAt = new Date();
    await updateDoc(galeriRef, updatedData);
    console.log("Galeri berhasil diperbarui");
    return true;
  } catch (e) {
    console.error("Gagal update galeri:", e);
    throw e;
  }
};
