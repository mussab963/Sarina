
const API_BASE =
  "https://sairna.abdulrahman-hares.com/api/v1/dashboard";

const TOKEN_KEY = "sairna_dashboard_access_token";

// قراءة توكن الأدمن
export function getDashboardToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

// حفظ التوكن
export function saveDashboardToken(token) {
  if (
    typeof token !== "string" ||
    !token.trim()
  ) {
    throw new Error("رمز تسجيل الدخول غير صالح.");
  }

  sessionStorage.setItem(TOKEN_KEY, token);
}

// تسجيل الخروج
export function clearDashboardToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // التخزين غير متاح
  }
}

// استخراج البيانات من استجابة API
export function unwrapDashboardData(payload) {
  let data = payload;

  for (let i = 0; i < 4; i += 1) {
    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data)
    ) {
      break;
    }

    if (data.data != null) {
      data = data.data;
    } else if (data.result != null) {
      data = data.result;
    } else {
      break;
    }
  }

  return data;
}

// دالة الطلبات المشتركة
async function request(
  path,
  {
    method = "GET",
    body,
    signal,
    authenticated = true,
  } = {}
) {
  const token = getDashboardToken();

  if (authenticated && !token) {
    const error = new Error(
      "يجب تسجيل دخول الأدمن أولاً."
    );

    error.status = 401;
    throw error;
  }

  const headers = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] =
      "application/json";
  }

  if (authenticated) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE}${path}`,
      {
        method,
        headers,
        signal,

        // منع عرض بيانات قديمة من كاش المتصفح
        cache: "no-store",

        ...(body !== undefined
          ? { body: JSON.stringify(body) }
          : {}),
      }
    );
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "تعذر الاتصال بسيرفر سيرنا.",
      { cause: error }
    );
  }

  const raw = await response.text();

  let payload = null;

  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch (error) {
      throw new Error(
        "استجابة السيرفر غير صالحة.",
        { cause: error }
      );
    }
  }

  // قد يعيد السيرفر HTTP 200
  // لكن جسم الاستجابة يشير إلى فشل العملية
  const rejectedByBody =
    payload?.success === false ||
    payload?.ok === false ||
    payload?.deleted === false;

  if (!response.ok || rejectedByBody) {
    const message =
      payload?.message ??
      payload?.error?.message ??
      (typeof payload?.error === "string"
        ? payload.error
        : null) ??
      `فشل الطلب (HTTP ${response.status}).`;

    const error = new Error(
      Array.isArray(message)
        ? message.join("، ")
        : String(message)
    );

    error.status = response.status;

    throw error;
  }

  return unwrapDashboardData(payload);
}

const encodedId = (id) =>
  encodeURIComponent(id);

// ==================================
// تسجيل دخول الأدمن
// ==================================

export const dashboardLogin = (credentials) =>
  request("/auth/login", {
    method: "POST",
    body: credentials,
    authenticated: false,
  });

export const dashboardMe = (signal) =>
  request("/auth/me", { signal });

// ==================================
// الإحصائيات
// ==================================

export const dashboardOverview = (signal) =>
  request("/overview", { signal });

// ==================================
// المدن
// ==================================

export const dashboardCities = (signal) =>
  request("/cities", { signal });

// ==================================
// شركات النقل
// ==================================

export const dashboardCompanies = (signal) =>
  request("/companies", { signal });

export const dashboardCreateCompany = (data) =>
  request("/companies", {
    method: "POST",
    body: data,
  });

export const dashboardUpdateCompany = (
  id,
  data
) =>
  request(
    `/companies/${encodedId(id)}`,
    {
      method: "PATCH",
      body: data,
    }
  );

export const dashboardDeleteCompany = (id) =>
  request(
    `/companies/${encodedId(id)}`,
    {
      method: "DELETE",
    }
  );

// ==================================
// الرحلات
// ==================================

export const dashboardTrips = (signal) =>
  request("/trips", { signal });

export const dashboardTrip = (id, signal) =>
  request(
    `/trips/${encodedId(id)}`,
    { signal }
  );

export const dashboardCreateTrip = (data) =>
  request("/trips", {
    method: "POST",
    body: data,
  });

export const dashboardUpdateTrip = (
  id,
  data
) =>
  request(
    `/trips/${encodedId(id)}`,
    {
      method: "PATCH",
      body: data,
    }
  );

export const dashboardDeleteTrip = (id) =>
  request(
    `/trips/${encodedId(id)}`,
    {
      method: "DELETE",
    }
  );

// ==================================
// الحجوزات
// ==================================

export const dashboardBookings = (signal) =>
  request("/bookings", { signal });

export const dashboardBooking = (
  id,
  signal
) =>
  request(
    `/bookings/${encodedId(id)}`,
    { signal }
  );

export const dashboardCancelBooking = (id) =>
  request(
    `/bookings/${encodedId(id)}/cancel`,
    {
      method: "POST",
    }
  );

// ==================================
// المستخدمون
// ==================================

export const dashboardUsers = (signal) =>
  request("/users", { signal });

export const dashboardUser = (id, signal) =>
  request(
    `/users/${encodedId(id)}`,
    { signal }
  );
