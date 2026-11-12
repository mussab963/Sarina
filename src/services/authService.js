const API_BASE = "https://sairna.abdulrahman-hares.com/api/v1/website";

export async function login({ email, password }, signal) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.trim(),
            password,
        }),
        signal,
    });

    const data = await response.json().catch(() => null);

    // أي استجابة غير ناجحة لازم توقف تسجيل الدخول
    if (!response.ok) {
        let message = "تعذّر تسجيل الدخول. حاول مرة ثانية.";

        if (response.status === 401) {
            message = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        } else if (data && typeof data.message === "string") {
            message = data.message;
        }

        throw new Error(message);
    }

    return data;
}

export async function register({ name, email, password }) {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
        }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        if (response.status === 409 || (data && data.message === "EMAIL_TAKEN")) {
            throw new Error(
                "البريد الإلكتروني مستخدم مسبقاً. جرّب تسجيل الدخول أو استخدم بريداً آخر.",
            );
        }

        if (response.status === 400) {
            throw new Error(
                "البيانات المدخلة غير صحيحة. تأكد من الاسم والبريد وكلمة المرور.",
            );
        }

        throw new Error("تعذّر إنشاء الحساب. حاول مرة ثانية.");
    }

    return data;
}