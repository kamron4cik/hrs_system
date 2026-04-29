import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthProvider }     from './context/AuthContext';
import { SearchProvider }   from './context/SearchContext';
import { ThemeContext, ThemeProvider }    from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { RefreshProvider }  from './context/RefreshContext';
import './App.css';

import Navbar  from './components/layout/Navbar';
import Footer  from './components/layout/Footer';
import CustomCursor from './components/ui/CustomCursor';
import CookieBanner from './components/ui/CookieBanner';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { AdminRoute }     from './components/shared/AdminRoute';

// Public pages
import HomePage          from './pages/public/HomePage';
import SearchResultsPage from './pages/public/SearchResultsPage';
import HotelDetailPage   from './pages/public/HotelDetailPage';
import TermsPage         from './pages/public/TermsPage';

// Auth pages
import LoginPage          from './pages/auth/LoginPage';
import RegisterPage       from './pages/auth/RegisterPage';
import AccountPage        from './pages/auth/AccountPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Guest pages
import BookingPage        from './pages/guest/BookingPage';
import BookingSuccessPage from './pages/guest/BookingSuccessPage';
import MyBookingsPage     from './pages/guest/MyBookingsPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHotels    from './pages/admin/AdminHotels';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminReports   from './pages/admin/AdminReports';

gsap.registerPlugin(ScrollTrigger);

// Public layout (with Navbar, Footer, CookieBanner)
const PublicLayout = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="custom-cursor flex flex-col min-h-screen bg-void text-alabaster">
      <CustomCursor />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CookieBanner />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <RefreshProvider>
        <CurrencyProvider>
          <AuthProvider>
            <SearchProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public */}
                  <Route path="/"        element={<PublicLayout><HomePage /></PublicLayout>} />
                  <Route path="/hotels"  element={<PublicLayout><SearchResultsPage /></PublicLayout>} />
                  <Route path="/hotels/:id" element={<PublicLayout><HotelDetailPage /></PublicLayout>} />
                  <Route path="/terms"   element={<PublicLayout><TermsPage /></PublicLayout>} />

                  {/* Auth */}
                  <Route path="/login"    element={<PublicLayout><LoginPage /></PublicLayout>} />
                  <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
                  <Route path="/forgot-password" element={<PublicLayout><ForgotPasswordPage /></PublicLayout>} />

                  {/* Guest protected */}
                  <Route path="/hotels/:id/book/:roomId" element={<PublicLayout><ProtectedRoute><BookingPage /></ProtectedRoute></PublicLayout>} />
                  <Route path="/booking/success"         element={<PublicLayout><ProtectedRoute><BookingSuccessPage /></ProtectedRoute></PublicLayout>} />
                  <Route path="/account"                 element={<PublicLayout><ProtectedRoute><AccountPage /></ProtectedRoute></PublicLayout>} />
                  <Route path="/account/bookings"        element={<PublicLayout><ProtectedRoute><MyBookingsPage /></ProtectedRoute></PublicLayout>} />

                  {/* Admin (full-screen, no Navbar/Footer) */}
                  <Route path="/admin"         element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/hotels"  element={<AdminRoute><AdminHotels /></AdminRoute>} />
                  <Route path="/admin/users"   element={<AdminRoute><AdminUsers /></AdminRoute>} />
                  <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
                </Routes>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: '#1A1A1A',
                      color: '#F4F4F0',
                      border: '1px solid rgba(197,160,89,0.2)',
                      fontFamily: 'Inter, sans-serif',
                    },
                  }}
                />
              </BrowserRouter>
            </SearchProvider>
          </AuthProvider>
        </CurrencyProvider>
      </RefreshProvider>
    </ThemeProvider>
  );
}

export default App;
