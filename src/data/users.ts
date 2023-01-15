import { copyFileSync } from 'fs';
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

    const isCorrectArr = ((user.hobbies instanceof Array) && user.hobbies.length > 0) 
      ? user.hobbies.every(hobbie => typeof hobbie === 'string' ) 
      : user.hobbies instanceof Array;

    if ( !(typeof user.username === 'string')
      || !user.username.trim()
      || !(typeof user.age === 'number')
      || !isCorrectArr)
    {
      return { code: 400, data: 'Invalid input! Please check input value.' };
    }
    this.users.push(user as User);
    return { code: 201, data: user as User };
  }

  public updateUser(user: Partial<User>): ResUser {
    if (!user.id || !uuidValidate(user.id)) {
      return { code: 400, data: 'Invalid ID! Please check input value.' }
    }
    const i = this.users.findIndex(_user => _user.id == user.id);
    if (i < 0) return { code: 404, data: 'Error: User not found!' };
    if (typeof user.username == 'string') this.users[i].username = user.username;
    if (typeof user.age == 'number') this.users[i].age = user.age;
    if (user.hobbies instanceof Array) {
      user.hobbies.forEach(hobbie => {
        if (!user.hobbies.includes(hobbie)) this.users[i].hobbies.push(hobbie);
      });
    }
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
    return { code: 204, data: user }
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
