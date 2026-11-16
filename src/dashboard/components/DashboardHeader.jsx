
import { Link, useLocation } from "react-router";

import {
  Menu,
  BusFront,
  ChevronLeft,
  ExternalLink,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const titles = {
  "/dashboard": "نظرة عامة",
  "/dashboard/trips": "إدارة الرحلات",
  "/dashboard/bookings": "إدارة الحجوزات",
  "/dashboard/companies": "شركات النقل",
  "/dashboard/users": "المستخدمون",
};

export default function DashboardHeader({
  onMenuClick,
  userName = "مدير النظام",
  role = "ADMIN",
}) {
  const location = useLocation();

  const title =
    titles[location.pathname] || "لوحة التحكم";

  const date = new Intl.DateTimeFormat("ar-SY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-30 border-b border-[#e3edf0] bg-white/95 px-4 py-4 backdrop-blur-xl sm:px-7"
    >
      <div className="flex items-center justify-between gap-4">
        {/* عنوان الصفحة */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="فتح القائمة الجانبية"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e1eaee] text-[#103a4e] lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div>
            <div className="flex items-center gap-2 text-[11px] text-[#879ba7]">
              <span>لوحة التحكم</span>
              <ChevronLeft size={13} />
              <span>{title}</span>
            </div>

            <h1 className="mt-1 text-lg font-black text-[#103a4e] sm:text-xl">
              {title}
            </h1>
          </div>
        </div>

        {/* أدوات الهيدر */}
        <div className="flex items-center gap-3">
          <span className="hidden text-[11px] font-medium text-[#879ba7] md:block">
            {date}
          </span>

          <Link
            to="/"
            title="العودة إلى موقع سيرنا"
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#e1eaee] text-[#103a4e] transition hover:border-[#0daaa0] hover:text-[#0daaa0]"
          >
            <ExternalLink size={18} />
          </Link>

          <div className="hidden h-9 w-px bg-[#e3edf0] sm:block" />

          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e7f8f5] text-[#0a9d94]">
              {role === "ADMIN" ? (
                <ShieldCheck size={21} />
              ) : (
                <BusFront size={21} />
              )}
            </span>

            <div className="hidden sm:block">
              <p className="text-[12px] font-black text-[#103a4e]">
                {userName}
              </p>

              <p className="text-[10px] text-[#879ba7]">
                {role === "ADMIN"
                  ? "Administrator"
                  : "شركة النقل"}
              </p>
            </div>

            <UserRound
              size={17}
              className="hidden text-[#879ba7] xl:block"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
