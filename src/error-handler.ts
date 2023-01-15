import http from 'http';

export const errorHandlerr = (response: http.ServerResponse) => {
    response.statusCode = 500
    const message = 'Internal Server Error! Sorry... Please try later. :('
    response.statusMessage = message
    response.write(message);
    console.error(message);
    response.end();
};
