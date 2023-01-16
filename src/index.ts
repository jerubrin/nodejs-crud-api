import http from "http";
import { createServer } from "./server";

const port = Number(process.env.PORT) || 3000;

export const server = http.createServer(createServer);
server.listen(port, 'localhost', () => {
    console.log(`Server started! Listening port ${port}`);
});
server.on('connection', socket => console.log(`Incoming Connectcion! Port: ${socket.localPort}`));
