import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "404 — Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-6xl font-extrabold text-orange-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all"
        >
          Return Home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
