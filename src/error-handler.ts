import http from 'http';

export const errorHandlerr = (response: http.ServerResponse) => {
    const message = 'Internal Server Error! Sorry... Please try later. :(';
    console.error(message);
    response.setHeader('Content-type', 'text/plain');
    response.statusCode = 500;
    response.statusMessage = message;
    response.write(message);
    response.end();
};
