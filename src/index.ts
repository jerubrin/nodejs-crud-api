import * as dotenv from 'dotenv';
import http from "http";
import { createServer } from "./server";

dotenv.config()
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || 'localhost';

export const server = http.createServer(createServer);
server.listen(port, host, () => {
    console.log(`Server started! Listening port ${port}`);
});
server.on('connection', socket => console.log(`Incoming Connectcion! Port: ${socket.localPort}`));
