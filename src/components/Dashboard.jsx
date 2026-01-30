import React from 'react';

const Dashboard = ({ language, t }) => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div>
                    <h2 style={styles.title}>{t.dashboard.title}</h2>
                    <p style={styles.subtitle}>
                        {language === 'ko'
                            ? `2024년 1월 30일 화요일 | ${t.common.doctor} 진료 세션`
                            : `Tuesday, Jan 30, 2024 | ${t.common.doctor}'s Session`}
                    </p>
                </div>
                <div style={styles.timeDisplay}>
                    <span style={styles.pulseIcon}>●</span> {language === 'ko' ? '실시간 모니터링 중' : 'Live Monitoring'}
                </div>
            </header>

            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={{ ...styles.statIcon, backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                        <span style={styles.statLabel}>{language === 'ko' ? '내원 환자' : 'Daily Patients'}</span>
                    </div>
                    <div style={styles.statValue}>1,284</div>
                    <div style={styles.statTrend}>
                        <span style={{ color: 'var(--success)', fontWeight: '600' }}>↑ 12%</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>{language === 'ko' ? '지난달 대비' : 'vs last month'}</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={{ ...styles.statIcon, backgroundColor: 'var(--secondary-light)', color: 'var(--secondary-color)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        </div>
                        <span style={styles.statLabel}>{language === 'ko' ? '금일 예약' : 'Appointments'}</span>
                    </div>
                    <div style={styles.statValue}>24</div>
                    <div style={styles.statTrend}>{language === 'ko' ? '다음 진료' : 'Next'} <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>14:00</span></div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={{ ...styles.statIcon, backgroundColor: 'rgba(234, 179, 8, 0.15)', color: 'var(--warning)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-3-3.87" /><path d="M9 21v-2a4 4 0 0 1 4-4" /><circle cx="9" cy="7" r="4" /></svg>
                        </div>
                        <span style={styles.statLabel}>{t.dashboard.waitingTitle}</span>
                    </div>
                    <div style={styles.statValue}>12 <span style={styles.statUnit}>{t.dashboard.waitingCount}</span></div>
                    <div style={styles.statTrend}>+2 {language === 'ko' ? '한 시간 전 대비' : 'from last hour'}</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={{ ...styles.statIcon, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        </div>
                        <span style={styles.statLabel}>{t.dashboard.systemAlert}</span>
                    </div>
                    <div style={styles.statValue}>3 <span style={styles.statUnit}>{language === 'ko' ? '건' : 'Case'}</span></div>
                    <div style={styles.statTrend}>{language === 'ko' ? '정상 작동 중' : 'All systems normal'}</div>
                </div>
            </div>

            <div style={styles.mainGrid}>
                <div style={styles.tableCard}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>{t.dashboard.waitingTitle}</h3>
                        <button style={styles.moreBtn}>View All</button>
                    </div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>{t.dashboard.patientName}</th>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>{t.dashboard.status}</th>
                                <th style={styles.th}>{t.dashboard.time}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: language === 'ko' ? '김철수' : 'Chulsoo Kim', id: 'P001', status: t.dashboard.waiting, time: '14:20', statusColor: 'var(--warning)' },
                                { name: language === 'ko' ? '이민수' : 'Minsoo Lee', id: 'P002', status: t.dashboard.inClinic, time: '14:35', statusColor: 'var(--primary-color)' },
                                { name: language === 'ko' ? '박지민' : 'Jimin Park', id: 'P003', status: t.dashboard.waiting, time: '14:40', statusColor: 'var(--warning)' },
                                { name: language === 'ko' ? '최현우' : 'Hyunwoo Choi', id: 'P004', status: t.dashboard.completed, time: '14:10', statusColor: 'var(--success)' },
                            ].map((row, i) => (
                                <tr key={i} style={styles.tr}>
                                    <td style={styles.td}><span style={styles.patientName}>{row.name}</span></td>
                                    <td style={styles.td}>{row.id}</td>
                                    <td style={styles.td}>
                                        <span style={{ ...styles.statusTag, backgroundColor: row.statusColor + '15', color: row.statusColor }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={styles.td}>{row.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={styles.sideColumn}>
                    <div style={styles.scheduleCard}>
                        <h3 style={styles.cardTitle}>{t.dashboard.schedule}</h3>
                        <div style={styles.timeline}>
                            {[
                                { time: '15:00', task: language === 'ko' ? '정형외과 컨퍼런스' : 'Orthopedic Conference', type: 'meeting' },
                                { time: '16:30', task: language === 'ko' ? '이민수 환자 수술 상담' : 'Surgery Consultation', type: 'consult' },
                                { time: '18:00', task: language === 'ko' ? '야간 진료 인수인계' : 'Night Shift Handover', type: 'clinic' },
                            ].map((item, i) => (
                                <div key={i} style={styles.timelineItem}>
                                    <div style={styles.timelineTime}>{item.time}</div>
                                    <div style={styles.timelineContent}>
                                        <div style={styles.timelineTask}>{item.task}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2.5rem',
        flex: 1,
        overflowY: 'auto',
        backgroundColor: 'var(--bg-color)',
    },
    header: {
        marginBottom: '2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '800',
        color: 'var(--text-main)',
        letterSpacing: '-0.025em',
    },
    subtitle: {
        color: 'var(--text-muted)',
        marginTop: '0.5rem',
        fontSize: '1rem',
    },
    timeDisplay: {
        backgroundColor: 'var(--card-bg)',
        padding: '0.5rem 1rem',
        borderRadius: '99px',
        fontSize: '0.875rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
    },
    pulseIcon: {
        color: 'var(--success)',
        fontSize: '0.6rem',
        animation: 'pulse 2s infinite',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.5rem',
        marginBottom: '2.5rem',
    },
    statCard: {
        backgroundColor: 'var(--card-bg)',
        padding: '1.75rem',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border-color)',
        transition: 'transform 0.2s',
    },
    statHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.25rem',
    },
    statIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
    },
    statLabel: {
        fontSize: '0.95rem',
        fontWeight: '700',
        color: 'var(--text-muted)',
    },
    statValue: {
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.4rem',
        color: 'var(--text-main)',
    },
    statUnit: {
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        marginLeft: '4px',
    },
    statTrend: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
    },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2.5fr) 1fr',
        gap: '2rem',
    },
    tableCard: {
        backgroundColor: 'var(--card-bg)',
        padding: '1.75rem',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border-color)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    cardTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: 'var(--text-main)',
    },
    moreBtn: {
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        background: 'none',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        color: 'var(--text-main)',
    },
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 0.5rem',
    },
    th: {
        textAlign: 'left',
        padding: '0.75rem 1rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        fontWeight: '600',
    },
    tr: {
        transition: 'all 0.2s',
    },
    td: {
        padding: '1rem',
        fontSize: '0.9rem',
        backgroundColor: 'var(--card-bg)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        color: 'var(--text-main)',
    },
    patientName: {
        fontWeight: '700',
        color: 'var(--text-main)',
    },
    statusTag: {
        padding: '0.3rem 0.75rem',
        borderRadius: '8px',
        fontSize: '0.8rem',
        fontWeight: '700',
    },
    sideColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    scheduleCard: {
        backgroundColor: 'var(--card-bg)',
        padding: '1.75rem',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border-color)',
    },
    timeline: {
        marginTop: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    timelineItem: {
        display: 'flex',
        gap: '1rem',
    },
    timelineTime: {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: 'var(--primary-color)',
        minWidth: '50px',
    },
    timelineTask: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: 'var(--text-main)',
    },
};

export default Dashboard;
