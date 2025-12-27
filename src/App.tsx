import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { UploadPage } from "./components/UploadPage";
import { ProcessingPage } from "./components/ProcessingPage";
import { ResultsPage } from "./components/ResultsPage";
import { PricingPage } from "./components/PricingPage";
import { BillEntryPage } from "./components/BillEntryPage";
import { CategorizationPage } from "./components/CategorizationPage";
import { AnomaliesPage } from "./components/AnomaliesPage";

type Page =
  | "landing"
  | "login"
  | "dashboard"
  | "upload"
  | "bill-entry"
  | "processing"
  | "categorization"
  | "results"
  | "anomalies"
  | "pricing"
  | "account"
  | "admin";

export default function App() {
  const { user, loading } = useAuth();

  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // restore theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // 🔐 Guard protected pages ONLY
  useEffect(() => {
    if (loading) return;

    const protectedPages: Page[] = [
      "dashboard",
      "upload",
      "bill-entry",
      "processing",
      "categorization",
      "results",
      "anomalies",
      "account",
      "admin"
    ];

    if (!user && protectedPages.includes(currentPage)) {
      setCurrentPage("landing");
    }
  }, [user, loading, currentPage]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isLoggedIn={!!user}
        userName={user?.email || ""}
      />

      <main className="flex-1">
        {currentPage === "landing" && (
          <LandingPage
            onNavigate={handleNavigate}
            isLoggedIn={!!user}
          />
        )}

        {currentPage === "login" && (
          <LoginPage onNavigate={handleNavigate} />
        )}

        {currentPage === "dashboard" && user && (
          <Dashboard onNavigate={handleNavigate} />
        )}

        {currentPage === "upload" && user && (
          <UploadPage onNavigate={handleNavigate} />
        )}

        {currentPage === "bill-entry" && user && (
          <BillEntryPage onNavigate={handleNavigate} />
        )}

        {currentPage === "processing" && user && (
          <ProcessingPage onNavigate={handleNavigate} />
        )}

        {currentPage === "categorization" && user && (
          <CategorizationPage onNavigate={handleNavigate} />
        )}

        {currentPage === "results" && user && (
          <ResultsPage onNavigate={handleNavigate} />
        )}

        {currentPage === "anomalies" && user && (
          <AnomaliesPage onNavigate={handleNavigate} />
        )}

        {currentPage === "pricing" && (
          <PricingPage
            onNavigate={handleNavigate}
            isLoggedIn={!!user}
          />
        )}

        {currentPage === "account" && user && (
          <AccountPage onNavigate={handleNavigate} />
        )}

        {currentPage === "admin" && user && (
          <AdminPanel onNavigate={handleNavigate} />
        )}
      </main>

      <Footer />
    </div>
  );
}
