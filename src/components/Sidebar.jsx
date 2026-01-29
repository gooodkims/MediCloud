import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <aside style={styles.sidebar}>
            <div style={styles.logo}>
                <span style={styles.logoIcon}>☁️</span>
                <h1 style={styles.logoText}>MediCloud</h1>
            </div>
            <nav style={styles.nav}>
                <div
                    style={{ ...styles.navItem, ...(activeTab === 'dashboard' ? styles.navActive : {}) }}
                    onClick={() => setActiveTab('dashboard')}
                >
                    <span>📊</span> 대시보드
                </div>
                <div
                    style={{ ...styles.navItem, ...(activeTab === 'patients' ? styles.navActive : {}) }}
                    onClick={() => setActiveTab('patients')}
                >
                    <span>👥</span> 환자 관리
                </div>
                <div
                    style={{ ...styles.navItem, ...(activeTab === 'records' ? styles.navActive : {}) }}
                    onClick={() => setActiveTab('records')}
                >
                    <span>📝</span> 진료 기록
                </div>

                <div style={styles.navItem}>
                    <span>📅</span> 예약 현황
                </div>
            </nav>
            <div style={styles.footer}>
                <div style={styles.profile}>
                    <div style={styles.avatar}>K</div>
                    <div>
                        <div style={styles.userName}>킴스님</div>
                        <div style={styles.userRole}>전문의</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const styles = {
    sidebar: {
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--card-bg)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
    },
    logo: {
        padding: '2rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    logoIcon: {
        fontSize: '2rem',
    },
    logoText: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--primary-color)',
        letterSpacing: '-0.025em',
    },
    nav: {
        flex: 1,
        padding: '0 0.75rem',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        fontWeight: '500',
        transition: 'all 0.2s',
        marginBottom: '0.25rem',
    },
    navActive: {
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary-color)',
    },
    footer: {
        padding: '1.5rem',
        borderTop: '1px solid var(--border-color)',
    },
    profile: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
    },
    userName: {
        fontSize: '0.9rem',
        fontWeight: '600',
    },
    userRole: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
    },
};

export default Sidebar;
