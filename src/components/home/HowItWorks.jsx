import { Search, BusFront, Ticket, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "اختار وجهتك",
    description: "حدّد من وين لوين وتاريخ الرحلة المناسب إلك.",
    Icon: Search,
    iconStyle: "bg-[#e6f8f3] text-[#0aa99b] dark:bg-[#174b49]",
  },
  {
    number: "02",
    title: "لاقي رحلتك",
    description: "قارن الشركات والمواعيد والأسعار واختر الأفضل.",
    Icon: BusFront,
    iconStyle: "bg-[#fff4e4] text-[#e4a34c]",
  },
  {
    number: "03",
    title: "احجز مقعدك",
    description: "اختار مقعدك وأكّد الحجز، وتذكرتك بتصير جاهزة.",
    Icon: Ticket,
    iconStyle: "bg-[#eaf1ff] text-[#5988d1]",
  },
];

function HowItWorks() {
  return (
    <section
      className="
        border-y border-[#e4ecef]
        bg-[#f2f7f8] py-[86px]
        dark:border-[#254252]
        dark:bg-[#173748]
        max-[650px]:py-[58px]
      "
    >
      <div
        className="
          mx-auto w-[calc(100%-68px)]
          max-w-[1216px]
          max-[1150px]:w-[calc(100%-48px)]
          max-[650px]:w-[calc(100%-34px)]
        "
      >
        {/* Section heading */}
        <div className="mb-[35px] text-center">
          <span
            className="
              inline-flex items-center gap-2
              rounded-full bg-[#e6f8f3]
              px-[14px] py-[5px]
              text-[11px] font-black text-[#078e87]
              dark:bg-[#174b49]
              dark:text-[#68dfcc]
            "
          >
            <Sparkles size={13} />
            السفر صار أبسط
          </span>

          <h2
            className="
              mt-3 mb-[6px]
              text-[clamp(25px,3vw,36px)]
              font-extrabold tracking-[-0.6px]
              text-[#112f41]
              dark:text-[#eef8fa]
              max-[650px]:text-[28px]
            "
          >
            3 خطوات... <span className="text-[#0aa99b]">وتكون بالطريق</span>
          </h2>

          <p
            className="
              text-xs text-[#718493]
              dark:text-[#9eb3be]
            "
          >
            ما في داعي للتعقيد. كل شي مرتب بواجهة وحدة.
          </p>
        </div>

        {/* Steps cards */}
        <div
          className="
            grid grid-cols-3 gap-5
            max-[650px]:grid-cols-1
            max-[650px]:gap-3
          "
        >
          {steps.map((step) => (
            <div
              key={step.number}
              className="
                relative overflow-hidden
                rounded-[20px]
                border border-[#e4ecef]
                bg-white p-8
                transition-all duration-300
                hover:-translate-y-[7px]
                hover:shadow-[0_22px_60px_rgba(19,54,72,0.11)]

                dark:border-[#254252]
                dark:bg-[#112b3b]

                max-[900px]:p-[22px]

                max-[650px]:grid
                max-[650px]:grid-cols-[50px_minmax(0,1fr)]
                max-[650px]:gap-x-[15px]
                max-[650px]:gap-y-[2px]
                max-[650px]:p-5
              "
            >
              {/* Decorative number */}
              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute top-[14px] left-[25px]
                  text-[54px] leading-none
                  font-black text-[#e4ecef]
                  dark:text-[#254252]
                  max-[650px]:top-0
                  max-[650px]:left-5
                "
              >
                {step.number}
              </span>

              {/* Icon */}
              <div
                className={`
                  relative z-10
                  mb-[21px] grid h-[60px] w-[60px]
                  place-items-center rounded-[18px]
                  ${step.iconStyle}

                  max-[650px]:row-span-2
                  max-[650px]:mb-0
                  max-[650px]:h-12
                  max-[650px]:w-12
                  max-[650px]:rounded-[13px]
                `}
              >
                <step.Icon
                  className="
                    h-7 w-7
                    max-[650px]:h-6
                    max-[650px]:w-6
                  "
                />
              </div>

              {/* Text */}
              <h3
                className="
                  relative z-10 mb-2
                  text-lg font-extrabold
                  text-[#112f41]
                  dark:text-[#eef8fa]
                  max-[650px]:mb-0
                  max-[650px]:text-[15px]
                "
              >
                {step.title}
              </h3>

              <p
                className="
                  relative z-10 m-0
                  text-xs leading-[2]
                  text-[#718493]
                  dark:text-[#9eb3be]
                  max-[650px]:text-[11px]
                "
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
