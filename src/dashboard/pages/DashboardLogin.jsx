import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  BusFront,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

import {
  dashboardLogin,
  dashboardMe,
  saveDashboardToken,
  clearDashboardToken,
} from "../services/dashboardApi";

export default function DashboardLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      clearDashboardToken();

      const result = await dashboardLogin({
        email: email.trim(),
        password,
      });

      const token =
        result?.accessToken ??
        result?.access_token ??
        result?.token ??
        result?.tokens?.accessToken;

      if (!token) {
        throw new Error("لم يرجع السيرفر رمز دخول صالحاً.");
      }

      saveDashboardToken(token);

      const profile = await dashboardMe();

      const user = profile?.user ?? profile;

      const role = String(user?.role ?? "").toUpperCase();

      if (role !== "ADMIN") {
        throw new Error("هذا الحساب لا يملك صلاحيات الأدمن.");
      }

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      clearDashboardToken();

      setError(err.message || "تعذر تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#f5f9fa] px-4 py-10"
    >
      <div className="w-full max-w-[430px]">
        <div className="mb-7 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#103a4e] text-white shadow-lg">
            <BusFront size={34} />
          </span>

          <h1 className="mt-5 text-3xl font-black text-[#103a4e]">سيرنا.</h1>

          <p className="mt-2 text-sm text-[#8197a3]">
            تسجيل الدخول إلى لوحة الإدارة
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="rounded-[22px] border border-[#e3edf0] bg-white p-7 shadow-[0_15px_45px_rgba(16,58,78,0.06)]"
        >
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-[#e7f8f5] p-4 text-[#078e87]">
            <ShieldCheck size={23} />

            <p className="text-xs font-bold">هذه الصفحة مخصصة لمدير النظام</p>
          </div>

          <label
            htmlFor="admin-email"
            className="mb-2 block text-xs font-bold text-[#103a4e]"
          >
            البريد الإلكتروني
          </label>

          <div className="relative mb-5">
            <Mail
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8197a3]"
            />

            <input
              id="admin-email"
              type="email"
              required
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="أدخل البريد الإلكتروني"
              className="w-full rounded-xl border border-[#dce8ec] bg-[#fbfdfd] py-3.5 pl-4 pr-11 text-sm text-[#103a4e] outline-none focus:border-[#0daaa0]"
            />
          </div>

          <label
            htmlFor="admin-password"
            className="mb-2 block text-xs font-bold text-[#103a4e]"
          >
            كلمة المرور
          </label>

          <div className="relative">
            <LockKeyhole
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8197a3]"
            />

            <input
              id="admin-password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="أدخل كلمة المرور"
              className="w-full rounded-xl border border-[#dce8ec] bg-[#fbfdfd] py-3.5 pl-4 pr-11 text-sm text-[#103a4e] outline-none focus:border-[#0daaa0]"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-red-50 p-3 text-xs leading-6 text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0daaa0] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#098f87] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "جاري التحقق من الحساب..." : "تسجيل الدخول"}

            {!loading && <ArrowLeft size={18} />}
          </button>
        </form>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center text-xs font-bold text-[#8197a3] hover:text-[#0daaa0]"
        >
          العودة إلى موقع المسافرين
        </Link>
      </div>
    </main>
  );
}
