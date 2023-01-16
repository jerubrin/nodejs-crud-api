import supertest from 'supertest';
import { User } from './data/users';
import { server } from './index';

const request = supertest(server);
const API_URL = '/api/users/';

describe('1 scenario: Check CURD http-server with one user', () => {
  const mockUser: Partial<User> = {
    username: 'Name',
    age: 0,
    hobbies: [
      'hobbie 1',
      'hobbie 2',
    ]
  };
  let id = '';

  it('GET - get all users', async () => {
    const res = await request.get(API_URL);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  })

  it('POST - add new user', async () => {
    const res = await request.post(API_URL).send(mockUser);
    expect(res.statusCode).toEqual(201);
    id = res.body.id;
    mockUser.id = id;
    expect(res.body as User).toEqual(mockUser);
  })

  it('GET - get user by id', async () => {
    const res = await request.get(API_URL + id);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockUser);
  })

  it('PUT - change user name by id', async () => {
    mockUser.username = 'Other Name'
    const res = await request.put(API_URL + id).send(mockUser);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockUser);
  })

  it('DELETE - delete user by id', async () => {
    const res = await request.delete(API_URL + id);
    expect(res.statusCode).toEqual(204);
  })

  it('GET - try to get deleted user by id', async () => {
    const res = await request.get(API_URL + id);
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual('Error: User not found!');
  })

});
