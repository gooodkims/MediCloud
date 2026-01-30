import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Multi-part form data를 처리하기 위한 multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const patientId = req.body.patientId || 'UNKNOWN';
        const dir = path.join(__dirname, 'records', patientId);

        // 폴더가 없으면 생성
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // 클라이언트에서 보낸 파일명을 그대로 사용하거나, 여기서 다시 구성
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.post('/api/save-record', upload.single('pdf'), (req, res) => {
    try {
        console.log(`[File Saved] Patient ID: ${req.body.patientId}, File: ${req.file.filename}`);
        res.status(200).json({
            success: true,
            message: '기록이 성공적으로 서버에 저장되었습니다.',
            path: req.file.path
        });
    } catch (error) {
        console.error('Save failed:', error);
        res.status(500).json({ success: false, message: '서버 저장 중 오류 발생' });
    }
});

app.listen(port, () => {
    console.log(`MediCloud Backend running at http://localhost:${port}`);
});
