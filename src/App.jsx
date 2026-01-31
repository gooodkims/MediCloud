import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import MedicalRecord from './components/MedicalRecord';
import PatientRegistration from './components/PatientRegistration';
import Login from './components/Login';
import Signup from './components/Signup';
import { translations } from './translations';
import { supabase } from './supabaseClient';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [session, setSession] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const [savedRecords, setSavedRecords] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [activePatient, setActivePatient] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem('medicloud_lang') || 'ko');
  const [theme, setTheme] = useState(localStorage.getItem('medicloud_theme') || 'light');

  const t = translations[language];

  // 인증 상태 감시
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setActiveTab('registration');
  };

  const handleStartConsultation = (patient) => {
    setActivePatient(patient);
    setSelectedRecordId(null); // Clear previous record selection for fresh start
    setActiveTab('records');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard language={language} t={t} />;
      case 'patients':
        return (
          <PatientList
            language={language}
            t={t}
            onEditPatient={handleEditPatient}
            onStartConsultation={handleStartConsultation}
          />
        );
      case 'registration':
        return (
          <PatientRegistration
            language={language}
            t={t}
            initialData={editingPatient}
            onRegisterSuccess={() => {
              setEditingPatient(null);
              setActiveTab('patients');
            }}
          />
        );
      case 'records':
        return (
          <MedicalRecord
            activePatient={activePatient}
            savedRecords={filteredRecords}
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

  if (!session) {
    return authView === 'login' ? (
      <Login
        onSwitchToSignup={() => setAuthView('signup')}
        language={language}
        t={t}
      />
    ) : (
      <Signup
        onSwitchToLogin={() => setAuthView('login')}
        language={language}
        t={t}
      />
    );
  }

  const filteredRecords = activePatient
    ? savedRecords.filter(r => r.patientId === activePatient.chart_id)
    : savedRecords;

  return (
    <div style={styles.appContainer}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'registration') setEditingPatient(null);
          else if (activeTab !== 'registration') setEditingPatient(null);

          if (tab !== 'records') {
            // Reset activePatient if we leave records, 
            // but maybe we want to keep it? 
            // In a real EMR, selecting a patient persists.
            // Let's reset for now to show the flow.
            setActivePatient(null);
          }
          setActiveTab(tab);
        }}
        savedRecords={filteredRecords}
        activePatient={activePatient}
        onRecordClick={handleRecordSelect}
        language={language}
        toggleLanguage={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        user={session.user}
        onLogout={() => supabase.auth.signOut()}
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
