import "./App.css";

import { Routes, Route } from "react-router";

import MainLayout from "./layouts/MainLayout";

import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import BookingPage from "./pages/BookingPage";
import CompaniesPage from "./pages/CompaniesPage";
import MyBookingsPage from "./pages/MyBookingsPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TrackingPage from "./pages/TrackingPage";

function ComingSoon() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-extrabold">أهلاً بك في سيرنا</h1>

        <p className="mt-4 text-muted">عم ننقل صفحات المشروع إلى React</p>
      </div>
    </section>
  );
}

function App() {
  return (
    <Routes>
      {/* صفحات تسجيل الدخول والتسجيل */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* صفحات الموقع الرئيسية */}
      <Route element={<MainLayout />}>
        <Route path="tracking" element={<TrackingPage />} />
        {/* الصفحة الرئيسية */}
        <Route index element={<HomePage />} />

        {/* نتائج البحث */}
        <Route path="results" element={<ResultsPage />} />

        {/* إتمام الحجز */}
        <Route path="booking/:tripId" element={<BookingPage />} />

        {/* شركات النقل */}
        <Route path="companies" element={<CompaniesPage />} />

        {/* حجوزاتي */}
        <Route path="trips" element={<MyBookingsPage />} />

        {/* الصفحات غير المنفذة */}
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
}

export default App;
