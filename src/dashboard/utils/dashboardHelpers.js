
export function listFrom(data, preferred = []) {
  if (Array.isArray(data)) return data;

  const keys = [
    ...preferred,
    "items",
    "results",
    "records",
    "rows",
    "content",
    "data",
  ];

  for (const key of keys) {
    const value = data?.[key];

    if (Array.isArray(value)) return value;

    if (value && typeof value === "object") {
      for (const nestedKey of keys) {
        if (Array.isArray(value[nestedKey])) {
          return value[nestedKey];
        }
      }
    }
  }

  return null;
}

export function firstValue(record, keys) {
  for (const key of keys) {
    if (
      record?.[key] !== undefined &&
      record?.[key] !== null
    ) {
      return record[key];
    }
  }

  return null;
}

export function recordId(record) {
  return firstValue(record, [
    "id",
    "tripId",
    "companyId",
    "userId",
    "customerId",
  ]);
}

export function displayValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (typeof value === "object") {
    return displayValue(
      firstValue(value, [
        "name",
        "fullName",
        "nameAr",
        "companyName",
        "cityName",
        "email",
        "id",
      ])
    );
  }

  return String(value);
}

export function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return displayValue(value);
  }

  return new Intl.DateTimeFormat("ar-SY", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const local = new Date(
    date.getTime() -
    date.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 16);
}

export function lookupName(value, entries) {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "object") {
    return displayValue(value);
  }

  const match = entries.find(
    (entry) =>
      String(recordId(entry)) === String(value)
  );

  return match
    ? displayValue(match)
    : String(value);
}
