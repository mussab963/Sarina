
import { useEffect, useMemo, useState } from "react";

import {
  Ban,
  CheckCircle2,
  Eye,
  RefreshCw,
  Search,
  Ticket,
  X,
} from "lucide-react";

import {
  dashboardBookings,
  dashboardBooking,
  dashboardCancelBooking,
} from "../services/dashboardApi";

import {
  displayValue,
  firstValue,
  formatDate,
  listFrom,
} from "../utils/dashboardHelpers";

function bookingId(item) {
  return firstValue(item, [
    "id",
    "bookingId",
  ]);
}

function bookingCustomer(item) {
  return displayValue(
    firstValue(item, [
      "customer",
      "user",
      "passenger",
      "customerName",
      "passengerName",
      "userName",
    ])
  );
}

function bookingStatus(item) {
  return displayValue(
    firstValue(item, [
      "status",
      "bookingStatus",
    ])
  );
}

function isCancelled(status) {
  return [
    "CANCELLED",
    "CANCELED",
    "ملغى",
    "ملغي",
  ].includes(
    String(status).trim().toUpperCase()
  );
}

function statusClasses(status) {
  const normalized = String(
    status
  ).toUpperCase();

  if (isCancelled(normalized)) {
    return "bg-red-50 text-red-600";
  }

  if (
    [
      "CONFIRMED",
      "COMPLETED",
      "PAID",
      "ACTIVE",
    ].includes(normalized)
  ) {
    return "bg-[#e7f8f5] text-[#078e87]";
  }

  return "bg-[#fff2df] text-[#b77920]";
}

function seatNumbers(booking) {
  const seats = firstValue(booking, [
    "seats",
    "bookedSeats",
    "passengers",
  ]);

  if (Array.isArray(seats)) {
    return (
      seats
        .map((seat) =>
          typeof seat === "object" &&
          seat !== null
            ? displayValue(
                seat.seatNumber ??
                  seat.number ??
                  seat.seat
              )
            : displayValue(seat)
        )
        .join("، ") || "—"
    );
  }

  return displayValue(
    firstValue(booking, [
      "seatNumber",
      "seatNumbers",
      "seatsCount",
    ])
  );
}

export default function DashboardBookings() {
  const [bookings, setBookings] = useState([]);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [reloadKey, setReloadKey] =
    useState(0);

  const [selected, setSelected] =
    useState(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [detailsError, setDetailsError] =
    useState("");

  const [cancellingId, setCancellingId] =
    useState(null);

  // إخفاء رسالة النجاح بعد 3.5 ثواني
  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => {
      setToast("");
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  // جلب الحجوزات من السيرفر
  useEffect(() => {
    const controller = new AbortController();

    dashboardBookings(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;

        const items = listFrom(
          data,
          ["bookings"]
        );

        if (items === null) {
          throw new Error(
            "صيغة قائمة الحجوزات من السيرفر غير معروفة."
          );
        }

        setBookings(items);
        setError("");
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(
            err.message ||
            "تعذر تحميل الحجوزات."
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [reloadKey]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();

    if (!text) return bookings;

    return bookings.filter((booking) =>
      [
        bookingId(booking),
        bookingCustomer(booking),
        bookingStatus(booking),
        booking?.reference,
        booking?.bookingCode,
        booking?.tripId,
      ]
        .join(" ")
        .toLowerCase()
        .includes(text)
    );
  }, [bookings, query]);

  function refresh() {
    setLoading(true);
    setError("");
    setReloadKey((value) => value + 1);
  }

  // تفاصيل الحجز
  async function openDetails(booking) {
    const id = bookingId(booking);

    setSelected(booking);
    setDetailsError("");

    if (id == null) return;

    setDetailsLoading(true);

    try {
      const response = await dashboardBooking(id);

      setSelected(
        response?.booking ?? response
      );
    } catch (err) {
      setDetailsError(
        err.message ||
        "تعذر تحميل التفاصيل."
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  // إلغاء حجز حقيقي
  async function cancelBooking(booking) {
    const id = bookingId(booking);

    if (
      id == null ||
      cancellingId !== null ||
      isCancelled(bookingStatus(booking))
    ) {
      return;
    }

    const confirmed = window.confirm(
      `هل تريد إلغاء الحجز رقم ${id}؟
سيتم الإلغاء على السيرفر الحقيقي.`
    );

    if (!confirmed) return;

    setCancellingId(id);
    setError("");

    try {
      await dashboardCancelBooking(id);

      setSelected(null);

      // تنبيه صغير بدل الشريط الأخضر
      setToast(
        `تم إلغاء الحجز رقم ${id} بنجاح.`
      );

      refresh();
    } catch (err) {
      setError(
        err.message ||
        "تعذر إلغاء الحجز."
      );
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div dir="rtl" className="space-y-6">
      {/* العنوان */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#103a4e]">
            إدارة الحجوزات
          </h2>

          <p className="mt-2 text-xs text-[#8197a3]">
            استعراض حجوزات سيرنا ومتابعة حالتها
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-[#dce8ec] bg-white px-4 py-3 text-xs font-bold text-[#103a4e] hover:border-[#0daaa0] disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              loading ? "animate-spin" : ""
            }
          />

          تحديث الحجوزات
        </button>
      </div>

      {/* البحث */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-[#e3edf0] bg-white p-5">
        <div className="relative w-full max-w-[380px]">
          <Search
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8197a3]"
          />

          <input
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="ابحث برقم الحجز أو اسم العميل..."
            className="w-full rounded-xl border border-[#dce8ec] bg-[#f8fbfb] py-3 pl-4 pr-11 text-xs text-[#103a4e] outline-none focus:border-[#0daaa0]"
          />
        </div>

        <span className="rounded-lg bg-[#e7f8f5] px-3 py-2 text-xs font-bold text-[#078e87]">
          الحجوزات المعروضة: {filtered.length}
        </span>
      </div>

      {/* أخطاء السيرفر فقط */}
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* جدول الحجوزات */}
      <section className="overflow-hidden rounded-[20px] border border-[#e3edf0] bg-white">
        <div className="border-b border-[#edf2f4] p-5">
          <h3 className="text-base font-black text-[#103a4e]">
            قائمة الحجوزات
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-[#8197a3]">
            جاري تحميل الحجوزات...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <Ticket
              size={40}
              className="text-[#0daaa0]"
            />

            <p className="text-sm text-[#8197a3]">
              {error
                ? "تعذر عرض الحجوزات."
                : "لا توجد حجوزات مطابقة."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right">
              <thead className="bg-[#f7fafb] text-[11px] text-[#718b99]">
                <tr>
                  <th className="px-5 py-4">
                    رقم الحجز
                  </th>

                  <th className="px-5 py-4">
                    العميل
                  </th>

                  <th className="px-5 py-4">
                    رقم الرحلة
                  </th>

                  <th className="px-5 py-4">
                    تاريخ الحجز
                  </th>

                  <th className="px-5 py-4">
                    الحالة
                  </th>

                  <th className="px-5 py-4">
                    الإجراءات
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#edf2f4]">
                {filtered.map((booking, index) => {
                  const id = bookingId(booking);
                  const status =
                    bookingStatus(booking);

                  return (
                    <tr
                      key={id ?? index}
                      className="hover:bg-[#f8fbfb]"
                    >
                      <td className="px-5 py-4 text-xs font-black text-[#103a4e]">
                        #{id ?? "—"}
                      </td>

                      <td className="px-5 py-4 text-xs text-[#103a4e]">
                        {bookingCustomer(booking)}
                      </td>

                      <td className="px-5 py-4 text-xs text-[#718b99]">
                        {displayValue(
                          booking.tripId ??
                          booking.trip?.id
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs text-[#718b99]">
                        {formatDate(
                          booking.createdAt ??
                          booking.bookingDate
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-lg px-3 py-2 text-[11px] font-bold ${statusClasses(status)}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openDetails(booking)
                            }
                            title="عرض التفاصيل"
                            aria-label={`تفاصيل الحجز ${id ?? ""}`}
                            className="grid h-9 w-9 place-items-center rounded-lg bg-[#e7f8f5] text-[#078e87] hover:bg-[#d3f1eb]"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              cancelBooking(booking)
                            }
                            disabled={
                              id == null ||
                              isCancelled(status) ||
                              cancellingId !== null
                            }
                            title="إلغاء الحجز"
                            aria-label={`إلغاء الحجز ${id ?? ""}`}
                            className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            <Ban size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* تفاصيل الحجز */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071b27]/65 p-4"
          onClick={() => setSelected(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="تفاصيل الحجز"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[20px] bg-white p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-[#103a4e]">
                تفاصيل الحجز #
                {bookingId(selected) ?? "—"}
              </h3>

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="إغلاق التفاصيل"
                className="rounded-lg p-2 text-[#8197a3] hover:bg-[#f2f7f8]"
              >
                <X size={20} />
              </button>
            </div>

            {detailsLoading && (
              <p className="mt-4 text-xs text-[#8197a3]">
                جاري تحميل التفاصيل...
              </p>
            )}

            {detailsError && (
              <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                {detailsError}
              </p>
            )}

            <dl className="mt-6 space-y-4">
              {[
                [
                  "رقم الحجز",
                  bookingId(selected),
                ],
                [
                  "العميل",
                  bookingCustomer(selected),
                ],
                [
                  "الهاتف",
                  selected.customer?.phone ??
                    selected.user?.phone ??
                    selected.passengerPhone ??
                    selected.phone,
                ],
                [
                  "رقم الرحلة",
                  selected.tripId ??
                    selected.trip?.id,
                ],
                [
                  "تاريخ الحجز",
                  formatDate(
                    selected.createdAt ??
                    selected.bookingDate
                  ),
                ],
                [
                  "المقاعد",
                  seatNumbers(selected),
                ],
                [
                  "الحالة",
                  bookingStatus(selected),
                ],
                [
                  "المبلغ",
                  selected.totalAmount ??
                    selected.totalPrice ??
                    selected.total,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-[#edf2f4] pb-3"
                >
                  <dt className="text-xs text-[#8197a3]">
                    {label}
                  </dt>

                  <dd className="text-left text-xs font-bold text-[#103a4e]">
                    {displayValue(value)}
                  </dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-xl bg-[#103a4e] py-3 text-xs font-bold text-white"
            >
              إغلاق
            </button>
          </section>
        </div>
      )}

      {/* تنبيه نجاح صغير أسفل الشاشة */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-5 z-[120] flex max-w-[350px] items-center gap-3 rounded-xl bg-[#103a4e] px-4 py-3 text-xs font-bold text-white shadow-xl"
        >
          <CheckCircle2
            size={19}
            className="shrink-0 text-[#64d9cd]"
          />

          <span className="flex-1">
            {toast}
          </span>

          <button
            type="button"
            onClick={() => setToast("")}
            aria-label="إغلاق التنبيه"
            className="rounded-md p-1 hover:bg-white/10"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
