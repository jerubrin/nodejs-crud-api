
# Task CRUD API

This application is a simple test CURD http-client, that was built as part of [RS.School NODE.JS](https://rs.school/nodejs/) course

## First steps:
1. Clone repository to your local machine.
```bash
git clone https://github.com/jerubrin/nodejs-crud-api.git
```

2. Change directory:
```bash
cd nodejs-crud-api
```

3. Change active branch for `develop`:
```bash
git checkout develop
```

4. Instal `npm` dependencies:
```bash
npm install
```

#### If you have a message notification of `vulnerabilities` found, please, update your `npm`:
```bash
npm update npm -g
```

## Start the server:
There is 3 different modes for running http-server:

1. Run in development mode (using `nodemon`):
```bash
npm run start:dev
```
You will receive a message about the successful start of the server and the number of the listening port.

`Server started! Listening port 5050`

After this message this http-server is ready to use.

2. Run in development mode (using `webpack`):
```bash
npm run start:prod
```
You will receive a message about the successful start of the server and the number of the listening port.

`Server started! Listening port 5050`

After this message this http-server is ready to use.

3. Run in production mode (using `webpack`):
```bash
npm run start:multi
```
You will receive a messages about the number of processor cores and about the successful start of the server and the number of the listening port.

`Master is started! CPU-cors cout: __`

`Main server listening port 5050`

Then, you will receive messages about the successful launch of child professions by the number of processor cores:

`Worker started! Listening port 5051`

`Worker started! Listening port 5052`

`...`

After this messages this http-server is ready to use.

## Change server port
If you want to change server port, you need to create `.env` file in the root directory of the project, with the port value (`PORT="YOUR_PORT_NUMBER"`), for example:
```bash
echo 'PORT=5050' > .env
```
**Warning:** After setting a new port number, you must **restart** the application.

## Use the application

To use this application, you need to install a REST client, such as the google chrome browser extension - [Yet Another REST Client](https://chrome.google.com/webstore/detail/yet-another-rest-client/ehafadccdcdedbhcbddihehiodgcddpl?hl=ru)

If you are using **Yet Another REST Client**:
1. Open the extension.
2. Write in the URL field `localhost:{port}/api/users` the port number *(default port: 3000)*
3. Select request method: `GET`, `POST`, `PUT` or `DELETE`
4. Enter the request body in the `Payload:` field (if needed)
5. Click on the `Send Request` button

## Application Features
### Get an array of all users
In response, you will receive a list of all users from the database as an array. Use the following algorithm:
- Send a request to `localhost:{port}/api/users`
- Use `GET` method
-  Submit an inquiry
### Get an one user by id
In response, you will receive one user from the database   
found by id, or get an error. Use the following algorithm:
- Send a request to `localhost:{port}/api/users/{id}`
- Use `GET` method
- Submit an inquiry
### Add new user to database
In response, you will receive the same user from the database with added unique id, or get an error. Use the following algorithm:
- Send a request to `localhost:{port}/api/users`
- Use `POST` method
- Add a JSON object with user data to the request body (JSON object must contain all required fields, see below)
- Submit an inquiry
### Edit user in database by id
In response, you will receive edited user from the database, or get an error. Use the following algorithm:
- Send a request to `localhost:{port}/api/users/{id}`
- Use `PUT` method
- Add a JSON object with user data to the request body
- Submit an inquiry
### Delete user from database by id
In response, you will receive response code 204 in case of successful request, or get an error. Use the following algorithm:
- Send a request to `localhost:{port}/api/users/{id}`
- Use `DELETE` method
- Submit an inquiry
## Required user fields
When creating a user in the request body, these fields must be present in the JSON object:
- `username`  — user's name (`string`)
- `age`  — user's age (`number`)
- `hobbies`  — user's hobbies (`array`  of  `strings`  or empty  `array`)
*For example:*
```JSON
{
  "username": "Alexey Kuptsov",
  "age": 34,
  "hobbies": [
    "coding",
    "music",
    "traveling"
  ]
}
```
## Server Tests
To check the server and the correctness of the responses issued, 3 scenarios are implemented:
1. Adding a user, editing this user by id and deleting this user, with intermediate queries to the database for the аvailability of this user.
2. Adding 2 users one by one, checking their existence in the database and removing them one by one.
3. A scenario is used to test all possible responses from the server.
To run tests, use the command:
```bash
npm test
```
## Contacts
If you encounter any unexpected errors or questions, please write to me:
- [Discord](https://discord.com/users/263367696136142849)
- [Telegram](https://t.me/jerubrin)
- [WhatsApp](https://wa.me/77781415031)
