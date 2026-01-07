import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './features/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import CustomerLayout from './components/layout/CustomerLayout';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminOrdersPage from './pages/admin/OrdersPage';
import AdminOrderDetailPage from './pages/admin/OrderDetailPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminPackagesPage from './pages/admin/PackagesPage';
import AdminLeadsPage from './pages/admin/LeadsPage';

// Customer Pages
import CustomerDashboardPage from './pages/customer/DashboardPage';
import CustomerOrdersPage from './pages/customer/OrdersPage';
import CustomerOrderDetailPage from './pages/customer/OrderDetailPage';
import CustomerCheckoutPage from './pages/customer/CheckoutPage';
import CustomerProfilePage from './pages/customer/ProfilePage';
import CustomerProjectsPage from './pages/customer/ProjectsPage';
import CustomerProjectDetailPage from './pages/customer/ProjectDetailPage';

import { AnimatePresence } from 'framer-motion';

function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent mb-4">
        {title}
      </h2>
      <p className="text-gray-400 text-lg">
        Fitur ini sedang dalam pengembangan 🚀
      </p>
    </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Customer Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><CustomerLayout /></ProtectedRoute>}>
          <Route index element={<CustomerDashboardPage />} />
          <Route path="orders" element={<CustomerOrdersPage />} />
          <Route path="orders/:id" element={<CustomerOrderDetailPage />} />
          <Route path="checkout" element={<CustomerCheckoutPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />

          {/* Coming Soon */}
          {/* Projects */}
          <Route path="projects" element={<CustomerProjectsPage />} />
          <Route path="projects/:id" element={<CustomerProjectDetailPage />} />

          <Route path="messages" element={<ComingSoonPage title="Pesan" />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="packages" element={<AdminPackagesPage />} />

          {/* Other Routes */}
          <Route path="leads" element={<AdminLeadsPage />} />
          <Route path="content" element={<ComingSoonPage title="Kelola Konten" />} />
          <Route path="analytics" element={<ComingSoonPage title="Analytics" />} />
          <Route path="settings" element={<ComingSoonPage title="Pengaturan" />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
