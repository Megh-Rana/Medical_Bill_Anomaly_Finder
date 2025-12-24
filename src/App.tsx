import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { Dashboard } from "./components/Dashboard";
import { UploadPage } from "./components/UploadPage";
import { ProcessingPage } from "./components/ProcessingPage";
import { ResultsPage } from "./components/ResultsPage";
import { PricingPage } from "./components/PricingPage";
import { AccountPage } from "./components/AccountPage";
import { AdminPanel } from "./components/AdminPanel";
import { BillEntryPage } from "./components/BillEntryPage";
import { CategorizationPage } from "./components/CategorizationPage";
import { AnomaliesPage } from "./components/AnomaliesPage";

type Page = 
  | 'landing' 
  | 'login' 
  | 'signup' 
  | 'dashboard' 
  | 'upload'
  | 'bill-entry'
  | 'processing'
  | 'categorization'
  | 'results' 
  | 'anomalies'
  | 'pricing' 
  | 'account'
  | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [billItems, setBillItems] = useState<any[]>([]);

  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogin = (email: string, name: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserName(name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    setCurrentPage('landing');
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />

      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />
        )}
        
        {currentPage === 'login' && (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        )}
        
        {currentPage === 'signup' && (
          <SignupPage onNavigate={handleNavigate} onLogin={handleLogin} />
        )}
        
        {currentPage === 'dashboard' && isLoggedIn && (
          <Dashboard userName={userName} onNavigate={handleNavigate} />
        )}
        
        {currentPage === 'upload' && isLoggedIn && (
          <UploadPage onNavigate={handleNavigate} />
        )}
        
        {currentPage === 'bill-entry' && isLoggedIn && (
          <BillEntryPage onNavigate={handleNavigate} billItems={billItems} setBillItems={setBillItems} />
        )}
        
        {currentPage === 'processing' && isLoggedIn && (
          <ProcessingPage onNavigate={handleNavigate} />
        )}
        
        {currentPage === 'categorization' && isLoggedIn && (
          <CategorizationPage onNavigate={handleNavigate} billItems={billItems} setBillItems={setBillItems} />
        )}
        
        {currentPage === 'results' && isLoggedIn && (
          <ResultsPage onNavigate={handleNavigate} />
        )}
        
        {currentPage === 'anomalies' && isLoggedIn && (
          <AnomaliesPage onNavigate={handleNavigate} billItems={billItems} setBillItems={setBillItems} />
        )}
        
        {currentPage === 'pricing' && (
          <PricingPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />
        )}
        
        {currentPage === 'account' && isLoggedIn && (
          <AccountPage
            userName={userName}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        )}
        
        {currentPage === 'admin' && isLoggedIn && (
          <AdminPanel onNavigate={handleNavigate} />
        )}
      </main>

      <Footer />
    </div>
  );
}