
import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
  ArrowLeft,
  BusFront,
  ChevronLeft,
  RefreshCw,
  Sparkles,
  Star,
} from "lucide-react";

import { loadCompanies } from "../services/sairnaApi";

// العرض الأساسي حسب تصميم سيرنا
const container =
  "mx-auto w-[calc(100%-34px)] max-w-[1216px] min-[651px]:w-[calc(100%-48px)] min-[1151px]:w-[calc(100%-68px)]";

// ألوان شعارات الشركات من التصميم المرجعي
const logoColors = [
  {
    match: "الشام",
    color: "#109d9c",
    bg: "#e7f9f6",
  },
  {
    match: "الفرات",
    color: "#e69a46",
    bg: "#fff3df",
  },
  {
    match: "النورس",
    color: "#5085e6",
    bg: "#e9efff",
  },
  {
    match: "الاتحاد",
    color: "#9969ce",
    bg: "#f1eafe",
  },
];

// شعار شركة النقل
function CompanyLogo({ company }) {
  const color =
    logoColors.find((item) =>
      company.name.includes(item.match)
    ) ?? {
      color: "#109d9c",
      bg: "#e7f9f6",
    };

  return (
    <span
      aria-hidden="true"
      className="grid h-[68px] w-[68px] shrink-0 place-items-center rounded-[19px] text-[36px] font-black"
      style={{
        color: color.color,
        backgroundColor: color.bg,
      }}
    >
      {company.short}
    </span>
  );
}

// بطاقة شركة واحدة
function CompanyCard({ company }) {
  return (
    <article className="flex min-w-0 flex-col rounded-[20px] border border-border bg-white p-[22px] transition duration-200 hover:-translate-y-[6px] hover:shadow-[0_18px_45px_rgba(19,54,72,.09)] dark:border-[#254252] dark:bg-[#112b3b]">
      {/* الشعار والتقييم */}
      <div className="mb-5 flex items-start justify-between gap-2">
        <CompanyLogo company={company} />

        {company.rating !== null && (
          <span className="inline-flex shrink-0 items-center gap-[5px] rounded-full bg-[#e6f8f3] px-[10px] py-[5px] text-[10px] font-extrabold text-[#078e87] dark:bg-[#174b49] dark:text-[#b7eee4]">
            <Star size={14} />
            {company.rating} / 5
          </span>
        )}
      </div>

      {/* اسم الشركة ووصفها */}
      <h2 className="mb-[7px] text-[17px] font-black">
        {company.name}
      </h2>

      <p className="min-h-[74px] text-[11px] leading-[2] text-muted max-[1150px]:min-h-0">
        {company.about ||
          "تعرّف على رحلات هذه الشركة ومواعيدها عبر سيرنا."}
      </p>

      {/* الخدمات */}
      <div className="my-[14px] flex min-h-7 flex-wrap items-start gap-[5px]">
        {company.features.length ? (
          company.features.map((feature) => (
            <span
              key={feature}
              className="rounded-md bg-[#f2f7f8] px-[9px] py-[5px] text-[10px] font-bold text-muted dark:bg-[#193a49]"
            >
              {feature}
            </span>
          ))
        ) : (
          <span className="text-[10px] text-muted">
            الخدمات حسب تفاصيل الرحلة
          </span>
        )}
      </div>

      {/* معلومات إضافية */}
      <div className="grid grid-cols-2 gap-3 border-t border-border py-[15px] dark:border-[#254252]">
        <div className="flex flex-col">
          <strong className="text-[16px] font-black">
            {company.destinationsCount ?? "—"}
          </strong>

          <small className="text-[10px] text-muted">
            الوجهات المتاحة
          </small>
        </div>

        <div className="flex flex-col">
          <strong className="text-[16px] font-black">
            {company.scheduleLabel ?? "—"}
          </strong>

          <small className="text-[10px] text-muted">
            مواعيد الرحلات
          </small>
        </div>
      </div>

      {/* الانتقال إلى نتائج البحث */}
      <Link
        to={`/results?company=${encodeURIComponent(company.id)}`}
        className="mt-auto inline-flex min-h-[49px] w-full items-center justify-center gap-[10px] rounded-xl border border-border bg-white px-2 py-[11px] text-[11px] font-extrabold text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary dark:border-[#254252] dark:bg-[#112b3b] dark:text-[#eef8fa]"
      >
        عرض رحلات الشركة
        <ArrowLeft size={17} />
      </Link>
    </article>
  );
}

// الصفحة الرئيسية لشركات النقل
export default function CompaniesPage() {
  const [request, setRequest] = useState({
    loading: true,
    companies: [],
    error: "",
  });

  const [reload, setReload] = useState(0);

  // جلب الشركات عند فتح الصفحة
  useEffect(() => {
    const controller = new AbortController();

    loadCompanies(controller.signal)
      .then((companies) => {
        setRequest({
          loading: false,
          companies,
          error: "",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setRequest({
            loading: false,
            companies: [],
            error: error.message,
          });
        }
      });

    // إلغاء طلب الشبكة عند مغادرة الصفحة
    return () => controller.abort();
  }, [reload]);

  return (
    <main
      dir="rtl"
      className="min-h-[70vh] bg-background text-foreground dark:bg-[#0b1c29] dark:text-[#eef8fa]"
    >
      {/* القسم العلوي */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-bl from-[#f2f7f8] to-background pb-[45px] pt-[26px] dark:border-[#254252] dark:from-[#173748] dark:to-[#0b1c29]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[120px] -top-[180px] h-[350px] w-[350px] rounded-full border border-dashed border-[#19a79a]/10"
        />

        <div className={container}>
          <nav
            aria-label="مسار التنقل"
            className="mb-[22px] flex items-center gap-2 text-[11px] font-extrabold text-muted"
          >
            <Link
              to="/"
              className="hover:text-primary"
            >
              الرئيسية
            </Link>

            <ChevronLeft size={14} />

            <span className="text-foreground dark:text-[#eef8fa]">
              شركات النقل
            </span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full bg-[#e6f8f3] px-[14px] py-[5px] text-[11px] font-black text-[#078e87] dark:bg-[#174b49] dark:text-[#b7eee4]">
            <Sparkles size={13} />
            شركاء الطريق
          </span>

          <h1 className="mb-[6px] mt-[11px] text-[clamp(29px,3.2vw,42px)] font-black leading-[1.5]">
            شركات بتوصلك{" "}
            <span className="text-primary">
              لوين ما بدك.
            </span>
          </h1>

          <p className="text-[13px] text-muted">
            تعرّف على شركات النقل المتوفرة
            واختار الأنسب إلك.
          </p>
        </div>
      </section>

      {/* قسم البطاقات */}
      <section
        className={`${container} py-[86px] max-[900px]:py-[60px] max-[650px]:py-[48px]`}
      >
        {request.loading ? (
          // حالة التحميل
          <div
            role="status"
            className="rounded-[20px] border border-border bg-white p-10 text-center text-sm text-muted dark:border-[#254252] dark:bg-[#112b3b]"
          >
            <BusFront
              className="mx-auto mb-3 animate-pulse text-primary"
              size={32}
            />
            جاري تحميل شركات النقل من السيرفر...
          </div>
        ) : request.error ? (
          // حالة الخطأ
          <div
            role="alert"
            className="rounded-[20px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-800"
          >
            <p>{request.error}</p>

            <button
              type="button"
              onClick={() => {
                setRequest({
                  loading: true,
                  error: "",
                  companies: [],
                });

                setReload((value) => value + 1);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-white"
            >
              <RefreshCw size={17} />
              إعادة المحاولة
            </button>
          </div>
        ) : request.companies.length === 0 ? (
          // لا توجد شركات
          <div className="rounded-[20px] border border-border bg-white p-10 text-center text-sm text-muted dark:border-[#254252] dark:bg-[#112b3b]">
            لا توجد شركات نقل مسجّلة حالياً.
          </div>
        ) : (
          // عرض شركات النقل
          <div className="grid grid-cols-1 gap-[17px] min-[901px]:grid-cols-2 min-[1151px]:grid-cols-4">
            {request.companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
              />
            ))}
          </div>
        )}

        <p className="mt-[23px] text-[11px] leading-6 text-muted">
          معلومات الشركات مأخوذة من السيرفر.
          التفاصيل غير المتوفرة تُعرض بدون
          اختراع تقييمات أو مواعيد.
        </p>
      </section>
    </main>
  );
}