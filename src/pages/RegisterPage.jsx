import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Info,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserRound,
} from "lucide-react";

import { register } from "../services/authService";

const DAMASCUS_IMAGE =
  "https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/6/68/Syria%2C_Damascus%2C_The_Umayyad_Mosque.jpg&w=1100&q=85";

const fieldClass =
  "flex h-[55px] items-center gap-3 rounded-xl border border-[#e4ecef] bg-white px-4 transition focus-within:border-[#0aa99b] focus-within:ring-2 focus-within:ring-[#0aa99b]/10";

const inputClass =
  "h-full w-full min-w-0 bg-transparent text-[13px] text-[#112f41] outline-none placeholder:text-[#9baab4]";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading || !accepted) return;

    setError("");
    setCreated(false);
    setLoading(true);

    try {
      await register({ name, email, password });

      setCreated(true);
      setPassword("");
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "تعذّر الاتصال بالسيرفر. تحقق من الإنترنت وحاول مجدداً."
          : err instanceof Error
            ? err.message
            : "حدث خطأ غير متوقع.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="bg-[#f8fafb] px-4 py-8 text-[#112f41] sm:px-6 sm:py-14"
    >
      <div className="mx-auto grid min-h-[610px] max-w-[1216px] overflow-hidden rounded-[25px] border border-[#e4ecef] bg-white shadow-[0_15px_55px_rgba(19,54,72,0.065)] lg:grid-cols-2">
        {/* نموذج إنشاء الحساب */}
        <section className="order-2 flex flex-col justify-center px-6 py-10 sm:px-10 lg:order-1 lg:px-14 lg:py-12">
          <div>
            <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#0aa99b]">
              <span className="h-[2px] w-6 rounded-full bg-[#0aa99b]" />
              انضم لعيلة سيرنا
            </div>

            <h1 className="mt-3 text-[28px] font-black tracking-tight sm:text-[32px]">
              خلّينا نبدأ
              <span className="text-[#0aa99b]"> المشوار سوا.</span>
            </h1>

            <p className="mt-2 text-[13px] leading-7 text-[#718493]">
              حساب بسيط، ورحلاتك كلها بين إيديك.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            {/* الاسم الكامل */}
            <div>
              <label
                htmlFor="register-name"
                className="mb-2 block text-[12px] font-bold"
              >
                الاسم الكامل
              </label>

              <div className={fieldClass}>
                <UserRound size={19} className="shrink-0 text-[#718493]" />

                <input
                  id="register-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="اسمك الكامل"
                  required
                  minLength={3}
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label
                htmlFor="register-email"
                className="mb-2 block text-[12px] font-bold"
              >
                البريد الإلكتروني
              </label>

              <div className={fieldClass}>
                <Mail size={19} className="shrink-0 text-[#718493]" />

                <input
                  id="register-email"
                  type="email"
                  name="email"
                  dir="ltr"
                  autoComplete="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div>
              <label
                htmlFor="register-password"
                className="mb-2 block text-[12px] font-bold"
              >
                كلمة المرور
              </label>

              <div className={fieldClass}>
                <LockKeyhole size={19} className="shrink-0 text-[#718493]" />

                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  dir="ltr"
                  autoComplete="new-password"
                  placeholder="6 أحرف على الأقل"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={inputClass}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 text-[#718493] transition hover:text-[#0aa99b]"
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* الموافقة */}
            <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-6 text-[#718493]">
              <input
                type="checkbox"
                required
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#0aa99b]"
              />
              أوافق على إرسال البيانات المدخلة لإنشاء حسابي في سيرنا.
            </label>

            {/* رسائل الحالة */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] leading-6 text-red-700"
              >
                {error}
              </div>
            )}

            {created && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] leading-6 text-emerald-800"
              >
                تم إنشاء حسابك بنجاح!
                <Link to="/login" className="mr-2 font-extrabold underline">
                  سجّل دخولك
                </Link>
              </div>
            )}

            {/* زر إنشاء الحساب */}
            <button
              type="submit"
              disabled={loading || !accepted || created}
              className="mt-1 flex min-h-[53px] items-center justify-center gap-3 rounded-xl bg-[#0aa99b] px-5 text-[13px] font-extrabold text-white transition hover:bg-[#078e87] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  جاري إنشاء الحساب...
                </>
              ) : created ? (
                "تم إنشاء الحساب"
              ) : (
                <>
                  إنشاء حساب
                  <ArrowLeft size={19} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[12px] text-[#718493]">
            عندك حساب من قبل؟{" "}
            <Link
              to="/login"
              className="font-black text-[#0aa99b] hover:underline"
            >
              سجّل دخولك
            </Link>
          </p>

          <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#f2f7f8] p-4 text-[11px] leading-6 text-[#718493]">
            <Info size={17} className="mt-0.5 shrink-0 text-[#0aa99b]" />
            بيانات التسجيل رح تُرسل إلى سيرفر سيرنا الحقيقي. كلمة المرور ما رح
            تُحفظ داخل واجهة الموقع.
          </div>
        </section>

        {/* القسم البصري */}
        <aside className="relative order-1 flex min-h-[310px] flex-col overflow-hidden bg-gradient-to-br from-[#123e51] to-[#1b7176] p-6 text-white sm:p-9 lg:order-2 lg:min-h-[610px]">
          <div className="pointer-events-none absolute -right-52 -top-40 h-[440px] w-[440px] rounded-full border border-dashed border-white/20" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold">
              <Sparkles size={17} />
              عالم جديد بانتظارك
            </div>

            <h2 className="mt-5 text-[29px] font-black leading-[1.4] sm:text-[38px] lg:mt-7 lg:text-[40px]">
              كل الطرق
              <span className="block">بتوصّل لذكريات.</span>
            </h2>

            <p className="mt-2 text-[12px] text-[#d7f0eb]">
              ومن أول محطة رح نكون معك.
            </p>
          </div>

          <img
            src={DAMASCUS_IMAGE}
            alt="الجامع الأموي في دمشق"
            loading="lazy"
            decoding="async"
            className="relative z-10 mx-auto mt-6 h-[145px] w-[80%] -rotate-3 rounded-[17px] object-cover shadow-2xl sm:h-[190px] lg:my-auto lg:h-auto lg:max-h-[280px] lg:w-[95%]"
          />

          <div className="relative z-10 mt-7 hidden flex-wrap items-center gap-6 text-[11px] font-bold text-white/90 lg:flex">
            <span className="flex items-center gap-2">
              <ShieldCheck size={19} />
              سهل وواضح
            </span>

            <span className="flex items-center gap-2">
              <Ticket size={19} />
              حجز بخطوات بسيطة
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
}
