import { Link } from "react-router";
import { ArrowLeft, Sparkles } from "lucide-react";

function HomeCTA() {
  return (
    <section className="pb-[85px] max-[650px]:pb-[54px]">
      <div
        className="
          mx-auto w-[calc(100%-68px)] max-w-[1216px]
          max-[1150px]:w-[calc(100%-48px)]
          max-[650px]:w-[calc(100%-34px)]
        "
      >
        <div
          className="
            relative flex items-center justify-between
            gap-[30px] overflow-hidden
            rounded-[24px]
            bg-[linear-gradient(105deg,#0e4653,#0b756e)]
            px-[60px] py-[39px]
            text-white

            max-[650px]:flex-col
            max-[650px]:items-start
            max-[650px]:gap-[22px]
            max-[650px]:px-6
            max-[650px]:py-[29px]
          "
        >
          {/* Decorative circles */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute
              -top-[140px] left-[22%]
              h-[230px] w-[230px]
              rounded-full
              border border-white/10
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute
              right-[30%] -bottom-[360px]
              h-[430px] w-[430px]
              rounded-full
              border border-white/10
            "
          />

          {/* Text */}
          <div className="relative z-10">
            <span
              className="
                inline-flex items-center gap-2
                rounded-full bg-white/10
                px-[14px] py-[5px]
                text-[11px] font-black
                text-[#c7f6e8]
              "
            >
              <Sparkles size={13} />
              جاهز تغير جو؟
            </span>

            <h2
              className="
                mt-3 mb-[2px]
                text-[31px] font-extrabold
                leading-normal text-white
                max-[650px]:text-[25px]
              "
            >
              الطريق الجاي بيناديك.
            </h2>

            <p className="m-0 text-sm text-[#d4edeb]">
              دوّر على رحلة، واحجز أول مقعد إلك.
            </p>
          </div>

          {/* CTA button */}
          <Link
            to="/results"
            className="
              relative z-10 inline-flex
              min-h-[49px] shrink-0
              items-center justify-center
              gap-[10px] rounded-xl
              bg-white px-[22px] py-[11px]
              text-[13px] font-extrabold
              text-[#114054]
              transition-all duration-200
              hover:-translate-y-[3px]
              hover:bg-[#e7fff9]
            "
          >
            يلا نلاقي رحلة
            <ArrowLeft size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomeCTA;
