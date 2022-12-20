import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';

export class Users {
  users: Array<User> = [];

  public getAllUsers(): ResUser {
    return {
      code: 200,
      data: this.users
    };
  }

  public getUser(id: string): ResUser {
    if (!uuidValidate(id)) {
      return { code: 400, data: 'Invalid ID! Please check input value.' }
    }
    const user = this.users.find(user => user.id == id);
    if (!user) return { code: 404, data: 'Error: User not found!' }
    return { code: 200, data: user }
  }

  public addUser(user: Partial<User>): ResUser {
    user.id = uuidv4();
    if ( !user.username || !user.username.trim() || !user.age ) {
      return { code: 400, data: 'Invalid input! Please check input value.' };
    }
    if (!user.hobbies) user.hobbies = [];
    this.users.push(user as User);
    return { code: 201, data: user as User };
  }

  public updateUser(user: Partial<User>): ResUser {
    if (!user.id || !uuidValidate(user.id)) {
      return { code: 400, data: 'Invalid ID! Please check input value.' }
    }
    const i = this.users.findIndex(_user => _user.id == user.id);
    if (i < 0) return { code: 404, data: 'Error: User not found!' };
    if (user.username) this.users[i].username = user.username;
    if (user.age) this.users[i].age = user.age;
    if (user.hobbies) this.users[i].hobbies = user.hobbies;
    return { code: 200, data: this.users[i] };
  }

  public deleteUser(id: string): ResUser {
    if (!uuidValidate(id)) {
      return { code: 400, data: 'Invalid ID! Please check input value.' }
    }
    const i = this.users.findIndex(user => user.id == id);
    if (i < 0) return { code: 404, data: 'Error: User not found!' }
    const user = this.users[i];
    this.users.splice(i, 1);
    return { code: 200, data: user }
  }

}

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: Array<string>;
}

export interface ResUser {
  code: number;
  data: User | Array<User> | string;
}

export const usersDB = new Users();