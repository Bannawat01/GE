const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws'); // พระเอกของเรา

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// สร้าง HTTP Server ครอบ Express ไว้อีกที
const server = http.createServer(app);

// สร้าง WebSocket Server (wss)
const wss = new WebSocket.Server({ server });

// ตัวแปรเก็บ Socket ของหน้าเว็บที่เชื่อมต่อเข้ามา
let webClient = null;

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    webClient = ws; // จำไว้ว่าใครคือหน้าเว็บ
});

// จุดรับข้อมูลจาก ESP32 (ใช้ HTTP POST เหมือนเดิมเพื่อง่ายต่อการแก้)
app.post('/api/update', (req, res) => {
    const data = req.body;
    console.log('Received:', data);

    // *** หัวใจสำคัญ: พอได้รับปุ๊บ ส่งต่อให้หน้าเว็บทันที! ***
    if (webClient && webClient.readyState === WebSocket.OPEN) {
        webClient.send(JSON.stringify(data));
    }

    res.send('OK');
});

// เปลี่ยนจาก app.listen เป็น server.listen
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});