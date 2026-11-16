
import { useEffect, useState } from "react";

import {
  dashboardCities,
  dashboardCompanies,
  dashboardCreateTrip,
  dashboardDeleteTrip,
  dashboardTrip,
  dashboardTrips,
  dashboardUpdateTrip,
} from "../services/dashboardApi";

import DashboardResource from "../components/DashboardResource";

import {
  displayValue,
  firstValue,
  formatDate,
  listFrom,
  lookupName,
  recordId,
  toDateTimeLocal,
} from "../utils/dashboardHelpers";

// استخراج ID من رقم أو كائن
function referenceId(value) {
  return value && typeof value === "object"
    ? recordId(value)
    : value;
}

// اسم مدينة الانطلاق
function originOf(trip, cities) {
  return lookupName(
    firstValue(trip, [
      "origin",
      "originId",
      "originCity",
      "originCityId",
      "fromCity",
      "fromCityId",
      "departureCity",
      "departureCityId",
    ]),
    cities
  );
}

// اسم مدينة الوصول
function destinationOf(trip, cities) {
  return lookupName(
    firstValue(trip, [
      "destination",
      "destinationId",
      "destinationCity",
      "destinationCityId",
      "toCity",
      "toCityId",
      "arrivalCity",
      "arrivalCityId",
    ]),
    cities
  );
}

// اسم شركة النقل
function companyOf(trip, companies) {
  return lookupName(
    firstValue(trip, [
      "company",
      "transportCompany",
      "companyId",
    ]),
    companies
  );
}

// تاريخ الانطلاق
function departureOf(trip) {
  return firstValue(trip, [
    "departureAt",
    "departureTime",
    "departureDate",
    "date",
  ]);
}

// تاريخ الوصول
function arrivalOf(trip) {
  return firstValue(trip, [
    "arrivalAt",
    "arrivalTime",
    "arrivalDate",
  ]);
}

// سعر المقعد
function priceOf(trip) {
  return firstValue(trip, [
    "price",
    "pricePerSeat",
    "ticketPrice",
    "fare",
  ]);
}

// تعبئة نموذج تعديل رحلة موجودة
function tripForm(trip) {
  const company = referenceId(
    firstValue(trip, [
      "companyId",
      "company",
      "transportCompany",
    ])
  );

  const origin = referenceId(
    firstValue(trip, [
      "originId",
      "originCityId",
      "originCity",
      "fromCityId",
      "fromCity",
      "origin",
    ])
  );

  const destination = referenceId(
    firstValue(trip, [
      "destinationId",
      "destinationCityId",
      "destinationCity",
      "toCityId",
      "toCity",
      "destination",
    ])
  );

  return {
    companyId: String(company ?? ""),
    originId: String(origin ?? ""),
    destinationId: String(destination ?? ""),

    departureAt: toDateTimeLocal(
      departureOf(trip)
    ),

    arrivalAt: toDateTimeLocal(
      arrivalOf(trip)
    ),

    price: String(priceOf(trip) ?? ""),

    totalSeats: String(
      firstValue(trip, [
        "totalSeats",
        "capacity",
        "seatCount",
      ]) ?? ""
    ),
  };
}

// تجهيز البيانات للإضافة والتعديل
// بأسماء الحقول التي يطلبها السيرفر
function tripPayload(form) {
  const companyId = Number(form.companyId);
  const originId = Number(form.originId);
  const destinationId = Number(
    form.destinationId
  );

  const price = Number(form.price);
  const totalSeats = Number(form.totalSeats);

  // التحقق من أرقام الشركة والمدن
  if (
    ![
      companyId,
      originId,
      destinationId,
    ].every(
      (id) =>
        Number.isInteger(id) &&
        id >= 1
    )
  ) {
    throw new Error(
      "اختر شركة النقل ومدينتي الانطلاق والوصول."
    );
  }

  // منع رحلة من المدينة لنفسها
  if (originId === destinationId) {
    throw new Error(
      "مدينة الانطلاق والوجهة لازم يكونوا مختلفين."
    );
  }

  // التحقق من وجود المواعيد
  if (
    !form.departureAt ||
    !form.arrivalAt
  ) {
    throw new Error(
      "أدخل موعد الانطلاق وموعد الوصول."
    );
  }

  const departureAt = new Date(
    form.departureAt
  );

  const arrivalAt = new Date(
    form.arrivalAt
  );

  // التحقق من صلاحية التواريخ
  if (
    Number.isNaN(departureAt.getTime()) ||
    Number.isNaN(arrivalAt.getTime())
  ) {
    throw new Error(
      "صيغة موعد الانطلاق أو الوصول غير صحيحة."
    );
  }

  if (arrivalAt <= departureAt) {
    throw new Error(
      "موعد الوصول لازم يكون بعد موعد الانطلاق."
    );
  }

  // التحقق من السعر
  if (
    String(form.price).trim() === "" ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    throw new Error(
      "أدخل سعراً صحيحاً للمقعد."
    );
  }

  // التحقق من عدد المقاعد
  if (
    !Number.isInteger(totalSeats) ||
    totalSeats < 1
  ) {
    throw new Error(
      "عدد المقاعد لازم يكون عدداً صحيحاً أكبر من الصفر."
    );
  }

  // الطلب النهائي المتوافق مع أخطاء
  // التحقق التي أرجعها Backend سيرنا
  return {
    companyId,
    originId,
    destinationId,
    departureAt: departureAt.toISOString(),
    arrivalAt: arrivalAt.toISOString(),
    price,
    totalSeats,
  };
}

export default function DashboardTrips() {
  const [cities, setCities] = useState([]);
  const [companies, setCompanies] =
    useState([]);

  // جلب المدن والشركات
  useEffect(() => {
    const controller = new AbortController();

    Promise.allSettled([
      dashboardCities(controller.signal),
      dashboardCompanies(controller.signal),
    ]).then(([cityResult, companyResult]) => {
      if (controller.signal.aborted) return;

      if (cityResult.status === "fulfilled") {
        setCities(
          listFrom(
            cityResult.value,
            ["cities"]
          ) ?? []
        );
      }

      if (companyResult.status === "fulfilled") {
        setCompanies(
          listFrom(
            companyResult.value,
            ["companies"]
          ) ?? []
        );
      }
    });

    return () => controller.abort();
  }, []);

  // حقول نموذج الإضافة والتعديل
  const fields = [
    {
      name: "companyId",
      label: "شركة النقل",
      type: "select",
      required: true,
      options: companies.map((company) => ({
        value: recordId(company),
        label: displayValue(company),
      })),
    },
    {
      name: "originId",
      label: "مدينة الانطلاق",
      type: "select",
      required: true,
      options: cities.map((city) => ({
        value: recordId(city),
        label: displayValue(city),
      })),
    },
    {
      name: "destinationId",
      label: "مدينة الوصول",
      type: "select",
      required: true,
      options: cities.map((city) => ({
        value: recordId(city),
        label: displayValue(city),
      })),
    },
    {
      name: "departureAt",
      label: "موعد الانطلاق",
      type: "datetime-local",
      required: true,
    },
    {
      name: "arrivalAt",
      label: "موعد الوصول",
      type: "datetime-local",
      required: true,
    },
    {
      name: "price",
      label: "سعر المقعد",
      type: "number",
      min: 0,
      step: "any",
      required: true,
    },
    {
      name: "totalSeats",
      label: "عدد المقاعد",
      type: "number",
      min: 1,
      step: 1,
      required: true,
    },
  ];

  // أعمدة جدول الرحلات
  const columns = [
    {
      key: "id",
      title: "رقم الرحلة",
      render: (trip) => (
        <strong>
          #{recordId(trip) ?? "—"}
        </strong>
      ),
    },
    {
      key: "origin",
      title: "الانطلاق",
      render: (trip) =>
        originOf(trip, cities),
    },
    {
      key: "destination",
      title: "الوجهة",
      render: (trip) =>
        destinationOf(trip, cities),
    },
    {
      key: "company",
      title: "الشركة",
      render: (trip) =>
        companyOf(trip, companies),
    },
    {
      key: "departure",
      title: "الموعد",
      render: (trip) =>
        formatDate(
          departureOf(trip)
        ),
    },
    {
      key: "price",
      title: "السعر",
      render: (trip) => (
        <strong>
          {displayValue(priceOf(trip))}
        </strong>
      ),
    },
  ];

  // تفاصيل الرحلة
  const detailFields = [
    {
      label: "رقم الرحلة",
      value: recordId,
    },
    {
      label: "الانطلاق",
      value: (trip) =>
        originOf(trip, cities),
    },
    {
      label: "الوجهة",
      value: (trip) =>
        destinationOf(trip, cities),
    },
    {
      label: "الشركة",
      value: (trip) =>
        companyOf(trip, companies),
    },
    {
      label: "موعد الانطلاق",
      value: (trip) =>
        formatDate(
          departureOf(trip)
        ),
    },
    {
      label: "موعد الوصول",
      value: (trip) =>
        formatDate(
          arrivalOf(trip)
        ),
    },
    {
      label: "السعر",
      value: priceOf,
    },
    {
      label: "المقاعد",
      value: (trip) =>
        firstValue(trip, [
          "totalSeats",
          "capacity",
          "seatCount",
        ]),
    },
    {
      label: "الحالة",
      value: (trip) => trip.status,
    },
  ];

  return (
    <DashboardResource
      title="إدارة الرحلات"
      subtitle="عرض الرحلات وإضافتها وتعديلها عبر سيرفر سيرنا"
      singular="رحلة"

      // API
      load={dashboardTrips}
      loadOne={dashboardTrip}
      create={dashboardCreateTrip}
      update={dashboardUpdateTrip}
      remove={dashboardDeleteTrip}

      // جدول الرحلات
      listKeys="trips"
      columns={columns}
      detailFields={detailFields}

      // نموذج الإضافة والتعديل
      fields={fields}
      allowCreate={
        cities.length > 0 &&
        companies.length > 0
      }
      emptyForm={{
        companyId: "",
        originId: "",
        destinationId: "",
        departureAt: "",
        arrivalAt: "",
        price: "",
        totalSeats: "",
      }}
      formFrom={tripForm}
      makePayload={tripPayload}

      // البحث
      searchable={(trip) =>
        [
          recordId(trip),
          originOf(trip, cities),
          destinationOf(trip, cities),
          companyOf(trip, companies),
          trip.status,
        ].join(" ")
      }
    />
  );
}
