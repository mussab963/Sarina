
import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
  useNavigate,
} from "react-router";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";

import {
  getDashboardToken,
  clearDashboardToken,
  dashboardMe,
} from "../services/dashboardApi";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function verifyAdmin() {
      if (!getDashboardToken()) {
        setChecking(false);
        return;
      }

      try {
        const result = await dashboardMe(
          controller.signal
        );

        if (controller.signal.aborted) return;

        const account = result?.user ?? result;

        const role = String(
          account?.role ?? ""
        ).toUpperCase();

        if (role !== "ADMIN") {
          clearDashboardToken();
          setAuthorized(false);
          return;
        }

        setUser(account);
        setAuthorized(true);
      } catch {
        if (controller.signal.aborted) return;

        clearDashboardToken();
        setAuthorized(false);
      } finally {
        if (!controller.signal.aborted) {
          setChecking(false);
        }
      }
    }

    verifyAdmin();

    return () => controller.abort();
  }, []);

  function handleLogout() {
    clearDashboardToken();
    setAuthorized(false);
    setUser(null);

    navigate("/dashboard/login", {
      replace: true,
    });
  }

  if (checking) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f5f9fa]"
      >
        <p className="text-sm font-bold text-[#103a4e]">
          جاري التحقق من جلسة الأدمن...
        </p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <Navigate
        to="/dashboard/login"
        replace
      />
    );
  }

  const userName =
    user?.name ??
    user?.fullName ??
    "مدير النظام";

  return (
    <div
      dir="rtl"
      className="flex min-h-screen bg-[#f5f9fa]"
    >
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        role="ADMIN"
        userName={userName}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <DashboardHeader
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
          role="ADMIN"
        />

        <main className="flex-1 px-4 py-6 sm:px-7 sm:py-8">
          <div className="mx-auto w-full max-w-[1450px]">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-[#e3edf0] px-7 py-4 text-center text-xs text-[#879ba7]">
          سيرنا — لوحة الإدارة
        </footer>
      </div>
    </div>
  );
}
