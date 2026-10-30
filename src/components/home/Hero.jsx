import { CircleCheck, MapPin, ShieldCheck, Sparkles, Star } from "lucide-react";

import HeroImage from "../../assets/hero.svg";
import SearchForm from "./SearchForm";

const containerClass = `
  mx-auto w-[calc(100%-68px)] max-w-[1216px]
  max-[1150px]:w-[calc(100%-48px)]
  max-[650px]:w-[calc(100%-34px)]
`;

const features = ["حجز سهل", "خيارات متنوعة", "متابعة رحلتك"];

function Hero() {
  return (
    <section
      className="
        relative overflow-hidden
        bg-[linear-gradient(160deg,#f5fbfa_0%,#f8fbfc_56%,#f3f9f7_100%)]
        pt-[65px] pb-[71px]
        dark:bg-[linear-gradient(160deg,#102f3d,#0b1c29)]
        max-[650px]:pt-8 max-[650px]:pb-[52px]
      "
    >
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
          {/* Hero Content */}
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
                my-[19px] mb-[11px]
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
                text-muted dark:text-[#9eb3be]
                max-[1150px]:text-sm
                max-[900px]:text-xs
                max-[650px]:max-w-[480px]
                max-[650px]:text-[13px]
                max-[650px]:leading-[2]
              "
            >
              من حلب لدمشق، ومن الساحل للجزيرة. لاقي الرحلة اللي بتناسبك، اختار
              مقعدك، وخلّي الطريق علينا.
            </p>

            {/* Features */}
            <div
              className="
                flex flex-wrap items-center gap-5
                max-[900px]:gap-[10px]
                max-[650px]:gap-[13px]
              "
            >
              {features.map((feature) => (
                <span
                  key={feature}
                  className="
                    flex items-center gap-[6px]
                    text-[11px] font-extrabold
                    text-foreground
                    dark:text-[#eef8fa]
                    max-[900px]:text-[10px]
                  "
                >
                  <CircleCheck size={17} className="text-primary" />
                  {feature}
                </span>
              ))}
            </div>

            {/* Social Proof */}
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
                    key={index}
                    style={{ backgroundColor: color }}
                    className="
                      -ml-[7px] grid h-[35px] w-[35px]
                      place-items-center rounded-full
                      border-[3px] border-white
                      font-black text-[#5e3a36]
                      dark:border-[#112b3b]
                    "
                  >
                    {letter}
                  </span>
                ))}
              </div>

              <div>
                <div className="flex items-center gap-1 text-[#f7b843]">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={14} />
                  ))}
                  <b className="mr-1 text-xs text-foreground dark:text-white">
                    4.9/5
                  </b>
                </div>

                <small className="text-[10px] font-bold text-muted">
                  تجربة سفر بتستاهل تجرّبها
                </small>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div
            className="
              relative min-w-0 py-[18px] pl-5
              max-[900px]:p-0
              max-[650px]:mx-[14px]
              max-[650px]:mt-[22px]
              max-[650px]:mb-[6px]
            "
          >
            <div
              className="
                relative rotate-[-1.5deg]
                rounded-[30px] bg-[#a8ddd2]
                shadow-[0_30px_70px_rgba(10,62,70,0.15)]
                max-[650px]:rotate-0
                max-[650px]:rounded-[20px]
              "
            >
              <img
                src={HeroImage}
                alt="حافلة سيرنا حديثة على طريق بين المدن السورية"
                className="
                  aspect-[1.45] w-full rounded-[30px]
                  object-cover
                  max-[650px]:aspect-[1.48]
                  max-[650px]:rounded-[20px]
                "
              />

              {/* Floating Card - Top */}
              <div
                className="
                  absolute top-9 -left-[26px]
                  flex rotate-[1.5deg]
                  items-center gap-[10px]
                  rounded-2xl bg-white
                  px-4 py-3 text-[#114252]
                  shadow-[0_15px_28px_rgba(15,61,69,0.17)]
                  max-[900px]:-left-3
                  max-[900px]:p-[9px]
                  max-[650px]:top-[17px]
                "
              >
                <MapPin size={18} className="text-primary" />

                <div className="flex flex-col whitespace-nowrap">
                  <b className="text-xs max-[900px]:text-[10px]">14 محافظة</b>
                  <small className="text-[10px] text-[#7e9299] max-[900px]:text-[9px]">
                    وجهات بتجمعنا
                  </small>
                </div>
              </div>

              {/* Floating Card - Bottom */}
              <div
                className="
                  absolute right-[-22px] bottom-[45px]
                  flex rotate-[1.5deg]
                  items-center gap-[10px]
                  rounded-2xl bg-white
                  px-4 py-3 text-[#114252]
                  shadow-[0_15px_28px_rgba(15,61,69,0.17)]
                  max-[900px]:-right-3
                  max-[900px]:p-[9px]
                  max-[650px]:bottom-[13px]
                "
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
          </div>
        </div>

        {/* Search Box */}
        <div
          className="
            relative z-20 mt-[22px]
            rounded-[21px] border border-border
            bg-white px-6 pt-[22px] pb-[25px]
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
              max-[650px]:items-start
            "
          >
            <div className="flex flex-wrap items-center gap-[11px] max-[650px]:gap-[6px]">
              <span
                className="
                  h-[9px] w-[9px] shrink-0
                  rounded-full bg-primary
                  shadow-[0_0_0_5px_#e6f8f3]
                "
              />

              <strong className="text-[15px] font-bold max-[650px]:text-[13px]">
                وين رحلتك الجاية؟
              </strong>

              <span
                className="
                  text-[11px] text-muted
                  max-[650px]:basis-full
                  max-[650px]:text-[10px]
                "
              >
                اختار وجهتك وباقي التفاصيل علينا
              </span>
            </div>

            <span
              className="
                inline-flex shrink-0 items-center gap-[5px]
                text-[10px] font-extrabold text-[#14968d]
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
    </section>
  );
}

export default Hero;
