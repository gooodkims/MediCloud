import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { countries } from '../constants/countries';

const ProfileEdit = ({ profile, onSave, onCancel, language, t }) => {
    const [name, setName] = useState(profile?.full_name || '');
    const [country, setCountry] = useState(profile?.country || '');
    const [hospitalName, setHospitalName] = useState(profile?.hospital_name || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                full_name: name,
                country: country,
                hospital_name: hospitalName,
                updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);

        if (updateError) {
            setError(t.profile.saveError);
        } else {
            // Update auth metadata as well to keep sync if possible
            await supabase.auth.updateUser({
                data: { full_name: name }
            });
            onSave();
        }
        setLoading(false);
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>{t.profile.title}</h2>
                    <p style={styles.subtitle}>{t.profile.subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && <div style={styles.errorBanner}>{error}</div>}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>{t.auth.name}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>{t.auth.country}</label>
                        <select
                            style={styles.input}
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        >
                            <option value="">{t.auth.countryPlaceholder}</option>
                            {countries.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>{t.auth.hospitalName}</label>
                        <input
                            type="text"
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.btnGroup}>
                        <button type="button" onClick={onCancel} style={styles.cancelBtn}>
                            {t.common.cancel}
                        </button>
                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading ? t.common.loading : t.common.save}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
    },
    modal: {
        width: '100%',
        maxWidth: '460px',
        backgroundColor: 'var(--card-bg)',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--border-color)',
    },
    header: {
        marginBottom: '2rem',
        textAlign: 'center',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: 'var(--text-main)',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '0.95rem',
        color: 'var(--text-muted)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: '700',
        color: 'var(--text-main)',
    },
    input: {
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-main)',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.2s',
    },
    btnGroup: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem',
    },
    cancelBtn: {
        flex: 1,
        padding: '1rem',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'transparent',
        color: 'var(--text-muted)',
        fontWeight: '700',
        cursor: 'pointer',
    },
    submitBtn: {
        flex: 2,
        padding: '1rem',
        borderRadius: '14px',
        border: 'none',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        fontWeight: '700',
        cursor: 'pointer',
    },
    errorBanner: {
        padding: '0.75rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--danger)',
        borderRadius: '10px',
        fontSize: '0.85rem',
        textAlign: 'center',
    }
};

export default ProfileEdit;
