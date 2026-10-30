import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeftRight,
  CalendarDays,
  MapPin,
  Search,
  Users,
} from "lucide-react";

const cities = [
  { id: "damascus", name: "دمشق" },
  { id: "aleppo", name: "حلب" },
  { id: "homs", name: "حمص" },
  { id: "hama", name: "حماة" },
  { id: "latakia", name: "اللاذقية" },
  { id: "tartus", name: "طرطوس" },
  { id: "idlib", name: "إدلب" },
  { id: "deir", name: "دير الزور" },
  { id: "raqqa", name: "الرقة" },
  { id: "hasakah", name: "الحسكة" },
  { id: "daraa", name: "درعا" },
  { id: "sweida", name: "السويداء" },
  { id: "quneitra", name: "القنيطرة" },
  { id: "rif-damascus", name: "ريف دمشق" },
];

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return formatDate(date);
}

const fieldClass = `
  relative flex h-[60px] min-w-0 items-center gap-[10px]
  rounded-[11px] border border-border bg-white
  px-[14px] pt-[11px] pb-[5px]
  transition-all duration-200
  focus-within:border-primary
  focus-within:ring-[3px] focus-within:ring-primary/10
  dark:border-[#254252]
  dark:bg-[#112b3b]
  max-[1150px]:gap-[6px]
  max-[1150px]:px-[10px]
  max-[900px]:h-[56px]
  max-[650px]:h-[58px]
  max-[650px]:gap-1
  max-[650px]:px-[9px]
`;

const inputClass = `
  mt-[11px] h-[30px] w-full min-w-0
  appearance-none border-0 bg-transparent
  p-0 text-[11px] font-black
  text-foreground outline-none
  dark:text-[#eef8fa]
  [&>option]:bg-white
  [&>option]:text-[#102f41]
`;

function SearchField({ label, icon: Icon, children, className = "" }) {
  return (
    <div className={`${fieldClass} ${className}`}>
      <span
        className="
          absolute top-[7px] right-[14px]
          text-[10px] font-bold text-muted
          max-[650px]:right-[9px]
        "
      >
        {label}
      </span>

      <Icon
        size={19}
        className="
          mt-3 shrink-0 text-primary
          max-[650px]:h-4
          max-[650px]:w-4
        "
      />

      {children}
    </div>
  );
}

function SearchForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    origin: "aleppo",
    destination: "damascus",
    date: getTomorrow(),
    people: 1,
  });

  const [error, setError] = useState("");

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const swapCities = () => {
    setForm((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.origin === form.destination) {
      setError("محافظة الانطلاق والوصول لازم يكونوا مختلفين.");
      return;
    }

    if (form.date < formatDate(new Date())) {
      setError("اختار تاريخ اليوم أو تاريخ لاحق.");
      return;
    }

    const params = new URLSearchParams({
      origin: form.origin,
      destination: form.destination,
      date: form.date,
      people: String(form.people),
    });

    navigate(`/results?${params.toString()}`);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="
          grid items-end gap-[11px]
          [grid-template-columns:1.12fr_34px_1.12fr_1fr_.74fr_1.14fr]

          max-[1150px]:gap-[7px]
          max-[1150px]:[grid-template-columns:1fr_27px_1fr_1fr_.7fr_1.1fr]

          max-[900px]:gap-2
          max-[900px]:[grid-template-columns:1fr_30px_1fr_1fr_1fr]

          max-[650px]:gap-[9px]
          max-[650px]:[grid-template-columns:1fr_29px_1fr]
        "
      >
        {/* Origin */}
        <SearchField label="من وين؟" icon={MapPin}>
          <select
            name="origin"
            aria-label="محافظة الانطلاق"
            value={form.origin}
            onChange={(e) => updateField("origin", e.target.value)}
            className={inputClass}
            required
          >
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </SearchField>

        {/* Swap */}
        <button
          type="button"
          onClick={swapCities}
          aria-label="تبديل المحافظات"
          className="
            mb-[11px] grid h-[38px] w-[34px]
            place-items-center rounded-[10px]
            bg-[#e6f8f3] text-[#078e87]
            transition-transform duration-300
            hover:rotate-180
            dark:bg-[#174b49]
            dark:text-[#68dfcc]

            max-[1150px]:w-[27px]
            max-[900px]:mb-2
            max-[900px]:w-[30px]
            max-[650px]:w-[29px]
          "
        >
          <ArrowLeftRight size={19} />
        </button>

        {/* Destination */}
        <SearchField label="لوين؟" icon={MapPin}>
          <select
            name="destination"
            aria-label="محافظة الوصول"
            value={form.destination}
            onChange={(e) => updateField("destination", e.target.value)}
            className={inputClass}
            required
          >
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </SearchField>

        {/* Date */}
        <SearchField
          label="تاريخ الرحلة"
          icon={CalendarDays}
          className="max-[650px]:col-[1/3]"
        >
          <input
            type="date"
            name="date"
            aria-label="تاريخ الرحلة"
            value={form.date}
            min={formatDate(new Date())}
            onChange={(e) => updateField("date", e.target.value)}
            className={inputClass}
            required
          />
        </SearchField>

        {/* Passengers */}
        <SearchField
          label="المسافرين"
          icon={Users}
          className="max-[650px]:col-[3]"
        >
          <select
            name="people"
            aria-label="عدد المسافرين"
            value={form.people}
            onChange={(e) => updateField("people", Number(e.target.value))}
            className={inputClass}
          >
            {[1, 2, 3, 4].map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "مسافر" : "مسافرين"}
              </option>
            ))}
          </select>
        </SearchField>

        {/* Submit */}
        <button
          type="submit"
          className="
            flex h-[60px] w-full items-center
            justify-center gap-[10px]
            whitespace-nowrap rounded-xl
            bg-primary px-[13px] py-[10px]
            text-xs font-extrabold text-white
            shadow-[0_9px_20px_rgba(8,165,151,0.19)]
            transition-all duration-200

            hover:-translate-y-[3px]
            hover:bg-primary-dark
            hover:shadow-[0_12px_25px_rgba(8,165,151,0.28)]

            max-[1150px]:text-[10px]
            max-[900px]:col-span-full
            max-[900px]:h-[49px]
            max-[900px]:text-xs
          "
        >
          <Search size={19} />
          ابحث عن رحلات
        </button>
      </form>

      {error && (
        <p
          role="alert"
          className="mt-3 text-xs font-bold text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </>
  );
}

export default SearchForm;
