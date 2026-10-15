import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import AnimatedBackground from './components/ui/AnimatedBackground';

// Admin imports
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ProjectsAdmin from './pages/admin/ProjectsAdmin';
import MessagesAdmin from './pages/admin/MessagesAdmin';
import SkillsAdmin from './pages/admin/SkillsAdmin';
import ExperiencesAdmin from './pages/admin/ExperiencesAdmin';

function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const variant = location.pathname === '/' ? 'hero' : 'default';

  return (
    <div className="bg-black min-h-screen text-white relative">
      <AnimatedBackground variant={variant} />
      <div className="relative z-10">
        <Nav />
        {children}
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/projects" element={<PublicLayout><ProjectsPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<PublicLayout><AdminLogin /></PublicLayout>} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="experiences" element={<ExperiencesAdmin />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;