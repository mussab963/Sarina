import "./App.css";
import { Routes, Route, Link } from "react-router";

import MainLayout from "./layouts/MainLayout";

// صفحات موقع المسافرين
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import BookingPage from "./pages/BookingPage";
import CompaniesPage from "./pages/CompaniesPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TrackingPage from "./pages/TrackingPage";
import AccountPage from "./pages/AccountPage";
import AboutPage from "./pages/AboutPage";
import SupportPage from "./pages/SupportPage";

// صفحات لوحة الإدارة - مشروع أحمد
import DashboardLayout from "./dashboard/layouts/DashboardLayout";
import DashboardLogin from "./dashboard/pages/DashboardLogin";
import DashboardHome from "./dashboard/pages/DashboardHome";
import DashboardTrips from "./dashboard/pages/DashboardTrips";
import DashboardBookings from "./dashboard/pages/DashboardBookings";
import DashboardCompanies from "./dashboard/pages/DashboardCompanies";
import DashboardUsers from "./dashboard/pages/DashboardUsers";

// صفحة الرابط غير الموجود
function NotFoundPage() {
  return (
    <main
      dir="rtl"
      className="flex min-h-[65vh] items-center justify-center bg-background px-4 py-16 text-center text-foreground"
    >
      <div className="max-w-md">
        <h1 className="text-7xl font-black text-primary">404</h1>

        <h2 className="mt-5 text-2xl font-black">الصفحة غير موجودة</h2>

        <p className="mt-4 text-sm leading-7 text-muted">
          يبدو أن الرابط الذي تحاول الوصول إليه غير صحيح أو أن الصفحة لم تعد
          متاحة.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          العودة إلى الرئيسية
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      {/* تسجيل دخول المسافر وإنشاء الحساب */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* لوحة الإدارة - منفصلة عن واجهة المسافر */}
      <Route path="/dashboard/login" element={<DashboardLogin />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="trips" element={<DashboardTrips />} />
        <Route path="bookings" element={<DashboardBookings />} />
        <Route path="companies" element={<DashboardCompanies />} />
        <Route path="users" element={<DashboardUsers />} />
      </Route>

      {/* صفحات موقع المسافرين */}
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="booking/:tripId" element={<BookingPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="trips" element={<MyBookingsPage />} />
        <Route path="tracking" element={<TrackingPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="support" element={<SupportPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
