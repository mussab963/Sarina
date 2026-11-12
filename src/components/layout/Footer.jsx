import { Link } from "react-router";
import { Globe, Mail, Phone } from "lucide-react";
import logo from "../../assets/logo.svg";

const footerSections = [
  {
    title: "استكشف",
    links: [
      { label: "الرئيسية", to: "/" },
      { label: "احجز رحلتك", to: "/results" },
      { label: "شركات النقل", to: "/companies" },
      { label: "تتبّع رحلتك", to: "/tracking" },
    ],
  },
  {
    title: "حسابك",
    links: [
      { label: "تسجيل الدخول", to: "/login" },
      { label: "إنشاء حساب", to: "/register" },
      { label: "حجوزاتي", to: "/trips" },
      { label: "الملف الشخصي", to: "/account" },
    ],
  },
  {
    title: "نحن هون لمساعدتك",
    links: [
      { label: "عن سيرنا", to: "/about" },
      { label: "مركز المساعدة", to: "/support" },
    ],
  },
];

const photoCredits = [
  {
    label: "دمشق / الهيرو — Vyacheslav Argenberg (CC BY 4.0)",
    url: "https://commons.wikimedia.org/wiki/File:Syria,_Damascus,_The_Umayyad_Mosque.jpg",
  },
  {
    label: "حلب — Vyacheslav Argenberg (CC BY 4.0)",
    url: "https://commons.wikimedia.org/wiki/File:Citadel_of_Aleppo,_Gates,_Aleppo,_Syria.jpg",
  },
  {
    label: "اللاذقية — Ahmad Ahmad (CC BY-SA 3.0)",
    url: "https://commons.wikimedia.org/wiki/File:Beach_Latakia_1.jpg",
  },
  {
    label: "حمص — Dosseman (CC BY-SA 4.0)",
    url: "https://commons.wikimedia.org/wiki/File:Homs_Khalid_Ibn_al-Walid_Mosque_3074.jpg",
  },
];

const containerClass = `
  mx-auto w-[calc(100%-68px)] max-w-[1216px]
  max-[1150px]:w-[calc(100%-48px)]
  max-[650px]:w-[calc(100%-34px)]
`;

function Footer() {
  return (
    <footer
      className="
        bg-[#0a2c3e] pt-14
        text-[#d2e4e9]
        max-[650px]:pt-10
      "
    >
      <div className={containerClass}>
        {/* Footer main grid */}
        <div
          className="
            grid grid-cols-[2fr_1fr_1fr_1.25fr]
            gap-10 pb-[50px]

            max-[900px]:grid-cols-[1.5fr_1fr_1fr]
            max-[900px]:gap-[25px]

            max-[650px]:grid-cols-2
            max-[650px]:gap-x-4
            max-[650px]:gap-y-[26px]
            max-[650px]:pb-[33px]
          "
        >
          {/* Brand */}
          <div className="max-[650px]:col-span-2">
            <Link
              to="/"
              aria-label="سيرنا - الرئيسية"
              className="
                inline-flex items-center gap-[10px]
              "
            >
              <img
                src={logo}
                alt=""
                className="
                  h-12 w-12
                  max-[650px]:h-[39px]
                  max-[650px]:w-[39px]
                "
              />

              <div className="flex flex-col leading-[1.2]">
                <strong
                  className="
                    text-[30px] font-black
                    tracking-[-1.5px] text-white
                    max-[650px]:text-[25px]
                  "
                >
                  سيرنا
                  <span className="text-[#0aa99b]">.</span>
                </strong>

                <small
                  className="
                    mt-[7px] text-[9px]
                    font-bold text-[#9ac4cd]
                    max-[650px]:mt-[5px]
                    max-[650px]:text-[8px]
                  "
                >
                  رحلتك بتبلّش من هون
                </small>
              </div>
            </Link>

            <p
              className="
                my-[17px] max-w-[290px]
                text-xs leading-[2.1]
                text-[#9cb4c0]
                max-[650px]:my-3
              "
            >
              طريقة أجمل وأسهل للسفر بين المحافظات السورية. ابحث، اختار، واحجز
              بكل راحة.
            </p>

            {/* Social/contact icons */}
            <div className="flex gap-[9px]">
              {[Globe, Mail, Phone].map((Icon, index) => (
                <span
                  key={index}
                  className="
                    grid h-[35px] w-[35px]
                    place-items-center rounded-[10px]
                    border border-[#335362]
                    text-[#cce9e9]
                  "
                >
                  <Icon size={17} />
                </span>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          {footerSections.map((section, index) => (
            <div
              key={section.title}
              className={`
                flex flex-col items-start gap-[13px]

                ${
                  index === 2
                    ? "max-[900px]:col-[2/4] max-[650px]:col-auto"
                    : ""
                }
              `}
            >
              <h4
                className="
                  mt-[6px] mb-[10px]
                  text-[13px] font-extrabold
                  text-white
                  max-[650px]:text-xs
                "
              >
                {section.title}
              </h4>

              {section.links.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="
                    text-[11px] text-[#a3c0ca]
                    transition-colors duration-200
                    hover:text-[#40d1bb]
                    max-[650px]:text-[10px]
                  "
                >
                  {item.label}
                </Link>
              ))}

              {/* Demo contact from original design */}
              {index === 2 && (
                <div
                  className="
                    flex items-center gap-2
                    text-[11px] text-[#a3c0ca]
                  "
                >
                  <Mail size={16} className="shrink-0" />

                  <span dir="ltr">hello@sairna.example</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Photography credits */}
        <div
          className="
            border-t border-[#254451]
            py-[18px] text-[10px]
            leading-[2] text-[#9fb9c3]
          "
        >
          <span className="font-bold">مصادر الصور (Wikimedia Commons):</span>{" "}
          {photoCredits.map((credit, index) => (
            <span key={credit.url}>
              {index > 0 && " · "}

              <a
                href={credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-[#b9eee6] underline
                  underline-offset-[3px]
                  transition-colors
                  hover:text-white
                "
              >
                {credit.label}
              </a>
            </span>
          ))}
          <span>
            {" "}
            تُحمّل الصور عند الاتصال بالإنترنت؛ تُعرض الروابط البديلة عند فشل
            المصدر الأول.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
