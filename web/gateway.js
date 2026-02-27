/**
 * WebSocket-to-TCP 桥接网关
 * 
 * 作用：浏览器不能直接连 TCP，所以这个 Node.js 中间层负责：
 *   浏览器 <--WebSocket--> gateway.js <--TCP--> Nginx(8000) --> ChatServer(6004/6006)
 * 
 * 论文价值：这就是论文中提到的 "Node.js Web 管理网关"
 */

const http = require('http');
const WebSocket = require('ws');
const net = require('net');
const fs = require('fs');
const path = require('path');

// ====== 配置 ======
const WEB_PORT = 3000;           // Web 页面端口
const CHAT_SERVER_HOST = '127.0.0.1';
const CHAT_SERVER_PORT = 8000;   // Nginx 负载均衡入口

// ====== HTTP 静态文件服务 ======
const server = http.createServer((req, res) => {
    let filePath;
    if (req.url === '/' || req.url === '/chat') {
        filePath = path.join(__dirname, 'chat.html');
    } else {
        filePath = path.join(__dirname, req.url);
    }

    const ext = path.extname(filePath);
    const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css':  'text/css; charset=utf-8',
        '.js':   'application/javascript; charset=utf-8',
        '.png':  'image/png',
        '.jpg':  'image/jpeg',
        '.svg':  'image/svg+xml',
    };

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        res.end(data);
    });
});

// ====== WebSocket 服务 ======
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('[Gateway] 新的浏览器 WebSocket 连接');

    // 为每个浏览器连接创建一个到 ChatServer 的 TCP 连接
    const tcpSocket = new net.Socket();
    let buffer = '';

    tcpSocket.connect(CHAT_SERVER_PORT, CHAT_SERVER_HOST, () => {
        console.log(`[Gateway] TCP 已连接到 ${CHAT_SERVER_HOST}:${CHAT_SERVER_PORT}`);
        ws.send(JSON.stringify({ type: 'system', msg: '已连接到聊天服务器' }));
    });

    // TCP 收到 ChatServer 的回复 → 转发给浏览器
    tcpSocket.on('data', (data) => {
        // ChatServer 用 \0 分隔 JSON 消息（muduo 的 Buffer 机制）
        buffer += data.toString();
        let nullIdx;
        while ((nullIdx = buffer.indexOf('\0')) !== -1) {
            const jsonStr = buffer.substring(0, nullIdx);
            buffer = buffer.substring(nullIdx + 1);
            if (jsonStr.trim()) {
                try {
                    const parsed = JSON.parse(jsonStr);
                    console.log('[Gateway] ← ChatServer:', JSON.stringify(parsed));
                    ws.send(jsonStr);
                } catch (e) {
                    console.error('[Gateway] JSON 解析失败:', jsonStr);
                }
            }
        }
    });

    tcpSocket.on('error', (err) => {
        console.error('[Gateway] TCP 错误:', err.message);
        ws.send(JSON.stringify({ type: 'system', msg: '服务器连接失败: ' + err.message }));
        ws.close();
    });

    tcpSocket.on('close', () => {
        console.log('[Gateway] TCP 连接关闭');
        ws.send(JSON.stringify({ type: 'system', msg: '服务器连接已断开' }));
        ws.close();
    });

    // 浏览器发来的消息 → 转发到 TCP（ChatServer 期望 JSON + \0 结尾）
    ws.on('message', (message) => {
        const msgStr = message.toString();
        console.log('[Gateway] → ChatServer:', msgStr);
        tcpSocket.write(msgStr + '\0');
    });

    ws.on('close', () => {
        console.log('[Gateway] 浏览器断开');
        tcpSocket.destroy();
    });
});

server.listen(WEB_PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔══════════════════════════════════════╗');
    console.log('║   🌐 聊天室 Web 网关已启动           ║');
    console.log(`║   📍 http://localhost:${WEB_PORT}            ║`);
    console.log(`║   🔗 桥接至 ChatServer ${CHAT_SERVER_HOST}:${CHAT_SERVER_PORT} ║`);
    console.log('╚══════════════════════════════════════╝');
    console.log('');
});
