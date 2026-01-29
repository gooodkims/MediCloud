import React from 'react';

const Dashboard = () => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={styles.title}>대시보드</h2>
                <p style={styles.subtitle}>오늘의 진료 현황 및 병원 상태입니다.</p>
            </header>

            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <span style={{ ...styles.statIcon, backgroundColor: '#dcfce7', color: '#166534' }}>👥</span>
                        <span style={styles.statLabel}>전체 환자</span>
                    </div>
                    <div style={styles.statValue}>1,284</div>
                    <div style={styles.statTrend}>↑ 12% vs last month</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <span style={{ ...styles.statIcon, backgroundColor: '#e0f2fe', color: '#075985' }}>📅</span>
                        <span style={styles.statLabel}>오늘의 예약</span>
                    </div>
                    <div style={styles.statValue}>24</div>
                    <div style={styles.statTrend}>Next at 14:00</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <span style={{ ...styles.statIcon, backgroundColor: '#fef9c3', color: '#854d0e' }}>📝</span>
                        <span style={styles.statLabel}>대기 환자</span>
                    </div>
                    <div style={styles.statValue}>5</div>
                    <div style={styles.statTrend}>Avg. wait: 15min</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <span style={{ ...styles.statIcon, backgroundColor: '#fee2e2', color: '#991b1b' }}>🚑</span>
                        <span style={styles.statLabel}>응급 내원</span>
                    </div>
                    <div style={styles.statValue}>2</div>
                    <div style={styles.statTrend}>Immediate attention</div>
                </div>
            </div>

            <div style={styles.mainGrid}>
                <section style={styles.sectionCard}>
                    <h3 style={styles.sectionTitle}>최근 진료 환자</h3>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>환자명</th>
                                <th style={styles.th}>진료 항목</th>
                                <th style={styles.th}>시간</th>
                                <th style={styles.th}>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: '이민수', type: '정기 검진', time: '13:20', status: '진료중' },
                                { name: '김지아', type: '내과 상담', time: '12:45', status: '대기' },
                                { name: '박철수', type: '알레르기 테스트', time: '11:30', status: '완료' },
                                { name: '최유진', type: '물리 치료', time: '10:15', status: '완료' },
                            ].map((patient, i) => (
                                <tr key={i} style={styles.tableRow}>
                                    <td style={styles.td}>{patient.name}</td>
                                    <td style={styles.td}>{patient.type}</td>
                                    <td style={styles.td}>{patient.time}</td>
                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.badge,
                                            backgroundColor: patient.status === '진료중' ? '#dcfce7' : patient.status === '대기' ? '#fef9c3' : '#f1f5f9',
                                            color: patient.status === '진료중' ? '#166534' : patient.status === '대기' ? '#854d0e' : '#64748b'
                                        }}>
                                            {patient.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section style={styles.sectionCard}>
                    <h3 style={styles.sectionTitle}>시스템 공지사항</h3>
                    <div style={styles.noticeList}>
                        <div style={styles.noticeItem}>
                            <div style={styles.noticeTag}>UPDATE</div>
                            <p style={styles.noticeText}>v2.4 업데이트 안내: 클라우드 동기화 속도가 개선되었습니다.</p>
                        </div>
                        <div style={styles.noticeItem}>
                            <div style={styles.noticeTag}>INFO</div>
                            <p style={styles.noticeText}>2월 5일 서버 정기 점검이 예정되어 있습니다 (02:00 ~ 04:00).</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        flex: 1,
        overflowY: 'auto',
    },
    header: {
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.875rem',
        fontWeight: '700',
        color: 'var(--text-main)',
    },
    subtitle: {
        color: 'var(--text-muted)',
        marginTop: '0.25rem',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    statCard: {
        backgroundColor: 'var(--card-bg)',
        padding: '1.5rem',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
    },
    statHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
    },
    statIcon: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
    },
    statLabel: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: 'var(--text-muted)',
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '0.25rem',
    },
    statTrend: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
    },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
    },
    sectionCard: {
        backgroundColor: 'var(--card-bg)',
        padding: '1.5rem',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
    },
    sectionTitle: {
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '1.25rem',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        borderBottom: '1px solid var(--border-color)',
    },
    th: {
        textAlign: 'left',
        padding: '0.75rem 0',
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        fontWeight: '500',
    },
    td: {
        padding: '1rem 0',
        fontSize: '0.9rem',
        borderBottom: '1px solid #f1f5f9',
    },
    badge: {
        padding: '0.25rem 0.625rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    noticeList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    noticeItem: {
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        borderLeft: '4px solid var(--primary-color)',
    },
    noticeTag: {
        fontSize: '0.7rem',
        fontWeight: '700',
        color: 'var(--primary-color)',
        marginBottom: '0.25rem',
    },
    noticeText: {
        fontSize: '0.875rem',
        lineHeight: '1.4',
    },
};

export default Dashboard;
