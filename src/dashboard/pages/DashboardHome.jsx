
import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
  ArrowLeft,
  BusFront,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  CircleHelp,
  LayoutDashboard,
  RefreshCw,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";

import StatCard from "../components/StatCard";
import { dashboardOverview } from "../services/dashboardApi";


const statItems = [
  {
    key: "bookings",
    title: "إجمالي الحجوزات",
    icon: Ticket,
    color: "teal",
    description: "الحجوزات المسجلة بالنظام",
    fields: [
      "bookings",
      "totalBookings",
      "bookingsCount",
    ],
  },
  {
    key: "trips",
    title: "الرحلات القادمة",
    icon: BusFront,
    color: "blue",
    description: "الرحلات القادمة بالنظام",
    fields: ["upcomingTrips"],
  },
  {
    key: "companies",
    title: "شركات النقل",
    icon: Building2,
    color: "orange",
    description: "الشركات المسجلة بالنظام",
    fields: ["companies"],
  },
  {
    key: "users",
    title: "العملاء المسجلون",
    icon: Users,
    color: "purple",
    description: "حسابات العملاء في النظام",
    fields: ["customers"],
  },
];


const quickLinks = [
  {
    title: "إدارة الرحلات",
    description: "استعراض الرحلات ومواعيدها",
    path: "/dashboard/trips",
    icon: CalendarDays,
  },
  {
    title: "إدارة الحجوزات",
    description: "متابعة الحجوزات وتفاصيلها",
    path: "/dashboard/bookings",
    icon: Ticket,
  },
  {
    title: "شركات النقل",
    description: "استعراض شركات النقل",
    path: "/dashboard/companies",
    icon: Building2,
  },
  {
    title: "المستخدمون",
    description: "استعراض حسابات المستخدمين",
    path: "/dashboard/users",
    icon: Users,
  },
];

function readCount(data, fields) {
  const sources = [
    data,
    data?.overview,
    data?.stats,
    data?.summary,
    data?.totals,
    data?.counts,
    data?.metrics,
    data?.statistics,
  ];

  for (const source of sources) {
    if (!source || typeof source !== "object") {
      continue;
    }

    for (const field of fields) {
      let value = source[field];

      if (value == null) {
        continue;
      }

      if (
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        value =
          value.total ??
          value.count ??
          value.totalCount ??
          value.total_count;
      }

      if (
        value == null ||
        typeof value === "boolean" ||
        Array.isArray(value)
      ) {
        continue;
      }

      const number = Number(value);

      if (
        Number.isFinite(number) &&
        Number.isInteger(number) &&
        number >= 0
      ) {
        return number.toLocaleString("ar");
      }
    }
  }

  return null;
}

export default function DashboardHome() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    dashboardOverview(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;

        setReport(data);
        setError("");
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;

        setReport(null);
        setError(
          err.message || "تعذر تحميل الإحصائيات."
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  function refreshOverview() {
    setLoading(true);
    setError("");
    setReloadKey((current) => current + 1);
  }

  const counts = statItems.map((item) => ({
    ...item,
    count: readCount(report, item.fields),
  }));

  const hasRecognizedCounts = counts.some(
    (item) => item.count !== null
  );

  return (
    <div dir="rtl" className="space-y-7">
      {/* الترحيب */}
      <section className="relative overflow-hidden rounded-[22px] bg-[#103a4e] px-6 py-8 text-white sm:px-8">
        <div className="relative z-10 max-w-[620px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#9de6de]">
            <LayoutDashboard size={15} />
            لوحة إدارة سيرنا
          </span>

          <h2 className="mt-4 text-2xl font-black sm:text-3xl">
            أهلاً في لوحة تحكم سيرنا!
          </h2>

          <p className="mt-3 text-[13px] leading-7 text-[#b8d0db]">
            تابع الرحلات والحجوزات وشركات
            النقل من مكان واحد.
          </p>

          <Link
            to="/dashboard/trips"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0daaa0] px-5 py-3 text-xs font-black text-white transition hover:bg-[#098f87]"
          >
            <BusFront size={18} />
            استعراض الرحلات
            <ArrowLeft size={16} />
          </Link>
        </div>

        <BusFront
          size={180}
          strokeWidth={1}
          className="pointer-events-none absolute -bottom-10 left-5 hidden text-white/[0.07] sm:block"
        />
      </section>

      {/* الإحصائيات */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-[#103a4e]">
              نظرة عامة
            </h2>

            <p className="mt-1 text-xs text-[#879ba7]">
              إحصائيات النظام من السيرفر
            </p>
          </div>

          <button
            type="button"
            onClick={refreshOverview}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#d9e7eb] bg-white px-4 py-2.5 text-xs font-bold text-[#103a4e] transition hover:border-[#0daaa0] disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={
                loading ? "animate-spin" : ""
              }
            />

            تحديث الإحصائيات
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-6 text-red-700"
          >
            تعذر تحميل الإحصائيات: {error}
          </div>
        )}

        {!loading &&
          !error &&
          report !== null &&
          !hasRecognizedCounts && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-800">
              وصلت استجابة من السيرفر، لكن
              أسماء حقول الإحصائيات مختلفة
              عن الحقول المتوقعة. نحتاج
              مطابقة شكل الاستجابة الفعلي.
            </div>
          )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {counts.map((item) => (
            <StatCard
              key={item.key}
              title={item.title}
              value={
                loading
                  ? "..."
                  : item.count ?? "—"
              }
              icon={item.icon}
              color={item.color}
              description={item.description}
            />
          ))}
        </div>
      </section>

      {/* الجزء السفلي */}
      <div className="grid items-start gap-5 xl:grid-cols-2">
        <section className="rounded-[20px] border border-[#e3edf0] bg-white p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e7f8f5] text-[#0daaa0]">
              <ChartNoAxesCombined size={22} />
            </span>

            <div>
              <h3 className="text-base font-black text-[#103a4e]">
                تحليل الحجوزات
              </h3>

              <p className="mt-1 text-xs text-[#879ba7]">
                عرض بيانات الحجوزات
              </p>
            </div>
          </div>

          <div className="mt-6 flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-dashed border-[#d9e7eb] bg-[#f8fbfb] p-6 text-center">
            <ChartNoAxesCombined
              size={40}
              className="text-[#0daaa0]"
            />

            <h4 className="mt-4 text-sm font-black text-[#103a4e]">
              مخطط الحجوزات
            </h4>

            <p className="mt-2 max-w-[280px] text-xs leading-6 text-[#879ba7]">
              رح نضيف الرسم البياني لما
              نتأكد من توفر بيانات زمنية
              فعلية من السيرفر.
            </p>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#e3edf0] bg-white p-6">
          <h3 className="text-base font-black text-[#103a4e]">
            الوصول السريع
          </h3>

          <p className="mt-1 text-xs text-[#879ba7]">
            أقسام لوحة الإدارة
          </p>

          <div className="mt-5 space-y-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group flex items-center gap-3 rounded-xl border border-[#e7eef1] p-3 transition hover:border-[#a9dfd9] hover:bg-[#f5fbfa]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e7f8f5] text-[#0daaa0]">
                    <Icon size={20} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-[#103a4e]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[11px] text-[#879ba7]">
                      {item.description}
                    </p>
                  </div>

                  <ArrowLeft
                    size={17}
                    className="text-[#91a6b0] transition group-hover:-translate-x-1"
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-[#d9e7eb] bg-white p-4">
        {error ? (
          <CircleHelp
            size={19}
            className="shrink-0 text-amber-500"
          />
        ) : (
          <ShieldCheck
            size={19}
            className="shrink-0 text-[#0daaa0]"
          />
        )}

        <p className="text-xs leading-6 text-[#718b99]">
          الأرقام المعروضة تُقرأ من
          استجابة السيرفر، ولا نستخدم
          إحصائيات وهمية.
        </p>
      </div>
    </div>
  );
}
