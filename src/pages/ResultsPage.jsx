
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";

import {
  ArrowLeft,
  ArrowLeftRight,
  Armchair,
  BusFront,
  CalendarDays,
  ChevronLeft,
  ListFilter,
  MapPin,
  RefreshCw,
  Search,
  SearchX,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import {
  CITIES,
  TIME_FILTERS,
  filterTrips,
  formatArabicDate,
  formatDuration,
  formatPrice,
  getCity,
  isValidDate,
  readSearchParams,
  todayISO,
} from "../data/resultsData";

import { loadTrips } from "../services/sairnaApi";

// Tailwind CSS v4 - قياسات تصميم سيرنا
const container =
  "mx-auto w-[calc(100%-34px)] max-w-[1216px] min-[651px]:w-[calc(100%-48px)] min-[1151px]:w-[calc(100%-68px)]";

const panel =
  "border border-border bg-white dark:border-[#254252] dark:bg-[#112b3b]";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-[11px] font-black text-white transition hover:bg-primary-dark";

// ألوان الشركات من تصميم الأستاذ
const companyDesign = [
  {
    key: "sham",
    name: "الشام للنقل",
    keyword: "الشام",
    short: "ش",
    color: "#109d9c",
    bg: "#e7f9f6",
  },
  {
    key: "furat",
    name: "الفرات للسياحة",
    keyword: "الفرات",
    short: "ف",
    color: "#e69a46",
    bg: "#fff3df",
  },
  {
    key: "nawras",
    name: "النورس إكسبرس",
    keyword: "النورس",
    short: "ن",
    color: "#5085e6",
    bg: "#e9efff",
  },
  {
    key: "ittihad",
    name: "الاتحاد للنقل",
    keyword: "الاتحاد",
    short: "ا",
    color: "#9969ce",
    bg: "#f1eafe",
  },
];

function CompanyLogo({ company, small = false }) {
  const design = companyDesign.find((item) =>
    company.name.includes(item.keyword)
  );

  return (
    <span
      aria-hidden="true"
      style={{
        color: design?.color ?? "#109d9c",
        backgroundColor: design?.bg ?? "#e7f9f6",
      }}
      className={`grid shrink-0 place-items-center font-black ${
        small
          ? "h-8 w-8 rounded-lg text-lg"
          : "h-[49px] w-[49px] rounded-[14px] text-[27px]"
      }`}
    >
      {design?.short ?? company.short ?? "ن"}
    </span>
  );
}

// عنوان الصفحة
function ResultsBanner() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-bl from-[#f0f7f8] to-background pb-[45px] pt-[26px] dark:from-[#173748] dark:to-[#0b1c29]">
      <div className={container}>
        <nav
          aria-label="مسار التنقل"
          className="mb-[22px] flex items-center gap-2 text-[11px] font-extrabold text-muted"
        >
          <Link to="/">الرئيسية</Link>
          <ChevronLeft size={14} />
          <span>نتائج البحث</span>
        </nav>

        <div className="flex items-center justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e6f8f3] px-3 py-1 text-[11px] font-black text-[#078e87]">
              <Sparkles size={13} />
              اختصر الطريق
            </span>

            <h1 className="my-2 text-[36px] font-black max-[650px]:text-[27px]">
              اختار الرحلة{" "}
              <span className="text-primary">
                اللي بتشبهك.
              </span>
            </h1>

            <p className="text-[13px] text-muted">
              قارن بين الشركات والأوقات،
              واحجز مقعدك بكل سهولة.
            </p>
          </div>

          <BusFront
            size={70}
            className="shrink-0 text-primary opacity-35 max-[650px]:hidden"
          />
        </div>
      </div>
    </section>
  );
}

const searchInput =
  "mt-3 h-7 w-full min-w-0 bg-transparent text-[11px] font-black outline-none dark:text-white";

function SearchField({ label, Icon, children }) {
  return (
    <label className="relative flex h-[57px] min-w-0 items-center gap-2 rounded-xl border border-border bg-white px-3 pb-1 pt-3 focus-within:border-primary dark:border-[#254252] dark:bg-[#112b3b]">
      <span className="absolute right-3 top-1.5 text-[10px] font-bold text-muted">
        {label}
      </span>

      <Icon
        size={18}
        className="mt-3 shrink-0 text-primary"
      />

      {children}
    </label>
  );
}

// نموذج البحث - يحتفظ بالشركة المختارة
function ResultsSearchForm({ initial, company }) {
  const navigate = useNavigate();

  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  function update(name, value) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
    setError("");
  }

  function submit(event) {
    event.preventDefault();

    if (form.origin === form.destination) {
      setError(
        "مدينة الانطلاق والوصول لازم يكونوا مختلفين."
      );
      return;
    }

    if (!isValidDate(form.date)) {
      setError("اختار تاريخ رحلة صحيح.");
      return;
    }

    const query = new URLSearchParams({
      origin: form.origin,
      destination: form.destination,
      date: form.date,
      people: String(form.people),
    });

    // الحفاظ على فلتر الشركة عند البحث
    if (company !== "all") {
      query.set("company", company);
    }

    navigate(`/results?${query.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className={`${panel} relative z-10 -mt-[25px] rounded-[18px] p-[18px] shadow-[0_15px_55px_rgba(19,54,72,.065)] max-[650px]:p-3`}
    >
      <div className="grid items-end gap-[9px] [grid-template-columns:1fr_29px_1fr] min-[651px]:[grid-template-columns:1fr_30px_1fr_1fr_1fr] min-[901px]:[grid-template-columns:1fr_27px_1fr_1fr_.7fr_1.1fr] min-[1151px]:[grid-template-columns:1.12fr_34px_1.12fr_1fr_.74fr_1.14fr]">
        <SearchField label="من وين؟" Icon={MapPin}>
          <select
            value={form.origin}
            onChange={(e) =>
              update("origin", e.target.value)
            }
            className={searchInput}
          >
            {CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </SearchField>

        <button
          type="button"
          aria-label="تبديل المدن"
          onClick={() => {
            setForm((old) => ({
              ...old,
              origin: old.destination,
              destination: old.origin,
            }));
            setError("");
          }}
          className="mb-2 grid h-[38px] place-items-center rounded-lg bg-[#e6f8f3] text-primary"
        >
          <ArrowLeftRight size={18} />
        </button>

        <SearchField label="لوين؟" Icon={MapPin}>
          <select
            value={form.destination}
            onChange={(e) =>
              update("destination", e.target.value)
            }
            className={searchInput}
          >
            {CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </SearchField>

        <div className="col-span-2 min-[651px]:col-span-1">
          <SearchField
            label="تاريخ الرحلة"
            Icon={CalendarDays}
          >
            <input
              type="date"
              min={todayISO()}
              required
              value={form.date}
              onChange={(e) =>
                update("date", e.target.value)
              }
              className={searchInput}
            />
          </SearchField>
        </div>

        <SearchField
          label="المسافرين"
          Icon={Users}
        >
          <select
            value={form.people}
            onChange={(e) =>
              update("people", Number(e.target.value))
            }
            className={searchInput}
          >
            {[1, 2, 3, 4].map((count) => (
              <option key={count} value={count}>
                {count}{" "}
                {count === 1 ? "مسافر" : "مسافرين"}
              </option>
            ))}
          </select>
        </SearchField>

        <button
          type="submit"
          className={`${primaryButton} col-span-full h-[49px] min-[901px]:col-span-1 min-[901px]:h-[57px]`}
        >
          <Search size={18} />
          ابحث عن رحلات
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </form>
  );
}

// اختيار الشركة
function CompanySelector({
  companies,
  selected,
  onChange,
}) {
  const options = [
    {
      id: "all",
      name: "كل الشركات",
    },
    ...companies,
  ];

  return (
    <section className="mt-[31px]">
      <div className="mb-[15px] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e6f8f3] text-sm font-black text-primary">
            01
          </span>

          <div>
            <h2 className="text-[15px] font-black">
              اختار شركة النقل
            </h2>

            <p className="text-[11px] text-muted">
              حدد الشركة اللي بتفضّلها،
              ومنعرضلك مواعيدها المتاحة.
            </p>
          </div>
        </div>

        <span className="hidden items-center gap-2 text-[11px] text-muted sm:flex">
          02 <ArrowLeft size={15} />
          اختار الوقت والمقعد
        </span>
      </div>

      <div className="grid grid-cols-3 gap-[8px] min-[651px]:grid-cols-5 min-[651px]:gap-[11px]">
        {options.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected === item.id}
            onClick={() => onChange(item.id)}
            className={`flex min-w-0 flex-col items-center gap-2 rounded-[13px] border px-2 py-[15px] transition hover:border-primary ${
              selected === item.id
                ? "border-primary bg-[#e6f8f3]"
                : panel
            }`}
          >
            {item.id === "all" ? (
              <BusFront
                size={27}
                className="text-primary"
              />
            ) : (
              <CompanyLogo company={item} small />
            )}

            <span className="text-center text-[11px] font-black max-[650px]:text-[10px]">
              {item.name}
            </span>

            <small className="flex items-center gap-1 text-[10px] text-muted">
              {item.rating != null ? (
                <>
                  <Star
                    size={12}
                    className="text-amber-500"
                  />
                  {item.rating}
                </>
              ) : item.id === "all" ? (
                "قارن الخيارات"
              ) : (
                "شركة نقل"
              )}
            </small>
          </button>
        ))}
      </div>
    </section>
  );
}

// فلاتر النتائج
function FiltersSidebar({
  trips,
  companies,
  company,
  time,
  setCompany,
  setTime,
  reset,
}) {
  return (
    <aside
      className={`${panel} rounded-[17px] p-5 min-[901px]:sticky min-[901px]:top-[103px]`}
    >
      <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
        <h3 className="flex items-center gap-2 text-[13px] font-black">
          <ListFilter size={19} />
          تصفية النتائج
        </h3>

        <button
          type="button"
          onClick={reset}
          className="text-[11px] font-black text-primary"
        >
          إعادة ضبط
        </button>
      </div>

      <fieldset className="mb-6">
        <legend className="mb-3 text-xs font-black">
          شركة النقل
        </legend>

        <div className="flex flex-col gap-3">
          {[
            { id: "all", name: "كل الشركات" },
            ...companies,
          ].map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-2 text-[11px] text-muted"
            >
              <input
                type="radio"
                name="company-filter"
                checked={company === item.id}
                onChange={() => setCompany(item.id)}
                className="accent-primary"
              />

              {item.name}

              <span className="mr-auto text-[10px]">
                {item.id === "all"
                  ? trips.length
                  : trips.filter(
                      (trip) =>
                        trip.company.id === item.id
                    ).length}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-black">
          وقت الانطلاق
        </legend>

        <div className="flex flex-col gap-3">
          {TIME_FILTERS.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-2 text-[11px] text-muted"
            >
              <input
                type="radio"
                name="time-filter"
                checked={time === item.id}
                onChange={() => setTime(item.id)}
                className="accent-primary"
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-7 flex gap-2 rounded-xl bg-[#e6f8f3] p-3 text-[10px] text-[#078e87]">
        <ShieldCheck size={20} />
        <p>
          <strong className="block">
            احجز بكل وضوح
          </strong>
          راجع تفاصيل رحلتك قبل التأكيد.
        </p>
      </div>
    </aside>
  );
}

// بطاقة رحلة
function TripCard({ trip, onSelect }) {
  return (
    <article
      className={`${panel} overflow-hidden rounded-[17px] transition hover:border-[#b4e4db] hover:shadow-lg`}
    >
      <div className="flex items-center justify-between gap-3 px-[23px] pb-3 pt-[19px] max-[650px]:px-4">
        <div className="flex items-center gap-3">
          <CompanyLogo company={trip.company} />

          <div>
            <strong className="block text-[13px] font-black">
              {trip.company.name}
            </strong>

            {trip.company.rating != null && (
              <span className="flex items-center gap-1 text-[11px] text-amber-500">
                <Star size={13} />
                {trip.company.rating}
              </span>
            )}
          </div>
        </div>

        <span className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[10px] text-muted">
          <BusFront size={15} />
          حافلة سياحية
        </span>
      </div>

      <div className="grid items-center gap-4 px-[23px] pb-[23px] pt-[14px] min-[651px]:grid-cols-[minmax(0,1fr)_159px] min-[1151px]:grid-cols-[minmax(0,1fr)_180px] max-[650px]:px-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <b
              dir="ltr"
              className="block text-right text-[23px] font-black max-[650px]:text-[19px]"
            >
              {trip.departure}
            </b>
            <span className="text-[11px] text-muted">
              {trip.origin.name}
            </span>
          </div>

          <div className="flex min-w-[70px] flex-1 flex-col items-center">
            <small className="text-[10px] text-muted">
              {formatDuration(trip.duration)}
            </small>

            <div className="my-1 flex w-full items-center gap-2 text-primary">
              <span className="flex-1 border-t border-dashed border-[#b6ccd2]" />
              <BusFront size={17} />
              <span className="flex-1 border-t border-dashed border-[#b6ccd2]" />
            </div>

            <small className="text-[10px] text-primary">
              مباشرة
            </small>
          </div>

          <div>
            <b
              dir="ltr"
              className="block text-right text-[23px] font-black max-[650px]:text-[19px]"
            >
              {trip.arrival || "—"}
            </b>
            <span className="text-[11px] text-muted">
              {trip.destination.name}
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-3 min-[651px]:border-r min-[651px]:border-t-0 min-[651px]:pr-5 min-[651px]:pt-0">
          <small className="text-[10px] text-muted">
            السعر للشخص
          </small>

          <b className="block text-[18px] font-black text-primary">
            {formatPrice(trip.price)}
          </b>

          <span className="my-2 flex items-center gap-1 text-[10px] text-primary">
            <Armchair size={15} />

            {trip.seats == null
              ? "تحقق من المقاعد"
              : `${trip.seats} مقعد متاح`}
          </span>

          <button
            type="button"
            onClick={() => onSelect(trip)}
            className={`${primaryButton} w-full min-h-[38px]`}
          >
            اختيار المقاعد
            <ArrowLeft size={16} />
          </button>
        </div>
      </div>

      {trip.company.features?.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border px-[23px] py-3">
          {trip.company.features.map((feature) => (
            <span
              key={feature}
              className="rounded-md bg-[#f2f7f8] px-2 py-1 text-[10px] text-muted"
            >
              {feature}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

// إدارة الرحلات والفلاتر
function ResultsContent({
  search,
  invalid,
  initialCompany,
  companyOnly,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [server, setServer] = useState({
    loading: true,
    error: "",
    trips: [],
  });

  const [reload, setReload] = useState(0);

  // قراءة الشركة المختارة من URL
  const [company, setCompany] = useState(initialCompany);
  const [time, setTime] = useState("all");
  const [sort, setSort] = useState("earliest");

  useEffect(() => {
    const controller = new AbortController();

    loadTrips(controller.signal)
      .then((trips) => {
        setServer({
          loading: false,
          error: "",
          trips,
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setServer({
            loading: false,
            error: error.message,
            trips: [],
          });
        }
      });

    return () => controller.abort();
  }, [reload]);

  // الشركات الموجودة في بيانات السيرفر
  const companies = useMemo(() => {
    const actual = Array.from(
      new Map(
        server.trips.map((trip) => [
          trip.company.id,
          trip.company,
        ])
      ).values()
    );

    const configured = companyDesign.map((design) => {
      const match = actual.find((item) =>
        item.name.includes(design.keyword)
      );

      return (
        match || {
          id: design.key,
          name: design.name,
          short: design.short,
          rating: null,
        }
      );
    });

    const extra = actual.filter(
      (item) =>
        !companyDesign.some((design) =>
          item.name.includes(design.keyword)
        )
    );

    return [...configured, ...extra];
  }, [server.trips]);

  // إذا أتينا من صفحة الشركات، نعرض كل الرحلات
  // ونطبّق فلتر الشركة فقط، بدون فرض مدن وتاريخ.
  const trips = useMemo(() => {
    if (companyOnly) {
      return server.trips;
    }

    return server.trips.filter(
      (trip) =>
        trip.origin.name.trim() ===
          getCity(search.origin)?.name &&
        trip.destination.name.trim() ===
          getCity(search.destination)?.name &&
        trip.date === search.date &&
        (trip.seats == null ||
          trip.seats >= search.people)
    );
  }, [
    server.trips,
    companyOnly,
    search.origin,
    search.destination,
    search.date,
    search.people,
  ]);

  const visible = useMemo(
    () =>
      filterTrips(trips, {
        company,
        time,
        sort,
      }),
    [trips, company, time, sort]
  );

  const selectedCompany = companies.find(
    (item) => item.id === company
  );

  function reset() {
    setCompany("all");
    setTime("all");
    setSort("earliest");
  }

  function selectTrip(trip) {
    navigate(
      `/booking/${encodeURIComponent(trip.id)}?people=${search.people}`,
      {
        state: {
          trip,
          returnTo:
            location.pathname + location.search,
        },
      }
    );
  }

  function retry() {
    setServer({
      loading: true,
      error: "",
      trips: [],
    });
    setReload((value) => value + 1);
  }

  return (
    <main
      dir="rtl"
      className="min-h-[70vh] bg-background pb-[90px] text-foreground dark:bg-[#0b1c29] dark:text-white"
    >
      <ResultsBanner />

      <section className={container}>
        <ResultsSearchForm
          initial={search}
          company={company}
        />

        {invalid && (
          <p
            role="status"
            className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800"
          >
            بعض بيانات البحث غير صحيحة،
            استخدمنا قيماً افتراضية.
          </p>
        )}

        <CompanySelector
          companies={companies}
          selected={company}
          onChange={setCompany}
        />

        <div className="mb-[22px] mt-[38px] flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="flex flex-wrap items-center gap-3 text-xl font-black max-[650px]:text-[17px]">
              {server.loading
                ? "جاري البحث..."
                : `${visible.length} رحلات متاحة`}

              {companyOnly ? (
                <span className="rounded-lg bg-[#e6f8f3] px-3 py-1 text-xs text-[#078e87]">
                  {selectedCompany?.name ??
                    "الشركة المحددة"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-lg bg-[#e6f8f3] px-3 py-1 text-xs text-[#078e87]">
                  {getCity(search.origin)?.name}
                  <ArrowLeft size={16} />
                  {getCity(search.destination)?.name}
                </span>
              )}
            </h2>

            <p className="mt-2 flex items-center gap-2 text-[11px] text-muted">
              {companyOnly ? (
                <>
                  <BusFront size={15} />
                  جميع المدن والتواريخ المتوفرة
                  للشركة. لتحديد بحث معيّن استخدم
                  النموذج بالأعلى.
                </>
              ) : (
                <>
                  <CalendarDays size={15} />
                  {formatArabicDate(search.date)}
                  {" · "}
                  {search.people} مسافر
                </>
              )}
            </p>
          </div>

          <label className="flex items-center gap-2 text-[11px] text-muted">
            ترتيب حسب
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className={`${panel} min-h-[42px] rounded-lg px-3 text-foreground dark:text-white`}
            >
              <option value="earliest">
                وقت الانطلاق
              </option>
              <option value="cheap">أقل سعر</option>
              <option value="quick">أقصر مدة</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 min-[901px]:grid-cols-[244px_minmax(0,1fr)]">
          <FiltersSidebar
            trips={trips}
            companies={companies}
            company={company}
            time={time}
            setCompany={setCompany}
            setTime={setTime}
            reset={reset}
          />

          <div className="flex min-w-0 flex-col gap-[15px]">
            {server.loading ? (
              <div
                role="status"
                className={`${panel} rounded-2xl p-10 text-center`}
              >
                جاري تحميل الرحلات...
              </div>
            ) : server.error ? (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"
              >
                <p>{server.error}</p>
                <button
                  type="button"
                  onClick={retry}
                  className={`${primaryButton} mt-4`}
                >
                  <RefreshCw size={16} />
                  إعادة المحاولة
                </button>
              </div>
            ) : visible.length > 0 ? (
              visible.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onSelect={selectTrip}
                />
              ))
            ) : (
              <div
                className={`${panel} rounded-[20px] border-dashed p-10 text-center`}
              >
                <SearchX
                  size={42}
                  className="mx-auto mb-4 text-primary"
                />

                <h3 className="text-lg font-black">
                  ما في رحلات مطابقة
                </h3>

                <p className="mt-2 text-xs text-muted">
                  جرّب تغيير الشركة أو البحث
                  عن تاريخ ومدن مختلفة.
                </p>

                <button
                  type="button"
                  onClick={reset}
                  className={`${primaryButton} mt-5`}
                >
                  عرض كل الشركات
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// قراءة معاملات البحث والشركة من الرابط
export default function ResultsPage() {
  const [params] = useSearchParams();

  const { search, invalid } =
    readSearchParams(params);

  const initialCompany =
    params.get("company") || "all";

  // رابط شركة فقط، بدون بحث محدد
  const companyOnly =
    params.has("company") &&
    !params.has("origin") &&
    !params.has("destination") &&
    !params.has("date");

  const pageKey = [
    search.origin,
    search.destination,
    search.date,
    search.people,
    initialCompany,
    companyOnly,
  ].join("|");

  return (
    <ResultsContent
      key={pageKey}
      search={search}
      invalid={invalid}
      initialCompany={initialCompany}
      companyOnly={companyOnly}
    />
  );
}
