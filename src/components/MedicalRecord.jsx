import React, { useState, useEffect } from 'react';

const MedicalRecord = () => {
    const [complaint, setComplaint] = useState('');
    const [soap, setSoap] = useState({
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });
    const [isListening, setIsListening] = useState({ complaint: false, soap: false });
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = false;
            recog.interimResults = false;
            recog.lang = 'ko-KR';
            setRecognition(recog);
        }
    }, []);

    const categorizeSOAP = (transcript) => {
        const categories = {
            subjective: ['아파요', '통증', '불편', '어지러', '기침', '가래', '열이', '힘들'],
            objective: ['혈압', '체온', '수치', '검사', '소견', '관찰', '맥박', '당뇨'],
            assessment: ['진단', '의심', '상태', '판단', '가능성', '결과', '확인됨'],
            plan: ['처방', '내원', '예약', '복용', '치료', '수술', '경과', '조절']
        };

        let updatedSoap = { ...soap };
        const sentences = transcript.split(/[.?!]\s*/);

        sentences.forEach(sentence => {
            if (!sentence.trim()) return;

            let matched = false;
            for (const [key, keywords] of Object.entries(categories)) {
                if (keywords.some(keyword => sentence.includes(keyword))) {
                    updatedSoap[key] = updatedSoap[key] + (updatedSoap[key] ? '\n' : '') + sentence;
                    matched = true;
                    break;
                }
            }

            // 매칭되는 키워드가 없으면 기본적으로 Subjective에 넣음
            if (!matched) {
                updatedSoap.subjective = updatedSoap.subjective + (updatedSoap.subjective ? '\n' : '') + sentence;
            }
        });

        setSoap(updatedSoap);
    };

    const startListening = (target) => {
        if (!recognition) {
            alert('이 브라우저는 음성 인식을 지원하지 않아요! ㅠㅠ 크롬을 사용해 주세요!');
            return;
        }

        setIsListening({ ...isListening, [target]: true });
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (target === 'complaint') {
                setComplaint(prev => prev + (prev ? ' ' : '') + transcript);
            } else {
                categorizeSOAP(transcript);
            }
            setIsListening({ ...isListening, [target]: false });
        };

        recognition.onerror = () => {
            setIsListening({ ...isListening, [target]: false });
        };

        recognition.onend = () => {
            setIsListening({ ...isListening, [target]: false });
        };
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
        }
    };

    const handleSoapChange = (e, key) => {
        setSoap({ ...soap, [key]: e.target.value });
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.patientInfo}>
                    <span style={styles.avatar}>MI</span>
                    <div>
                        <h2 style={styles.patientName}>이민수 (남/45세)</h2>
                        <p style={styles.patientMeta}>차트번호: P002 | 최종내원: 2024-01-28</p>
                    </div>
                </div>
                <button style={styles.saveBtn}>진료 저장</button>
            </header>

            <div style={styles.content}>
                <div style={styles.editorArea}>
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>주요 증상 (Chief Complaint)</h3>
                            <button
                                style={{
                                    ...styles.micBtn,
                                    backgroundColor: isListening.complaint ? 'var(--danger)' : 'var(--primary-light)',
                                    color: isListening.complaint ? 'white' : 'var(--primary-color)'
                                }}
                                onClick={() => isListening.complaint ? stopListening() : startListening('complaint')}
                            >
                                {isListening.complaint ? '⏹' : '🎤'}
                            </button>
                        </div>
                        <textarea
                            style={styles.textarea}
                            placeholder="환자가 호소하는 증상을 입력하세요..."
                            rows={2}
                            value={complaint}
                            onChange={(e) => setComplaint(e.target.value)}
                        />
                    </div>

                    <div style={styles.soapGrid}>
                        {[
                            { key: 'subjective', label: 'S (Subjective) - 주관적 정보', placeholder: '환자의 통증 호소, 증상 등...' },
                            { key: 'objective', label: 'O (Objective) - 객관적 정보', placeholder: '혈압, 체온, 검사 결과, 의사 소견...' },
                            { key: 'assessment', label: 'A (Assessment) - 진단 및 평가', placeholder: '추정 진단, 환자 상태 평가...' },
                            { key: 'plan', label: 'P (Plan) - 치료 계획', placeholder: '처방, 향후 내원 계획, 수술 여부...' }
                        ].map((item) => (
                            <div key={item.key} style={styles.section}>
                                <div style={styles.sectionHeader}>
                                    <h3 style={styles.sectionTitle}>{item.label}</h3>
                                    {item.key === 'subjective' && (
                                        <button
                                            style={{
                                                ...styles.micBtn,
                                                backgroundColor: isListening.soap ? 'var(--danger)' : 'var(--secondary-light)',
                                                color: isListening.soap ? 'white' : 'var(--secondary-color)'
                                            }}
                                            onClick={() => isListening.soap ? stopListening() : startListening('soap')}
                                            title="전체 음성 입력 및 자동 분류"
                                        >
                                            {isListening.soap ? '⏹' : '🎤 AI'}
                                        </button>
                                    )}
                                </div>
                                <textarea
                                    style={{ ...styles.textarea, height: '140px' }}
                                    placeholder={item.placeholder}
                                    value={soap[item.key]}
                                    onChange={(e) => handleSoapChange(e, item.key)}
                                />
                            </div>
                        ))}
                    </div>
                    {isListening.soap && <div style={styles.listeningHint}>🎙️ 인공지능이 듣고 있어요! SOAP에 맞춰 분류해 드릴게요.</div>}
                </div>

                <aside style={styles.sidebar}>
                    <h3 style={styles.sectionTitle}>과거 이력</h3>
                    <div style={styles.historyList}>
                        {[
                            { date: '2024-01-28', title: '기관지염 추적 관찰' },
                            { date: '2024-01-14', title: '기침 및 가래 증상' },
                            { date: '2023-12-05', title: '정기 종합 검진' },
                        ].map((h, i) => (
                            <div key={i} style={styles.historyItem}>
                                <span style={styles.historyDate}>{h.date}</span>
                                <p style={styles.historyTitle}>{h.title}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ ...styles.section, marginTop: '2rem', padding: '1rem' }}>
                        <h3 style={styles.sectionTitle}>처방 (Prescription)</h3>
                        <div style={styles.prescriptionBox}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>등록된 처방이 없습니다.</p>
                            <button style={styles.miniBtn}>+ 약 처방 추가</button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', backgroundColor: 'var(--card-bg)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' },
    patientInfo: { display: 'flex', alignItems: 'center', gap: '1rem' },
    avatar: { width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.2rem' },
    patientName: { fontSize: '1.25rem', fontWeight: '700' },
    patientMeta: { fontSize: '0.875rem', color: 'var(--text-muted)' },
    saveBtn: { padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
    content: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '2rem', flex: 1 },
    editorArea: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    soapGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    section: { backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', position: 'relative' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    sectionTitle: { fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' },
    micBtn: { padding: '4px 12px', borderRadius: '20px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s' },
    textarea: { width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem', lineHeight: '1.6', outline: 'none', resize: 'none', fontFamily: 'inherit' },
    listeningHint: { marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--danger)', fontWeight: '600', textAlign: 'center' },
    sidebar: { backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', height: 'fit-content' },
    historyList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    historyItem: { paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' },
    historyDate: { fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary-color)' },
    historyTitle: { fontSize: '0.875rem', marginTop: '0.25rem' },
    prescriptionBox: { border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '1rem', textAlign: 'center' },
    miniBtn: { marginTop: '0.75rem', padding: '0.5rem 1rem', background: 'none', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' },
};

export default MedicalRecord;
