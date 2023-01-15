import { ResUser, User, usersDB } from "./users"

export interface MessageData {
    method: MessageMethod;
    param: string | Array<User> | Partial<User>;
}

export enum MessageMethod {
    getAllUsers = 'getAllUsers',
    getUser = 'getUser',
    addUser = 'addUser',
    updateUser = 'updateUser',
    deleteUser = 'deleteUser',
}

export const messageHandler = (message: MessageData): ResUser => {
    switch (message.method) {
        case MessageMethod.getAllUsers:
            return usersDB.getAllUsers();
        case MessageMethod.getUser:
            return usersDB.getUser(message.param as string);
        case MessageMethod.addUser:
            return usersDB.addUser(message.param as Partial<User>);
        case MessageMethod.updateUser:
            return usersDB.updateUser(message.param as Partial<User>);
        case MessageMethod.deleteUser:
            return usersDB.deleteUser(message.param as string);
    }
}