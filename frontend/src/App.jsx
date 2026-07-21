import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectCurrentUser, selectIsAdmin } from './features/auth/authSlice';
import useAuthInit from './hooks/useAuthInit';
import Layout from './components/layout/Layout';
import SplashScreen from './components/ui/SplashScreen';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Services = lazy(() => import('./pages/Services'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProjectsAdmin = lazy(() => import('./pages/admin/ProjectsAdmin'));
const CategoriesAdmin = lazy(() => import('./pages/admin/CategoriesAdmin'));
const CloudinaryAdmin = lazy(() => import('./pages/admin/CloudinaryAdmin'));
const PopupAdmin = lazy(() => import('./pages/admin/PopupAdmin'));
const AdminCotizacion = lazy(() => import('./pages/admin/AdminCotizacion'));
const AdminUsuarios = lazy(() => import('./pages/admin/AdminUsuarios'));
const AdminQuotes = lazy(() => import('./pages/admin/AdminQuotes'));
const DownloadsAdmin = lazy(() => import('./pages/admin/DownloadsAdmin'));
const ServicesAdmin = lazy(() => import('./pages/admin/ServicesAdmin'));
const TestimonialsAdmin = lazy(() => import('./pages/admin/TestimonialsAdmin'));
const FAQsAdmin = lazy(() => import('./pages/admin/FAQsAdmin'));

const MyQuotes = lazy(() => import('./pages/MyQuotes'));

// Guards
const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  const isAuthInitialized = useSelector(state => state.auth.isAuthInitialized);
  
  if (!isAuthInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[100vh]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const isAdmin = useSelector(selectIsAdmin);
  const isAuthInitialized = useSelector(state => state.auth.isAuthInitialized);
  
  if (!isAuthInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[100vh]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }
  
  return isAdmin ? children : <Navigate to="/" replace />;
};

const GuestRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  return !user ? children : <Navigate to="/" replace />;
};

const Loading = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
  </div>
);

const AuthInitializer = () => {
  useAuthInit();
  return null;
};

const App = () => {
  const [splashComplete, setSplashComplete] = useState(false);

  return (
    <div className="bg-black">
      <AnimatePresence mode="wait">
        {!splashComplete && (
          <SplashScreen onComplete={() => setSplashComplete(true)} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: splashComplete ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <Suspense fallback={<Loading />}>
          <AuthInitializer />
          <Routes>
      {/* Public routes with layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/proyectos" element={<Projects />} />
        <Route path="/proyectos/:id" element={<ProjectDetail />} />
        <Route path="/servicios" element={<Services />} />

        {/* Auth routes (guests only) */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/registro" element={<GuestRoute><Register /></GuestRoute>} />

        {/* Protected user routes */}
        <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/mis-presupuestos" element={<ProtectedRoute><MyQuotes /></ProtectedRoute>} />
        <Route path="/downloads" element={<DownloadsPage />} />
      </Route>

      {/* Admin routes (no Layout wrapper — AdminLayout is self-contained) */}
      <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/proyectos" element={<AdminRoute><ProjectsAdmin /></AdminRoute>} />
      <Route path="/admin/categorias" element={<AdminRoute><CategoriesAdmin /></AdminRoute>} />
      <Route path="/admin/cloudinary" element={<AdminRoute><CloudinaryAdmin /></AdminRoute>} />
      <Route path="/admin/popup" element={<AdminRoute><PopupAdmin /></AdminRoute>} />
      <Route path="/admin/cotizacion" element={<AdminRoute><AdminCotizacion /></AdminRoute>} />
      <Route path="/admin/usuarios" element={<AdminRoute><AdminUsuarios /></AdminRoute>} />
      <Route path="/admin/presupuestos" element={<AdminRoute><AdminQuotes /></AdminRoute>} />
      <Route path="/admin/descargas" element={<AdminRoute><DownloadsAdmin /></AdminRoute>} />
      <Route path="/admin/servicios" element={<AdminRoute><ServicesAdmin /></AdminRoute>} />
      {/* <Route path="/admin/testimonios" element={<AdminRoute><TestimonialsAdmin /></AdminRoute>} /> */}
      <Route path="/admin/faqs" element={<AdminRoute><FAQsAdmin /></AdminRoute>} />

      <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </Suspense>
      </motion.div>
    </div>
  );
};

export default App;
