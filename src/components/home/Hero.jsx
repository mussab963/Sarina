import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import SearchForm from "./SearchForm";

// نفس مصادر صورة دمشق المستخدمة بالتصميم الجديد.
const HERO_IMAGES = [
  "https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/6/68/Syria%2C_Damascus%2C_The_Umayyad_Mosque.jpg&w=1100&q=85",
  "https://upload.wikimedia.org/wikipedia/commons/6/68/Syria,_Damascus,_The_Umayyad_Mosque.jpg",
];

const containerClass = `
  mx-auto w-[calc(100%-68px)] max-w-[1216px]
  max-[1150px]:w-[calc(100%-48px)]
  max-[650px]:w-[calc(100%-34px)]
`;

const floatingCardClass = `
  absolute z-10 flex items-center gap-[10px]
  rounded-2xl bg-white px-4 py-3
  text-[#114252]
  shadow-[0_15px_28px_rgba(15,61,69,0.17)]
  motion-safe:animate-[sairna-float_9s_ease-in-out_infinite]
  max-[900px]:p-[9px]
`;

function Hero() {
  const [imageIndex, setImageIndex] = useState(0);
  const imageAvailable = imageIndex < HERO_IMAGES.length;

  return (
    <section
      className="
        relative overflow-hidden
        bg-[linear-gradient(160deg,#f5fbfa_0%,#f8fbfc_56%,#f3f9f7_100%)]
        py-[65px] pb-[71px]
        dark:bg-[linear-gradient(160deg,#102f3d,#0b1c29)]
        max-[650px]:pt-8
        max-[650px]:pb-[52px]
      "
    >
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -top-[180px]
          -left-[140px] h-[540px] w-[540px]
          rounded-full
          bg-[radial-gradient(circle,rgba(76,203,175,0.1),transparent_66%)]
        "
      />

      <div className={containerClass}>
        {/* Hero grid */}
        <div
          className="
            grid min-h-[420px]
            grid-cols-[0.95fr_1.05fr]
            items-center gap-9
            max-[900px]:grid-cols-2
            max-[900px]:gap-2
            max-[650px]:grid-cols-1
            max-[650px]:gap-0
          "
        >
          {/* Text content */}
          <div
            className="
              relative z-10 pb-[34px]
              max-[650px]:pb-0
            "
          >
            <span
              className="
                inline-flex items-center gap-2
                rounded-full bg-[#e6f8f3]
                px-[14px] py-[5px]
                text-[11px] font-black
                text-[#078e87]
                dark:bg-[#174b49]
                dark:text-[#68dfcc]
              "
            >
              <Sparkles size={13} />
              أهلاً فيك بسيرنا
            </span>

            <h1
              className="
                mt-[19px] mb-[11px]
                text-[clamp(48px,5.15vw,79px)]
                leading-[1.33] font-black
                tracking-[-2.4px]
                text-[#0a2c3e]
                dark:text-[#eef8fa]
                max-[1150px]:text-[clamp(45px,5vw,66px)]
                max-[900px]:text-[49px]
                max-[650px]:mt-4
                max-[650px]:text-[clamp(44px,11vw,62px)]
                max-[650px]:tracking-[-1.8px]
              "
            >
              المحطة الجاية؟
              <br />
              <span
                className="
                  bg-[linear-gradient(93deg,#078a91,#15ba9d_75%)]
                  bg-clip-text text-transparent
                "
              >
                على كيفك.
              </span>
            </h1>

            <p
              className="
                mb-[22px] max-w-[485px]
                text-base leading-[2.15]
                text-muted
                max-[1150px]:text-sm
                max-[900px]:text-xs
                max-[650px]:text-[13px]
                max-[650px]:leading-[2]
              "
            >
              من حلب لدمشق، ومن الساحل للجزيرة. لاقي الرحلة اللي بتناسبك، اختار
              مقعدك، وخلّي الطريق علينا.
            </p>

            {/* Benefits */}
            <div
              className="
                flex flex-wrap items-center gap-5
                max-[900px]:gap-[10px]
                max-[650px]:gap-[13px]
              "
            >
              {["حجز سهل", "خيارات متنوعة", "متابعة رحلتك"].map((item) => (
                <span
                  key={item}
                  className="
                    flex items-center gap-[6px]
                    text-[11px] font-extrabold
                    text-foreground
                    dark:text-[#eef8fa]
                    max-[900px]:text-[10px]
                  "
                >
                  <CheckCircle2 size={17} className="shrink-0 text-primary" />
                  {item}
                </span>
              ))}
            </div>

            {/* Social proof */}
            <div
              className="
                mt-10 flex items-center gap-[14px]
                max-[900px]:mt-6
                max-[650px]:hidden
              "
            >
              <div className="flex items-center">
                {[
                  ["م", "#f3d2a6"],
                  ["س", "#c2dadb"],
                  ["ع", "#e4bed1"],
                  ["ر", "#b9d2ed"],
                ].map(([letter, color], index) => (
                  <span
                    key={letter}
                    style={{
                      backgroundColor: color,
                      marginRight: index === 0 ? 0 : -7,
                    }}
                    className="
                      grid h-[35px] w-[35px]
                      place-items-center
                      rounded-full border-[3px]
                      border-white text-xs font-black
                      text-[#5e3a36]
                      dark:border-[#112b3b]
                    "
                  >
                    {letter}
                  </span>
                ))}
              </div>

              <div>
                <div className="flex items-center gap-[3px]">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={14}
                      fill="currentColor"
                      className="text-[#f7b843]"
                    />
                  ))}

                  <strong className="mr-[7px] text-xs text-foreground dark:text-white">
                    4.9/5
                  </strong>
                </div>

                <small className="text-[10px] font-bold text-muted">
                  تجربة سفر بتستاهل تجرّبها
                </small>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div
            className="
              relative min-w-0
              py-[18px] pr-0 pl-5
              max-[900px]:p-0
              max-[650px]:mx-[14px]
              max-[650px]:mt-[22px]
              max-[650px]:mb-[6px]
            "
          >
            <div
              className="
                relative isolate min-h-[320px]
                -rotate-[1.5deg]
                rounded-[30px] bg-[#d4e4e5]
                shadow-[0_30px_70px_rgba(10,62,70,0.15)]
                max-[650px]:min-h-0
                max-[650px]:rotate-0
              "
            >
              {imageAvailable ? (
                <img
                  src={HERO_IMAGES[imageIndex]}
                  alt="صورة للجامع الأموي في دمشق"
                  fetchPriority="high"
                  onError={() => setImageIndex((index) => index + 1)}
                  className="
                    block aspect-[1.45] w-full
                    rounded-[30px] object-cover
                    max-[650px]:aspect-[1.48]
                    max-[650px]:rounded-[20px]
                  "
                />
              ) : (
                <div
                  className="
                    grid aspect-[1.45] place-items-center
                    rounded-[30px] bg-[#d4e4e5]
                    px-7 text-center text-sm
                    font-bold text-[#54727c]
                    max-[650px]:aspect-[1.48]
                    max-[650px]:rounded-[20px]
                  "
                >
                  تعذّر تحميل صورة دمشق. تأكد من اتصال الإنترنت.
                </div>
              )}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none absolute inset-0
                  rounded-[30px]
                  bg-[linear-gradient(135deg,rgba(3,38,47,0.08),transparent_68%)]
                  max-[650px]:rounded-[20px]
                "
              />

              {imageAvailable && (
                <span
                  className="
                    absolute bottom-[17px] left-[18px]
                    z-[1] rounded-lg
                    bg-[rgba(12,43,53,0.72)]
                    px-[11px] py-[5px]
                    text-[10px] font-bold text-white
                    max-[650px]:bottom-[11px]
                    max-[650px]:left-[11px]
                    max-[650px]:text-[9px]
                  "
                >
                  صورة حقيقية من دمشق
                </span>
              )}

              {/* Floating top card */}
              <div
                className={`
                  ${floatingCardClass}
                  top-9 -left-[26px]
                  max-[900px]:-left-3
                  max-[650px]:top-[17px]
                `}
              >
                <MapPin size={18} className="shrink-0 text-primary" />

                <div className="flex flex-col whitespace-nowrap">
                  <b className="text-xs max-[900px]:text-[10px]">14 محافظة</b>
                  <small className="text-[10px] text-[#7e9299] max-[900px]:text-[9px]">
                    وجهات بتجمعنا
                  </small>
                </div>
              </div>

              {/* Floating bottom card */}
              <div
                className={`
                  ${floatingCardClass}
                  right-[-22px] bottom-[45px]
                  motion-safe:animate-[sairna-float_10s_ease-in-out_infinite]
                  max-[900px]:-right-3
                  max-[650px]:bottom-[13px]
                `}
              >
                <span
                  className="
                    grid h-10 w-10 place-items-center
                    rounded-xl bg-[#e6f9f4]
                    text-[#0ca88f]
                    max-[650px]:h-8
                    max-[650px]:w-8
                  "
                >
                  <ShieldCheck size={20} />
                </span>

                <div className="flex flex-col whitespace-nowrap">
                  <b className="text-xs max-[900px]:text-[10px]">سافر براحة</b>
                  <small className="text-[10px] text-[#7e9299] max-[900px]:text-[9px]">
                    من أول حجز لآخر محطة
                  </small>
                </div>
              </div>
            </div>

            {/* Decorative orbit circles */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute
                -top-[35px] -left-[62px]
                -z-10 h-[220px] w-[220px]
                rounded-full border-[1.5px]
                border-dashed border-[#99d6cc]
              "
            />
            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute
                right-[-50px] bottom-0
                -z-10 h-[150px] w-[150px]
                rounded-full border-[1.5px]
                border-dashed border-[#99d6cc]
              "
            />
          </div>
        </div>

        {/* Search shell */}
        <div
          className="
            relative z-[3] mt-[22px]
            rounded-[21px] border border-border
            bg-surface px-6 pt-[22px] pb-[25px]
            shadow-[0_21px_58px_rgba(11,71,72,0.1)]
            dark:border-[#254252]
            dark:bg-[#112b3b]
            max-[650px]:mt-5
            max-[650px]:px-[14px]
            max-[650px]:py-[18px]
          "
        >
          <div
            className="
              mb-4 flex items-center
              justify-between gap-3
            "
          >
            <div className="flex flex-wrap items-center gap-[11px]">
              <span
                className="
                  h-[9px] w-[9px] shrink-0
                  rounded-full bg-primary
                  shadow-[0_0_0_5px_#e6f8f3]
                "
              />

              <strong className="text-[15px] max-[650px]:text-[13px]">
                وين رحلتك الجاية؟
              </strong>

              <span className="text-[11px] text-muted max-[650px]:basis-full max-[650px]:text-[10px]">
                اختار وجهتك وباقي التفاصيل علينا
              </span>
            </div>

            <span
              className="
                flex shrink-0 items-center gap-[5px]
                text-[10px] font-extrabold
                text-[#14968d]
                max-[650px]:hidden
              "
            >
              <Sparkles size={16} />
              الحجز بـ 3 خطوات
            </span>
          </div>

          <SearchForm />
        </div>
      </div>

      <style>{`
        @keyframes sairna-float {
          0%, 100% {
            transform: translateY(0) rotate(1.5deg);
          }
          50% {
            transform: translateY(-5px) rotate(1.5deg);
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;
