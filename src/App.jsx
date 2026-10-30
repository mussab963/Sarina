import "./App.css";
import { Routes, Route } from "react-router";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";

function ComingSoon() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-extrabold">أهلاً بك في سيرنا</h1>

        <p className="mt-4 text-muted">عم ننقل صفحات المشروع إلى React</p>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<ComingSoon />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
