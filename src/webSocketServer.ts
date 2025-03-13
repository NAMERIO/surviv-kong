import WebSocket from 'ws';
import http from 'http';
import cookie from 'cookie';
import { Game } from './game/game.js';
import { Config, log, MsgType, SurvivBitStream } from './utils';
import { InputPacket } from './packets/receiving/inputPacket';
import { EmotePacket } from './packets/receiving/emotePacket';
import { JoinPacket } from './packets/receiving/joinPacket';
import { DropItemPacket } from './packets/receiving/dropItemPacket';
import { SpectatePacket } from './packets/receiving/spectatePacket';

let game = new Game();

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(302, {
            'Location': 'http://127.0.0.1:8000/'
        });
        res.end();
        return;
    }
});

const wss = new WebSocket.Server({ 
    server,
    perMessageDeflate: false,
    maxPayload: 64 * 1024 
});

const playerCounts: { [key: string]: number } = {};
let connectionAttempts: { [key: string]: number } = {};
const bannedIPs: string[] = [];

wss.on('connection', (socket: WebSocket, req: http.IncomingMessage) => {
    if (game.over) game = new Game();

    const ip = (req.headers['cf-connecting-ip'] as string) || (req.socket?.remoteAddress ?? '127.0.0.1');

    if (Config.botProtection) {
        if (bannedIPs.includes(ip) || (playerCounts[ip] ?? 0) >= 5 || (connectionAttempts[ip] ?? 0) >= 40) {
            if (!bannedIPs.includes(ip)) bannedIPs.push(ip);
            socket.close();
            log(`Connection blocked: ${ip}`);
            return;
        }

        playerCounts[ip] = (playerCounts[ip] ?? 0) + 1;
        connectionAttempts[ip] = (connectionAttempts[ip] ?? 0) + 1;

        log(`${playerCounts[ip]} simultaneous connections: ${ip}`);
        log(`${connectionAttempts[ip]} connection attempts in the last 30 seconds: ${ip}`);
    }
    const cookies = cookie.parse(req.headers.cookie || '');
    (socket as any).cookies = cookies;
    (socket as any).ip = ip;
    socket.binaryType = 'arraybuffer';
    let playerName = cookies['player-name'];
    if (!playerName || playerName.length > 16) playerName = 'Player';
    (socket as any).player = game.addPlayer(socket, playerName, cookies.loadout ? JSON.parse(cookies.loadout) : null);
    log(`${(socket as any).player.name} joined the game`);
    socket.on('message', (message: Buffer) => {
        if (!message || message.length === 0) return;
        
        try {
            const stream = new SurvivBitStream(message);
            const msgType = stream.readUint8();

            if (msgType === undefined || msgType < 0 || msgType > 255) {
                console.warn('Invalid message type:', msgType);
                return;
            }

            switch (msgType) {
                case MsgType.Input:
                    new InputPacket((socket as any).player).deserialize(stream);
                    break;
                case MsgType.DropItem:
                    new DropItemPacket((socket as any).player).deserialize(stream);
                    break;
                case MsgType.Emote:
                    new EmotePacket((socket as any).player).deserialize(stream);
                    break;
                case MsgType.Join:
                    new JoinPacket((socket as any).player).deserialize(stream);
                    break;
                case MsgType.Spectate:
                    new SpectatePacket((socket as any).player).deserialize(stream);
                    break;
                default:
                    console.warn('Unknown message type:', msgType);
            }
        } catch (e) {
            console.warn('Error parsing message:', e);
        }
    });
    socket.on('close', () => {
        if (Config.botProtection) playerCounts[ip]--;
        log(`${(socket as any).player.name} left the game`);
        game.removePlayer((socket as any).player);
    });
    socket.on('error', (error) => {
        console.warn('WebSocket error:', error);
        try {
            socket.close();
        } catch (e) {
            console.warn('Error closing socket:', e);
        }
    });
});
server.listen(Config.webSocketPort, Config.webSocketHost, () => {
    log(`WebSocket server listening on ${Config.webSocketHost}:${Config.webSocketPort}`);
    log('Press Ctrl+C to exit.');
});
if (Config.botProtection) {
    setInterval(() => {
        connectionAttempts = {};
    }, 30000);
}
process.on('SIGINT', () => {
    log('WebSocket server shutting down...');
    game.end();
    process.exit();
});
process.on('SIGTERM', () => {
    log('WebSocket server shutting down...');
    game.end();
    process.exit();
});