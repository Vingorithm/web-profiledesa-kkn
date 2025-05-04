// src/service.js
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { query, where, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

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

export const tambahArtikel = async (gambar, judul, text, link, kategori) => {
  try {
    await addDoc(collection(db, "artikel"), {
      gambar,
      judul,
      text,
      link,
      kategori
    });
    console.log("Artikel berhasil ditambahkan");
  } catch (e) {
    console.error("Gagal tambah artikel:", e);
  }
};

export const hapusArtikel = async (id) => {
    try {
      await deleteDoc(doc(db, "artikel", id));
      console.log("Artikel berhasil dihapus");
    } catch (e) {
      console.error("Gagal hapus artikel:", e);
    }
};

export const editArtikel = async (id, updatedData) => {
    try {
      const artikelRef = doc(db, "artikel", id);
      await updateDoc(artikelRef, updatedData);
      console.log("Artikel berhasil diperbarui");
    } catch (e) {
      console.error("Gagal update artikel:", e);
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
