import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import DashboardPage from "../pages/DashboardPage";
import CatalogPage from "../pages/CatalogPage";
import AboutPage from "../pages/AboutPage";
import LoginPage from "../pages/LoginPage";
import AdminPage from "../pages/AdminPage";
import ManageArtikel from "../pages/ManageArtikel";

const router = createBrowserRouter([
    { path: "/", element: <DashboardPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/katalog", element: <CatalogPage /> },
    { path: "/about", element: <AboutPage /> },
    { path: "/admin", element: <AdminPage /> },
    { path: "/admin/artikel", element: <ManageArtikel /> },
    { path: "*", element: <div>Halaman tidak ditemukan</div> },
]);

const AppRouter = () => (
    <>
      {/* <Toaster position="top-center" richColors /> */}
      <RouterProvider router={router} />
    </>
);

export default AppRouter;