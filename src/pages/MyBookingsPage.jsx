
import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
  Armchair,
  BusFront,
  CheckCircle2,
  ChevronLeft,
  Info,
  LoaderCircle,
  LogIn,
  Plus,
  RefreshCw,
  Route,
  Ticket,
  Wallet,
} from "lucide-react";

// Website API - خاص بالمسافرين
const API_BASE =
  "https://sairna.abdulrahman-hares.com/api/v1/website";

// نفس المفتاح المتفق عليه مع مصعب
const TOKEN_KEY = "sairna_passenger_access_token";

function readToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

const container =
  "mx-auto w-[calc(100%-34px)] max-w-[1216px] min-[651px]:w-[calc(100%-48px)] min-[1151px]:w-[calc(100%-68px)]";

const panel =
  "rounded-[19px] border border-border bg-white dark:border-[#254252] dark:bg-[#112b3b]";

const mainButton =
  "inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[11px] font-black text-white transition hover:opacity-90";

// تحويل قيم السيرفر إلى نصوص للعرض
function valueText(value) {
  if (value == null || value === "") {
    return "";
  }

  if (typeof value === "object") {
    return String(
      value.nameAr ??
      value.name ??
      value.name_ar ??
      value.title ??
      ""
    );
  }

  return String(value);
}

function first(...values) {
  return values.find(
    (value) =>
      value !== null &&
      value !== undefined &&
      value !== ""
  );
}

// استخراج قائمة الحجوزات من الاستجابة
function getList(payload) {
  let root = payload;

  for (let i = 0; i < 4; i += 1) {
    if (
      !root ||
      typeof root !== "object" ||
      Array.isArray(root)
    ) {
      break;
    }

    if (root.data != null) {
      root = root.data;
    } else if (root.result != null) {
      root = root.result;
    } else {
      break;
    }
  }

  if (Array.isArray(root)) {
    return root;
  }

  for (const key of [
    "bookings",
    "items",
    "results",
    "rows",
    "content",
    "list",
  ]) {
    if (Array.isArray(root?.[key])) {
      return root[key];
    }
  }

  throw new Error(
    "صيغة قائمة الحجوزات غير متوافقة مع الواجهة. لازم نراجع استجابة GET /bookings/me."
  );
}

// توحيد بيانات الحجز
function bookingData(raw, index) {
  const trip =
    raw.trip ??
    raw.tripDetails ??
    {};

  const route = trip.route ?? {};

  const seatsRaw = first(
    raw.seats,
    raw.bookedSeats,
    raw.bookingSeats,
    raw.seatAssignments,
    []
  );

  const seats = Array.isArray(seatsRaw)
    ? seatsRaw.map((seat) => {
        if (
          typeof seat !== "object" ||
          seat === null
        ) {
          return {
            number: String(seat),
            name: "",
            phone: "",
          };
        }

        return {
          number: valueText(
            first(
              seat.seatNumber,
              seat.number,
              seat.seat?.number
            )
          ),
          name: valueText(
            first(
              seat.passengerName,
              seat.name,
              seat.passenger?.name
            )
          ),
          phone: valueText(
            first(
              seat.passengerPhone,
              seat.phone,
              seat.passenger?.phone
            )
          ),
        };
      })
    : [];

  const amount = first(
    raw.totalAmount,
    raw.totalPrice,
    raw.total,
    raw.amount,
    raw.price
  );

  const numericAmount =
    amount == null ? null : Number(amount);

  const bookingId = first(
    raw.bookingNumber,
    raw.bookingCode,
    raw.reference,
    raw.id,
    raw.bookingId
  );

  return {
    key: String(bookingId ?? `row-${index}`),

    id:
      valueText(bookingId) ||
      "غير متوفر",

    status: valueText(
      first(raw.status, raw.bookingStatus)
    ),

    origin: valueText(
      first(
        trip.originCity,
        trip.fromCity,
        trip.origin,
        route.originCity,
        raw.originCity
      )
    ),

    destination: valueText(
      first(
        trip.destinationCity,
        trip.toCity,
        trip.destination,
        route.destinationCity,
        raw.destinationCity
      )
    ),

    departure: valueText(
      first(
        trip.departureTime,
        trip.departureAt,
        raw.departureTime
      )
    ),

    arrival: valueText(
      first(
        trip.arrivalTime,
        trip.arrivalAt,
        raw.arrivalTime
      )
    ),

    date: valueText(
      first(
        trip.date,
        trip.travelDate,
        trip.departureDate,
        raw.travelDate
      )
    ),

    company: valueText(
      first(
        trip.company,
        trip.transportCompany,
        raw.company
      )
    ),

    seats,

    amount:
      Number.isFinite(numericAmount)
        ? numericAmount
        : null,
  };
}

// عرض الوقت بدون تغيير توقيت السيرفر
function displayTime(value) {
  return (
    value.match(
      /(?:T|\s)(\d{2}:\d{2})/
    )?.[1] ??
    value.match(
      /^(\d{2}:\d{2})/
    )?.[1] ??
    "—"
  );
}

function displayDate(value) {
  const iso = value.match(
    /\d{4}-\d{2}-\d{2}/
  )?.[0];

  if (!iso) {
    return "تاريخ غير متوفر";
  }

  return new Intl.DateTimeFormat("ar-SY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(
    new Date(`${iso}T12:00:00`)
  );
}

function displayPrice(value) {
  if (value == null) {
    return "غير متوفر";
  }

  return (
    new Intl.NumberFormat("en-US").format(
      value
    ) + " ل.س"
  );
}

// تحديد شكل حالة الحجز حسب قيم السيرفر
function statusInfo(value) {
  const status = value.toUpperCase();

  if (
    ["CONFIRMED", "BOOKED", "SUCCESS"].includes(
      status
    )
  ) {
    return {
      label: "تم تأكيد الحجز",
      cls: "bg-[#e7f9f6] text-[#078e87]",
    };
  }

  if (
    ["PENDING", "WAITING"].includes(status)
  ) {
    return {
      label: "بانتظار التأكيد",
      cls: "bg-amber-50 text-amber-700",
    };
  }

  if (
    ["CANCELLED", "CANCELED"].includes(
      status
    )
  ) {
    return {
      label: "ملغي",
      cls: "bg-red-50 text-red-700",
    };
  }

  if (
    ["COMPLETED", "FINISHED"].includes(
      status
    )
  ) {
    return {
      label: "مكتمل",
      cls: "bg-slate-100 text-slate-700",
    };
  }

  return {
    label: value || "الحالة غير متوفرة",
    cls: "bg-slate-100 text-slate-700",
  };
}

// =====================================
// بطاقة حجز واحدة
// =====================================

function BookingCard({ booking }) {
  const [expanded, setExpanded] =
    useState(false);

  const status = statusInfo(
    booking.status
  );

  return (
    <article className={`${panel} overflow-hidden`}>
      {/* رأس بطاقة الحجز */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-border bg-[#f2f7f8] px-[25px] py-[19px] dark:border-[#254252] dark:bg-[#173748] max-[650px]:px-[13px]">
        <div className="flex items-center gap-2.5">
          <span className="grid h-[41px] w-[41px] place-items-center rounded-xl bg-[#e6f8f3] text-primary">
            <Ticket size={20} />
          </span>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted">
              رقم الحجز
            </span>

            <b
              dir="ltr"
              className="text-[13px]"
            >
              {booking.id}
            </b>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black ${status.cls}`}
        >
          <CheckCircle2 size={15} />
          {status.label}
        </span>
      </header>

      {/* تفاصيل خط الرحلة */}
      <div className="grid items-center gap-[25px] px-[25px] py-[30px] min-[701px]:grid-cols-[1.1fr_1fr] max-[650px]:px-[15px] max-[650px]:py-[21px]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <small className="text-[10px] text-muted">
              من
            </small>

            <h3 className="mt-1 break-words text-[21px] font-black max-[650px]:text-[18px]">
              {booking.origin || "—"}
            </h3>

            <b
              dir="ltr"
              className="block text-right text-xs"
            >
              {displayTime(
                booking.departure
              )}
            </b>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-primary">
            <BusFront size={20} />

            <div className="w-full border-t border-dashed border-border dark:border-[#254252]" />

            <small className="text-center text-[9px] text-muted">
              {displayDate(booking.date)}
            </small>
          </div>

          <div className="min-w-0">
            <small className="text-[10px] text-muted">
              إلى
            </small>

            <h3 className="mt-1 break-words text-[21px] font-black max-[650px]:text-[18px]">
              {booking.destination || "—"}
            </h3>

            <b
              dir="ltr"
              className="block text-right text-xs"
            >
              {displayTime(
                booking.arrival
              )}
            </b>
          </div>
        </div>

        {/* الشركة والمقاعد والسعر */}
        <div className="flex flex-col gap-[11px] border-r border-border pr-[26px] dark:border-[#254252] max-[700px]:border-r-0 max-[700px]:border-t max-[700px]:pr-0 max-[700px]:pt-4">
          <span className="flex items-center gap-2 text-[11px] font-bold text-muted">
            <BusFront size={17} />
            {booking.company ||
              "شركة النقل غير متوفرة"}
          </span>

          <span className="flex items-center gap-2 text-[11px] font-bold text-muted">
            <Armchair size={17} />

            المقاعد:{" "}
            {booking.seats.length
              ? booking.seats
                  .map(
                    (seat) => seat.number
                  )
                  .join("، ")
              : "غير متوفرة"}
          </span>

          <span className="flex items-center gap-2 text-[11px] font-bold text-muted">
            <Wallet size={17} />
            {displayPrice(booking.amount)}
          </span>
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex flex-wrap gap-[9px] border-t border-border px-[25px] py-4 dark:border-[#254252] max-[650px]:px-3">
        <button
          type="button"
          onClick={() =>
            setExpanded(
              (current) => !current
            )
          }
          aria-expanded={expanded}
          className="inline-flex min-h-[39px] items-center justify-center gap-2 rounded-lg border border-border px-4 text-[11px] font-black transition hover:border-primary dark:border-[#254252]"
        >
          <Ticket size={17} />
          {expanded
            ? "إخفاء التفاصيل"
            : "عرض التذكرة"}
        </button>

        <span className="inline-flex min-h-[39px] items-center gap-2 rounded-lg bg-[#f2f7f8] px-4 text-[11px] text-muted dark:bg-[#173748]">
          <Route size={17} />
          التتبّع قريباً
        </span>
      </div>

      {/* تفاصيل التذكرة */}
      {expanded && (
        <div className="border-t border-border bg-[#f8fbfb] px-6 py-5 dark:border-[#254252] dark:bg-[#173748] max-[650px]:px-4">
          <h4 className="mb-3 text-[12px] font-black">
            تفاصيل المقاعد والمسافرين
          </h4>

          {booking.seats.length === 0 ? (
            <p className="text-[11px] text-muted">
              السيرفر ما رجّع تفاصيل
              المسافرين ضمن قائمة الحجوزات.
            </p>
          ) : (
            <div className="space-y-2">
              {booking.seats.map(
                (seat, index) => (
                  <div
                    key={`${seat.number}-${index}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-white p-3 text-[11px] dark:border-[#254252] dark:bg-[#112b3b]"
                  >
                    <span className="font-black">
                      المقعد{" "}
                      {seat.number || "—"}
                    </span>

                    <span className="text-muted">
                      {seat.name ||
                        "الاسم غير متوفر"}
                    </span>

                    {seat.phone && (
                      <span
                        dir="ltr"
                        className="text-muted"
                      >
                        {seat.phone}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          <p className="mt-3 flex items-start gap-2 text-[10px] leading-5 text-muted">
            <Info
              size={15}
              className="mt-0.5 shrink-0"
            />
            التفاصيل مأخوذة من حسابك لدى
            السيرفر؛ لا يتم إنشاء تذكرة
            تجريبية.
          </p>
        </div>
      )}
    </article>
  );
}

// =====================================
// صفحة حجوزاتي
// =====================================

export default function MyBookingsPage() {
  const [state, setState] = useState(
    () => {
      const guest = !readToken();

      return {
        loading: !guest,
        guest,
        error: "",
        bookings: [],
      };
    }
  );

  const [refresh, setRefresh] =
    useState(0);

  useEffect(() => {
    const controller =
      new AbortController();

    const token = readToken();

    if (!token) {
      return;
    }

    async function load() {
      try {
        const response = await fetch(
          `${API_BASE}/bookings/me`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          setState({
            loading: false,
            guest: true,
            error: "",
            bookings: [],
          });
          return;
        }

        if (!response.ok) {
          throw new Error(
            `فشل تحميل الحجوزات (HTTP ${response.status}).`
          );
        }

        if (response.status === 204) {
          setState({
            loading: false,
            guest: false,
            error: "",
            bookings: [],
          });
          return;
        }

        const payload =
          await response.json();

        const bookings = getList(
          payload
        ).map(bookingData);

        setState({
          loading: false,
          guest: false,
          error: "",
          bookings,
        });
      } catch (error) {
        if (
          error?.name !== "AbortError"
        ) {
          setState({
            loading: false,
            guest: false,
            error:
              error.message ||
              "تعذّر تحميل الحجوزات.",
            bookings: [],
          });
        }
      }
    }

    load();

    return () => controller.abort();
  }, [refresh]);

  function retry() {
    const guest = !readToken();

    setState({
      loading: !guest,
      guest,
      error: "",
      bookings: [],
    });

    setRefresh(
      (count) => count + 1
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-[70vh] bg-background pb-[80px] text-foreground dark:bg-[#0b1c29] dark:text-white"
    >
      {/* عنوان الصفحة */}
      <section className="border-b border-border bg-gradient-to-bl from-[#f0f7f8] to-background py-[28px] dark:border-[#254252] dark:from-[#173748] dark:to-[#0b1c29]">
        <div className={container}>
          <nav
            aria-label="مسار التنقل"
            className="mb-[24px] flex items-center gap-2 text-[11px] font-extrabold text-muted"
          >
            <Link to="/">
              الرئيسية
            </Link>

            <ChevronLeft size={14} />

            <span>حجوزاتي</span>
          </nav>

          <span className="inline-flex rounded-full bg-[#e6f8f3] px-3 py-1 text-[11px] font-black text-[#078e87]">
            كل رحلاتك بمكان واحد
          </span>

          <h1 className="my-2 text-[34px] font-black max-[650px]:text-[27px]">
            تذاكرك{" "}
            <span className="text-primary">
              دايماً معك.
            </span>
          </h1>

          <p className="text-[13px] text-muted">
            راقب حجوزاتك، وارجع لتفاصيل
            الرحلة وقت ما تحتاج.
          </p>
        </div>
      </section>

      {/* محتوى الصفحة */}
      <section
        className={`${container} pt-[39px]`}
      >
        <div className="mb-[23px] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[19px] font-black">
              رحلاتي القادمة وحجوزاتي
            </h2>

            <p className="text-[11px] text-muted">
              الحجوزات المرتبطة بحسابك
              على سيرفر سيرنا
            </p>
          </div>

          <Link
            to="/results"
            className={mainButton}
          >
            <Plus size={17} />
            حجز جديد
          </Link>
        </div>

        {/* جاري التحميل */}
        {state.loading ? (
          <div
            role="status"
            className={`${panel} flex items-center justify-center gap-3 p-12 text-xs text-muted`}
          >
            <LoaderCircle
              size={20}
              className="animate-spin text-primary"
            />
            جاري تحميل الحجوزات...
          </div>
        ) : state.guest ? (
          /* المستخدم غير مسجل دخول */
          <div
            className={`${panel} p-10 text-center`}
          >
            <LogIn
              size={42}
              className="mx-auto mb-4 text-primary"
            />

            <h3 className="text-lg font-black">
              سجّل دخولك لتشوف حجوزاتك
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-muted">
              رحلاتك محفوظة بحسابك،
              وبتظهر هون بعد تسجيل الدخول.
            </p>

            <Link
              to="/login?redirect=%2Ftrips"
              className={`${mainButton} mt-5`}
            >
              <LogIn size={17} />
              تسجيل الدخول
            </Link>
          </div>
        ) : state.error ? (
          /* خطأ بالسيرفر */
          <div
            role="alert"
            className={`${panel} p-8 text-center`}
          >
            <Info
              size={35}
              className="mx-auto mb-3 text-amber-600"
            />

            <h3 className="font-black">
              تعذّر عرض الحجوزات
            </h3>

            <p className="mt-2 text-xs text-muted">
              {state.error}
            </p>

            <button
              type="button"
              onClick={retry}
              className={`${mainButton} mt-5`}
            >
              <RefreshCw size={16} />
              إعادة المحاولة
            </button>
          </div>
        ) : state.bookings.length === 0 ? (
          /* لا توجد حجوزات */
          <div
            className={`${panel} p-10 text-center`}
          >
            <Ticket
              size={42}
              className="mx-auto mb-4 text-primary"
            />

            <h3 className="text-lg font-black">
              لسا ما عندك حجوزات
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-muted">
              لما تحجز رحلة من حسابك،
              رح تظهر هون بعد تأكيدها
              من السيرفر.
            </p>

            <Link
              to="/results"
              className={`${mainButton} mt-5`}
            >
              <Plus size={17} />
              دور على رحلة
            </Link>
          </div>
        ) : (
          /* عرض حجوزات المستخدم */
          <div className="space-y-4">
            {state.bookings.map(
              (booking) => (
                <BookingCard
                  key={booking.key}
                  booking={booking}
                />
              )
            )}

            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 text-[11px] font-black text-primary"
            >
              <RefreshCw size={15} />
              تحديث حجوزاتي
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
