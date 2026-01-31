import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, savedRecords = [], activePatient, onRecordClick, language, toggleLanguage, theme, toggleTheme, user, profile, onEditProfile, onLogout, t }) => {
    const menuItems = [
        { id: 'dashboard', label: t.sidebar.dashboard, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { id: 'patients', label: t.sidebar.patients, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 'registration', label: t.sidebar.newPatient, icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
        { id: 'records', label: t.sidebar.records, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    ];

    return (
        <aside style={styles.sidebar}>
            <div style={styles.logo}>
                <div style={styles.logoIconBg}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>
                </div>
                <h1 style={styles.logoText}>MediCloud</h1>
            </div>

            <div style={styles.menuLabel}>{t.sidebar.mainMenu}</div>
            <nav style={styles.nav}>
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        style={{ ...styles.navItem, ...(activeTab === item.id ? styles.navActive : {}) }}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
                        {item.label}
                    </div>
                ))}

                <div style={{ ...styles.menuLabel, marginTop: '2.5rem', paddingLeft: '1rem' }}>
                    {activePatient
                        ? (language === 'ko' ? `${activePatient.name}님의 최근 기록` : `Records for ${activePatient.name}`)
                        : t.sidebar.recentRecords}
                </div>
                <div style={styles.recordsList}>
                    {savedRecords.length === 0 ? (
                        <div style={styles.emptyMsg}>{t.sidebar.noRecords}</div>
                    ) : (
                        savedRecords.slice(0, 5).map(record => (
                            <div
                                key={record.id}
                                style={styles.recordItem}
                                onClick={() => onRecordClick(record.id)}
                            >
                                <div style={styles.recordDot}></div>
                                <div style={styles.recordContent}>
                                    <div style={styles.recordName}>{record.patient}</div>
                                    <div style={styles.recordTime}>{record.date.split(' ')[1]} {record.date.split(' ')[2]}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </nav>

            <div style={styles.footer}>
                {/* 테마 토글 버튼 추가 */}
                <div style={styles.langSwitchArea}>
                    <span style={styles.langLabel}>{t.sidebar.theme}</span>
                    <button onClick={toggleTheme} style={styles.langToggle}>
                        <span style={{ ...styles.langCircle, left: theme === 'light' ? '4px' : 'calc(100% - 24px)', backgroundColor: theme === 'light' ? '#f59e0b' : '#334155' }}></span>
                        <span style={styles.langText}>{theme === 'light' ? t.sidebar.light : t.sidebar.dark}</span>
                    </button>
                </div>

                {/* 언어 토글 버튼 */}
                <div style={styles.langSwitchArea}>
                    <span style={styles.langLabel}>{t.sidebar.language}</span>
                    <button onClick={toggleLanguage} style={styles.langToggle}>
                        <span style={{ ...styles.langCircle, left: language === 'ko' ? '4px' : 'calc(100% - 24px)' }}></span>
                        <span style={styles.langText}>{language === 'ko' ? 'KO' : 'EN'}</span>
                    </button>
                </div>

                <div style={styles.profileCard}>
                    <div style={styles.profileTop}>
                        <div style={styles.avatar}>{profile?.full_name?.charAt(0) || user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}</div>
                        <div style={styles.statusDot} />
                    </div>
                    <div style={styles.profileInfo}>
                        <div style={styles.userName}>{profile?.full_name || user?.user_metadata?.full_name || t.common.doctor} <span style={styles.userBadge}>{t.common.md}</span></div>
                        <div style={styles.userRole}>{profile?.hospital_name || t.common.specialty}</div>
                        <button onClick={onEditProfile} style={styles.editInfoBtn}>
                            {t.profile.editBtn}
                        </button>
                    </div>
                    <button onClick={onLogout} style={styles.logoutBtn} title="Logout">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    </button>
                </div>
            </div>
        </aside>
    );
};


const styles = {
    sidebar: {
        width: '280px',
        backgroundColor: 'var(--card-bg)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    logo: {
        padding: '2.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    logoIconBg: {
        width: '40px',
        height: '40px',
        backgroundColor: 'var(--primary-color)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
    },
    logoText: {
        fontSize: '1.6rem',
        fontWeight: '800',
        color: 'var(--text-main)',
        letterSpacing: '-0.04em',
    },
    menuLabel: {
        padding: '0 2rem 1rem',
        fontSize: '0.75rem',
        fontWeight: '700',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
    },
    nav: {
        flex: 1,
        padding: '0 1rem',
        display: 'flex',
        flexDirection: 'column',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderRadius: '14px',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        fontWeight: '600',
        fontSize: '0.95rem',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        marginBottom: '0.5rem',
    },
    navActive: {
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary-color)',
        boxShadow: 'inset 0 0 0 1px rgba(13, 148, 136, 0.1)',
    },
    recordsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        padding: '0 0.5rem',
        overflowY: 'auto',
    },
    recordItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: 'var(--bg-color)',
        }
    },
    recordDot: {
        width: '6px',
        height: '6px',
        backgroundColor: 'var(--primary-color)',
        borderRadius: '50%',
        opacity: 0.6,
    },
    recordContent: {
        display: 'flex',
        flexDirection: 'column',
    },
    recordName: {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: 'var(--text-main)',
    },
    recordTime: {
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
    },
    emptyMsg: {
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
        padding: '1.5rem',
    },
    footer: {
        padding: '1.5rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    langSwitchArea: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 0.5rem',
    },
    langLabel: {
        fontSize: '0.75rem',
        fontWeight: '700',
        color: 'var(--text-muted)',
    },
    langToggle: {
        width: '60px',
        height: '28px',
        backgroundColor: 'var(--bg-color)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s ease',
    },
    langCircle: {
        width: '20px',
        height: '20px',
        backgroundColor: 'var(--primary-color)',
        borderRadius: '50%',
        position: 'absolute',
        top: '3px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    langText: {
        fontSize: '0.65rem',
        fontWeight: '800',
        width: '100%',
        textAlign: 'center',
        color: 'var(--text-muted)',
        marginLeft: '4px',
    },
    profileCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: 'var(--bg-color)',
        borderRadius: '16px',
    },
    profileTop: {
        position: 'relative',
    },
    avatar: {
        width: '44px',
        height: '44px',
        borderRadius: '14px',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '1.1rem',
    },
    statusDot: {
        position: 'absolute',
        bottom: '-2px',
        right: '-2px',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: 'var(--success)',
        border: '2.5px solid var(--bg-color)',
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: '0.95rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
    },
    userBadge: {
        fontSize: '0.65rem',
        backgroundColor: 'var(--secondary-light)',
        color: 'var(--secondary-color)',
        padding: '0.1rem 0.4rem',
        borderRadius: '4px',
        fontWeight: '800',
    },
    userRole: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginTop: '0.15rem',
    },
    editInfoBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--primary-color)',
        fontSize: '0.7rem',
        fontWeight: '700',
        cursor: 'pointer',
        padding: '0.2rem 0',
        marginTop: '0.3rem',
        textAlign: 'left',
        textDecoration: 'underline',
        opacity: 0.8,
        transition: 'opacity 0.2s',
    },
    logoutBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--danger)',
        }
    }
};

export default Sidebar;
