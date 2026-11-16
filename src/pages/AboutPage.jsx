import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

const container =
  "mx-auto w-[calc(100%-34px)] max-w-[1216px] min-[651px]:w-[calc(100%-48px)] min-[1151px]:w-[calc(100%-68px)]";

export default function AboutPage() {
  return (
    <main
      dir="rtl"
      className="min-h-[70vh] bg-background pb-20 text-foreground dark:bg-[#0b1c29] dark:text-white"
    >
      <section className="border-b border-border bg-gradient-to-bl from-[#f0f7f8] to-background py-10 dark:from-[#173748] dark:to-[#0b1c29]">
        <div className={container}>
          <p className="text-xs font-black text-primary">قصتنا</p>

          <h1 className="mt-3 text-[32px] font-black">
            سيرنا. <span className="text-primary">رحلة أبسط لكل حدا.</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            موقع لحجز الرحلات البرية بين المحافظات السورية، تم تطويره كمشروع
            تعليمي لتصميم وتطوير تطبيقات الويب.
          </p>
        </div>
      </section>

      <section
        className={`${container} grid items-center gap-10 pt-14 lg:grid-cols-2`}
      >
        <div>
          <h2 className="text-[28px] font-black">فكرة صغيرة... تجربة كبيرة.</h2>

          <p className="mt-6 text-[13px] leading-9 text-muted">
            هدف سيرنا هو تقديم تجربة واضحة وسهلة للمسافر، تبدأ من اختيار مدينة
            الانطلاق والوصول، ثم مقارنة الرحلات وشركات النقل، واختيار المقاعد،
            وإتمام الحجز.
          </p>

          <p className="mt-4 text-[13px] leading-9 text-muted">
            تم تطوير المشروع باستخدام React وJavaScript وTailwind CSS، مع ربط
            تسجيل الدخول والرحلات والحجوزات بواجهة API. ويحتوي أيضاً على خريطة
            تفاعلية ومحاكاة تعليمية لحركة الحافلة، وليست تتبعاً مباشراً عبر GPS.
          </p>

          <Link
            to="/results"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-black text-white"
          >
            جرّب حجز رحلة
            <ArrowLeft size={17} />
          </Link>
        </div>
        <figure>
          <img
            src="/images/latakia.jpg"
            alt="شاطئ اللاذقية على الساحل السوري"
            loading="lazy"
            className="h-[350px] w-full rounded-[23px] object-cover shadow-lg"
          />

          <figcaption className="mt-2 text-[10px] text-muted">
            الصورة: Ahmad Ahmad / Wikimedia Commons — CC BY-SA 3.0
          </figcaption>
        </figure>
      </section>
    </main>
  );
}
