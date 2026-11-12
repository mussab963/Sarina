
/**
 * Sairna Website API
 * الاتصال بالـ Backend الخاص بالمسافرين.
 * لا نستخدم بيانات Dashboard أو Admin هنا.
 */

const API_BASE =
  "https://sairna.abdulrahman-hares.com/api/v1/website";

// إرسال طلب GET
async function get(path, signal) {
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "تعذّر الاتصال بالسيرفر. تحقق من الإنترنت أو إعدادات CORS.",
      { cause: error }
    );
  }

  if (!response.ok) {
    throw new Error(
      `فشل جلب البيانات (HTTP ${response.status})`
    );
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error(
      "استجابة السيرفر ليست JSON صالحاً.",
      { cause: error }
    );
  }
}

// فك تغليف البيانات
function unwrap(payload) {
  let value = payload;

  for (let i = 0; i < 4; i += 1) {
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      break;
    }

    if (value.data != null) {
      value = value.data;
    } else if (value.result != null) {
      value = value.result;
    } else {
      break;
    }
  }

  return value;
}

// استخراج مصفوفة من استجابة السيرفر
function collection(payload, names) {
  const root = unwrap(payload);

  if (Array.isArray(root)) {
    return root;
  }

  const possibleKeys = [
    ...names,
    "items",
    "results",
    "rows",
    "content",
    "list",
  ];

  for (const name of possibleKeys) {
    if (Array.isArray(root?.[name])) {
      return root[name];
    }
  }

  throw new Error(
    `تعذّر قراءة القائمة من السيرفر. الحقول: ${Object.keys(
      root ?? {}
    ).join(", ")}`
  );
}

// اختيار أول قيمة موجودة
function pick(...values) {
  return values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== ""
  );
}

// بناء خريطة للمدن
function cityMapFrom(cities) {
  const map = new Map();

  cities.forEach((raw) => {
    const id = pick(
      raw.id,
      raw.cityId,
      raw.city_id
    );

    const name = pick(
      raw.name,
      raw.nameAr,
      raw.arabicName,
      raw.cityName,
      raw.name_ar
    );

    if (id != null && name) {
      map.set(String(id), {
        id: String(id),
        name: String(name),
      });
    }
  });

  return map;
}

// توحيد بيانات المدينة
function cityFrom(value, map) {
  if (value && typeof value === "object") {
    const id = pick(
      value.id,
      value.cityId,
      value.city_id
    );

    const name = pick(
      value.name,
      value.nameAr,
      value.arabicName,
      value.cityName,
      value.name_ar
    );

    if (name) {
      return {
        id: String(id ?? name),
        name: String(name),
      };
    }

    if (id != null) {
      return (
        map.get(String(id)) ?? {
          id: String(id),
          name: "",
        }
      );
    }
  }

  return (
    map.get(String(value)) ?? {
      id: String(value ?? ""),
      name: "",
    }
  );
}

// توحيد بيانات شركة النقل
function companyFrom(value, companies) {
  const raw =
    value && typeof value === "object"
      ? value
      : companies.find(
          (company) =>
            String(
              pick(
                company.id,
                company.companyId
              )
            ) === String(value)
        );

  if (!raw) {
    return {
      id: String(value ?? "unknown"),
      name: "شركة نقل",
      short: "ن",
      rating: null,
      features: [],
    };
  }

  const id = pick(
    raw.id,
    raw.companyId,
    raw.company_id
  );

  const name = String(
    pick(
      raw.name,
      raw.nameAr,
      raw.companyName,
      raw.name_ar,
      "شركة نقل"
    )
  );

  return {
    id: String(id ?? name),
    name,
    short: name[0] || "ن",
    rating: pick(raw.rating, null),
    features: Array.isArray(raw.features)
      ? raw.features
      : [],
  };
}

// استخراج الوقت
function extractTime(value) {
  const text = String(value ?? "");

  const match =
    text.match(/(?:T|\s)(\d{2}:\d{2})/) ??
    text.match(/^(\d{2}:\d{2})/);

  return match?.[1] ?? "";
}

// استخراج التاريخ
function extractDate(value) {
  return (
    String(value ?? "").match(
      /\d{4}-\d{2}-\d{2}/
    )?.[0] ?? ""
  );
}

// تحويل قيمة إلى رقم صالح
function validNumber(value) {
  if (value == null || value === "") {
    return null;
  }

  const result = Number(value);

  return Number.isFinite(result)
    ? result
    : null;
}

// تحويل الرحلة القادمة من السيرفر
export function normalizeTrip(
  payload,
  cities = [],
  companies = []
) {
  const raw = unwrap(payload);

  if (
    !raw ||
    typeof raw !== "object" ||
    Array.isArray(raw)
  ) {
    throw new Error(
      "تفاصيل الرحلة غير صالحة."
    );
  }

  const map = cityMapFrom(cities);

  const id = pick(
    raw.id,
    raw.tripId,
    raw.trip_id
  );

  const origin = cityFrom(
    pick(
      raw.originCity,
      raw.fromCity,
      raw.departureCity,
      raw.origin,
      raw.from,
      raw.originCityId,
      raw.fromCityId,
      raw.origin_city_id,
      raw.route?.originCity,
      raw.route?.fromCity
    ),
    map
  );

  const destination = cityFrom(
    pick(
      raw.destinationCity,
      raw.toCity,
      raw.arrivalCity,
      raw.destination,
      raw.to,
      raw.destinationCityId,
      raw.toCityId,
      raw.destination_city_id,
      raw.route?.destinationCity,
      raw.route?.toCity
    ),
    map
  );

  const departureValue = pick(
    raw.departureTime,
    raw.departure_time,
    raw.departureAt,
    raw.startTime,
    raw.departure,
    raw.departureDateTime
  );

  const arrivalValue = pick(
    raw.arrivalTime,
    raw.arrival_time,
    raw.arrivalAt,
    raw.endTime,
    raw.arrival,
    raw.arrivalDateTime
  );

  if (
    id == null ||
    !origin.name ||
    !destination.name ||
    !extractTime(departureValue)
  ) {
    throw new Error(
      `حقول الرحلة غير متوافقة مع الواجهة: ${Object.keys(
        raw
      ).join(", ")}`
    );
  }

  return {
    id: String(id),

    origin,
    destination,

    company: companyFrom(
      pick(
        raw.company,
        raw.transportCompany,
        raw.companyId,
        raw.company_id
      ),
      companies
    ),

    date: extractDate(
      pick(
        raw.date,
        raw.travelDate,
        raw.departureDate,
        raw.tripDate,
        raw.departureDateTime,
        departureValue
      )
    ),

    departure: extractTime(departureValue),
    arrival: extractTime(arrivalValue),

    price: validNumber(
      pick(
        raw.price,
        raw.ticketPrice,
        raw.pricePerSeat,
        raw.seatPrice,
        raw.ticket_price
      )
    ),

    seats: validNumber(
      pick(
        raw.availableSeats,
        raw.available_seats,
        raw.seatsAvailable,
        raw.freeSeats
      )
    ),

    duration: validNumber(
      pick(
        raw.durationMinutes,
        raw.duration_minutes
      )
    ),

    status: String(raw.status ?? ""),
  };
}

// جلب الرحلات والمدن والشركات
export async function loadTrips(signal) {
  const [
    tripsPayload,
    citiesPayload,
    companiesPayload,
  ] = await Promise.all([
    get("/trips", signal),
    get("/cities", signal),
    get("/companies", signal),
  ]);

  const trips = collection(
    tripsPayload,
    ["trips"]
  );

  const cities = collection(
    citiesPayload,
    ["cities"]
  );

  const companies = collection(
    companiesPayload,
    ["companies"]
  );

  return trips.map((trip) =>
    normalizeTrip(
      trip,
      cities,
      companies
    )
  );
}

// جلب رحلة واحدة
export async function loadTrip(id, signal) {
  const [
    tripPayload,
    citiesPayload,
    companiesPayload,
  ] = await Promise.all([
    get(
      `/trips/${encodeURIComponent(id)}`,
      signal
    ),
    get("/cities", signal),
    get("/companies", signal),
  ]);

  return normalizeTrip(
    tripPayload,
    collection(citiesPayload, ["cities"]),
    collection(companiesPayload, ["companies"])
  );
}

/**
 * جلب مقاعد الرحلة
 *
 * استجابة السيرفر المؤكدة:
 * {
 *   tripId,
 *   totalSeats,
 *   status,
 *   occupiedSeats,
 *   availableSeats
 * }
 */
export async function loadSeats(id, signal) {
  const data = unwrap(
    await get(
      `/trips/${encodeURIComponent(id)}/seats`,
      signal
    )
  );

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    throw new Error(
      "بيانات المقاعد غير صالحة."
    );
  }

  const total = Number(data.totalSeats);

  if (
    !Number.isInteger(total) ||
    total < 1 ||
    total > 200
  ) {
    throw new Error(
      "عدد المقاعد غير معروف."
    );
  }

  if (!Array.isArray(data.occupiedSeats)) {
    throw new Error(
      "قائمة المقاعد المحجوزة غير متوافقة مع السيرفر."
    );
  }

  // أرقام المقاعد المحجوزة
  const occupied = new Set(
    data.occupiedSeats.map((seat) => {
      const value =
        seat && typeof seat === "object"
          ? pick(
              seat.seatNumber,
              seat.number,
              seat.seat_number
            )
          : seat;

      const number = Number(value);

      if (
        value == null ||
        !Number.isInteger(number) ||
        number < 1 ||
        number > total
      ) {
        throw new Error(
          "رقم مقعد محجوز غير صالح."
        );
      }

      return number;
    })
  );

  // إنشاء المقاعد للعرض على الواجهة
  // الترقيم من 1 حتى totalSeats افتراض تصميمي.
  return Array.from(
    { length: total },
    (_, index) => {
      const number = index + 1;

      return {
        number: String(number),
        available: !occupied.has(number),
      };
    }
  );
}

/**
 * جلب شركات النقل من Website API.
 * نعرض المعلومات التي يوفرها السيرفر فقط.
 */
export async function loadCompanies(signal) {
  const payload = await get("/companies", signal);

  const rows = collection(payload, ["companies"]);

  return rows.map((raw) => {
    if (!raw || typeof raw !== "object") {
      throw new Error(
        "بيانات شركة النقل غير صحيحة."
      );
    }

    const id =
      raw.id ??
      raw.companyId ??
      raw.company_id;

    const name =
      raw.name ??
      raw.nameAr ??
      raw.companyName ??
      raw.name_ar;

    if (id == null || !name) {
      throw new Error(
        `حقول الشركات غير متوافقة: ${Object.keys(
          raw
        ).join(", ")}`
      );
    }

    const features =
      raw.features ?? raw.amenities ?? [];

    const rating =
      raw.rating ?? raw.averageRating ?? null;

    const destinations =
      raw.destinationsCount ??
      raw.routesCount ??
      null;

    return {
      id: String(id),
      name: String(name),
      short: String(name).slice(0, 1),

      about: String(
        raw.about ??
        raw.description ??
        raw.bio ??
        ""
      ),

      features: Array.isArray(features)
        ? features
            .map((item) =>
              typeof item === "string"
                ? item
                : String(
                    item?.name ??
                    item?.label ??
                    ""
                  )
            )
            .filter(Boolean)
        : [],

      rating:
        rating != null &&
        Number.isFinite(Number(rating))
          ? Number(rating)
          : null,

      destinationsCount:
        destinations != null &&
        Number.isFinite(Number(destinations))
          ? Number(destinations)
          : null,

      scheduleLabel:
        typeof raw.scheduleLabel === "string"
          ? raw.scheduleLabel
          : null,
    };
  });
}

/**
 * إنشاء حجز حقيقي عبر Website API.
 *
 * يتطلب Access Token خاص بالمسافر.
 * يدعم من 1 إلى 4 مقاعد.
 */
export async function createBooking(
  { tripId, seats },
  token,
  signal
) {
  const numericTripId = Number(tripId);

  if (
    !Number.isInteger(numericTripId) ||
    numericTripId < 1
  ) {
    throw new Error("معرّف الرحلة غير صالح.");
  }

  if (
    !Array.isArray(seats) ||
    seats.length < 1 ||
    seats.length > 4
  ) {
    throw new Error(
      "لازم تختار من مقعد واحد لأربعة مقاعد."
    );
  }

  if (!token || typeof token !== "string") {
    const error = new Error(
      "يجب تسجيل الدخول قبل تأكيد الحجز."
    );
    error.status = 401;
    throw error;
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
        "الاسم الكامل للمسافر غير صالح."
      );
    }

    const phoneDigits = passengerPhone.replace(
      /\D/g,
      ""
    );

    if (phoneDigits.length < 9) {
      throw new Error(
        "رقم هاتف المسافر غير صالح."
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
    new Set(seatNumbers).size !==
    seatNumbers.length
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
        tripId: numericTripId,
        seats: normalizedSeats,
      }),
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "تعذّر الاتصال بالسيرفر أثناء إنشاء الحجز.",
      { cause: error }
    );
  }

  // قد تكون استجابة النجاح JSON أو فارغة.
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
      result?.message ||
      result?.error?.message ||
      `فشل إنشاء الحجز (HTTP ${response.status}).`;

    if (Array.isArray(message)) {
      message = message.join("، ");
    }

    if (response.status === 401) {
      message =
        "انتهت جلسة تسجيل الدخول. سجّل دخولك مجدداً.";
    } else if (response.status === 403) {
      message =
        "هذا الحساب غير مخوّل بإنشاء حجز.";
    } else if (response.status === 409) {
      message =
        "في تعارض بالحجز. ممكن تكون بعض المقاعد انحجزت، جرّب اختيار مقاعد ثانية.";
    }

    const error = new Error(String(message));
    error.status = response.status;

    throw error;
  }

  // النجاح يعتمد على استجابة السيرفر الفعلية.
  // رمز النجاح الموثق في Swagger هو 201.
  return result;
}
