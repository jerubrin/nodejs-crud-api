import * as dotenv from 'dotenv';
import { ResUser, User, usersDB } from './data/users';
import http from 'http';

dotenv.config()
const port = Number(process.env.PORT);
const USERS_URL = '/api/users/';
const USERS_URL_SHORT = '/api/users';
enum method {
  get = "GET",
  post = "POST",
  put = "PUT",
  delete = "DELETE"
}

const writeToResponse = (res: http.ServerResponse<http.IncomingMessage>, data: ResUser) => {
  res.statusCode = data.code;
  if (data.code.toString()[0] == '2') {
    res.setHeader('Content-type', 'application/json');
    res.write(JSON.stringify(data.data));
  } else {
    res.setHeader('Content-type', 'text/plain');
    res.write(data.data);
  }
  res.end();
}

const server = http.createServer((req, res) => {
  try {
    console.log('Incoming Connectcion');
    
    res.setHeader('Content-type', 'application/json')
    if (req.method == method.get && (req.url == USERS_URL || req.url == USERS_URL_SHORT)) {
      // get all
      const resData = usersDB.getAllUsers();
      writeToResponse(res, resData);
    } else if (req.method == method.get && req.url?.indexOf(USERS_URL) == 0) {
      // get user
      const id = req.url?.substring(USERS_URL.length);
      const resData = usersDB.getUser(id);
      writeToResponse(res, resData);
    } else if (req.method == method.post && req.url?.indexOf(USERS_URL) == 0) {
      // create new user
      let body: string = ''
      req.on('data', (chunk) => body += chunk)
      req.on('end', function() {
        const resData = usersDB.addUser(JSON.parse(body));
        writeToResponse(res, resData);
      })
    } else if (req.method == method.put && req.url?.indexOf(USERS_URL) == 0) {
      // update user data
      let body: string = ''
      req.on('data', (chunk) => body += chunk)
      req.on('end', function() {
        const id = req.url?.substring(USERS_URL.length);
        const user = JSON.parse(body) as Partial<User>;
        user.id = id;
        const resData = usersDB.updateUser(user);
        writeToResponse(res, resData);
      })
    } else if (req.method == method.delete && req.url?.indexOf(USERS_URL) == 0) {
      // delete user
      const id = req.url?.substring(USERS_URL.length);
      const resData = usersDB.deleteUser(id);
      writeToResponse(res, resData);
    } else {
      res.statusCode = 404;
      res.setHeader('Content-type', 'text/plain');
      res.write('Failed to load resource: Not Found! :(');
      res.end();
    }
  } catch {
    res.write(JSON.stringify({code: 500, message: 'Internal Server Error! Sorry... Please try later. :('}));
    res.end();
  }
});

server.listen(port, 'localhost', () => {
  console.log(`Listening port ${port}`);
})