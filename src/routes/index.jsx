import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import DashboardPage from "../pages/DashboardPage";
import CatalogPage from "../pages/CatalogPage";
import ArtikelPage from "../pages/DetailArtikelPage";
import AboutPage from "../pages/AboutPage";
import LoginPage from "../pages/LoginPage";
import AdminPage from "../pages/AdminPage";
import ProfilePage from "../pages/ProfilePage";
import GaleriPage from "../pages/GaleriPage";
import ManageArtikel from "../pages/ManageArtikel";
import ManageUmkm from "../pages/ManageUmkm";
import ManageGaleri from "../pages/ManageGaleriPage";
import ListArtikel from "../pages/ListArtikelPage";
import ListUmkm from "../pages/ListUmkmPage";
import UmkmPage from "../pages/DetailUmkm";

const router = createBrowserRouter([
    { path: "/", element: <DashboardPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/katalog", element: <CatalogPage /> },
    { path: "/artikel/:id", element: <ArtikelPage /> },
    { path: "/about", element: <AboutPage /> },
    { path: "/galeri", element: <GaleriPage /> },
    { path: "/admin", element: <AdminPage /> },
    { path: "/profil", element: <ProfilePage /> },
    { path: "/admin/artikel", element: <ManageArtikel /> },
    { path: "/admin/umkm", element: <ManageUmkm /> },
    { path: "/admin/galeri", element: <ManageGaleri /> },
    { path: "*", element: <div>Halaman tidak ditemukan</div> },
    { path: "/artikel", element: <ListArtikel /> },
    { path: "/umkm", element: <ListUmkm /> },
    { path: "/umkm/:id", element: <UmkmPage /> },
]);

const AppRouter = () => (
    <>
      {/* <Toaster position="top-center" richColors /> */}
      <RouterProvider router={router} />
    </>
);

export default AppRouter;