import { Link } from "react-router";
import { ArrowLeft, CheckCircle2, MapPin, Sparkles } from "lucide-react";

import RoutePreviewMap from "../maps/RoutePreviewMap";

const containerClass = `
  mx-auto w-[calc(100%-68px)] max-w-[1216px]
  max-[1150px]:w-[calc(100%-48px)]
  max-[650px]:w-[calc(100%-34px)]
`;

const features = [
  "استكشف مواقع المدن على الخريطة",
  "تعرّف على تفاصيل الرحلة ومحطاتها",
];

function TrackingPreview() {
  return (
    <section
      className="
        py-[86px]
        max-[650px]:py-[58px]
      "
    >
      <div className={containerClass}>
        <div
          className="
            grid min-h-[435px]
            grid-cols-[0.9fr_1.1fr]
            overflow-hidden
            rounded-[28px]
            border border-[#e4ecef]
            bg-white

            dark:border-[#254252]
            dark:bg-[#112b3b]

            max-[900px]:grid-cols-2
            max-[650px]:grid-cols-1
          "
        >
          {/* Right side: Content */}
          <div
            className="
              px-[52px] py-[50px]
              max-[900px]:px-[29px]
              max-[900px]:py-9
              max-[650px]:px-6
              max-[650px]:py-8
            "
          >
            {/* Eyebrow */}
            <span
              className="
                inline-flex items-center gap-2
                rounded-full
                bg-[#e6f8f3]
                px-[14px] py-[5px]
                text-[11px] font-black
                text-[#078e87]

                dark:bg-[#174b49]
                dark:text-[#68dfcc]
              "
            >
              <Sparkles size={13} />
              وين وصلت الرحلة؟
            </span>

            {/* Heading */}
            <h2
              className="
                mt-3 mb-[6px]
                text-[clamp(25px,3vw,36px)]
                leading-[1.65]
                font-extrabold
                text-[#112f41]

                dark:text-[#eef8fa]
                max-[650px]:text-[29px]
              "
            >
              الطريق قدامك.
              <br />
              <span className="text-[#0aa99b]">لحظة بلحظة؟</span>
            </h2>

            {/* Description */}
            <p
              className="
                my-[15px]
                text-[13px]
                leading-[2.15]
                text-[#718493]
                dark:text-[#9eb3be]
              "
            >
              بصفحة التتبّع بتشوف تفاصيل الرحلة ومحطاتها وحالتها ضمن نموذج
              تفاعلي سهل وواضح.
            </p>

            {/* Features */}
            <div className="space-y-[11px]">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="
                    flex items-center gap-[10px]
                    text-xs font-extrabold
                    text-[#112f41]
                    dark:text-white
                  "
                >
                  <CheckCircle2
                    size={18}
                    className="
                      shrink-0
                      text-[#0aa99b]
                    "
                  />

                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Tracking button */}
            <Link
              to="/tracking"
              className="
                mt-[30px]
                inline-flex min-h-[49px]
                items-center justify-center
                gap-[10px]
                rounded-xl
                bg-[#0aa99b]
                px-[22px] py-[11px]
                text-[13px]
                font-extrabold text-white

                shadow-[0_9px_20px_rgba(8,165,151,0.19)]

                transition-all duration-200
                hover:-translate-y-[3px]
                hover:bg-[#078e87]
                active:translate-y-0

                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#0aa99b]
              "
            >
              جرّب تتبّع رحلة
              <ArrowLeft size={18} />
            </Link>

            {/* Disclaimer */}
            <small
              className="
                mt-[13px] block
                text-[9px]
                leading-[1.8]
                text-[#718493]
                dark:text-[#9eb3be]
              "
            >
              * الخريطة والتتبّع في هذا النموذج توضيحيان، وليسا GPS مباشراً.
            </small>
          </div>

          {/* Left side: Map preview */}
          <div
            className="
              flex min-w-0 flex-col
              justify-center
              bg-[#f0f6f3]
              p-7

              max-[900px]:p-[17px]
              max-[650px]:p-[15px]
            "
          >
            {/* Map heading */}
            <div
              className="
                mb-[15px]
                flex flex-wrap
                items-center gap-2
                text-xs font-extrabold
                text-[#215467]
              "
            >
              <span
                className="
                  h-[9px] w-[9px]
                  shrink-0 rounded-full
                  bg-[#13b58d]
                  shadow-[0_0_0_5px_rgba(16,180,141,0.13)]
                "
              />

              <span>معاينة خريطة سوريا</span>

              <strong className="mr-auto">حلب ودمشق</strong>
            </div>

            {/* Interactive map - loads immediately */}
            <RoutePreviewMap />

            {/* City labels - without connecting line */}
            <div
              className="
                mt-[15px]
                flex items-center
                justify-between gap-3
                text-[11px]
                font-black text-[#235666]
              "
            >
              <span
                className="
                  inline-flex items-center gap-[5px]
                "
              >
                <MapPin size={15} className="text-[#0aa99b]" />
                حلب
              </span>

              <span
                className="
                  inline-flex items-center gap-[5px]
                "
              >
                <MapPin size={15} className="text-[#153c52]" />
                دمشق
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrackingPreview;
