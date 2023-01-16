import { ResUser, User, usersDB } from './data/users';
import http from 'http';
import { errorHandlerr } from './error-handler';
import { MessageData, messageHandler, MessageMethod } from './data/database';
import cluster from 'cluster';

const USERS_URL = '/api/users/';
const USERS_URL_SHORT = '/api/users';
enum method {
    get = "GET",
    post = "POST",
    put = "PUT",
    delete = "DELETE"
}

const writeToResponse = (res: http.ServerResponse, data: ResUser) => {
    res.statusCode = data.code;
    if (data.code != 200 && data.code != 201 && data.code != 204) {
        res.statusMessage = data.data as string;
    }
    if (data.code.toString()[0] === '2') {
        res.setHeader('Content-type', 'application/json');
        try {
            res.write(JSON.stringify(data.data));
        } catch {
            errorHandlerr(res);
        }
    } else {
        res.setHeader('Content-type', 'text/plain');
        res.write(data.data);
    }
    res.end();
}

const res404 = (res: http.ServerResponse) => {
    res.statusCode = 404;
    res.statusMessage = 'Failed to load resource: Not Found! :(';
    res.setHeader('Content-type', 'text/plain');
    res.write('Failed to load resource: Not Found! :(');
    res.end();
}

const responseData = (msgData: MessageData, res: http.ServerResponse) => {
    const data = messageHandler(msgData);
    writeToResponse(res, data);
};

export const createServer = async (req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
        res.setHeader('Content-type', 'application/json')
        if (req.method === method.get && (req.url == USERS_URL || req.url == USERS_URL_SHORT)) {
            // get all
            const messageData: MessageData = { method: MessageMethod.getAllUsers, param: null };
            if (cluster.isWorker) {
                process.send(messageData);
            } else {
                responseData(messageData, res);
            }
        } else if (req.method === method.get && req.url?.indexOf(USERS_URL) == 0) {
            // get user
            const id = req.url?.substring(USERS_URL.length);
            if (id.includes('/')) {
                res404(res);
            } else {
                const messageData: MessageData = { method: MessageMethod.getUser, param: id }
                if (cluster.isWorker) {
                    process.send(messageData);
                } else {
                    responseData(messageData, res);
                }
            }
        } else if (req.method === method.post && req.url?.indexOf(USERS_URL) == 0) {
            // create new user
            let body: string = '';
            req.on('data', (chunk) => body += chunk);
            req.on('end', function() {
                try {
                    const messageData: MessageData = { method: MessageMethod.addUser, param: JSON.parse(body) };
                    if (cluster.isWorker) {
                        process.send(messageData);
                    } else {
                        responseData(messageData, res);
                    }
                } catch {
                    const messageData: MessageData = { method: MessageMethod.addUser, param: {} };
                    if (cluster.isWorker) {
                        process.send(messageData);
                    } else {
                        responseData(messageData, res);
                    }
                }
            });
            req.on('error', () => {
                errorHandlerr(res);
            })
        } else if (req.method === method.put && req.url?.indexOf(USERS_URL) == 0) {
            // update user data
            let body: string = '';
            req.on('data', (chunk) => body += chunk);
            req.on('end', function() {
                const id = req.url?.substring(USERS_URL.length);
                if (id.includes('/')) {
                    res404(res);
                } else {
                    try {
                        const user = JSON.parse(body) as Partial<User>;
                        user.id = id;
                        const messageData: MessageData = { method: MessageMethod.updateUser, param: user }
                        if (cluster.isWorker) {
                            process.send(messageData);
                        } else {
                            responseData(messageData, res);
                        }
                    } catch {
                        const messageData: MessageData = { method: MessageMethod.addUser, param: {} };
                        if (cluster.isWorker) {
                            process.send(messageData);
                        } else {
                            responseData(messageData, res);
                        }
                    }
                }
            })
            req.on('error', () => {
                errorHandlerr(res);
            })
        } else if (req.method === method.delete && req.url?.indexOf(USERS_URL) == 0) {
            // delete user
            const id = req.url?.substring(USERS_URL.length);
            if (id.includes('/')) {
                res404(res);
            } else {
                const messageData: MessageData = { method: MessageMethod.deleteUser, param: id }
                if (cluster.isWorker) {
                    process.send(messageData);
                } else {
                    responseData(messageData, res);
                }
            }
        } else {
            res404(res);
        }
    } catch {
        errorHandlerr(res);
    }

    if (cluster.isWorker) {
        const data: ResUser = await new Promise(resolve => {
            process.on('message', (data: ResUser) => {
                resolve(data);
            });
        });
        writeToResponse(res, data);
    }
}