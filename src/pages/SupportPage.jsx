import { Link } from "react-router";
import { ArrowLeft, Headphones, Plus } from "lucide-react";

const container =
  "mx-auto w-[calc(100%-34px)] max-w-[1216px] min-[651px]:w-[calc(100%-48px)] min-[1151px]:w-[calc(100%-68px)]";

const questions = [
  {
    question: "كيف بحجز رحلة؟",
    answer:
      "اختار مدينة الانطلاق والوصول والتاريخ، وبعدها اختار الرحلة والمقاعد، وأدخل بيانات المسافرين وأكّد الحجز.",
  },
  {
    question: "وين بلاقي حجوزاتي؟",
    answer:
      "من صفحة حجوزاتي. لازم تكون مسجّل دخول، والحجوزات تُجلب من السيرفر المرتبط بحسابك.",
  },
  {
    question: "هل تسجيل الدخول حقيقي؟",
    answer:
      "نعم، تسجيل الدخول وإنشاء الحساب مرتبطان بواجهة API الخاصة بالمشروع.",
  },
  {
    question: "في دفع إلكتروني حقيقي؟",
    answer: "لا، الدفع الإلكتروني تجريبي حالياً وغير مرتبط ببوابة دفع حقيقية.",
  },
  {
    question: "الخريطة بتعرض مكان الباص الحقيقي؟",
    answer:
      "لا، حركة الباص محاكاة تعليمية، وليست تتبع GPS مباشر. ويمكنك فتح طريق القيادة عبر Google Maps.",
  },
  {
    question: "نسيت كلمة المرور، شو بعمل؟",
    answer:
      "استعادة كلمة المرور غير متاحة حالياً ضمن وظائف الموقع. تحتاج هذه الميزة إلى دعم إضافي من السيرفر.",
  },
];

export default function SupportPage() {
  return (
    <main
      dir="rtl"
      className="min-h-[70vh] bg-background pb-20 text-foreground dark:bg-[#0b1c29] dark:text-white"
    >
      <section className="border-b border-border bg-gradient-to-bl from-[#f0f7f8] to-background py-10 dark:from-[#173748] dark:to-[#0b1c29]">
        <div className={container}>
          <p className="text-xs font-black text-primary">نحن معك</p>

          <h1 className="mt-3 text-[32px] font-black">
            شو حابب <span className="text-primary">تعرف؟</span>
          </h1>

          <p className="mt-3 text-sm text-muted">
            أسئلة وأجوبة بتساعدك تستخدم سيرنا بسهولة.
          </p>
        </div>
      </section>

      <section
        className={`${container} grid items-start gap-5 pt-12 lg:grid-cols-[1fr_300px]`}
      >
        {/* الأسئلة الشائعة */}
        <div className="space-y-3">
          {questions.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-border bg-white px-5 dark:border-[#254252] dark:bg-[#112b3b]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[13px] font-black group-open:text-primary [&::-webkit-details-marker]:hidden">
                {item.question}
                <Plus
                  size={19}
                  className="shrink-0 text-primary transition group-open:rotate-45"
                />
              </summary>

              <p className="border-t border-border pb-5 pt-4 text-xs leading-8 text-muted dark:border-[#254252]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        {/* بطاقة المساعدة */}
        <aside className="rounded-[18px] bg-[#e6f8f3] p-7 text-[#123e51]">
          <Headphones size={34} className="text-primary" />

          <h2 className="mt-5 text-xl font-black">بحاجة لمساعدة؟</h2>

          <p className="mt-4 text-xs leading-7">
            هاي الصفحة بتجاوب عن الأسئلة الشائعة في مشروع سيرنا. نظام التواصل مع
            فريق الدعم غير متوفر حالياً.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-white"
          >
            رجوع للرئيسية
            <ArrowLeft size={17} />
          </Link>
        </aside>
      </section>
    </main>
  );
}
