
import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import DashboardTable from "./DashboardTable";

import {
  displayValue,
  listFrom,
  recordId,
} from "../utils/dashboardHelpers";

const PAGE_SIZE = 12;

function isInactiveRecord(item) {
  if (!item || typeof item !== "object") {
    return false;
  }

  if (
    item.isDeleted === true ||
    item.deleted === true ||
    item.isActive === false ||
    item.active === false ||
    item.deletedAt != null
  ) {
    return true;
  }

  return [
    "CANCELLED",
    "CANCELED",
    "INACTIVE",
    "DELETED",
    "ARCHIVED",
  ].includes(
    String(item.status ?? "").toUpperCase()
  );
}

export default function DashboardResource({
  title,
  subtitle,
  singular,
  load,
  loadOne,
  create,
  update,
  remove,
  listKeys = "",
  columns,
  fields = [],
  detailFields = [],
  emptyForm = {},
  formFrom = () => ({}),
  makePayload = (form) => form,
  searchable = (item) => JSON.stringify(item),
  allowCreate = true,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [reload, setReload] = useState(0);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showInactive, setShowInactive] =
    useState(false);

  const [mode, setMode] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState(null);

  const [detailsBusy, setDetailsBusy] =
    useState(false);

  const [dialogError, setDialogError] =
    useState("");

  const [advanced, setAdvanced] =
    useState(false);

  const [jsonText, setJsonText] =
    useState("");

  const isTrip = singular === "رحلة";

  const listKeyNames = listKeys
    ? listKeys.split(",").map((key) => key.trim())
    : [];

  // تنبيه النجاح يختفي تلقائياً
  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => {
      setToast("");
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  // تحميل البيانات من السيرفر
  useEffect(() => {
    const controller = new AbortController();

    load(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;

        const items = listFrom(
          data,
          listKeys ? listKeys.split(",") : []
        );

        if (items === null) {
          throw new Error(
            "صيغة القائمة القادمة من السيرفر غير معروفة."
          );
        }

        setRows(items);
        setError("");
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(
            err.message || "تعذر تحميل البيانات."
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [load, listKeys, reload]);

  const inactiveCount = useMemo(
    () => rows.filter(isInactiveRecord).length,
    [rows]
  );

  const displayedRows = useMemo(
    () =>
      showInactive
        ? rows
        : rows.filter(
            (item) => !isInactiveRecord(item)
          ),
    [rows, showInactive]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return displayedRows;

    return displayedRows.filter((item) =>
      String(searchable(item))
        .toLowerCase()
        .includes(term)
    );
  }, [displayedRows, query, searchable]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function refresh() {
    setLoading(true);
    setError("");
    setReload((value) => value + 1);
  }

  function closeDialog() {
    if (saving) return;

    setMode(null);
    setSelected(null);
    setDialogError("");
    setAdvanced(false);
  }

  function openCreate() {
    setSelected(null);
    setForm({ ...emptyForm });
    setMode("create");
    setDialogError("");
    setAdvanced(false);
  }

  function openEdit(item) {
    setSelected(item);
    setForm(formFrom(item));
    setMode("edit");
    setDialogError("");
    setAdvanced(false);
  }

  async function openDetails(item) {
    setSelected(item);
    setMode("view");
    setDialogError("");

    if (!loadOne || recordId(item) == null) {
      return;
    }

    setDetailsBusy(true);

    try {
      const result = await loadOne(
        recordId(item)
      );

      setSelected(
        result?.trip ??
          result?.company ??
          result?.user ??
          result?.customer ??
          result
      );
    } catch (err) {
      setDialogError(
        err.message || "تعذر تحميل التفاصيل."
      );
    } finally {
      setDetailsBusy(false);
    }
  }

  // محرر JSON المتقدم
  function enableAdvanced() {
    try {
      setJsonText(
        JSON.stringify(
          makePayload(form),
          null,
          2
        )
      );

      setAdvanced(true);
      setDialogError("");
    } catch (err) {
      setDialogError(
        err.message || "تعذر تجهيز JSON."
      );
    }
  }

  // إضافة أو تعديل سجل
  async function submitForm(event) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setDialogError("");

    try {
      const payload = advanced
        ? JSON.parse(jsonText)
        : makePayload(form, mode);

      if (
        !payload ||
        Array.isArray(payload) ||
        typeof payload !== "object"
      ) {
        throw new Error(
          "بيانات الطلب يجب أن تكون JSON صالحاً."
        );
      }

      if (mode === "create") {
        await create(payload);
      } else {
        const id = recordId(selected);

        if (id == null) {
          throw new Error(
            "رقم السجل غير موجود."
          );
        }

        await update(id, payload);
      }

      // نجاح صغير أسفل الشاشة
      setToast(
        mode === "create"
          ? `تمت إضافة ${singular} بنجاح.`
          : `تم تعديل ${singular} بنجاح.`
      );

      setMode(null);
      setSelected(null);

      refresh();
    } catch (err) {
      setDialogError(
        err instanceof SyntaxError
          ? "صيغة JSON غير صحيحة."
          : err.message || "فشل الحفظ."
      );
    } finally {
      setSaving(false);
    }
  }

  // حذف أو إلغاء السجل
  async function handleDelete(item) {
    const id = recordId(item);

    if (
      id == null ||
      !remove ||
      deletingId !== null ||
      isInactiveRecord(item)
    ) {
      return;
    }

    const confirmation = isTrip
      ? `هل تريد إلغاء الرحلة رقم ${id}؟
سيحتفظ النظام بسجل الرحلة الملغاة.`
      : `هل تريد حذف ${singular} رقم ${id}؟
قد يمنع السيرفر الحذف إذا كان السجل مرتبطاً ببيانات أخرى.`;

    if (!window.confirm(confirmation)) {
      return;
    }

    setDeletingId(id);
    setError("");

    let requestAccepted = false;

    try {
      const result = await remove(id);

      if (
        result === false ||
        result?.success === false ||
        result?.deleted === false
      ) {
        throw new Error(
          result?.message ||
            "السيرفر رفض عملية الحذف."
        );
      }

      requestAccepted = true;

      let freshRows = listFrom(
        await load(),
        listKeyNames
      );

      if (freshRows === null) {
        throw new Error(
          "تعذر قراءة القائمة بعد الحذف."
        );
      }

      const findRecord = (items) =>
        items.find(
          (record) =>
            String(recordId(record)) ===
            String(id)
        );

      let updatedRecord = findRecord(
        freshRows
      );

      // إعادة التحقق عند تأخر السيرفر
      if (
        updatedRecord &&
        !isInactiveRecord(updatedRecord)
      ) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, 450)
        );

        const again = listFrom(
          await load(),
          listKeyNames
        );

        if (again === null) {
          throw new Error(
            "تعذر قراءة القائمة بعد إعادة المحاولة."
          );
        }

        freshRows = again;
        updatedRecord = findRecord(
          freshRows
        );
      }

      setRows(freshRows);

      if (!updatedRecord) {
        setToast(
          `تم حذف ${singular} رقم ${id} بنجاح.`
        );
      } else if (
        isInactiveRecord(updatedRecord)
      ) {
        setToast(
          isTrip
            ? `تم إلغاء الرحلة رقم ${id}.`
            : `تم تعطيل ${singular} رقم ${id}.`
        );
      } else {
        setError(
          `السيرفر استجاب، لكن ${singular} رقم ${id} ما زال نشطاً. لم نتأكد من تنفيذ العملية.`
        );
      }
    } catch (err) {
      setError(
        requestAccepted
          ? `أُرسل طلب الحذف لكن تعذّر التحقق من نتيجته: ${err.message}`
          : `فشل حذف ${singular} رقم ${id}: ${err.message}`
      );
    } finally {
      setDeletingId(null);
    }
  }

  // أعمدة الجدول
  const tableColumns = [
    ...columns,
    {
      key: "actions",
      title: "الإجراءات",

      render: (item) => {
        const inactive = isInactiveRecord(item);

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="عرض التفاصيل"
              aria-label="عرض التفاصيل"
              onClick={() => openDetails(item)}
              className="rounded-lg bg-[#e7f8f5] p-2 text-[#078e87]"
            >
              <Eye size={17} />
            </button>

            {update && !inactive && (
              <button
                type="button"
                title="تعديل"
                aria-label="تعديل السجل"
                onClick={() => openEdit(item)}
                className="rounded-lg bg-blue-50 p-2 text-blue-600"
              >
                <Pencil size={17} />
              </button>
            )}

            {remove && !inactive && (
              <button
                type="button"
                title={
                  isTrip
                    ? "إلغاء الرحلة"
                    : "حذف السجل"
                }
                aria-label={
                  isTrip
                    ? "إلغاء الرحلة"
                    : "حذف السجل"
                }
                disabled={deletingId !== null}
                onClick={() => handleDelete(item)}
                className="rounded-lg bg-red-50 p-2 text-red-600 disabled:opacity-40"
              >
                <Trash2 size={17} />
              </button>
            )}

            {inactive && (
              <span className="rounded-lg bg-red-50 px-2 py-1.5 text-[10px] font-bold text-red-600">
                {isTrip ? "ملغاة" : "غير نشط"}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div dir="rtl" className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#103a4e]">
            {title}
          </h2>

          <p className="mt-2 text-xs text-[#8197a3]">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {create && (
            <button
              type="button"
              disabled={!allowCreate}
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0daaa0] px-4 py-3 text-xs font-bold text-white disabled:opacity-50"
            >
              <Plus size={17} />
              إضافة {singular}
            </button>
          )}

          <button
            type="button"
            disabled={
              loading || deletingId !== null
            }
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-xl border border-[#dce8ec] bg-white px-4 py-3 text-xs font-bold text-[#103a4e] disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading ? "animate-spin" : ""
              }
            />
            تحديث
          </button>
        </div>
      </div>

      {/* البحث */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-[#e3edf0] bg-white p-5">
        <div className="relative w-full max-w-[400px]">
          <Search
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8197a3]"
          />

          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder={`بحث في ${title}...`}
            className="w-full rounded-xl border border-[#dce8ec] bg-[#f8fbfb] py-3 pl-4 pr-11 text-xs outline-none focus:border-[#0daaa0]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {inactiveCount > 0 && (
            <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-[#718b99]">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(event) => {
                  setShowInactive(
                    event.target.checked
                  );
                  setPage(1);
                }}
                className="h-4 w-4 accent-[#0daaa0]"
              />

              عرض الملغاة / غير النشطة ({inactiveCount})
            </label>
          )}

          <span className="rounded-lg bg-[#e7f8f5] px-3 py-2 text-xs font-bold text-[#078e87]">
            السجلات المعروضة: {filtered.length}
          </span>
        </div>
      </div>

      {/* رسالة الخطأ فقط */}
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-700"
        >
          {error}
        </p>
      )}

      {/* الجدول */}
      <section className="overflow-hidden rounded-[20px] border border-[#e3edf0] bg-white">
        <div className="border-b border-[#edf2f4] p-5">
          <h3 className="text-base font-black text-[#103a4e]">
            قائمة {title}
          </h3>
        </div>

        <DashboardTable
          columns={tableColumns}
          rows={visible}
          loading={loading}
          emptyText={
            error
              ? "تعذر تحميل البيانات."
              : "لا توجد سجلات مطابقة."
          }
          getKey={(item, index) =>
            recordId(item) ?? index
          }
        />

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 border-t border-[#edf2f4] p-4 text-xs text-[#103a4e]">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setPage((value) =>
                  Math.max(1, value - 1)
                )
              }
              className="rounded-lg border border-[#e3edf0] p-2 disabled:opacity-30"
              aria-label="الصفحة السابقة"
            >
              <ChevronRight size={17} />
            </button>

            <span>
              صفحة {currentPage} من {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((value) =>
                  Math.min(totalPages, value + 1)
                )
              }
              className="rounded-lg border border-[#e3edf0] p-2 disabled:opacity-30"
              aria-label="الصفحة التالية"
            >
              <ChevronLeft size={17} />
            </button>
          </div>
        )}
      </section>

      {/* نافذة التفاصيل والإضافة والتعديل */}
      {mode && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071b27]/70 p-4"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeDialog();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`${
              mode === "view"
                ? "تفاصيل"
                : mode === "edit"
                  ? "تعديل"
                  : "إضافة"
            } ${singular}`}
            className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-[20px] bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-black text-[#103a4e]">
                {mode === "create"
                  ? `إضافة ${singular}`
                  : `${
                      mode === "edit"
                        ? "تعديل"
                        : "تفاصيل"
                    } ${singular} #${recordId(selected)}`}
              </h3>

              <button
                type="button"
                onClick={closeDialog}
                aria-label="إغلاق"
                className="rounded-lg p-2 text-[#8197a3] hover:bg-[#f2f7f8]"
              >
                <X size={20} />
              </button>
            </div>

            {dialogError && (
              <p
                role="alert"
                className="mb-4 rounded-xl bg-red-50 p-3 text-xs leading-6 text-red-700"
              >
                {dialogError}
              </p>
            )}

            {mode === "view" ? (
              <div className="space-y-3">
                {detailsBusy && (
                  <p className="text-xs text-[#8197a3]">
                    جاري تحميل التفاصيل...
                  </p>
                )}

                {detailFields.map((field) => (
                  <div
                    key={field.label}
                    className="flex items-start justify-between gap-5 border-b border-[#edf2f4] py-3"
                  >
                    <span className="text-xs text-[#8197a3]">
                      {field.label}
                    </span>

                    <span className="text-left text-xs font-bold text-[#103a4e]">
                      {displayValue(
                        field.value(selected)
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <form
                onSubmit={submitForm}
                className="space-y-4"
              >
                {!advanced ? (
                  fields.map((field) => (
                    <label
                      key={field.name}
                      className="block"
                    >
                      <span className="mb-2 block text-xs font-bold text-[#103a4e]">
                        {field.label}
                        {field.required ? " *" : ""}
                      </span>

                      {field.type === "select" ? (
                        <select
                          required={field.required}
                          value={form[field.name] ?? ""}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              [field.name]:
                                event.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-[#dce8ec] bg-[#fbfdfd] px-4 py-3 text-sm outline-none focus:border-[#0daaa0]"
                        >
                          <option value="">
                            اختر من القائمة
                          </option>

                          {(field.options ?? []).map(
                            (option) => (
                              <option
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            )
                          )}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea
                          rows={3}
                          required={field.required}
                          value={form[field.name] ?? ""}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              [field.name]:
                                event.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-[#dce8ec] bg-[#fbfdfd] px-4 py-3 text-sm outline-none focus:border-[#0daaa0]"
                        />
                      ) : (
                        <input
                          type={field.type ?? "text"}
                          min={field.min}
                          step={field.step}
                          required={field.required}
                          value={form[field.name] ?? ""}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              [field.name]:
                                event.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-[#dce8ec] bg-[#fbfdfd] px-4 py-3 text-sm outline-none focus:border-[#0daaa0]"
                        />
                      )}
                    </label>
                  ))
                ) : (
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-[#103a4e]">
                      JSON المطابق لـ Swagger
                    </span>

                    <textarea
                      dir="ltr"
                      rows={14}
                      spellCheck={false}
                      value={jsonText}
                      onChange={(event) =>
                        setJsonText(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-[#dce8ec] bg-[#fbfdfd] p-4 font-mono text-xs outline-none focus:border-[#0daaa0]"
                    />
                  </label>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf2f4] pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      advanced
                        ? setAdvanced(false)
                        : enableAdvanced()
                    }
                    className="text-xs font-bold text-[#718b99] underline"
                  >
                    {advanced
                      ? "العودة للنموذج"
                      : "محرّر JSON المتقدم"}
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={closeDialog}
                      disabled={saving}
                      className="rounded-xl border border-[#dce8ec] px-4 py-3 text-xs font-bold text-[#103a4e]"
                    >
                      إلغاء
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-[#0daaa0] px-5 py-3 text-xs font-bold text-white disabled:opacity-50"
                    >
                      {saving
                        ? "جاري الحفظ..."
                        : "حفظ على السيرفر"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </section>
        </div>
      )}

      {/* التنبيه الجديد: صغير، كحلي، ومؤقت */}
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
