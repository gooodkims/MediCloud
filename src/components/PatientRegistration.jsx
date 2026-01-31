import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const PatientRegistration = ({ language, t, onRegisterSuccess, initialData }) => {
    const isEdit = !!initialData;
    const [chartId, setChartId] = useState(initialData?.chart_id || '');
    const [name, setName] = useState(initialData?.name || '');
    const [gender, setGender] = useState(initialData?.gender || 'male');
    const [birthDate, setBirthDate] = useState(initialData?.birth_date || '');
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [active, setActive] = useState(initialData?.active ?? true);
    const [maritalStatus, setMaritalStatus] = useState(initialData?.marital_status || 'U');
    const [contactName, setContactName] = useState(initialData?.contact?.name || '');
    const [contactRelation, setContactRelation] = useState(initialData?.contact?.relationship || '');
    const [contactPhone, setContactPhone] = useState(initialData?.contact?.phone || '');
    const [communication, setCommunication] = useState(initialData?.communication || language);
    const [gpId, setGpId] = useState(initialData?.general_practitioner || '');
    const [orgName, setOrgName] = useState(initialData?.managing_organization || 'MediCloud Central Hospital');
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(!isEdit);

    useEffect(() => {
        if (!isEdit) {
            generateAutoChartId();
        }
        fetchCurrentUser();
    }, [isEdit]);

    const fetchCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setGpId(user.id);
    };

    const generateAutoChartId = async () => {
        setGenerating(true);
        try {
            const { data, error } = await supabase.rpc('get_next_chart_id_preview');

            if (error) throw error;
            setChartId(data || 'P001');
        } catch (error) {
            console.error('Error fetching preview chart_id:', error);
            // Fallback: fetch last and increment
            const { data } = await supabase
                .from('patients')
                .select('chart_id')
                .order('chart_id', { ascending: false })
                .limit(1);

            if (data && data.length > 0) {
                const nextNum = (parseInt(data[0].chart_id.replace(/[^\d]/g, '')) || 0) + 1;
                setChartId('P' + String(nextNum).padStart(3, '0'));
            } else {
                setChartId('P001');
            }
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const patientData = {
            name,
            gender,
            birth_date: birthDate,
            phone,
            active,
            marital_status: maritalStatus,
            contact: {
                name: contactName,
                relationship: contactRelation,
                phone: contactPhone
            },
            communication,
            general_practitioner: gpId || null,
            managing_organization: orgName
        };

        let query;
        if (isEdit) {
            query = supabase.from('patients').update(patientData).eq('id', initialData.id);
        } else {
            query = supabase.from('patients').insert([patientData]);
        }

        const { error } = await query;

        if (error) {
            const errorMsg = isEdit ? t.patientRegistration.updateError : t.patientRegistration.error;
            alert(errorMsg + ': ' + error.message);
        } else {
            const successMsg = isEdit ? t.patientRegistration.updateSuccess : t.patientRegistration.success;
            alert(successMsg);
            if (onRegisterSuccess) onRegisterSuccess();
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <header style={styles.header}>
                    <h2 style={styles.title}>{isEdit ? t.patientRegistration.editTitle : t.patientRegistration.title}</h2>
                    <p style={styles.subtitle}>{isEdit ? t.patientRegistration.editSubtitle : t.patientRegistration.subtitle}</p>
                </header>

                <form style={styles.form} onSubmit={handleSubmit}>
                    <div style={styles.inputGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{t.patientRegistration.chartId}</label>
                            <input
                                type="text"
                                style={{ ...styles.input, backgroundColor: 'var(--bg-color)', fontWeight: '700' }}
                                value={generating ? t.patientRegistration.generatingId : chartId}
                                readOnly
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{t.patientRegistration.name}</label>
                            <input
                                type="text"
                                style={styles.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{t.patientRegistration.gender}</label>
                            <select
                                style={styles.select}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="male">{t.patientRegistration.male}</option>
                                <option value="female">{t.patientRegistration.female}</option>
                                <option value="other">{t.patientRegistration.other}</option>
                                <option value="unknown">{t.patientRegistration.unknown}</option>
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{t.patientRegistration.birthDate}</label>
                            <input
                                type="date"
                                style={styles.input}
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{t.patientRegistration.phone}</label>
                            <input
                                type="tel"
                                placeholder="010-0000-0000"
                                style={styles.input}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{t.patientRegistration.active}</label>
                            <label style={styles.switchLabel}>
                                <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={(e) => setActive(e.target.checked)}
                                />
                                <span style={styles.activeText}>{active ? 'Active' : 'Inactive'}</span>
                            </label>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{t.patientRegistration.maritalStatus}</label>
                            <select
                                style={styles.select}
                                value={maritalStatus}
                                onChange={(e) => setMaritalStatus(e.target.value)}
                            >
                                <option value="U">{t.patientRegistration.unknown}</option>
                                <option value="S">{t.patientRegistration.single}</option>
                                <option value="M">{t.patientRegistration.married}</option>
                                <option value="D">{t.patientRegistration.divorced}</option>
                                <option value="W">{t.patientRegistration.widowed}</option>
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{t.patientRegistration.communication}</label>
                            <select
                                style={styles.select}
                                value={communication}
                                onChange={(e) => setCommunication(e.target.value)}
                            >
                                <option value="ko">한국어 (Korean)</option>
                                <option value="en">영어 (English)</option>
                            </select>
                        </div>

                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>{t.patientRegistration.contact}</h3>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{t.patientRegistration.contactName}</label>
                            <input
                                type="text"
                                style={styles.input}
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{t.patientRegistration.contactRelation}</label>
                            <input
                                type="text"
                                style={styles.input}
                                value={contactRelation}
                                onChange={(e) => setContactRelation(e.target.value)}
                            />
                        </div>

                        <div style={styles.inputGroupFull}>
                            <label style={styles.label}>{t.patientRegistration.contactPhone}</label>
                            <input
                                type="tel"
                                style={styles.input}
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                            />
                        </div>

                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Healthcare Provider Info</h3>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{t.patientRegistration.generalPractitioner}</label>
                            <input
                                type="text"
                                style={{ ...styles.input, backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)' }}
                                value={gpId ? `Dr. ${t.common.doctor} (${gpId.substring(0, 8)})` : 'Loading...'}
                                readOnly
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{t.patientRegistration.managingOrganization}</label>
                            <input
                                type="text"
                                style={styles.input}
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" style={styles.submitBtn} disabled={loading || generating}>
                        {loading ? '...' : (isEdit ? t.patientRegistration.updateBtn : t.patientRegistration.submit)}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2.5rem',
        flex: 1,
        backgroundColor: 'var(--bg-color)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'auto',
    },
    card: {
        width: '100%',
        maxWidth: '850px',
        backgroundColor: 'var(--card-bg)',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)',
    },
    header: {
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: 'var(--text-main)',
        letterSpacing: '-0.025em',
    },
    subtitle: {
        fontSize: '0.95rem',
        color: 'var(--text-muted)',
        marginTop: '0.4rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    inputGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
    },
    inputGroupFull: {
        gridColumn: 'span 2',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
    },
    sectionHeader: {
        gridColumn: 'span 2',
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px dashed var(--border-color)',
    },
    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: 'var(--primary-color)',
    },
    switchLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        cursor: 'pointer',
    },
    activeText: {
        fontSize: '0.9rem',
        color: 'var(--text-main)',
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: 'var(--text-muted)',
    },
    input: {
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'transparent',
        color: 'var(--text-main)',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'all 0.2s',
    },
    select: {
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'transparent',
        color: 'var(--text-main)',
        fontSize: '0.95rem',
        outline: 'none',
        appearance: 'none',
    },
    submitBtn: {
        padding: '1.25rem',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        borderRadius: '14px',
        fontSize: '1.1rem',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 8px 16px rgba(13, 148, 136, 0.2)',
        transition: 'transform 0.2s, background-color 0.2s',
    }
};

export default PatientRegistration;
