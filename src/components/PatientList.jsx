import React, { useState } from 'react';

const PatientList = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const patients = [
        { id: 'P001', name: '김지아', gender: '여', age: 28, lastVisit: '2024-01-20', phone: '010-1234-5678' },
        { id: 'P002', name: '이민수', gender: '남', age: 45, lastVisit: '2024-01-28', phone: '010-9876-5432' },
        { id: 'P003', name: '박철수', gender: '남', age: 32, lastVisit: '2024-01-15', phone: '010-5555-4444' },
        { id: 'P004', name: '최유진', gender: '여', age: 39, lastVisit: '2024-01-10', phone: '010-8888-7777' },
        { id: 'P005', name: '정현우', gender: '남', age: 52, lastVisit: '2024-01-05', phone: '010-2222-3333' },
    ];

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={styles.title}>환자 관리</h2>
                <div style={styles.actions}>
                    <div style={styles.searchWrapper}>
                        <span style={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="환자명 또는 차트 번호 검색"
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button style={styles.addButton}>+ 새 환자 등록</button>
                </div>
            </header>

            <div style={styles.card}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>차트 번호</th>
                            <th style={styles.th}>성함</th>
                            <th style={styles.th}>성별/나이</th>
                            <th style={styles.th}>연락처</th>
                            <th style={styles.th}>최근 내원일</th>
                            <th style={styles.th}>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.filter(p => p.name.includes(searchTerm) || p.id.includes(searchTerm)).map((patient) => (
                            <tr key={patient.id} style={styles.tableRow}>
                                <td style={{ ...styles.td, fontWeight: '600', color: 'var(--primary-color)' }}>{patient.id}</td>
                                <td style={styles.td}>{patient.name}</td>
                                <td style={styles.td}>{patient.gender} / {patient.age}세</td>
                                <td style={styles.td}>{patient.phone}</td>
                                <td style={styles.td}>{patient.lastVisit}</td>
                                <td style={styles.td}>
                                    <button style={styles.actionBtn}>상세</button>
                                    <button style={{ ...styles.actionBtn, color: 'var(--secondary-color)' }}>기록</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        flex: 1,
        overflowY: 'auto',
        backgroundColor: 'var(--bg-color)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.875rem',
        fontWeight: '700',
        color: 'var(--text-main)',
    },
    actions: {
        display: 'flex',
        gap: '1rem',
    },
    searchWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    searchIcon: {
        position: 'absolute',
        left: '12px',
        color: 'var(--text-muted)',
    },
    searchInput: {
        padding: '0.625rem 1rem 0.625rem 2.5rem',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        width: '300px',
        fontSize: '0.9rem',
        outline: 'none',
        backgroundColor: 'var(--card-bg)',
        color: 'var(--text-main)',
    },
    addButton: {
        padding: '0.625rem 1.25rem',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    card: {
        backgroundColor: 'var(--card-bg)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        backgroundColor: 'var(--bg-color)',
        borderBottom: '1px solid var(--border-color)',
    },
    th: {
        textAlign: 'left',
        padding: '1rem',
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        fontWeight: '600',
    },
    tableRow: {
        borderBottom: '1px solid var(--border-color)',
        transition: 'background-color 0.2s',
        color: 'var(--text-main)',
    },
    td: {
        padding: '1.25rem 1rem',
        fontSize: '0.9rem',
    },
    actionBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--text-muted)',
        fontWeight: '600',
        cursor: 'pointer',
        marginRight: '1rem',
        fontSize: '0.85rem',
    },
};

export default PatientList;
