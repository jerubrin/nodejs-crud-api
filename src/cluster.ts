import * as dotenv from 'dotenv';
import cluster, { Worker } from 'cluster';
import http from 'http';
import { cpus } from 'os';
import { errorHandlerr } from './error-handler';
import { messageHandler } from './data/database';
import { createServer } from './server';

dotenv.config()
const port = Number(process.env.PORT) || 3000;

export let dbWorker: Worker;

if (cluster.isPrimary) {
    console.log(`Master is started! CPU-cors cout: ${cpus().length}`);

    let activeWorkerPort = port + 1;

    // dbWorker = new Worker('./src/data/database.ts');
    const children: Array<Worker> = []

    for (let i = 0; i < cpus().length; i++) {
        const workerEnv = {port: (port + i + 1).toString()};
        const createNewWorker = () => {
            const child = cluster.fork(workerEnv);
            child.on('message', message => {
                child.send(messageHandler(message));
            });
            child.on('exit', (code) => {
                if (code !== 0) {
                    children[i] = createNewWorker();
                }
            });
            return child;
        }
        const child = createNewWorker();
        children.push(child);
    }

    const mainServer = http.createServer(async (request: http.IncomingMessage, response: http.ServerResponse) => {
        try {
            const httpRequest = http.request({
                hostname: 'localhost',
                port: activeWorkerPort,
                path: request.url,
                method: request.method,
                headers: request.headers,
            }, (res) => {
                const data: Array<Buffer> = [];
                res.on('data', (chunk) => {
                    data.push(chunk);
                });
                res.on('end', () => {
                    response.statusCode = res.statusCode
                    if (response.statusCode.toString()[0] === '2') {
                        response.setHeader('Content-type', 'application/json');
                    } else {
                        response.setHeader('Content-type', 'text/plain');
                    }
                    if (res.statusCode != 200) {
                        response.statusMessage = res.statusMessage;
                    }
                    response.write(data.join().toString());
                    response.end();
                });
                res.on('error', () => errorHandlerr(response));
            });

            httpRequest.on('error', () => errorHandlerr(response));

            const data: Array<Buffer> = [];
            request.on('data', (chunk: Buffer) => {
                data.push(chunk);
            });

            request.on('end', () => {
                httpRequest.end(data.join().toString());
            });

            request.on('error', () => errorHandlerr(response));
        } catch {
            errorHandlerr(response)
        }
        
        activeWorkerPort = (activeWorkerPort < port + cpus().length) ? activeWorkerPort + 1 : port + 1;
    });
    mainServer.listen(port, 'localhost', () => {
        console.log(`Main server listening port ${port}`);
    });
}

if (cluster.isWorker) {
    const workerPort = +process.env['port']
    const server = http.createServer(createServer);
    server.listen(workerPort, 'localhost', () => {
        console.log(`Worker started! Listening port ${workerPort}`);
    });
    server.on('connection', socket => console.log(`Incoming Connectcion! Port: ${socket.localPort}`));
}
