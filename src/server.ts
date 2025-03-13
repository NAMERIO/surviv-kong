import http from 'http';
import cookie from 'cookie';
import fs from 'fs';
import { Worker } from 'node:worker_threads';
import { Config, Debug, getContentType, log, readJson } from './utils';
import { exec, spawn } from 'child_process';

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url) {
        const path = req.url === '/' ? '/index.html' : req.url;
        let file: Buffer | undefined;

        try {
            if (Debug.disableStaticFileCache) {
                file = fs.readFileSync('public' + path);
            } else {
                file = staticFiles[path];
            }

            if (file === undefined) {
                res.writeHead(404);
                res.end(`<!DOCTYPE html><html lang="en"><body><pre>404 Not Found: ${req.url}</pre></body></html>`);
                return;
            }

            res.setHeader('Content-Type', getContentType(path));
            res.end(file);
        } catch (e) {
            res.writeHead(404);
            res.end(`<!DOCTYPE html><html lang="en"><body><pre>404 Not Found: ${req.url}</pre></body></html>`);
        }
        return;
    }

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            switch (req.url) {
                case '/api/site_info':
                    res.setHeader('Content-Type', 'application/json');
                    res.end(fs.readFileSync('json/site_info.json'));
                    break;

                case '/api/games_modes':
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify([{ mapName: 'main', teamMode: 1 }]));
                    break;

                case '/api/prestige_battle_modes':
                    res.setHeader('Content-Type', 'application/json');
                    res.end(fs.readFileSync('json/prestige_battle_modes.json'));
                    break;

                case '/api/user/get_user_prestige':
                    res.setHeader('Content-Type', 'application/json');
                    res.end('"0"');
                    break;

                case '/api/find_game':
                    try {
                        const data = JSON.parse(body);
                        const region = data?.region as keyof typeof Config.webSocketRegions;
                        const addr: string = Config.useWebSocketDevAddress
                            ? Config.webSocketDevAddress
                            : Config.webSocketRegions[region] ?? Config.webSocketRegions[Config.defaultRegion];
                        
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({
                            res: [{ zone: data.zones[0], gameId: '', useHttps: Config.useHttps, hosts: [addr], addrs: [addr] }]
                        }));
                    } catch (e) {
                        log('/api/find_game: Error retrieving body');
                        res.writeHead(400);
                        res.end();
                    }
                    break;

                case '/api/user/profile':
                    const loadout = readJson('json/profile.json');
                    const cookies = cookie.parse(req.headers.cookie || '');
                    if (cookies.loadout) loadout.loadout = JSON.parse(cookies.loadout);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(loadout));
                    break;

                case '/api/user/loadout':
                    try {
                        const data = JSON.parse(body);
                        res.setHeader('Set-Cookie', cookie.serialize('loadout', JSON.stringify(data.loadout), {
                            path: '/',
                            maxAge: 2147483647
                        }));
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(data));
                    } catch (e) {
                        log('/api/user/loadout: Error retrieving body');
                        res.writeHead(400);
                        res.end();
                    }
                    break;

                case '/api/user/load_exclusive_offers':
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true, data: [] }));
                    break;

                case '/api/user/load_previous_offers':
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true, offers: {} }));
                    break;

                case '/api/user/get_pass':
                    res.setHeader('Content-Type', 'application/json');
                    res.end(fs.readFileSync('json/get_pass.json'));
                    break;

                case '/api/user/unlock':
                case '/api/user/get_user_currency_total':
                case '/api/user/get_market_notifications':
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({}));
                    break;

                default:
                    res.writeHead(404);
                    res.end();
            }
        });
    }
});

const staticFiles: { [key: string]: Buffer } = {};
function walk(dir: string, files: string[] = []): string[] {
    if (dir.includes('.git') || dir.includes('src') || dir.includes('.vscode') || dir.includes('.idea')) return files;
    const dirFiles = fs.readdirSync(dir);
    for (const f of dirFiles) {
        const stat = fs.lstatSync(dir + '/' + f);
        if (stat.isDirectory()) {
            walk(dir + '/' + f, files);
        } else {
            files.push(dir.slice(6) + '/' + f);
        }
    }
    return files;
}
for (const file of walk('public')) {
    staticFiles[file] = fs.readFileSync('public' + file);
}

const shutdownHandler = (): void => {
    log('Shutting down...');
    webSocketProcess.kill('SIGKILL');
    process.exit();
};

process.on('SIGINT', shutdownHandler);
process.on('SIGTERM', shutdownHandler);

// Code to handle the WebSocket server
let lastDataReceivedTime = Date.now() + 30000;
let webSocketProcess;
function spawnWebSocketProcess(): void {
    webSocketProcess = spawn('node', ['--enable-source-maps', 'dist/webSocketServer.js']);
    webSocketProcess.stdout!.on('data', data => {
        lastDataReceivedTime = Date.now();
        process.stdout.write(data);
    });
    webSocketProcess.stderr!.on('data', data => process.stderr.write(data));
}
setInterval(() => {
    if(Date.now() - lastDataReceivedTime > 10000) {
        log("WebSocket process hasn't sent data in more than 10 seconds. Restarting...");
        lastDataReceivedTime = Date.now() + 30000;
        webSocketProcess.kill('SIGKILL');
        setTimeout(() => spawnWebSocketProcess(), 1000);
    }
}, 10000);

// Start the servers
log('Surviv Reloaded v0.6.2');
server.listen(Config.port, Config.host, () => {
    log(`HTTP server listening on ${Config.host}:${Config.port}`);
    log('WebSocket server is starting...');
    spawnWebSocketProcess();
});