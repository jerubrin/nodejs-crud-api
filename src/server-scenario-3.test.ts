import supertest from 'supertest';
import { User } from './data/users';
import { server } from './index';

const request = supertest(server);
const API_URL = '/api/users/';

describe('3 scenario: check all answers codes.', () => {
  const mockUser: Partial<User> = {
    username: 'User Name',
    age: 10,
    hobbies: []
  };

  const wrongMockUserByName = { username: 10, age: 10, hobbies: [] };
  const wrongMockUserByAge = { username: 'User Name', age: '10', hobbies: [] };
  const wrongMockUserByHobbies = { username: 'User Name', age: '10', hobbies: 1 };
  const wrongMockUserByMissingName = { age: 10, hobbies: [] };
  const wrongMockUserByMissingAge = { username: 'User Name', hobbies: [] };
  const wrongMockUserByMissingHobbies = { username: 'User Name', age: '10' };

  it('GET - get all users - clear (code: 200)', async () => {
    const res = await request.get(API_URL);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(0);
    expect(res.body).toEqual([]);
  });
  
  it('POST - try to add wrong user data (code: 400)', async () => {
    let res = await request.post(API_URL).send(wrongMockUserByName);
    expect(res.statusCode).toEqual(400);
    expect(res.statusMessage).not.toEqual('');

    res = await request.post(API_URL).send(wrongMockUserByAge);
    expect(res.statusCode).toEqual(400);

    res = await request.post(API_URL).send(wrongMockUserByHobbies);
    expect(res.statusCode).toEqual(400);

    res = await request.post(API_URL).send(wrongMockUserByMissingName);
    expect(res.statusCode).toEqual(400);

    res = await request.post(API_URL).send(wrongMockUserByMissingAge);
    expect(res.statusCode).toEqual(400);

    res = await request.post(API_URL).send(wrongMockUserByMissingHobbies);
    expect(res.statusCode).toEqual(400);
  });

  it('POST - try to add correct user data (code: 201)', async () => {
    const res = await request.post(API_URL).send(mockUser);
    expect(res.statusCode).toEqual(201);
    mockUser.id = res.body.id;
    expect(res.body).toEqual(mockUser);
  });

  it('GET - try to take user by wrong id (code: 400)', async () => {
    const res = await request.get(API_URL + 'wrong-id');
    expect(res.statusCode).toEqual(400);
    expect(res.statusMessage).not.toEqual('');
  });

  it('GET - one user by wrong id (code: 404)', async () => {
    const res = await request.get(API_URL + '00000000-0000-0000-0000-000000000000');
    expect(res.statusCode).toEqual(404);
    expect(res.statusMessage).not.toEqual('');
  });

  it('PUT - update user data (code: 200)', async () => {
    mockUser.age = 100;
    const res = await request.put(API_URL + mockUser.id).send(mockUser);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockUser);
  });

  it('PUT - try to send data by wrong id (code: 400)', async () => {
    const res = await request.put(API_URL + 'wrong-id').send(mockUser);
    expect(res.statusCode).toEqual(400);
    expect(res.statusMessage).not.toEqual('');
  });

  it('PUT - try to send data by non-existent id (code: 404)', async () => {
    const res = await request.put(API_URL + '00000000-0000-0000-0000-000000000000').send(mockUser);
    expect(res.statusCode).toEqual(404);
    expect(res.statusMessage).not.toEqual('');
  });

  it('DELETE - successfully delete user by id (code: 204)', async () => {
    const res = await request.delete(API_URL + mockUser.id);
    expect(res.statusCode).toEqual(204);
  })

  it('DELETE - try to remove non-existent user (code: 404)', async () => {
    const res = await request.delete(API_URL + mockUser.id);
    expect(res.statusCode).toEqual(404);
  })

  it('DELETE - try to remove by wrong id (code: 404)', async () => {
    const res = await request.delete(API_URL + 'wrong-id');
    expect(res.statusCode).toEqual(400);
  })

  it('GET - try to take wrong path (code: 404)', async () => {
    let res = await request.get('/wrong/path');
    expect(res.statusCode).toEqual(404);

    res = await request.post('/wrong/path').send();
    expect(res.statusCode).toEqual(404);

    res = await request.put('/wrong/path').send();
    expect(res.statusCode).toEqual(404);

    res = await request.delete('/wrong/path');
    expect(res.statusCode).toEqual(404);
  });
});
