import { Link } from "react-router";
import { Globe, Mail, Phone, Heart } from "lucide-react";
import Logo from "../../assets/logo.svg";

const exploreLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "احجز رحلتك", path: "/results" },
  { label: "شركات النقل", path: "/companies" },
  { label: "تتبّع رحلتك", path: "/tracking" },
];

const accountLinks = [
  { label: "تسجيل الدخول", path: "/login" },
  { label: "إنشاء حساب", path: "/register" },
  { label: "حجوزاتي", path: "/trips" },
  { label: "الملف الشخصي", path: "/account" },
];

const helpLinks = [
  { label: "عن سيرنا", path: "/about" },
  { label: "مركز المساعدة", path: "/support" },
];

const containerClass =
  "mx-auto w-[calc(100%-68px)] max-w-[1216px] " +
  "max-[1150px]:w-[calc(100%-48px)] " +
  "max-[650px]:w-[calc(100%-34px)]";

function FooterColumn({ title, links, children, className = "" }) {
  return (
    <div className={`flex flex-col items-start gap-[13px] ${className}`}>
      <h4 className="mt-[6px] mb-[10px] text-[13px] font-extrabold text-white max-[650px]:text-xs">
        {title}
      </h4>

      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className="text-[11px] text-[#a3c0ca] transition-colors hover:text-[#40d1bb] max-[650px]:text-[10px]"
        >
          {link.label}
        </Link>
      ))}

      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0a2c3e] pt-[56px] text-[#d2e4e9] max-[650px]:pt-[40px]">
      <div
        className={`${containerClass} grid grid-cols-[2fr_1fr_1fr_1.25fr] gap-10 pb-[50px]
          max-[900px]:grid-cols-[1.5fr_1fr_1fr]
          max-[900px]:gap-[25px]
          max-[650px]:grid-cols-2
          max-[650px]:gap-x-4
          max-[650px]:gap-y-[26px]
          max-[650px]:pb-[33px]`}
      >
        {/* Brand */}
        <div className="max-[650px]:col-span-2">
          <Link to="/" className="inline-flex shrink-0 items-center gap-[10px]">
            <span className="grid h-12 w-12 place-items-center max-[650px]:h-[39px] max-[650px]:w-[39px]">
              <img src={Logo} alt="" className="h-full w-full" />
            </span>

            <span className="flex flex-col leading-[1.2]">
              <strong className="text-[30px] font-black tracking-[-1.5px] text-white max-[650px]:text-[25px]">
                سيرنا<span className="text-primary">.</span>
              </strong>

              <small className="mt-[7px] text-[9px] font-bold whitespace-nowrap text-[#9ac4cd] max-[650px]:mt-[5px] max-[650px]:text-[8px]">
                رحلتك بتبلّش من هون
              </small>
            </span>
          </Link>

          <p className="my-[17px] max-w-[290px] text-xs leading-[2.1] text-[#9cb4c0] max-[650px]:my-3">
            طريقة أجمل وأسهل للسفر بين المحافظات السورية. ابحث، اختار، واحجز بكل
            راحة.
          </p>

          <div className="flex gap-[9px]">
            {[Globe, Mail, Phone].map((Icon, index) => (
              <span
                key={index}
                className="grid h-[35px] w-[35px] place-items-center rounded-[10px] border border-[#335362] text-[#cce9e9]"
              >
                <Icon size={17} />
              </span>
            ))}
          </div>
        </div>

        {/* Explore */}
        <FooterColumn title="استكشف" links={exploreLinks} />

        {/* Account */}
        <FooterColumn title="حسابك" links={accountLinks} />

        {/* Help */}
        <FooterColumn
          title="نحن هون لمساعدتك"
          links={helpLinks}
          className="min-[651px]:max-[900px]:col-[2/4]"
        >
          <div
            dir="ltr"
            className="flex items-center gap-2 text-[11px] text-[#a3c0ca]"
          >
            <Mail size={16} />
            <span>hello@sairna.example</span>
          </div>
        </FooterColumn>
      </div>

      {/* Footer Bottom */}
      <div
        className={`${containerClass} flex items-center justify-between gap-3
          border-t border-[#254451] py-5 text-[10px] text-[#8eabb7]
          max-[650px]:flex-col max-[650px]:items-start max-[650px]:text-[9px]`}
      >
        <span>
          © 2026 سيرنا — نموذج تعليمي لتصميم الواجهات، ليس خدمة حجوزات فعلية.
        </span>

        <span className="inline-flex items-center gap-1">
          صُمّم بحب لسوريا
          <Heart size={13} className="text-[#e8938e]" />
        </span>
      </div>
    </footer>
  );
}

export default Footer;
