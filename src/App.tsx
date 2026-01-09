import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './features/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import CustomerLayout from './components/layout/CustomerLayout';

// Admin Pages
// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminOrdersPage from './pages/admin/OrdersPage';
import AdminOrderDetailPage from './pages/admin/OrderDetailPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminPackagesPage from './pages/admin/PackagesPage';
import AdminLeadsPage from './pages/admin/LeadsPage';
import AdminAnalyticsPage from './pages/admin/AnalyticsPage';
import AdminContentPage from './pages/admin/ContentPage';
import AdminSettingsPage from './pages/admin/SettingsPage';

// ...



// Customer Pages
import CustomerDashboardPage from './pages/customer/DashboardPage';
import CustomerOrdersPage from './pages/customer/OrdersPage';
import CustomerOrderDetailPage from './pages/customer/OrderDetailPage';
import CustomerCheckoutPage from './pages/customer/CheckoutPage';
import CustomerProfilePage from './pages/customer/ProfilePage';
import CustomerProjectsPage from './pages/customer/ProjectsPage';
import CustomerProjectDetailPage from './pages/customer/ProjectDetailPage';
import MessagesPage from './pages/customer/MessagesPage';
import TicketDetailPage from './pages/customer/TicketDetailPage';

import { AnimatePresence } from 'framer-motion';



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


          {/* Messages */}
          <Route path="messages" element={<MessagesPage />} />
          <Route path="messages/:id" element={<TicketDetailPage />} />
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
          <Route path="content" element={<AdminContentPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
