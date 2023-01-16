/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 901:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dbWorker = void 0;
const cluster_1 = __importDefault(__webpack_require__(1));
const http_1 = __importDefault(__webpack_require__(685));
const os_1 = __webpack_require__(37);
const error_handler_1 = __webpack_require__(939);
const database_1 = __webpack_require__(422);
const server_1 = __webpack_require__(728);
const port = Number(process.env.PORT) || 3000;
if (cluster_1.default.isPrimary) {
    console.log(`Master is started! CPU-cors cout: ${(0, os_1.cpus)().length}`);
    let activeWorkerPort = port + 1;
    // dbWorker = new Worker('./src/data/database.ts');
    const children = [];
    for (let i = 0; i < (0, os_1.cpus)().length; i++) {
        const workerEnv = { port: (port + i + 1).toString() };
        const createNewWorker = () => {
            const child = cluster_1.default.fork(workerEnv);
            child.on('message', message => {
                child.send((0, database_1.messageHandler)(message));
            });
            child.on('exit', (code) => {
                if (code !== 0) {
                    children[i] = createNewWorker();
                }
            });
            return child;
        };
        const child = createNewWorker();
        children.push(child);
    }
    const mainServer = http_1.default.createServer((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const httpRequest = http_1.default.request({
                hostname: 'localhost',
                port: activeWorkerPort,
                path: request.url,
                method: request.method,
                headers: request.headers,
            }, (res) => {
                const data = [];
                res.on('data', (chunk) => {
                    data.push(chunk);
                });
                res.on('end', () => {
                    response.statusCode = res.statusCode;
                    if (response.statusCode.toString()[0] === '2') {
                        response.setHeader('Content-type', 'application/json');
                    }
                    else {
                        response.setHeader('Content-type', 'text/plain');
                    }
                    if (res.statusCode != 200) {
                        response.statusMessage = res.statusMessage;
                    }
                    response.write(data.join().toString());
                    response.end();
                });
                res.on('error', () => (0, error_handler_1.errorHandlerr)(response));
            });
            httpRequest.on('error', () => (0, error_handler_1.errorHandlerr)(response));
            const data = [];
            request.on('data', (chunk) => {
                data.push(chunk);
            });
            request.on('end', () => {
                httpRequest.end(data.join().toString());
            });
            request.on('error', () => (0, error_handler_1.errorHandlerr)(response));
        }
        catch (_a) {
            (0, error_handler_1.errorHandlerr)(response);
        }
        activeWorkerPort = (activeWorkerPort < port + (0, os_1.cpus)().length) ? activeWorkerPort + 1 : port + 1;
    }));
    mainServer.listen(port, 'localhost', () => {
        console.log(`Main server listening port ${port}`);
    });
}
if (cluster_1.default.isWorker) {
    const workerPort = +process.env['port'];
    const server = http_1.default.createServer(server_1.createServer);
    server.listen(workerPort, 'localhost', () => {
        console.log(`Worker started! Listening port ${workerPort}`);
    });
    server.on('connection', socket => console.log(`Incoming Connectcion! Port: ${socket.localPort}`));
}


/***/ }),

/***/ 422:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.messageHandler = exports.MessageMethod = void 0;
const users_1 = __webpack_require__(343);
var MessageMethod;
(function (MessageMethod) {
    MessageMethod["getAllUsers"] = "getAllUsers";
    MessageMethod["getUser"] = "getUser";
    MessageMethod["addUser"] = "addUser";
    MessageMethod["updateUser"] = "updateUser";
    MessageMethod["deleteUser"] = "deleteUser";
})(MessageMethod = exports.MessageMethod || (exports.MessageMethod = {}));
const messageHandler = (message) => {
    switch (message.method) {
        case MessageMethod.getAllUsers:
            return users_1.usersDB.getAllUsers();
        case MessageMethod.getUser:
            return users_1.usersDB.getUser(message.param);
        case MessageMethod.addUser:
            return users_1.usersDB.addUser(message.param);
        case MessageMethod.updateUser:
            return users_1.usersDB.updateUser(message.param);
        case MessageMethod.deleteUser:
            return users_1.usersDB.deleteUser(message.param);
    }
};
exports.messageHandler = messageHandler;


/***/ }),

/***/ 343:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.usersDB = exports.Users = void 0;
const uuid_1 = __webpack_require__(828);
const uuid_2 = __webpack_require__(828);
class Users {
    constructor() {
        this.users = [];
    }
    getAllUsers() {
        return {
            code: 200,
            data: this.users
        };
    }
    getUser(id) {
        if (!(0, uuid_2.validate)(id)) {
            return { code: 400, data: 'Invalid ID! Please check input value.' };
        }
        const user = this.users.find(user => user.id == id);
        if (!user)
            return { code: 404, data: 'Error: User not found!' };
        return { code: 200, data: user };
    }
    addUser(user) {
        user.id = (0, uuid_1.v4)();
        const isCorrectArr = ((user.hobbies instanceof Array) && user.hobbies.length > 0)
            ? user.hobbies.every(hobbie => typeof hobbie === 'string')
            : user.hobbies instanceof Array;
        if (!(typeof user.username === 'string')
            || !user.username.trim()
            || !(typeof user.age === 'number')
            || !isCorrectArr) {
            return { code: 400, data: 'Invalid input! Please check input value.' };
        }
        this.users.push(user);
        return { code: 201, data: user };
    }
    updateUser(user) {
        if (!user.id || !(0, uuid_2.validate)(user.id)) {
            return { code: 400, data: 'Invalid ID! Please check input value.' };
        }
        const i = this.users.findIndex(_user => _user.id == user.id);
        if (i < 0)
            return { code: 404, data: 'Error: User not found!' };
        if (typeof user.username == 'string')
            this.users[i].username = user.username;
        if (typeof user.age == 'number')
            this.users[i].age = user.age;
        if (user.hobbies instanceof Array) {
            user.hobbies.forEach(hobbie => {
                if (!user.hobbies.includes(hobbie))
                    this.users[i].hobbies.push(hobbie);
            });
        }
        return { code: 200, data: this.users[i] };
    }
    deleteUser(id) {
        if (!(0, uuid_2.validate)(id)) {
            return { code: 400, data: 'Invalid ID! Please check input value.' };
        }
        const i = this.users.findIndex(user => user.id == id);
        if (i < 0)
            return { code: 404, data: 'Error: User not found!' };
        const user = this.users[i];
        this.users.splice(i, 1);
        return { code: 204, data: user };
    }
}
exports.Users = Users;
exports.usersDB = new Users();


/***/ }),

/***/ 939:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.errorHandlerr = void 0;
const errorHandlerr = (response) => {
    response.statusCode = 500;
    const message = 'Internal Server Error! Sorry... Please try later. :(';
    response.statusMessage = message;
    response.write(message);
    console.error(message);
    response.end();
};
exports.errorHandlerr = errorHandlerr;


/***/ }),

/***/ 728:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createServer = void 0;
const dotenv = __importStar(__webpack_require__(142));
const error_handler_1 = __webpack_require__(939);
const database_1 = __webpack_require__(422);
const cluster_1 = __importDefault(__webpack_require__(1));
dotenv.config();
const USERS_URL = '/api/users/';
const USERS_URL_SHORT = '/api/users';
var method;
(function (method) {
    method["get"] = "GET";
    method["post"] = "POST";
    method["put"] = "PUT";
    method["delete"] = "DELETE";
})(method || (method = {}));
const writeToResponse = (res, data) => {
    res.statusCode = data.code;
    if (data.code != 200 && data.code != 201 && data.code != 204) {
        res.statusMessage = data.data;
    }
    if (data.code.toString()[0] === '2') {
        res.setHeader('Content-type', 'application/json');
        try {
            res.write(JSON.stringify(data.data));
        }
        catch (_a) {
            (0, error_handler_1.errorHandlerr)(res);
        }
    }
    else {
        res.setHeader('Content-type', 'text/plain');
        res.write(data.data);
    }
    res.end();
};
const res404 = (res) => {
    res.statusCode = 404;
    res.statusMessage = 'Failed to load resource: Not Found! :(';
    res.setHeader('Content-type', 'text/plain');
    res.write('Failed to load resource: Not Found! :(');
    res.end();
};
const responseData = (msgData, res) => {
    const data = (0, database_1.messageHandler)(msgData);
    writeToResponse(res, data);
};
const createServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        res.setHeader('Content-type', 'application/json');
        if (req.method === method.get && (req.url == USERS_URL || req.url == USERS_URL_SHORT)) {
            // get all
            const messageData = { method: database_1.MessageMethod.getAllUsers, param: null };
            if (cluster_1.default.isWorker) {
                process.send(messageData);
            }
            else {
                responseData(messageData, res);
            }
        }
        else if (req.method === method.get && ((_a = req.url) === null || _a === void 0 ? void 0 : _a.indexOf(USERS_URL)) == 0) {
            // get user
            const id = (_b = req.url) === null || _b === void 0 ? void 0 : _b.substring(USERS_URL.length);
            if (id.includes('/')) {
                res404(res);
            }
            else {
                const messageData = { method: database_1.MessageMethod.getUser, param: id };
                if (cluster_1.default.isWorker) {
                    process.send(messageData);
                }
                else {
                    responseData(messageData, res);
                }
            }
        }
        else if (req.method === method.post && ((_c = req.url) === null || _c === void 0 ? void 0 : _c.indexOf(USERS_URL)) == 0) {
            // create new user
            let body = '';
            req.on('data', (chunk) => body += chunk);
            req.on('end', function () {
                try {
                    const messageData = { method: database_1.MessageMethod.addUser, param: JSON.parse(body) };
                    if (cluster_1.default.isWorker) {
                        process.send(messageData);
                    }
                    else {
                        responseData(messageData, res);
                    }
                }
                catch (_a) {
                    (0, error_handler_1.errorHandlerr)(res);
                }
            });
            req.on('error', () => {
                (0, error_handler_1.errorHandlerr)(res);
            });
        }
        else if (req.method === method.put && ((_d = req.url) === null || _d === void 0 ? void 0 : _d.indexOf(USERS_URL)) == 0) {
            // update user data
            let body = '';
            req.on('data', (chunk) => body += chunk);
            req.on('end', function () {
                var _a;
                const id = (_a = req.url) === null || _a === void 0 ? void 0 : _a.substring(USERS_URL.length);
                if (id.includes('/')) {
                    res404(res);
                }
                else {
                    try {
                        const user = JSON.parse(body);
                        user.id = id;
                        const messageData = { method: database_1.MessageMethod.updateUser, param: user };
                        if (cluster_1.default.isWorker) {
                            process.send(messageData);
                        }
                        else {
                            responseData(messageData, res);
                        }
                    }
                    catch (_b) {
                        (0, error_handler_1.errorHandlerr)(res);
                    }
                }
            });
            req.on('error', () => {
                (0, error_handler_1.errorHandlerr)(res);
            });
        }
        else if (req.method === method.delete && ((_e = req.url) === null || _e === void 0 ? void 0 : _e.indexOf(USERS_URL)) == 0) {
            // delete user
            const id = (_f = req.url) === null || _f === void 0 ? void 0 : _f.substring(USERS_URL.length);
            if (id.includes('/')) {
                res404(res);
            }
            else {
                const messageData = { method: database_1.MessageMethod.deleteUser, param: id };
                if (cluster_1.default.isWorker) {
                    process.send(messageData);
                }
                else {
                    responseData(messageData, res);
                }
            }
        }
        else {
            res404(res);
        }
    }
    catch (_g) {
        if (cluster_1.default.isWorker) {
            process.send({ method: 'error' });
        }
        (0, error_handler_1.errorHandlerr)(res);
    }
    if (cluster_1.default.isWorker) {
        const data = yield new Promise(resolve => {
            process.on('message', (data) => {
                resolve(data);
            });
        });
        writeToResponse(res, data);
    }
});
exports.createServer = createServer;


/***/ }),

/***/ 142:
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ 828:
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ 1:
/***/ ((module) => {

module.exports = require("cluster");

/***/ }),

/***/ 685:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 37:
/***/ ((module) => {

module.exports = require("os");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(901);
/******/ 	
/******/ })()
;