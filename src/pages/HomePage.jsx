import Hero from "../components/home/Hero";

const metrics = [
  { value: "14", label: "محافظة سورية" },
  { value: "4", label: "شركات نقل تجريبية" },
  { value: "+30", label: "خيار رحلة باليوم" },
  { value: "24/7", label: "سهولة الوصول للموقع" },
];

function HomePage() {
  return (
    <main>
      <Hero />

      <section
        className="
          border-y border-border bg-white
          dark:border-[#254252]
          dark:bg-[#112b3b]
        "
      >
        <div
          className="
            mx-auto flex min-h-[107px]
            w-[calc(100%-68px)] max-w-[1216px]
            items-center justify-around
            max-[1150px]:w-[calc(100%-48px)]
            max-[650px]:grid
            max-[650px]:min-h-[140px]
            max-[650px]:w-[calc(100%-34px)]
            max-[650px]:grid-cols-2
            max-[650px]:gap-y-[17px]
            max-[650px]:py-5
          "
        >
          {metrics.map((metric, index) => (
            <div key={metric.label} className="contents max-[650px]:block">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="
                    h-9 w-px bg-border
                    dark:bg-[#254252]
                    max-[650px]:hidden
                  "
                />
              )}

              <div className="flex flex-col text-center">
                <strong
                  className="
                    text-[27px] leading-[1.4]
                    font-black text-[#0a2c3e]
                    dark:text-[#eef8fa]
                    max-[650px]:text-[23px]
                  "
                >
                  {metric.value}
                </strong>

                <span
                  className="
                    text-[11px] font-bold text-muted
                    max-[650px]:text-[10px]
                  "
                >
                  {metric.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
