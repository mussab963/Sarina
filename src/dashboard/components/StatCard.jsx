
import { ArrowUpLeft } from "lucide-react";

const themes = {
  teal: {
    background: "bg-[#e4f8f4]",
    foreground: "text-[#0daaa0]",
  },
  blue: {
    background: "bg-[#e9f0ff]",
    foreground: "text-[#4e81e8]",
  },
  orange: {
    background: "bg-[#fff2df]",
    foreground: "text-[#e7a045]",
  },
  purple: {
    background: "bg-[#f1e9ff]",
    foreground: "text-[#9467d5]",
  },
};

export default function StatCard({
  title,
  value = "—",
  icon: Icon,
  color = "teal",
  description = "",
}) {
  const theme = themes[color] || themes.teal;

  return (
    <article className="rounded-[19px] border border-[#e3edf0] bg-white p-5 shadow-[0_8px_30px_rgba(16,58,78,0.035)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(16,58,78,0.09)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold text-[#8197a3]">
            {title}
          </p>

          <h3 className="mt-3 text-[29px] font-black tracking-tight text-[#103a4e]">
            {value}
          </h3>
        </div>

        <span
          className={`grid h-[49px] w-[49px] shrink-0 place-items-center rounded-[14px] ${theme.background} ${theme.foreground}`}
        >
          {Icon && <Icon size={23} strokeWidth={2} />}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-[#edf2f4] pt-3">
        <ArrowUpLeft
          size={15}
          className="text-[#0daaa0]"
        />

        <p className="text-[10px] text-[#8197a3]">
          {description || "بيانات لوحة التحكم"}
        </p>
      </div>
    </article>
  );
}
