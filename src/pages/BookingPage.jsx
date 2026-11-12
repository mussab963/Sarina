
import { useEffect, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";

import {
  Armchair,
  ArrowLeft,
  ArrowRight,
  BusFront,
  Check,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  LoaderCircle,
  ShieldCheck,
  Ticket,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

import {
  formatArabicDate,
  formatPrice,
} from "../data/resultsData";

import {
  loadSeats,
  loadTrip,
} from "../services/sairnaApi";

// Website API الخاص بالمسافرين
const API_BASE =
  "https://sairna.abdulrahman-hares.com/api/v1/website";

// لازم يكون نفس المفتاح المستخدم بصفحة Login
const TOKEN_KEY = "sairna_passenger_access_token";

const container =
  "mx-auto w-[calc(100%-34px)] max-w-[1216px] min-[651px]:w-[calc(100%-48px)] min-[1151px]:w-[calc(100%-68px)]";

const card =
  "rounded-[20px] border border-border bg-white shadow-[0_15px_55px_rgba(19,54,72,.065)] dark:border-[#254252] dark:bg-[#112b3b]";

const stages = [
  "اختيار المقاعد",
  "بيانات المسافرين",
  "المراجعة والتأكيد",
];

// ========================================
// إنشاء الحجز الحقيقي
// ========================================

async function submitBooking(tripId, seats, token) {
  if (!token) {
    const error = new Error(
      "يجب تسجيل الدخول أولاً."
    );
    error.status = 401;
    throw error;
  }

  const id = Number(tripId);

  if (!Number.isInteger(id) || id < 1) {
    throw new Error("معرّف الرحلة غير صالح.");
  }

  if (
    !Array.isArray(seats) ||
    seats.length < 1 ||
    seats.length > 4
  ) {
    throw new Error(
      "يمكن حجز من مقعد واحد إلى أربعة مقاعد."
    );
  }

  const normalizedSeats = seats.map((seat) => {
    const seatNumber = Number(seat.seatNumber);
    const passengerName = String(
      seat.passengerName ?? ""
    ).trim();
    const passengerPhone = String(
      seat.passengerPhone ?? ""
    ).trim();

    if (
      !Number.isInteger(seatNumber) ||
      seatNumber < 1
    ) {
      throw new Error("رقم المقعد غير صالح.");
    }

    if (passengerName.length < 3) {
      throw new Error(
        "أدخل الاسم الكامل لكل مسافر."
      );
    }

    if (
      passengerPhone.replace(/\D/g, "").length < 9
    ) {
      throw new Error(
        "أدخل رقم موبايل صحيح لكل مسافر."
      );
    }

    return {
      seatNumber,
      passengerName,
      passengerPhone,
    };
  });

  const seatNumbers = normalizedSeats.map(
    (seat) => seat.seatNumber
  );

  if (
    new Set(seatNumbers).size !== seatNumbers.length
  ) {
    throw new Error(
      "لا يمكن حجز المقعد نفسه مرتين."
    );
  }

  let response;

  try {
    response = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tripId: id,
        seats: normalizedSeats,
      }),
    });
  } catch (error) {
    throw new Error(
      "تعذّر الاتصال بالسيرفر. تحقق من اتصالك وحالة الحجز قبل إعادة المحاولة.",
      { cause: error }
    );
  }

  const responseText = await response.text();

  let result = null;

  if (responseText) {
    try {
      result = JSON.parse(responseText);
    } catch {
      result = null;
    }
  }

  if (!response.ok) {
    let message =
      result?.message ??
      result?.error?.message ??
      `فشل إنشاء الحجز (HTTP ${response.status}).`;

    if (Array.isArray(message)) {
      message = message.join("، ");
    }

    if (response.status === 401) {
      message =
        "جلسة تسجيل الدخول غير صالحة. سجّل دخولك مجدداً.";
    } else if (response.status === 403) {
      message =
        "هذا الحساب غير مخوّل بإنشاء الحجز.";
    } else if (response.status === 409) {
      message =
        "بعض المقاعد لم تعد متاحة. اختر مقاعد ثانية.";
    }

    const error = new Error(String(message));
    error.status = response.status;
    throw error;
  }

  // استجابة النجاح الموثقة في Swagger هي 201
  return result;
}

// ========================================
// شريط مراحل الحجز
// ========================================

function BookingSteps({ current }) {
  return (
    <div className="my-[30px] flex flex-wrap items-center justify-center gap-2 sm:gap-4">
      {stages.map((label, index) => (
        <div
          key={label}
          className="flex items-center gap-2 sm:gap-4"
        >
          {index > 0 && (
            <span className="h-px w-4 bg-border sm:w-[65px] dark:bg-[#254252]" />
          )}

          <span
            aria-current={
              current === index ? "step" : undefined
            }
            className={`flex items-center gap-2 text-[10px] font-black sm:text-[11px] ${
              current >= index
                ? "text-primary"
                : "text-muted"
            }`}
          >
            <span
              className={`grid h-[27px] w-[27px] shrink-0 place-items-center rounded-full border ${
                current >= index
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-[#f2f7f8] dark:border-[#254252] dark:bg-[#173748]"
              }`}
            >
              {index < current ? (
                <Check size={16} />
              ) : (
                index + 1
              )}
            </span>

            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ========================================
// ملخص الحجز
// ========================================

function BookingSummary({
  trip,
  people,
  selected,
}) {
  return (
    <aside
      className={`${card} h-fit p-[20px] lg:sticky lg:top-24`}
    >
      <h2 className="flex items-center gap-2 border-b border-border pb-4 text-[15px] font-black dark:border-[#254252]">
        <Ticket size={18} className="text-primary" />
        ملخص الحجز
      </h2>

      <div className="my-5 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#e7f9f6] text-2xl font-black text-primary">
          {trip.company.short}
        </span>

        <div>
          <strong className="text-[12px]">
            {trip.company.name}
          </strong>

          <p className="text-[10px] text-muted">
            رحلة باتجاه واحد
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-[#f2f7f8] p-3 dark:bg-[#173748]">
        <div>
          <small className="text-[10px] text-muted">
            الانطلاق
          </small>
          <b className="block text-sm">
            {trip.origin.name}
          </b>
          <span
            dir="ltr"
            className="text-[10px] text-muted"
          >
            {trip.departure}
          </span>
        </div>

        <ArrowLeft
          size={19}
          className="text-primary"
        />

        <div>
          <small className="text-[10px] text-muted">
            الوصول
          </small>
          <b className="block text-sm">
            {trip.destination.name}
          </b>
          <span
            dir="ltr"
            className="text-[10px] text-muted"
          >
            {trip.arrival || "—"}
          </span>
        </div>
      </div>

      <dl className="my-5 space-y-3.5 text-[11px]">
        {[
          [
            "تاريخ الرحلة",
            formatArabicDate(trip.date),
          ],
          ["المسافرون", people],
          [
            "المقاعد",
            selected.length
              ? selected.join("، ")
              : "لم تُحدَّد بعد",
          ],
          [
            "السعر للشخص",
            formatPrice(trip.price),
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3"
          >
            <dt className="text-muted">
              {label}
            </dt>
            <dd className="font-bold">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center justify-between gap-3 border-t border-dashed border-border pt-4 dark:border-[#254252]">
        <b className="text-xs">
          السعر الإجمالي
        </b>
        <strong className="text-[17px] font-black text-primary">
          {formatPrice(
            trip.price == null
              ? null
              : trip.price * people
          )}
        </strong>
      </div>

      <p className="mt-4 flex gap-2 rounded-lg bg-[#f2f7f8] p-3 text-[10px] leading-5 text-muted dark:bg-[#173748]">
        <ShieldCheck
          size={17}
          className="shrink-0 text-primary"
        />
        يتم تثبيت الحجز فقط بعد موافقة
        السيرفر على الطلب.
      </p>
    </aside>
  );
}

// ========================================
// اختيار المقاعد
// ========================================

function SeatMap({
  seats,
  selected,
  people,
  onToggle,
}) {
  const rows = Array.from(
    { length: Math.ceil(seats.length / 4) },
    (_, index) =>
      seats.slice(index * 4, index * 4 + 4)
  );

  return (
    <div className="grid items-start gap-[26px] md:grid-cols-[minmax(260px,1fr)_minmax(190px,.8fr)]">
      <div className="mx-auto w-full max-w-[353px] rounded-[100px_100px_26px_26px] border border-border bg-[#f2f7f8] px-4 pb-6 pt-5 dark:border-[#254252] dark:bg-[#173748]">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-[#bdced2] pb-4 text-[10px] font-black text-muted">
          <span className="flex items-center gap-2">
            <BusFront
              size={18}
              className="text-primary"
            />
            مقدمة الحافلة
          </span>
        </div>

        <div className="space-y-2">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-[20px_1fr_1fr_12px_1fr_1fr] items-center gap-1.5 sm:grid-cols-[27px_1fr_1fr_15px_1fr_1fr]"
            >
              <span className="text-center text-[10px] text-muted">
                {String(rowIndex + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              {row.map((seat, index) => {
                const chosen =
                  selected.includes(seat.number);

                return (
                  <button
                    key={seat.number}
                    type="button"
                    disabled={!seat.available}
                    aria-pressed={chosen}
                    aria-label={`المقعد ${seat.number}`}
                    onClick={() =>
                      onToggle(seat.number)
                    }
                    style={{
                      gridColumn: [2, 3, 5, 6][index],
                    }}
                    className={`relative grid h-[39px] min-w-0 place-items-center rounded-[9px] border text-[10px] transition ${
                      !seat.available
                        ? "cursor-not-allowed border-[#d9e1e3] bg-[#e2e9eb] text-[#aab9be]"
                        : chosen
                          ? "border-primary bg-primary text-white"
                          : "border-[#c9dade] bg-white text-[#8fadb4] hover:border-primary hover:text-primary"
                    }`}
                  >
                    <Armchair size={17} />

                    <small className="absolute bottom-0.5 left-1 text-[8px]">
                      {seat.number}
                    </small>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3 border-t border-border pt-3 text-[10px] text-muted">
          <span>□ متاح</span>
          <span className="text-primary">
            ■ مختار
          </span>
          <span>▣ محجوز</span>
        </div>
      </div>

      <div className="rounded-[17px] border border-border p-5 dark:border-[#254252]">
        <span className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-[#e6f8f3] text-primary">
          <Armchair size={24} />
        </span>

        <h3 className="font-black">
          مكانك، راحتك.
        </h3>

        <p className="mt-2 text-xs leading-6 text-muted">
          اختار مقعدك حسب تفضيلك،
          جنب الشباك أو الممر.
        </p>

        <div className="mt-5 flex justify-between border-t border-border pt-3 text-xs">
          <span>المقاعد المختارة</span>
          <b className="text-primary">
            {selected.length} / {people}
          </b>
        </div>

        <p className="mt-4 text-xs text-muted">
          {selected.length
            ? `اخترت: ${selected.join("، ")}`
            : "لسا ما اخترت مقعد"}
        </p>

        <p className="mt-4 rounded-xl bg-[#e6f8f3] p-3 text-[11px] text-[#078e87]">
          لازم تختار عدد مقاعد مساوي لعدد
          المسافرين حتى تكمل.
        </p>
      </div>
    </div>
  );
}

// ========================================
// بيانات المسافرين
// ========================================

function PassengersForm({
  passengers,
  selected,
  onUpdate,
}) {
  return (
    <div className="space-y-4">
      {passengers.map((person, index) => (
        <section
          key={index}
          className="rounded-[17px] border border-border p-[22px] dark:border-[#254252]"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-black">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e6f8f3] text-primary">
                {index + 1}
              </span>

              المسافر {index + 1}
            </h3>

            <span className="text-xs text-primary">
              مقعد {selected[index]}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold">
              الاسم الكامل

              <input
                type="text"
                value={person.name}
                maxLength={90}
                autoComplete="name"
                onChange={(event) =>
                  onUpdate(
                    index,
                    "name",
                    event.target.value
                  )
                }
                className="mt-2 block h-[49px] w-full rounded-xl border border-border bg-transparent px-3 text-xs outline-primary dark:border-[#254252]"
                placeholder="مثال: أحمد خالد"
              />
            </label>

            <label className="text-xs font-bold">
              رقم الموبايل

              <input
                type="tel"
                dir="ltr"
                inputMode="tel"
                value={person.phone}
                maxLength={22}
                onChange={(event) =>
                  onUpdate(
                    index,
                    "phone",
                    event.target.value
                  )
                }
                className="mt-2 block h-[49px] w-full rounded-xl border border-border bg-transparent px-3 text-xs outline-primary dark:border-[#254252]"
                placeholder="09xxxxxxxx"
              />
            </label>
          </div>
        </section>
      ))}
    </div>
  );
}

// ========================================
// المراجعة وطريقة الحجز
// ========================================

function BookingReview({
  passengers,
  selected,
  payment,
  onPaymentChange,
}) {
  const paymentOptions = [
    {
      value: "office",
      Icon: Wallet,
      title: "الدفع في مكتب الشركة",
      description:
        "ادفع عند الحضور لمكتب الشركة قبل الرحلة.",
    },
    {
      value: "demo",
      Icon: CreditCard,
      title: "دفع إلكتروني (تجريبي)",
      description:
        "هذا الخيار للعرض فقط، ولا توجد بوابة دفع إلكتروني حالياً.",
    },
  ];

  return (
    <div>
      <div className="mb-[18px] rounded-[17px] border border-border p-[22px] dark:border-[#254252]">
        <h3 className="mb-[14px] text-sm font-black">
          تفاصيل المسافرين
        </h3>

        {passengers.map((person, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-t border-border py-3 dark:border-[#254252]"
          >
            <span className="grid h-[39px] w-[39px] shrink-0 place-items-center rounded-full bg-[#e6f8f3] text-primary">
              <UserRound size={19} />
            </span>

            <div className="flex min-w-0 flex-col">
              <b className="break-words text-[12px]">
                {person.name}
              </b>

              <span
                dir="ltr"
                className="text-left text-[11px] text-muted"
              >
                {person.phone}
              </span>
            </div>

            <small className="mr-auto shrink-0 text-[11px] font-black text-primary">
              المقعد {selected[index]}
            </small>
          </div>
        ))}
      </div>

      <fieldset className="mb-[18px] rounded-[17px] border border-border p-[22px] dark:border-[#254252]">
        <legend className="sr-only">
          طريقة تأكيد الحجز
        </legend>

        <h3 className="mb-[14px] text-sm font-black">
          طريقة تأكيد الحجز
        </h3>

        <div className="space-y-[9px]">
          {paymentOptions.map(
            ({
              value,
              Icon,
              title,
              description,
            }) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-[13px] transition ${
                  payment === value
                    ? "border-primary bg-[#e6f8f3] dark:bg-[#174b49]"
                    : "border-border bg-white dark:border-[#254252] dark:bg-[#112b3b]"
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={value}
                  checked={payment === value}
                  onChange={() =>
                    onPaymentChange(value)
                  }
                  className="shrink-0 accent-primary"
                />

                <span className="grid h-[43px] w-[43px] shrink-0 place-items-center rounded-[11px] bg-[#f2f7f8] text-primary">
                  <Icon size={22} />
                </span>

                <span className="flex min-w-0 flex-col">
                  <b className="text-[12px]">
                    {title}
                  </b>

                  <small className="text-[10px] leading-5 text-muted">
                    {description}
                  </small>
                </span>
              </label>
            )
          )}
        </div>
      </fieldset>

      <p className="flex items-start gap-2 text-[11px] leading-6 text-[#078e87]">
        <ShieldCheck
          size={18}
          className="mt-0.5 shrink-0"
        />
        الحجز يُؤكَّد فقط بعد قبول
        السيرفر للطلب. خيار الدفع الإلكتروني
        تجريبي وغير مرتبط بتحصيل أموال.
      </p>
    </div>
  );
}

// ========================================
// الصفحة الرئيسية للحجز
// ========================================

export default function BookingPage() {
  const { tripId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const [params] = useSearchParams();

  const requestedPeople = Number(
    params.get("people")
  );

  const people =
    Number.isInteger(requestedPeople) &&
    requestedPeople >= 1 &&
    requestedPeople <= 4
      ? requestedPeople
      : 1;

  // استرجاع المسودة بعد تسجيل الدخول
  const draft =
    location.state?.bookingDraft?.tripId ===
    tripId
      ? location.state.bookingDraft
      : null;

  const returnTo =
    location.state?.returnTo || "/results";

  const [request, setRequest] = useState({
    trip: location.state?.trip || null,
    seats: [],
    loading: true,
    error: "",
  });

  const [selected, setSelected] = useState(
    () =>
      Array.isArray(draft?.selected)
        ? draft.selected.slice(0, people)
        : []
  );

  const [passengers, setPassengers] = useState(
    () =>
      Array.from(
        { length: people },
        (_, index) => ({
          name:
            draft?.passengers?.[index]?.name ||
            "",
          phone:
            draft?.passengers?.[index]?.phone ||
            "",
        })
      )
  );

  const [step, setStep] = useState(
    draft ? 2 : 0
  );

  const [payment, setPayment] = useState(
    draft?.payment || "office"
  );

  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] =
    useState(false);

  // تحميل الرحلة والمقاعد الحقيقية
  useEffect(() => {
    const controller = new AbortController();

    const tripRequest = location.state?.trip
      ? Promise.resolve(location.state.trip)
      : loadTrip(
          tripId,
          controller.signal
        );

    Promise.all([
      tripRequest,
      loadSeats(
        tripId,
        controller.signal
      ),
    ])
      .then(([trip, seats]) => {
        setRequest({
          trip,
          seats,
          loading: false,
          error: "",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setRequest((old) => ({
            ...old,
            loading: false,
            error: error.message,
          }));
        }
      });

    return () => controller.abort();
  }, [tripId, location.state?.trip]);

  // اختيار أو إلغاء مقعد
  function toggleSeat(number) {
    setMessage("");

    setSelected((current) =>
      current.includes(number)
        ? current.filter(
            (item) => item !== number
          )
        : current.length >= people
          ? current
          : [...current, number]
    );
  }

  // تحديث بيانات المسافرين
  function updatePassenger(index, key, value) {
    setPassengers((current) =>
      current.map((person, i) =>
        i === index
          ? {
              ...person,
              [key]: value,
            }
          : person
      )
    );

    setMessage("");
  }

  // التأكد من أن المقاعد ما زالت متاحة
  async function verifySeats() {
    const fresh = await loadSeats(tripId);

    setRequest((current) => ({
      ...current,
      seats: fresh,
    }));

    const available = new Set(
      fresh
        .filter((seat) => seat.available)
        .map((seat) => seat.number)
    );

    const unavailableSelected = selected.some(
      (number) => !available.has(number)
    );

    if (unavailableSelected) {
      setSelected((current) =>
        current.filter((number) =>
          available.has(number)
        )
      );

      setStep(0);

      throw new Error(
        "بعض المقاعد صارت محجوزة. اختار مقاعد متاحة من جديد."
      );
    }
  }

  // الانتقال بين المراحل
  async function next() {
    setMessage("");

    if (step === 0) {
      if (selected.length !== people) {
        setMessage(
          `اختار ${people} مقعد قبل المتابعة.`
        );
        return;
      }

      setBusy(true);

      try {
        await verifySeats();
        setStep(1);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setBusy(false);
      }

      return;
    }

    if (step === 1) {
      if (
        passengers.some(
          (person) =>
            person.name.trim().length < 3 ||
            person.phone.replace(
              /\D/g,
              ""
            ).length < 9
        )
      ) {
        setMessage(
          "أدخل الاسم الكامل ورقم هاتف صحيح لكل مسافر."
        );
        return;
      }

      setStep(2);
    }
  }

  // الذهاب إلى Login مع الاحتفاظ ببيانات الحجز
  function goToLogin() {
    const redirect =
      `${location.pathname}${location.search}`;

    navigate(
      `/login?redirect=${encodeURIComponent(
        redirect
      )}`,
      {
        state: {
          trip: request.trip,
          returnTo,
          bookingDraft: {
            tripId,
            selected,
            passengers,
            payment,
          },
        },
      }
    );
  }

  // ========================================
  // تأكيد الحجز الحقيقي
  // ========================================

  async function confirm() {
    // منع إرسال الحجز مرتين من نفس الشاشة
    if (busy || bookingConfirmed) {
      return;
    }

    setMessage("");

    // لا يوجد دفع إلكتروني حقيقي
    if (payment === "demo") {
      setMessage(
        "الدفع الإلكتروني حالياً تجريبي. اختار الدفع في مكتب الشركة لإكمال الحجز."
      );
      return;
    }

    // قراءة جلسة المسافر
    
const token = (() => {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
})();


    // المستخدم غير مسجل دخول
    if (!token) {
      goToLogin();
      return;
    }

    // تحقق نهائي من عدد المقاعد
    if (selected.length !== people) {
      setStep(0);
      setMessage(
        "عدد المقاعد المختارة لا يطابق عدد المسافرين."
      );
      return;
    }

    // تحقق نهائي من بيانات المسافرين
    if (
      passengers.some(
        (person) =>
          person.name.trim().length < 3 ||
          person.phone.replace(/\D/g, "").length < 9
      )
    ) {
      setStep(1);
      setMessage(
        "راجع الاسم الكامل ورقم الموبايل لكل مسافر."
      );
      return;
    }

    setBusy(true);

    try {
      // تحديث حالة المقاعد قبل الإرسال
      await verifySeats();

      // تحويل البيانات إلى صيغة Swagger
      const bookingSeats = selected.map(
        (seatNumber, index) => ({
          seatNumber: Number(seatNumber),
          passengerName:
            passengers[index].name.trim(),
          passengerPhone:
            passengers[index].phone.trim(),
        })
      );

      // تنفيذ POST /bookings الحقيقي
      await submitBooking(
        tripId,
        bookingSeats,
        token
      );

      // ما منوصل هون إلا إذا السيرفر قبل الطلب
      setBookingConfirmed(true);
      setMessage("");
    } catch (error) {
      // جلسة منتهية أو غير صالحة
      if (error.status === 401) {
        try {
          sessionStorage.removeItem(TOKEN_KEY);
        } catch {
          // التخزين غير متاح
        }

        goToLogin();
        return;
      }

      if (error.status === 409) {
        // نعيد عرض المقاعد حتى يختار المستخدم
        try {
          const fresh = await loadSeats(tripId);

          setRequest((current) => ({
            ...current,
            seats: fresh,
          }));

          setSelected([]);
          setStep(0);
        } catch {
          // ستظهر رسالة تعارض الحجز للمستخدم
        }
      }

      setMessage(
        error.message ||
          "حدث خطأ أثناء تأكيد الحجز."
      );
    } finally {
      setBusy(false);
    }
  }

  const trip = request.trip;

  return (
    <main
      dir="rtl"
      className="min-h-[70vh] bg-background pb-[90px] text-foreground dark:bg-[#0b1c29] dark:text-white"
    >
      <div className={container}>
        <header className="pt-[30px]">
          <nav
            className="flex items-center gap-2 text-[11px] font-extrabold text-muted"
            aria-label="مسار التنقل"
          >
            <Link to="/">الرئيسية</Link>
            <ChevronLeft size={13} />
            <Link to={returnTo}>
              الرحلات
            </Link>
            <ChevronLeft size={13} />
            <span>إتمام الحجز</span>
          </nav>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <span className="rounded-full bg-[#e6f8f3] px-3 py-1 text-[11px] font-black text-[#078e87]">
                باقي شوي وتوصل
              </span>

              <h1 className="mt-2 text-[29px] font-black">
                كمّل حجز{" "}
                <span className="text-primary">
                  رحلتك.
                </span>
              </h1>
            </div>

            <Link
              to={returnTo}
              className="flex items-center gap-2 text-[11px] font-bold text-muted"
            >
              <ArrowRight size={16} />
              تغيير الرحلة
            </Link>
          </div>
        </header>

        <BookingSteps current={step} />

        {request.loading ? (
          <div
            role="status"
            className={`${card} p-8 text-center`}
          >
            جاري تحميل الرحلة والمقاعد...
          </div>
        ) : request.error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
          >
            {request.error}
          </div>
        ) : trip ? (
          <div className="grid items-start gap-[21px] lg:grid-cols-[minmax(0,1fr)_320px]">
            <section
              className={`${card} min-w-0 p-[17px] sm:p-[29px]`}
            >
              <div className="mb-[21px]">
                <h2 className="flex items-center gap-[11px] text-[20px] font-black">
                  {bookingConfirmed ? (
                    <CheckCircle2
                      size={24}
                      className="text-primary"
                    />
                  ) : step === 0 ? (
                    <Armchair
                      size={24}
                      className="text-primary"
                    />
                  ) : step === 1 ? (
                    <Users
                      size={24}
                      className="text-primary"
                    />
                  ) : (
                    <CheckCircle2
                      size={24}
                      className="text-primary"
                    />
                  )}

                  {bookingConfirmed
                    ? "تم تأكيد حجزك!"
                    : step === 0
                      ? "اختار مكانك المفضّل"
                      : step === 1
                        ? "مين مسافر معنا؟"
                        : "كل شي جاهز؟"}
                </h2>

                <p className="mt-1 text-xs text-muted">
                  {bookingConfirmed
                    ? "تم إنشاء الحجز بنجاح لدى السيرفر."
                    : step === 0
                      ? "اختار عدد المقاعد المطلوب من المقاعد المتاحة."
                      : step === 1
                        ? "دخل بيانات المسافرين حسب عدد المقاعد المختارة."
                        : "راجع معلومات الرحلة قبل ما تثبّت الحجز."}
                </p>
              </div>

              {bookingConfirmed ? (
                <div
                  role="status"
                  className="rounded-[17px] border border-emerald-200 bg-emerald-50 p-7 text-center text-emerald-800"
                >
                  <CheckCircle2
                    size={48}
                    className="mx-auto mb-3 text-emerald-600"
                  />

                  <h3 className="text-lg font-black">
                    حجزك صار جاهز!
                  </h3>

                  <p className="mx-auto mt-2 max-w-[360px] text-xs leading-6">
                    تم إنشاء الحجز بنجاح.
                    احتفظ بتفاصيل الرحلة،
                    وراجع حجوزاتك من حسابك.
                  </p>

                  <Link
                    to="/"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-white"
                  >
                    <ArrowRight size={16} />
                    العودة للرئيسية
                  </Link>
                </div>
              ) : (
                <>
                  {step === 0 && (
                    <SeatMap
                      seats={request.seats}
                      selected={selected}
                      people={people}
                      onToggle={toggleSeat}
                    />
                  )}

                  {step === 1 && (
                    <PassengersForm
                      passengers={passengers}
                      selected={selected}
                      onUpdate={updatePassenger}
                    />
                  )}

                  {step === 2 && (
                    <BookingReview
                      passengers={passengers}
                      selected={selected}
                      payment={payment}
                      onPaymentChange={setPayment}
                    />
                  )}

                  {message && (
                    <p
                      role="alert"
                      className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-6 text-amber-900"
                    >
                      {message}
                    </p>
                  )}

                  <div className="mt-[27px] flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5 dark:border-[#254252]">
                    {step === 0 ? (
                      <Link
                        to={returnTo}
                        className="flex items-center gap-2 text-[11px] font-bold text-muted"
                      >
                        <ArrowRight size={16} />
                        رجوع للرحلات
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setStep((current) => current - 1);
                          setMessage("");
                        }}
                        className="flex items-center gap-2 text-[11px] font-bold text-muted disabled:opacity-50"
                      >
                        <ArrowRight size={16} />
                        السابق
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={busy}
                      onClick={
                        step === 2 ? confirm : next
                      }
                      className="inline-flex min-h-[43px] items-center gap-2 rounded-xl bg-primary px-5 py-3 text-[11px] font-black text-white disabled:opacity-60"
                    >
                      {busy ? (
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <ArrowLeft size={16} />
                      )}

                      {busy
                        ? "جارٍ التحقق..."
                        : step === 2
                          ? "تأكيد الحجز"
                          : "متابعة الحجز"}
                    </button>
                  </div>
                </>
              )}
            </section>

            <BookingSummary
              trip={trip}
              people={people}
              selected={selected}
            />
          </div>
        ) : (
          <div className={`${card} p-6`}>
            الرحلة غير موجودة.
          </div>
        )}
      </div>
    </main>
  );
}
