import cluster, { Worker } from 'cluster';
import http from 'http';
import { cpus } from 'os';
import { server } from "./server";

const port = Number(process.env.PORT);

if (cluster.isPrimary) {
    console.log(`Master is started! CPU-cors cout: ${cpus().length}`);

    let activeWorkerPort = port + 1;
    const workers: Array<Worker> = [];

    for (let i = 0; i < cpus().length; i++) {
        const workerEnv = {};
        workerEnv['port'] = (port + i + 1).toString();
        const runCluster = () => {
            const worker: Worker = cluster.fork(workerEnv);
            workers.push(worker);
        }
        runCluster();
    }

    const mainServer = http.createServer(async (request: http.IncomingMessage, response: http.ServerResponse) => {
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
                response.write(data.join().toString());
                response.end();
            });
        });

        const data: Array<Buffer> = [];
        request.on('data', (chunk: Buffer) => {
            data.push(chunk);
        });

        request.on('end', () => {
            httpRequest.write(data.join().toString());
            httpRequest.end();
        });
        
        activeWorkerPort = (activeWorkerPort < port + cpus().length) ? activeWorkerPort + 1 : port + 1;
    });
    mainServer.listen(port, 'localhost', () => {
        console.log(`Main server listening port ${port}`);
    });

}

if (cluster.isWorker) {
    const workerPort = +process.env['port']
    server.listen(workerPort, 'localhost', () => {
        console.log(`Worker started! Listening port ${workerPort}`);
    });
}
