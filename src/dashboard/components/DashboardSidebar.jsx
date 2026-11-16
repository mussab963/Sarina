
import { NavLink } from "react-router";

import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Building2,
  Users,
  BusFront,
  LogOut,
  ExternalLink,
  X,
  UserRound,
  ShieldCheck,
} from "lucide-react";

/*
  DashboardSidebar

  القائمة الجانبية للوحة تحكم سيرنا.

  Props:
  - isOpen: فتح القائمة على الموبايل
  - onClose: إغلاق القائمة
  - onLogout: تنفيذ تسجيل الخروج
  - role: صلاحية المستخدم
  - userName: اسم المستخدم

  الأدوار:
  ADMIN   => مدير النظام
  COMPANY => شركة النقل

  ملاحظة:
  إخفاء الروابط حسب الدور لأغراض الواجهة فقط.
  حماية البيانات والعمليات مسؤولية الـ Backend.
*/

// تعريف صفحات القائمة
const menuItems = [
  {
    title: "نظرة عامة",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "COMPANY"],
    end: true,
  },
  {
    title: "إدارة الرحلات",
    path: "/dashboard/trips",
    icon: CalendarDays,
    roles: ["ADMIN", "COMPANY"],
  },
  {
    title: "إدارة الحجوزات",
    path: "/dashboard/bookings",
    icon: Ticket,
    roles: ["ADMIN", "COMPANY"],
  },
  {
    title: "شركات النقل",
    path: "/dashboard/companies",
    icon: Building2,
    roles: ["ADMIN"],
  },
  {
    title: "المستخدمون",
    path: "/dashboard/users",
    icon: Users,
    roles: ["ADMIN"],
  },
];

function DashboardSidebar({
  isOpen = false,
  onClose = () => {},
  onLogout,
  role = "ADMIN",
  userName = "مدير النظام",
}) {
  const normalizedRole =
    String(role).toUpperCase();

  const allowedItems = menuItems.filter(
    (item) =>
      item.roles.includes(normalizedRole)
  );

  const roleLabel =
    normalizedRole === "ADMIN"
      ? "مدير النظام"
      : normalizedRole === "COMPANY"
        ? "شركة نقل"
        : "مستخدم";

  return (
    <>
      {/* طبقة الخلفية على الموبايل */}
      {isOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة الجانبية"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#071b27]/70 backdrop-blur-[3px] lg:hidden"
        />
      )}

      {/* القائمة الجانبية */}
      <aside
        dir="rtl"
        aria-label="القائمة الجانبية للوحة التحكم"
        className={`
          fixed inset-y-0 right-0 z-50
          flex h-dvh w-[275px]
          flex-col overflow-y-auto
          bg-[#102c3d] text-white
          shadow-[0_12px_35px_rgba(0,0,0,0.2)]
          transition-transform duration-300
          lg:sticky lg:top-0 lg:z-20
          lg:h-screen lg:translate-x-0
          lg:shrink-0 lg:shadow-none
          ${
            isOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-6">
          <NavLink
            to="/dashboard"
            end
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <span className="flex h-[47px] w-[47px] items-center justify-center rounded-[14px] bg-[#0daaa0] shadow-[0_6px_20px_rgba(13,170,160,0.2)]">
              <BusFront
                size={27}
                strokeWidth={2.3}
                className="text-white"
              />
            </span>

            <span className="flex flex-col">
              <strong className="text-[23px] font-black tracking-tight text-white">
                سيرنا.
              </strong>

              <small className="text-[11px] font-medium text-[#9bb7c5]">
                لوحة التحكم
              </small>
            </span>
          </NavLink>

          {/* إغلاق القائمة على الموبايل */}
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9bb7c5] transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* معلومات الدور */}
        <div className="px-4 pt-6">
          <div className="flex items-center gap-2 rounded-xl border border-[#225464] bg-[#153d4c] px-3 py-3">
            <ShieldCheck
              size={18}
              className="shrink-0 text-[#21c7b8]"
            />

            <span className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-white">
                {roleLabel}
              </span>

              <small className="text-[10px] text-[#9bb7c5]">
                {normalizedRole === "ADMIN"
                  ? "إدارة نظام سيرنا"
                  : normalizedRole === "COMPANY"
                    ? "إدارة رحلات الشركة"
                    : "صلاحيات محدودة"}
              </small>
            </span>
          </div>
        </div>

        {/* الروابط الرئيسية */}
        <nav
          aria-label="صفحات لوحة التحكم"
          className="flex-1 px-4 py-7"
        >
          <p className="mb-4 px-3 text-[10px] font-bold tracking-wide text-[#789eae]">
            القائمة الرئيسية
          </p>

          <div className="flex flex-col gap-2">
            {allowedItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    group relative flex min-h-[47px]
                    items-center gap-3
                    overflow-hidden rounded-xl
                    px-4 py-3
                    text-[12px] font-bold
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#17565b] text-white shadow-[0_5px_20px_rgba(0,0,0,0.1)]"
                        : "text-[#a6c0cc] hover:bg-white/[0.07] hover:text-white"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={2}
                        className={
                          isActive
                            ? "text-[#33d3c6]"
                            : "text-[#8aafbd] transition-colors group-hover:text-[#33d3c6]"
                        }
                      />

                      <span>{item.title}</span>

                      {isActive && (
                        <span className="absolute bottom-2 right-0 top-2 w-[4px] rounded-l-full bg-[#21c7b8]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* أسفل القائمة */}
        <div className="mt-auto border-t border-white/10 px-4 pb-5 pt-4">
          {/* العودة إلى موقع المسافرين */}
          <NavLink
            to="/"
            onClick={onClose}
            className="mb-5 flex min-h-[43px] items-center gap-3 rounded-xl px-4 text-[11px] font-bold text-[#a6c0cc] transition hover:bg-white/[0.07] hover:text-white"
          >
            <ExternalLink size={18} />

            <span>العودة إلى الموقع</span>
          </NavLink>

          {/* بطاقة المستخدم */}
          <div className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.04] p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#255063]">
              <UserRound
                size={21}
                className="text-[#c8dce3]"
              />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-black text-white">
                {userName}
              </p>

              <p className="mt-1 text-[10px] text-[#9bb7c5]">
                {roleLabel}
              </p>
            </div>

            {/* زر تسجيل الخروج يظهر عند
                تمرير دالة onLogout من Layout */}
            {typeof onLogout === "function" && (
              <button
                type="button"
                onClick={onLogout}
                title="تسجيل الخروج"
                aria-label="تسجيل الخروج"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#9bb7c5] transition hover:bg-red-500/15 hover:text-red-300"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default DashboardSidebar;
