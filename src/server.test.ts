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
