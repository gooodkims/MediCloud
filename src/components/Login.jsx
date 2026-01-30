import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Login = ({ onSwitchToSignup, language, t }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(t.auth.loginError);
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logoIconBg}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>
                    </div>
                    <h1 style={styles.logoText}>MediCloud</h1>
                    <p style={styles.subtitle}>{t.auth.login}</p>
                </div>

                <form style={styles.form} onSubmit={handleLogin}>
                    {error && <div style={styles.errorBanner}>{error}</div>}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>{t.auth.email}</label>
                        <input
                            type="email"
                            placeholder={t.auth.emailPlaceholder}
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>{t.auth.password}</label>
                        <input
                            type="password"
                            placeholder={t.auth.passwordPlaceholder}
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.submitBtn} disabled={loading}>
                        {loading ? '...' : t.auth.loginBtn}
                    </button>
                </form>

                <div style={styles.footer}>
                    {t.auth.goToSignup.split('?')[0]}? <span style={styles.switchLink} onClick={onSwitchToSignup}>{t.auth.signup}</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'var(--card-bg)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)',
        backdropFilter: 'blur(10px)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2.5rem',
    },
    logoIconBg: {
        width: '48px',
        height: '48px',
        backgroundColor: 'var(--primary-color)',
        borderRadius: '14px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        boxShadow: '0 8px 16px rgba(13, 148, 136, 0.2)',
    },
    logoText: {
        fontSize: '2rem',
        fontWeight: '800',
        color: 'var(--text-main)',
        letterSpacing: '-0.04em',
    },
    subtitle: {
        color: 'var(--text-muted)',
        marginTop: '0.5rem',
        fontSize: '1.1rem',
        fontWeight: '500',
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
        '&:focus': {
            borderColor: 'var(--primary-color)',
            boxShadow: '0 0 0 4px rgba(13, 148, 136, 0.1)',
        }
    },
    errorBanner: {
        padding: '1rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--danger)',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: '600',
        textAlign: 'center',
    },
    submitBtn: {
        marginTop: '1rem',
        padding: '1.1rem',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        borderRadius: '14px',
        fontSize: '1.1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)',
    },
    footer: {
        marginTop: '2rem',
        textAlign: 'center',
        fontSize: '0.95rem',
        color: 'var(--text-muted)',
    },
    switchLink: {
        color: 'var(--primary-color)',
        fontWeight: '700',
        cursor: 'pointer',
        marginLeft: '0.5rem',
    }
};

export default Login;
