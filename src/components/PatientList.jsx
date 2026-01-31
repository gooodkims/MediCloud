import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const PatientList = ({ language, t, onEditPatient, onStartConsultation }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPatients(data || []);
        } catch (error) {
            console.error('Error fetching patients:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return '??';
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.chart_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={styles.title}>{t.patientList.title}</h2>
                <div style={styles.actions}>
                    <div style={styles.searchWrapper}>
                        <span style={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder={t.patientList.searchPlaceholder}
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Note: This button navigation is handled via activeTab in App.jsx, 
                        but for now we keep it for UI completeness or fix its action if needed */}
                    <button style={styles.addButton}>{t.patientList.addButton}</button>
                </div>
            </header>

            <div style={styles.card}>
                {loading ? (
                    <div style={styles.emptyState}>{t.common.loading}</div>
                ) : filteredPatients.length === 0 ? (
                    <div style={styles.emptyState}>{t.patientList.noPatients}</div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>{t.patientList.tableHeader.chartId}</th>
                                <th style={styles.th}>{t.patientList.tableHeader.name}</th>
                                <th style={styles.th}>{t.patientList.tableHeader.genderAge}</th>
                                <th style={styles.th}>{t.patientList.tableHeader.phone}</th>
                                <th style={styles.th}>{t.patientList.tableHeader.status}</th>
                                <th style={styles.th}>{t.patientList.tableHeader.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} style={styles.tableRow}>
                                    <td style={{ ...styles.td, fontWeight: '600', color: 'var(--primary-color)' }}>{patient.chart_id}</td>
                                    <td style={styles.td}>{patient.name}</td>
                                    <td style={styles.td}>
                                        {t.patientRegistration[patient.gender] || patient.gender} / {calculateAge(patient.birth_date)}세
                                    </td>
                                    <td style={styles.td}>{patient.phone || '-'}</td>
                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.badge,
                                            backgroundColor: patient.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: patient.active ? '#10b981' : '#ef4444'
                                        }}>
                                            {patient.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <button
                                            style={styles.actionBtn}
                                            onClick={() => onEditPatient(patient)}
                                        >
                                            {t.patientList.details}
                                        </button>
                                        <button
                                            style={{ ...styles.actionBtn, color: 'var(--secondary-color)' }}
                                            onClick={() => onStartConsultation(patient)}
                                        >
                                            {t.patientList.records}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
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
    badge: {
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    emptyState: {
        padding: '3rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '1rem',
        fontWeight: '500',
    }
};

export default PatientList;
