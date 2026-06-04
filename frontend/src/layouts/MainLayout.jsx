// import { Outlet } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// export default function MainLayout() {
//   const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

//   useEffect(() => {
//     const root = document.documentElement;
//     if (theme === "dark") root.classList.add("dark");
//     else root.classList.remove("dark");
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

//   return (
//     <div className="min-h-screen">
//       <Navbar theme={theme} onToggleTheme={toggleTheme} />
//       <main className="mx-auto max-w-6xl px-4 py-8">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// }
//-------------------------------------------------------
// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// export default function MainLayout({
//   onToggleTheme,
//   theme,
// }) {
//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
//       <Navbar
//         onToggleTheme={onToggleTheme}
//         theme={theme}
//       />

//       <main className="mx-auto max-w-6xl px-4 py-6">
//         <Outlet />
//       </main>

//       <Footer />
//     </div>
//   );
// }
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({
  onToggleTheme,
  theme,
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <Navbar
        onToggleTheme={onToggleTheme}
        theme={theme}
      />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}