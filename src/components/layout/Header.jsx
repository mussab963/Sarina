import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { ChevronLeft, Menu, Moon, Sparkles, Sun, X } from "lucide-react";

import Logo from "../../assets/logo.svg";
import AuthStatus from "../Auth/AuthStatus";

// Navigation links
const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "احجز رحلة", path: "/results" },
  { label: "شركات النقل", path: "/companies" },
  { label: "حجوزاتي", path: "/trips" },
  { label: "تتبّع الرحلة", path: "/tracking" },
];

// Same container width as original Sairna
const containerClass = `
  mx-auto w-[calc(100%-68px)] max-w-[1216px]
  max-[1150px]:w-[calc(100%-48px)]
  max-[650px]:w-[calc(100%-34px)]
`;

// Desktop navigation styles
const desktopLinkClass = ({ isActive }) => `
  relative whitespace-nowrap py-8
  text-[12px] font-extrabold
  transition-colors duration-200
  max-[1150px]:text-[11px]

  after:absolute after:bottom-[17px]
  after:right-1/2 after:h-[3px]
  after:translate-x-1/2
  after:rounded-[5px] after:bg-primary
  after:content-['']
  after:transition-[width] after:duration-[270ms]
  hover:after:w-[23px]

  ${
    isActive
      ? "text-foreground after:w-[23px] dark:text-[#eef8fa]"
      : "text-muted after:w-0 hover:text-foreground dark:text-[#9eb3be] dark:hover:text-white"
  }
`;

// Mobile navigation styles
const mobileLinkClass = ({ isActive }) => `
  flex items-center justify-between
  border-b border-border px-2 py-3
  text-[14px] font-bold
  transition-colors
  dark:border-[#254252]

  ${
    isActive
      ? "text-primary"
      : "text-foreground hover:text-primary dark:text-[#eef8fa]"
  }
`;

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("sairna-theme") === "dark";
  });

  // Synchronize theme with document and localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    localStorage.setItem("sairna-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const closeMenu = () => setMenuOpen(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <>
      {/* ===== Announcement Bar ===== */}
      <div
        className="
          flex min-h-8 items-center justify-center gap-[9px]
          bg-[#0a2c3e] px-3
          text-center text-[10px] font-bold
          tracking-[0.1px] text-[#d4f2ec]
          max-[650px]:py-[5px]
          max-[650px]:text-[9px]
        "
      >
        <span
          className="
            h-[6px] w-[6px] shrink-0
            rounded-full bg-[#58d7bb]
            shadow-[0_0_0_4px_rgba(88,215,187,0.12)]
          "
        />

        <span>رحلات بين المدن السورية، بخطوات بسيطة وواضحة</span>

        <Sparkles size={13} className="shrink-0 text-[#ffce87]" />
      </div>

      {/* ===== Main Header ===== */}
      <header
        className="
          sticky top-0 z-[80]
          border-b border-border
          bg-white/95 backdrop-blur-[16px]
          dark:border-[#254252]
          dark:bg-[#112b3b]/95
        "
      >
        <div
          className={`
            ${containerClass}
            flex h-[83px] items-center
            justify-between gap-[22px]
            max-[900px]:h-[71px]
            max-[650px]:h-[66px]
          `}
        >
          {/* ===== Logo ===== */}
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="سيرنا - الرئيسية"
            className="
              inline-flex shrink-0 items-center gap-[10px]
            "
          >
            <span
              className="
                grid h-12 w-12 place-items-center
                max-[650px]:h-[39px]
                max-[650px]:w-[39px]
              "
            >
              <img src={Logo} alt="" className="h-full w-full" />
            </span>

            <span className="flex flex-col leading-[1.2]">
              <strong
                className="
                  text-[30px] font-black
                  tracking-[-1.5px] text-[#0a2c3e]
                  dark:text-[#eef8fa]
                  max-[650px]:text-[25px]
                "
              >
                سيرنا
                <span className="text-primary">.</span>
              </strong>

              <small
                className="
                  mt-[7px] whitespace-nowrap
                  text-[9px] font-bold text-muted
                  max-[650px]:mt-[5px]
                  max-[650px]:text-[8px]
                "
              >
                رحلتك بتبلّش من هون
              </small>
            </span>
          </Link>

          {/* ===== Desktop Navigation ===== */}
          <nav
            aria-label="التنقل الرئيسي"
            className="
              mx-auto hidden items-center gap-[27px]
              min-[901px]:flex
              max-[1150px]:gap-[15px]
            "
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={desktopLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* ===== Header Actions ===== */}
          <div
            className="
              flex shrink-0 items-center gap-3
              max-[1150px]:gap-2
            "
          >
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"
              }
              aria-pressed={darkMode}
              title="تبديل المظهر"
              className="
                grid h-10 w-10 shrink-0
                place-items-center rounded-xl
                border border-border
                bg-surface text-foreground
                transition-colors duration-200

                hover:border-primary
                hover:bg-[#e6f8f3]
                hover:text-primary

                dark:border-[#254252]
                dark:bg-[#112b3b]
                dark:text-[#eef8fa]
                dark:hover:border-primary
                dark:hover:bg-[#174b49]

                max-[650px]:h-[35px]
                max-[650px]:w-[35px]
              "
            >
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* Authentication */}
            <div className="hidden min-[901px]:block">
              <AuthStatus />
            </div>

            {/* Mobile Toggle */}
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="
                hidden h-10 w-10 shrink-0
                place-items-center rounded-xl
                border border-border
                bg-surface text-foreground
                transition-colors duration-200

                hover:border-primary
                hover:bg-[#e6f8f3]
                hover:text-primary

                dark:border-[#254252]
                dark:bg-[#112b3b]
                dark:text-[#eef8fa]

                max-[900px]:grid
              "
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ===== Mobile Navigation ===== */}
        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="قائمة الموبايل"
            className="
              hidden border-t border-border
              bg-surface px-7 py-3
              dark:border-[#254252]
              dark:bg-[#112b3b]
              max-[900px]:block
              max-[650px]:px-5
            "
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                {link.label}
                <ChevronLeft size={16} />
              </NavLink>
            ))}

            {/* Mobile Authentication */}
            <div
              className="border-t border-border pt-4 dark:border-[#254252]"
              onClick={closeMenu}
            >
              <AuthStatus />
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

export default Header;
