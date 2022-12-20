/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
        if (!user.username || !user.username.trim() || !user.age) {
            return { code: 400, data: 'Invalid input! Please check input value.' };
        }
        if (!user.hobbies)
            user.hobbies = [];
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
        if (user.username)
            this.users[i].username = user.username;
        if (user.age)
            this.users[i].age = user.age;
        if (user.hobbies)
            this.users[i].hobbies = user.hobbies;
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
        return { code: 200, data: user };
    }
}
exports.Users = Users;
exports.usersDB = new Users();


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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const dotenv = __importStar(__webpack_require__(142));
const users_1 = __webpack_require__(343);
const http_1 = __importDefault(__webpack_require__(685));
dotenv.config();
const port = Number(process.env.PORT);
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
    if (data.code.toString()[0] == '2') {
        res.setHeader('Content-type', 'application/json');
        res.write(JSON.stringify(data.data));
    }
    else {
        res.setHeader('Content-type', 'text/plain');
        res.write(data.data);
    }
    res.end();
};
const server = http_1.default.createServer((req, res) => {
    var _a, _b, _c, _d, _e, _f;
    try {
        console.log('Incoming Connectcion');
        res.setHeader('Content-type', 'application/json');
        if (req.method == method.get && (req.url == USERS_URL || req.url == USERS_URL_SHORT)) {
            // get all
            const resData = users_1.usersDB.getAllUsers();
            writeToResponse(res, resData);
        }
        else if (req.method == method.get && ((_a = req.url) === null || _a === void 0 ? void 0 : _a.indexOf(USERS_URL)) == 0) {
            // get user
            const id = (_b = req.url) === null || _b === void 0 ? void 0 : _b.substring(USERS_URL.length);
            const resData = users_1.usersDB.getUser(id);
            writeToResponse(res, resData);
        }
        else if (req.method == method.post && ((_c = req.url) === null || _c === void 0 ? void 0 : _c.indexOf(USERS_URL)) == 0) {
            // create new user
            let body = '';
            req.on('data', (chunk) => body += chunk);
            req.on('end', function () {
                const resData = users_1.usersDB.addUser(JSON.parse(body));
                writeToResponse(res, resData);
            });
        }
        else if (req.method == method.put && ((_d = req.url) === null || _d === void 0 ? void 0 : _d.indexOf(USERS_URL)) == 0) {
            // update user data
            let body = '';
            req.on('data', (chunk) => body += chunk);
            req.on('end', function () {
                var _a;
                const id = (_a = req.url) === null || _a === void 0 ? void 0 : _a.substring(USERS_URL.length);
                const user = JSON.parse(body);
                user.id = id;
                const resData = users_1.usersDB.updateUser(user);
                writeToResponse(res, resData);
            });
        }
        else if (req.method == method.delete && ((_e = req.url) === null || _e === void 0 ? void 0 : _e.indexOf(USERS_URL)) == 0) {
            // delete user
            const id = (_f = req.url) === null || _f === void 0 ? void 0 : _f.substring(USERS_URL.length);
            const resData = users_1.usersDB.deleteUser(id);
            writeToResponse(res, resData);
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-type', 'text/plain');
            res.write('Failed to load resource: Not Found! :(');
            res.end();
        }
    }
    catch (_g) {
        res.write(JSON.stringify({ code: 500, message: 'Internal Server Error! Sorry... Please try later. :(' }));
        res.end();
    }
});
server.listen(port, 'localhost', () => {
    console.log(`Listening port ${port}`);
});


/***/ }),

/***/ 142:
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ 828:
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ 685:
/***/ ((module) => {

module.exports = require("http");

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
/******/ 	var __webpack_exports__ = __webpack_require__(728);
/******/ 	
/******/ })()
;