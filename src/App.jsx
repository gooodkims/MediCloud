import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import MedicalRecord from './components/MedicalRecord';
import { translations } from './translations';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [savedRecords, setSavedRecords] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem('medicloud_lang') || 'ko');
  const [theme, setTheme] = useState(localStorage.getItem('medicloud_theme') || 'light');

  const t = translations[language];

  // 테마 적용
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('medicloud_theme', theme);
  }, [theme]);

  // 로컬 스토리지에서 저장된 기록 불러오기
  useEffect(() => {
    const stored = localStorage.getItem('medicloud_records');
    if (stored) {
      setSavedRecords(JSON.parse(stored));
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = language === 'ko' ? 'en' : 'ko';
    setLanguage(nextLang);
    localStorage.setItem('medicloud_lang', nextLang);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // 기록 저장 시 로컬 스토리지 업데이트
  const handleUpdateRecords = (newRecords) => {
    setSavedRecords(newRecords);
    localStorage.setItem('medicloud_records', JSON.stringify(newRecords));
  };

  const handleRecordSelect = (recordId) => {
    setSelectedRecordId(recordId);
    setActiveTab('records');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard language={language} t={t} />;
      case 'patients':
        return <PatientList language={language} t={t} />;
      case 'records':
        return (
          <MedicalRecord
            savedRecords={savedRecords}
            setSavedRecords={handleUpdateRecords}
            selectedRecordId={selectedRecordId}
            setSelectedRecordId={setSelectedRecordId}
            language={language}
            t={t}
          />
        );
      default:
        return <Dashboard language={language} t={t} />;
    }
  };

  return (
    <div style={styles.appContainer}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedRecords={savedRecords}
        onRecordClick={handleRecordSelect}
        language={language}
        toggleLanguage={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        t={t}
      />
      <main style={styles.main}>
        {renderContent()}
      </main>
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    width: '100%',
    height: '100vh',
  },
  main: {
    flex: 1,
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
};

export default App;
