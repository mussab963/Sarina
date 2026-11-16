import { Link, useNavigate } from "react-router";
import { ArrowLeft, LogIn, LogOut, Ticket, UserRound } from "lucide-react";
import { useAuth } from "../Context/AuthContext";

const container =
  "mx-auto w-[calc(100%-34px)] max-w-[1216px] min-[651px]:w-[calc(100%-48px)] min-[1151px]:w-[calc(100%-68px)]";

export default function AccountPage() {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "المستخدم";
  const email = user?.email || "غير متوفر";

  function handleLogout() {
    signOut();
    navigate("/");
  }

  if (!isAuthenticated) {
    return (
      <main
        dir="rtl"
        className="min-h-[65vh] bg-background px-4 py-20 text-center dark:bg-[#0b1c29]"
      >
        <UserRound size={45} className="mx-auto text-primary" />
        <h1 className="mt-5 text-2xl font-black">أهلاً فيك!</h1>
        <p className="mt-3 text-sm text-muted">
          سجّل دخول لحتى تشوف معلومات حسابك.
        </p>
        <Link
          to="/login"
          state={{ from: "/account" }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-black text-white"
        >
          <LogIn size={18} />
          تسجيل الدخول
        </Link>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-[70vh] bg-background pb-20 text-foreground dark:bg-[#0b1c29] dark:text-white"
    >
      <section className="border-b border-border bg-gradient-to-bl from-[#f0f7f8] to-background py-9 dark:from-[#173748] dark:to-[#0b1c29]">
        <div className={container}>
          <p className="text-xs font-black text-primary">ملفك الشخصي</p>
          <h1 className="mt-3 text-[32px] font-black">
            أهلاً {name.split(" ")[0]} 👋
          </h1>
          <p className="mt-2 text-xs text-muted">
            هون كل التفاصيل المتعلقة بحسابك على سيرنا.
          </p>
        </div>
      </section>

      <section
        className={`${container} grid gap-5 pt-10 lg:grid-cols-[300px_1fr]`}
      >
        {/* بطاقة المستخدم */}
        <aside className="h-fit rounded-[19px] border border-border bg-white p-7 text-center dark:border-[#254252] dark:bg-[#112b3b]">
          <div className="mx-auto grid h-[90px] w-[90px] place-items-center rounded-[30px] bg-[#e6f8f3] text-[43px] font-black text-primary">
            {name[0]}
          </div>

          <h2 className="mt-4 text-xl font-black">{name}</h2>
          <p dir="ltr" className="mt-2 break-all text-xs text-muted">
            {email}
          </p>

          <Link
            to="/trips"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#f2f7f8] p-4 text-xs font-bold text-primary dark:bg-[#173748]"
          >
            <Ticket size={19} />
            عرض حجوزاتي
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-xs font-black transition hover:border-red-300 hover:text-red-600 dark:border-[#254252]"
          >
            <LogOut size={17} />
            تسجيل الخروج
          </button>
        </aside>

        {/* معلومات الحساب */}
        <section className="rounded-[19px] border border-border bg-white p-7 dark:border-[#254252] dark:bg-[#112b3b]">
          <h2 className="border-b border-border pb-5 text-xl font-black dark:border-[#254252]">
            معلومات الحساب
          </h2>

          {[
            ["الاسم الكامل", name],
            ["البريد الإلكتروني", email],
            ["حالة الحساب", "مسجّل الدخول"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-5 text-xs dark:border-[#254252]"
            >
              <span className="text-muted">{label}</span>
              <strong className="break-all">{value}</strong>
            </div>
          ))}

          <Link
            to="/trips"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-black text-white"
          >
            انتقل لحجوزاتي
            <ArrowLeft size={17} />
          </Link>
        </section>
      </section>
    </main>
  );
}
