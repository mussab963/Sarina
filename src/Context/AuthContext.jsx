import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "sairna-auth";

function getSavedSession() {
  try {
    const saved =
      sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);

    if (!saved) return null;

    const session = JSON.parse(saved);

    if (
      !session ||
      typeof session.accessToken !== "string" ||
      !session.accessToken ||
      !session.user
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSavedSession);

  function signIn(data, rememberMe = false) {
    if (
      !data ||
      typeof data.accessToken !== "string" ||
      !data.accessToken ||
      !data.user
    ) {
      throw new Error("استجابة تسجيل الدخول غير مكتملة.");
    }

    const newSession = {
      accessToken: data.accessToken,
      tokenType: data.tokenType || "Bearer",
      user: data.user,
    };

    setSession(newSession);

    // نحذف الجلسة السابقة قبل حفظ الجديدة
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    } catch {
      // إذا المتصفح منع التخزين،
      // الجلسة بتبقى موجودة بذاكرة React فقط.
    }
  }

  function signOut() {
    setSession(null);

    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // التخزين غير متاح
    }
  }

  const user = session ? session.user : null;
  const accessToken = session ? session.accessToken : null;
  const isAuthenticated = Boolean(accessToken);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}