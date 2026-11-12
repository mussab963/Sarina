
/**
 * Sairna - Results Data
 * بيانات البحث والدوال المساعدة للنتائج.
 */

export const CITIES = [
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

export const TIME_FILTERS = [
  { id: "all", label: "كل الأوقات" },
  { id: "morning", label: "صباحاً (قبل 12)" },
  { id: "afternoon", label: "ظهراً (12–17)" },
  { id: "evening", label: "مساءً (بعد 17)" },
];

export function getCity(id) {
  return CITIES.find((city) => city.id === id);
}

function toLocalISO(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function todayISO() {
  return toLocalISO(new Date());
}

export function tomorrowISO() {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return toLocalISO(date);
}

export function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) {
    return false;
  }

  const date = new Date(`${value}T12:00:00`);

  return (
    !Number.isNaN(date.getTime()) &&
    toLocalISO(date) === value &&
    value >= todayISO()
  );
}

export function readSearchParams(params) {
  const originInput = params.get("origin");
  const destinationInput = params.get("destination");
  const dateInput = params.get("date");
  const peopleInput = params.get("people");

  const people = Number(peopleInput);

  const validPeople =
    peopleInput != null &&
    Number.isInteger(people) &&
    people >= 1 &&
    people <= 4;

  const validOrigin = !!getCity(originInput);
  const validDestination = !!getCity(destinationInput);

  return {
    search: {
      origin: validOrigin ? originInput : "aleppo",
      destination: validDestination
        ? destinationInput
        : "damascus",
      date: isValidDate(dateInput)
        ? dateInput
        : tomorrowISO(),
      people: validPeople ? people : 1,
    },

    invalid:
      (originInput != null && !validOrigin) ||
      (destinationInput != null && !validDestination) ||
      (dateInput != null && !isValidDate(dateInput)) ||
      (peopleInput != null && !validPeople),
  };
}

export function formatPrice(value) {
  if (
    value == null ||
    !Number.isFinite(Number(value))
  ) {
    return "السعر غير متاح";
  }

  return `${Number(value).toLocaleString("en-US")} ل.س`;
}

export function formatDuration(minutes) {
  if (!Number.isFinite(minutes)) {
    return "—";
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return `${hours} س ${rest} د`;
}

export function formatArabicDate(dateString) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(dateString ?? "")
  ) {
    return "التاريخ غير متاح";
  }

  return new Intl.DateTimeFormat("ar-SY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateString}T12:00:00`));
}

export function filterTrips(
  trips,
  {
    company = "all",
    time = "all",
    sort = "earliest",
  }
) {
  const filtered = trips.filter((trip) => {
    if (
      company !== "all" &&
      trip.company.id !== company
    ) {
      return false;
    }

    const hour = Number(
      trip.departure?.slice(0, 2)
    );

    if (time === "all") {
      return true;
    }

    if (!Number.isFinite(hour)) {
      return false;
    }

    if (time === "morning") {
      return hour < 12;
    }

    if (time === "afternoon") {
      return hour >= 12 && hour < 17;
    }

    return hour >= 17;
  });

  return filtered.sort((a, b) => {
    if (sort === "cheap") {
      return (
        (a.price ?? Infinity) -
        (b.price ?? Infinity)
      );
    }

    if (sort === "quick") {
      return (
        (a.duration ?? Infinity) -
        (b.duration ?? Infinity)
      );
    }

    return (a.departure || "99:99").localeCompare(
      b.departure || "99:99"
    );
  });
}
