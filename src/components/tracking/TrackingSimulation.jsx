import {
  Bus,
  Check,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  Route,
} from "lucide-react";

export default function TrackingSimulation({
  origin,
  destination,
  progress,
  playing,
  onToggle,
  onReset,
}) {
  const completed = progress >= 100;

  const status = completed
    ? "اكتملت المحاكاة"
    : playing
      ? "المحاكاة قيد التشغيل"
      : progress > 0
        ? "المحاكاة متوقفة مؤقتاً"
        : "جاهزة للبدء";

  return (
    <div className="mt-6 border-t border-border pt-6 dark:border-[#254252]">
      {/* عنوان التقدم */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-black">تقدّم الرحلة</h3>

        <strong className="text-sm font-black text-primary">{progress}%</strong>
      </div>

      {/* شريط التقدم */}
      <div
        role="progressbar"
        aria-label="تقدّم محاكاة الرحلة"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="h-2.5 overflow-hidden rounded-full bg-[#e5efed] dark:bg-[#244654]"
        dir="ltr"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#0cb5a3] to-[#69d1b2] transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-[11px] text-muted">{status}</p>

      {/* محطات الرحلة */}
      <div className="mt-6 space-y-5">
        {/* الانطلاق */}
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e6f8f3] text-[#078e87]">
            <Check size={18} />
          </span>

          <div className="flex-1">
            <p className="text-xs font-black">{origin}</p>
            <p className="mt-1 text-[11px] text-muted">محطة الانطلاق</p>
          </div>

          <span className="text-[10px] font-bold text-muted">
            {progress > 0 ? "تم الانطلاق*" : "البداية"}
          </span>
        </div>

        {/* على الطريق */}
        <div className="flex items-center gap-3">
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
              progress > 0 && !completed
                ? "bg-primary text-white"
                : "bg-[#e6efef] text-[#68818d]"
            }`}
          >
            <Bus size={18} />
          </span>

          <div className="flex-1">
            <p className="text-xs font-black">على الطريق</p>
            <p className="mt-1 text-[11px] text-muted">
              {completed
                ? "انتهى المسار التجريبي"
                : progress > 0
                  ? "الحافلة تتحرك افتراضياً"
                  : "بانتظار بدء المحاكاة"}
            </p>
          </div>

          <span className="text-[10px] font-bold text-primary">
            {playing && !completed ? "الآن*" : "—"}
          </span>
        </div>

        {/* الوصول */}
        <div className="flex items-center gap-3">
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
              completed
                ? "bg-[#e6f8f3] text-[#078e87]"
                : "bg-[#e6efef] text-[#68818d]"
            }`}
          >
            {completed ? <Check size={18} /> : <MapPin size={18} />}
          </span>

          <div className="flex-1">
            <p className="text-xs font-black">{destination}</p>
            <p className="mt-1 text-[11px] text-muted">محطة الوصول</p>
          </div>

          <span className="text-[10px] font-bold text-muted">
            {completed ? "تم الوصول*" : "الوجهة"}
          </span>
        </div>
      </div>

      {/* معلومات المحاكاة */}
      <div className="mt-6 rounded-xl border border-border p-3 dark:border-[#254252]">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-[11px] text-muted">
            <Route size={16} />
            حالة المسار
          </span>

          <span className="text-[11px] font-black">
            {completed ? "مكتمل تجريبياً" : `${progress}%`}
          </span>
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          disabled={completed}
          onClick={onToggle}
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {playing && !completed ? (
            <>
              <Pause size={17} />
              إيقاف الحركة
            </>
          ) : (
            <>
              <Play size={17} />
              {progress > 0 ? "متابعة الحركة" : "بدء المحاكاة"}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          aria-label="إعادة المحاكاة"
          title="إعادة المحاكاة"
          className="grid h-11 w-12 shrink-0 place-items-center rounded-xl border border-border transition hover:bg-[#f2f7f8] dark:border-[#254252] dark:hover:bg-[#173748]"
        >
          <RotateCcw size={19} />
        </button>
      </div>

      <p className="mt-4 text-[10px] leading-6 text-muted">
        * هذه حركة ونسبة تقدّم افتراضيتان لأغراض تعليمية، ولا تعبّران عن موقع
        الحافلة الحقيقي أو حالة الرحلة الفعلية.
      </p>
    </div>
  );
}
