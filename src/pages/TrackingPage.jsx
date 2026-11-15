import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  MapPinned,
  Navigation,
  Ticket,
} from "lucide-react";
import TrackingRouteMap from "../components/maps/TrackingRouteMap";
import TrackingSimulation from "../components/tracking/TrackingSimulation";

const container =
  "mx-auto w-[calc(100%-34px)] max-w-[1216px] min-[651px]:w-[calc(100%-48px)] min-[1151px]:w-[calc(100%-68px)]";

export default function TrackingPage() {
  const location = useLocation();

  const booking = location.state?.booking ?? null;

  const origin = booking?.origin || null;
  const destination = booking?.destination || null;

  const hasRoute = Boolean(origin && destination);

  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);

  const completed = progress >= 100;

  useEffect(() => {
    if (!playing || completed) return;

    const timer = window.setInterval(() => {
      setProgress((previous) => Math.min(previous + 1, 100));
    }, 180);

    return () => window.clearInterval(timer);
  }, [playing, completed]);

  function resetSimulation() {
    setPlaying(false);
    setProgress(0);
  }

  const googleMapsUrl = hasRoute
    ? `https://www.google.com/maps/dir/?${new URLSearchParams({
        api: "1",
        origin: `${origin}, Syria`,
        destination: `${destination}, Syria`,
        travelmode: "driving",
      }).toString()}`
    : null;

  return (
    <main
      dir="rtl"
      className="min-h-[70vh] bg-background pb-16 text-foreground dark:bg-[#0b1c29] dark:text-white"
    >
      <div className={container}>
        <header className="flex flex-wrap items-end justify-between gap-5 py-8">
          <div>
            <nav className="mb-5 flex items-center gap-2 text-xs text-muted">
              <Link to="/">الرئيسية</Link>
              <span>/</span>
              <Link to="/trips">حجوزاتي</Link>
              <span>/</span>
              <span>تتبّع الرحلة</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[29px] font-black">رحلتك قدام عيونك</h1>

              <span className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
                <Navigation size={15} />
                محاكاة تفاعلية
              </span>
            </div>

            <p className="mt-2 text-xs text-muted">
              استكشف مسار رحلتك ومحطاتها على الخريطة.
            </p>
          </div>

          <Link
            to="/trips"
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-xs font-bold dark:border-[#254252]"
          >
            <ArrowRight size={17} />
            كل الحجوزات
          </Link>
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-[349px_minmax(0,1fr)]">
          {/* تفاصيل الحجز */}
          <aside className="rounded-[19px] border border-border bg-white p-6 dark:border-[#254252] dark:bg-[#112b3b]">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#e6f8f3] text-primary">
                <Ticket size={24} />
              </span>

              <div>
                <h2 className="text-lg font-black">تفاصيل رحلتك</h2>
                <p className="text-[11px] text-muted">معلومات الحجز المختار</p>
              </div>
            </div>

            {booking ? (
              <div className="space-y-5">
                <div className="rounded-xl bg-[#f2f7f8] p-4 dark:bg-[#173748]">
                  <p className="text-[11px] text-muted">رقم الحجز</p>
                  <p className="mt-1 text-sm font-black">
                    {booking.id || "غير متوفر"}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-muted">من</p>
                    <h3 className="mt-1 text-lg font-black">
                      {origin || "غير متوفر"}
                    </h3>
                  </div>

                  <ArrowLeft size={22} className="text-primary" />

                  <div>
                    <p className="text-[11px] text-muted">إلى</p>
                    <h3 className="mt-1 text-lg font-black">
                      {destination || "غير متوفر"}
                    </h3>
                  </div>
                </div>

                <div className="border-t border-border pt-4 dark:border-[#254252]">
                  {[
                    ["شركة النقل", booking.company],
                    ["تاريخ الرحلة", booking.date],
                    ["وقت الانطلاق", booking.departure],
                    ["وقت الوصول", booking.arrival],
                    ["حالة الحجز", booking.status],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3 py-2.5 text-xs"
                    >
                      <span className="text-muted">{label}</span>

                      <span className="font-bold">{value || "غير متوفر"}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-primary/20 bg-[#e6f8f3] p-4 text-[11px] leading-6 text-[#078e87]">
                  الخريطة تعرض مواقع المدن المرتبطة بالحجز، وليست تتبعاً مباشراً
                  لموقع الحافلة.
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs leading-7 text-muted">
                  ما اخترت رحلة بعد. افتح حجوزاتي واختار الحجز اللي بدك تستكشفه.
                </p>

                <Link
                  to="/trips"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-white"
                >
                  <Ticket size={17} />
                  عرض حجوزاتي
                </Link>
              </div>
            )}
            {hasRoute && (
              <TrackingSimulation
                key={booking?.id ?? `${origin}-${destination}`}
                origin={origin}
                destination={destination}
                progress={progress}
                playing={playing}
                onToggle={() => setPlaying((previous) => !previous)}
                onReset={resetSimulation}
              />
            )}
          </aside>

          {/* قسم الخريطة */}
          <section className="overflow-hidden rounded-[19px] border border-border bg-white dark:border-[#254252] dark:bg-[#112b3b]">
            <div className="flex items-center gap-2 border-b border-border p-5 dark:border-[#254252]">
              <MapPinned size={19} className="text-primary" />
              <h2 className="text-sm font-black">خريطة الرحلة</h2>
            </div>

            {hasRoute ? (
              <TrackingRouteMap
                origin={origin}
                destination={destination}
                progress={progress}
              />
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 bg-[#eef5f2] p-6 text-center">
                <MapPinned size={42} className="text-primary" />

                <h3 className="text-base font-black text-[#123e51]">
                  اختار رحلة لتتبّعها
                </h3>

                <p className="max-w-sm text-xs leading-6 text-[#718493]">
                  افتح صفحة حجوزاتي واختار الرحلة اللي بدك تستكشف مسارها على
                  الخريطة.
                </p>

                <Link
                  to="/trips"
                  className="rounded-xl bg-primary px-5 py-3 text-xs font-black text-white"
                >
                  الذهاب إلى حجوزاتي
                </Link>
              </div>
            )}

            {/* زر Google Maps الجديد */}
            {hasRoute && (
              <div className="border-t border-border p-4 dark:border-[#254252]">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-white transition hover:opacity-90"
                >
                  <Navigation size={17} />
                  عرض الطرق في Google Maps
                </a>

                <p className="mt-3 text-[11px] leading-6 text-muted">
                  الخط المنقّط على خريطة سيرنا يربط بين المدن بشكل تقريبي، وليس
                  طريق القيادة الفعلي.
                </p>
              </div>
            )}

            {/* تنبيه عن نوع التتبّع */}
            <div className="flex items-start gap-2 p-4 text-[11px] leading-6 text-muted">
              <Info size={17} className="shrink-0 text-primary" />
              معاينة المسار ليست تتبّع GPS مباشر.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
