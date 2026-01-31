import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MedicalRecord = ({ activePatient, savedRecords = [], setSavedRecords, selectedRecordId, setSelectedRecordId, language, t }) => {
    const [complaint, setComplaint] = useState('');
    const [soap, setSoap] = useState({
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });
    const [isListening, setIsListening] = useState({ complaint: false, soap: false });
    const [recognition, setRecognition] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const pdfRef = useRef(null);

    // 환자 정보 (전달받은 activePatient가 있으면 사용, 없으면 기본값)
    const patientInfo = {
        name: activePatient?.name || (language === 'ko' ? '이민수' : 'Minsoo Lee'),
        id: activePatient?.chart_id || 'P002',
        gender: activePatient?.gender || 'male',
        birthDate: activePatient?.birth_date || '1979-01-01'
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


    // 외부에서 기록 선택 시 로드
    useEffect(() => {
        if (selectedRecordId) {
            const record = savedRecords.find(r => r.id === selectedRecordId);
            if (record) {
                setComplaint(record.complaint);
                setSoap(record.soap);
            }
        }
    }, [selectedRecordId, savedRecords]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = true;
            recog.interimResults = true;
            recog.lang = language === 'ko' ? 'ko-KR' : 'en-US';
            setRecognition(recog);
        }
    }, [language]);

    const categorizeSOAP = (transcript) => {
        const categories = {
            objective: [
                '혈압', '체온', '수치', '검사', '소견', '관찰', '맥박', '당뇨', '혈당', '산소포화도', '심음', '폐음',
                '압통', '종창', '발적', 'X선', '초음파', 'CT', 'MRI', '혈액', '소변', '심전도', '내시경', '청진',
                'BP', 'BT', 'HR', 'RR', 'SpO2', 'Lab', 'X-ray', 'ECG', 'EKG', 'Physical', '결과는', '수치는', '재보니'
            ],
            assessment: [
                '진단', '의심', '상태', '판단', '가능성', '결과', '확인됨', '고혈압', '당뇨병', '감기', '기관지염',
                '폐렴', '위염', '장염', '협심증', '부정맥', '갑상선', '빈혈', '우울증', '불안',
                'Dx', 'Diagnosis', 'R/O', 'Impression', 'Acute', 'Chronic', '질환은', '병명은', '의심되네요'
            ],
            plan: [
                '처방', '내원', '예약', '복용', '치료', '수술', '경과', '조절', '교육', '입원', '퇴원', '재활',
                '정밀검사', '추적', '협진', '투약', '하루 세번', '식후', '취침전', '금식', '주의사항',
                'Plan', 'Prescribe', 'Rx', 'Tx', 'F/U', '약은', '치료는', '다음주에'
            ],
            subjective: [
                '아파요', '통증', '불편', '어지러', '기침', '가래', '열이', '힘들', '피로', '무력', '저녁에', '밤에', '두통',
                '시림', '부음', '가려움', '속쓰림', '메스꺼움', '구토', '설사', '변비', '흉통', '호흡', '두근',
                '식욕', '체중', '오한', '발열', '근육통', '관절통', '저림', '마비', '감각', '불면',
                'pain', 'ache', 'discomfort', 'dizzy', 'cough', 'sputum', 'fever', 'tired', 'fatigue'
            ]
        };

        let updatedSoap = { ...soap };
        // Split by punctuation or common verbal conjunctions
        const segments = transcript.split(/[.?!]|\s{2,}|그리고|그래서|그런데/).map(s => s.trim()).filter(Boolean);

        segments.forEach(segment => {
            const lowerSegment = segment.toLowerCase();
            let matched = false;

            // Priority: O, A, P, then S
            const priorityOrder = ['objective', 'assessment', 'plan', 'subjective'];

            for (const key of priorityOrder) {
                if (categories[key].some(keyword => lowerSegment.includes(keyword.toLowerCase()))) {
                    updatedSoap[key] = updatedSoap[key] + (updatedSoap[key] ? '\n' : '') + segment;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                updatedSoap.subjective = updatedSoap.subjective + (updatedSoap.subjective ? '\n' : '') + segment;
            }
        });

        setSoap(updatedSoap);
    };

    const startListening = (target) => {
        if (!recognition) {
            alert(t.medicalRecord.speechRecognitionNotSupported);
            return;
        }

        setIsListening({ ...isListening, [target]: true });

        // Reset result index tracking if needed, though recognition object is recreating
        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }

            if (finalTranscript) {
                if (target === 'complaint') {
                    setComplaint(prev => prev + (prev ? ' ' : '') + finalTranscript);
                } else {
                    categorizeSOAP(finalTranscript);
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('STT Error:', event.error);
            setIsListening({ ...isListening, [target]: false });
        };

        recognition.onend = () => {
            setIsListening({ ...isListening, [target]: false });
        };

        recognition.start();
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
        }
    };

    const handleSoapChange = (e, key) => {
        setSoap({ ...soap, [key]: e.target.value });
    };

    const loadRecord = (record) => {
        setComplaint(record.complaint);
        setSoap(record.soap);
        setSelectedRecordId(record.id);
    };

    const resetEditor = () => {
        setComplaint('');
        setSoap({ subjective: '', objective: '', assessment: '', plan: '' });
        setSelectedRecordId(null);
    };

    // 타임스탬프 생성 (YYYYMMDDHHmmss)
    const getTimestamp = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    };

    const handleSavePDF = async () => {
        if (!pdfRef.current) return;

        setIsExporting(true);
        try {
            const element = pdfRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

            // 1. 파일명 및 폼 데이터 준비
            const timestamp = getTimestamp();
            const fileName = `${t.medicalRecord.medicalRecordFilePrefix}-${patientInfo.name}-${timestamp}.pdf`;
            const pdfBlob = pdf.output('blob');

            const formData = new FormData();
            formData.append('patientId', patientInfo.id);
            formData.append('patientName', patientInfo.name);
            formData.append('pdf', pdfBlob, fileName);

            // 2. 서버에 저장 요청
            const response = await fetch('http://localhost:3001/api/save-record', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('서버 저장 실패');

            const result = await response.json();
            console.log('Server response:', result);

            // 브라우저에서도 다운로드 원할 경우 대비 (선택 사항)
            // pdf.save(fileName);

            // 3. 로컬 상태 업데이트
            const newRecord = {
                id: selectedRecordId || Date.now(),
                date: new Date().toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US'),
                patient: patientInfo.name,
                patientId: patientInfo.id,
                complaint,
                soap: { ...soap }
            };

            let updated;
            if (selectedRecordId) {
                updated = savedRecords.map(r => r.id === selectedRecordId ? newRecord : r);
            } else {
                updated = [newRecord, ...savedRecords];
                setSelectedRecordId(newRecord.id);
            }
            setSavedRecords(updated);

            alert(t.medicalRecord.folderSaved
                .replace('{patientId}', patientInfo.id)
                .replace('{fileName}', fileName));

        } catch (error) {
            console.error('PDF generation or save failed:', error);
            alert(t.medicalRecord.saveError);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.patientInfo}>
                    <span style={styles.avatar}>MI</span>
                    <div>
                        <h2 style={styles.patientName}>
                            {patientInfo.name} ({t.patientRegistration[patientInfo.gender] || patientInfo.gender}/{calculateAge(patientInfo.birthDate)}세)
                        </h2>
                        <p style={styles.patientMeta}>
                            {t.medicalRecord.chartNumber}: {patientInfo.id} | {t.medicalRecord.lastVisit}: {activePatient ? 'N/A' : '2024-01-28'}
                        </p>
                    </div>
                </div>
                <div style={styles.headerActions}>
                    <button style={styles.newBtn} onClick={resetEditor}>{t.medicalRecord.newRecord}</button>
                    <button
                        style={{ ...styles.saveBtn, backgroundColor: isExporting ? 'var(--text-muted)' : 'var(--primary-color)' }}
                        onClick={handleSavePDF}
                        disabled={isExporting}
                    >
                        {isExporting ? t.medicalRecord.saving : t.medicalRecord.saveServer}
                    </button>
                </div>
            </header>

            <div style={styles.content}>
                <div style={styles.leftColumn}>
                    <div style={styles.editorArea} ref={pdfRef}>
                        <div style={styles.pdfHeader}>
                            <div style={styles.pdfLogo}>☁️ MediCloud Medical Report</div>
                            <div style={styles.pdfDocInfo}>{t.medicalRecord.doctorLabel}: {t.common.doctor} ({t.common.md}) | {new Date().toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US')}</div>
                        </div>

                        <div style={styles.section}>
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.sectionTitle}>{t.medicalRecord.chiefComplaint}</h3>
                                {!isExporting && (
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
                                )}
                            </div>
                            <textarea
                                style={styles.textarea}
                                placeholder={t.medicalRecord.chiefComplaintPlaceholder}
                                rows={2}
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                            />
                        </div>

                        <div style={styles.soapGrid}>
                            {[
                                { key: 'subjective', label: t.medicalRecord.soapSubjective, placeholder: t.medicalRecord.soapSubjectivePlaceholder },
                                { key: 'objective', label: t.medicalRecord.soapObjective, placeholder: t.medicalRecord.soapObjectivePlaceholder },
                                { key: 'assessment', label: t.medicalRecord.soapAssessment, placeholder: t.medicalRecord.soapAssessmentPlaceholder },
                                { key: 'plan', label: t.medicalRecord.soapPlan, placeholder: t.medicalRecord.soapPlanPlaceholder }
                            ].map((item) => (
                                <div key={item.key} style={styles.section}>
                                    <div style={styles.sectionHeader}>
                                        <h3 style={styles.sectionTitle}>{item.label}</h3>
                                        {item.key === 'subjective' && !isExporting && (
                                            <button
                                                style={{
                                                    ...styles.micBtn,
                                                    backgroundColor: isListening.soap ? 'var(--danger)' : 'var(--secondary-light)',
                                                    color: isListening.soap ? 'white' : 'var(--secondary-color)'
                                                }}
                                                onClick={() => isListening.soap ? stopListening() : startListening('soap')}
                                                title={t.medicalRecord.aiTranscriptionTitle}
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
                        {isListening.soap && <div style={styles.listeningHint}>🎙️ {t.medicalRecord.aiListening}</div>}

                        <div style={styles.pdfFooter}>
                            <div style={styles.signatureArea}>
                                <p>{t.medicalRecord.signature}</p>
                                <div style={styles.signatureLine}>
                                    {t.medicalRecord.doctorLabel}: {t.common.doctor} ({t.common.seal})
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.savedRecordsArea}>
                        <h3 style={styles.recordsTitle}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
                            {t.medicalRecord.recentRecords}
                        </h3>
                        <div style={styles.recordList}>
                            {savedRecords.length === 0 ? (
                                <p style={styles.emptyMsg}>{t.medicalRecord.noSavedRecords}</p>
                            ) : (
                                savedRecords.map(record => (
                                    <div
                                        key={record.id}
                                        style={{
                                            ...styles.recordItem,
                                            borderLeft: selectedRecordId === record.id ? '4px solid var(--primary-color)' : '4px solid transparent',
                                            backgroundColor: selectedRecordId === record.id ? 'var(--primary-light)' : 'var(--card-bg)'
                                        }}
                                        onClick={() => loadRecord(record)}
                                    >
                                        <div style={styles.recordInfo}>
                                            <span style={styles.recordPatient}>{record.patient}</span>
                                            <span style={styles.recordDate}>{record.date}</span>
                                        </div>
                                        <p style={styles.recordPreview}>{record.complaint || t.medicalRecord.noComplaintEntered}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <aside style={styles.sidebar}>
                    <h3 style={styles.sectionTitle}>{t.medicalRecord.pastHistory}</h3>
                    <div style={styles.historyList}>
                        {savedRecords.length === 0 ? (
                            <p style={styles.historyTitle}>{t.medicalRecord.noSavedRecords}</p>
                        ) : (
                            savedRecords.slice(0, 5).map((h, i) => (
                                <div key={i} style={styles.historyItem}>
                                    <span style={styles.historyDate}>{h.date.split(',')[0] || h.date}</span>
                                    <p style={styles.historyTitle}>{h.complaint || t.medicalRecord.noComplaintEntered}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div style={{ ...styles.section, marginTop: '2rem', padding: '1rem' }}>
                        <h3 style={styles.sectionTitle}>{t.medicalRecord.prescription}</h3>
                        <div style={styles.prescriptionBox}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.medicalRecord.noPrescription}</p>
                            <button style={styles.miniBtn}>{t.medicalRecord.addPrescription}</button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: 'var(--bg-color)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', backgroundColor: 'var(--card-bg)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' },
    patientInfo: { display: 'flex', alignItems: 'center', gap: '1rem' },
    avatar: { width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.2rem' },
    patientName: { fontSize: '1.25rem', fontWeight: '700' },
    patientMeta: { fontSize: '0.875rem', color: 'var(--text-muted)' },
    headerActions: { display: 'flex', gap: '1rem' },
    newBtn: { padding: '0.75rem 1.5rem', backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
    saveBtn: { padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)', transition: 'all 0.2s' },
    content: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '2rem', flex: 1 },
    leftColumn: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    editorArea: { display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' },
    pdfHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '1rem', borderBottom: '2px solid var(--primary-color)', marginBottom: '1rem' },
    pdfLogo: { fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-color)' },
    pdfDocInfo: { fontSize: '0.75rem', color: 'var(--text-muted)' },
    soapGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    section: { backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', position: 'relative' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    sectionTitle: { fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' },
    micBtn: { padding: '4px 12px', borderRadius: '20px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s' },
    textarea: { width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.95rem', lineHeight: '1.6', outline: 'none', resize: 'none', fontFamily: 'inherit', backgroundColor: 'transparent', color: 'var(--text-main)' },
    listeningHint: { marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--danger)', fontWeight: '600', textAlign: 'center' },
    pdfFooter: { marginTop: '2rem', paddingTop: '2rem', borderTop: '1px dashed var(--border-color)' },
    signatureArea: { textAlign: 'right' },
    signatureLine: { marginTop: '1rem', fontWeight: '700', fontSize: '1rem' },
    savedRecordsArea: { backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' },
    recordsTitle: { fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)' },
    recordList: { display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' },
    recordItem: { padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s' },
    recordInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' },
    recordPatient: { fontWeight: '700', fontSize: '0.9rem' },
    recordDate: { fontSize: '0.75rem', color: 'var(--text-muted)' },
    recordPreview: { fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    emptyMsg: { textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '2rem 0' },
    sidebar: { backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', height: 'fit-content', border: '1px solid var(--border-color)' },
    historyList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    historyItem: { paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' },
    historyDate: { fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary-color)' },
    historyTitle: { fontSize: '0.875rem', marginTop: '0.25rem' },
    prescriptionBox: { border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '1rem', textAlign: 'center' },
    miniBtn: { marginTop: '0.75rem', padding: '0.5rem 1rem', background: 'none', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' },
};

export default MedicalRecord;
