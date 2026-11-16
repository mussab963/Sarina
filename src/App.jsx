import "./App.css";
import { Routes, Route, Link } from "react-router";
import MainLayout from "./layouts/MainLayout";
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

// صفحة تظهر عند فتح رابط غير موجود
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
      {/* تسجيل الدخول وإنشاء الحساب */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* صفحات الموقع داخل التخطيط الرئيسي */}
      <Route element={<MainLayout />}>
        {/* الرئيسية */}
        <Route index element={<HomePage />} />

        {/* نتائج البحث */}
        <Route path="results" element={<ResultsPage />} />

        {/* إتمام الحجز */}
        <Route path="booking/:tripId" element={<BookingPage />} />

        {/* شركات النقل */}
        <Route path="companies" element={<CompaniesPage />} />

        {/* حجوزاتي */}
        <Route path="trips" element={<MyBookingsPage />} />

        {/* تتبّع الرحلة */}
        <Route path="tracking" element={<TrackingPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="support" element={<SupportPage />} />

        {/* أي رابط غير معروف */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
