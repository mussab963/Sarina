import { LogOut, LogIn, UserRound } from "lucide-react";
import { useAuth } from "../../Context/AuthContext.jsx";
import { Link, useNavigate, useLocation } from "react-router";

export default function AuthStatus() {
  const navigate = useNavigate();

  const { user, isAuthenticated, signOut } = useAuth();
  const location = useLocation();

  const returnTo = location.pathname + location.search + location.hash;

  function handleLogout() {
    signOut();
    navigate("/");
  }

  // المستخدم مو مسجّل دخول
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          state={{ from: returnTo }}
          className="flex items-center gap-2 rounded-xl bg-[#0aa99b] px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#078e87]"
        >
          <LogIn size={17} />
          تسجيل الدخول
        </Link>

        <Link
          to="/register"
          className="text-[12px] font-bold text-[#123e51] transition hover:text-[#0aa99b]"
        >
          إنشاء حساب
        </Link>
      </div>
    );
  }

  // المستخدم مسجّل دخول
  return (
    <div dir="rtl" className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 rounded-xl bg-[#eef8f6] px-3 py-2">
        <UserRound size={19} className="text-[#0aa99b]" />

        <span className="max-w-[120px] truncate text-[12px] font-bold text-[#123e51]">
          {user ? user.name : "حسابي"}
        </span>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-xl border border-red-100 px-3 py-2 text-[12px] font-bold text-red-600 transition hover:bg-red-50"
      >
        <LogOut size={17} />
        تسجيل الخروج
      </button>
    </div>
  );
}
