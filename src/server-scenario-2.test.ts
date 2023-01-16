import supertest from 'supertest';
import { User } from './data/users';
import { server } from './index';

const request = supertest(server);
const API_URL = '/api/users/';

describe('2 scenario: Check CURD http-server with two user', () => {
  const mockUserOne: Partial<User> = {
    username: 'Name One',
    age: 10,
    hobbies: []
  };
  const mockUserTwo: Partial<User> = {
    username: 'Name Two',
    age: 20,
    hobbies: []
  };

  it('GET - get all users', async () => {
    const res = await request.get(API_URL);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  })

  it('POST - add user one', async () => {
    const res = await request.post(API_URL).send(mockUserOne);
    expect(res.statusCode).toEqual(201);
    mockUserOne.id = res.body.id;
    expect(res.body as User).toEqual(mockUserOne);
  })

  it('GET - get all users', async () => {
    const res = await request.get(API_URL);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  it('POST - add user two', async () => {
    const res = await request.post(API_URL).send(mockUserTwo);
    expect(res.statusCode).toEqual(201);
    mockUserTwo.id = res.body.id;
    expect(res.body as User).toEqual(mockUserTwo);
  })

  it('GET - get all users', async () => {
    const res = await request.get(API_URL);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });

  it('GET - get first user by id', async () => {
    const res = await request.get(API_URL + mockUserOne.id);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockUserOne);
  })

  it('GET - get second user by id', async () => {
    const res = await request.get(API_URL + mockUserOne.id);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockUserOne);
  })

  it('DELETE - delete first user by id', async () => {
    const res = await request.delete(API_URL + mockUserOne.id);
    expect(res.statusCode).toEqual(204);
  })

  it('GET - get all users', async () => {
    const res = await request.get(API_URL);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  it('DELETE - delete second user by id', async () => {
    const res = await request.delete(API_URL + mockUserTwo.id);
    expect(res.statusCode).toEqual(204);
  })

  it('GET - get all users', async () => {
    const res = await request.get(API_URL);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(0);
    expect(res.body).toEqual([]);
  });

});
