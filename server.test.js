const request = require('supertest');
const app = require('./server');

let server;

beforeAll(() => {
  server = app.listen(0); // port aléatoire pour les tests
});

afterAll((done) => {
  server.close(done);
});

describe('User API', () => {

  test('GET /api/users retourne tous les utilisateurs', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/users/:id retourne un utilisateur', async () => {
    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
  });

  test('GET /api/users/:id retourne 404 si introuvable', async () => {
    const response = await request(app).get('/api/users/999');
    expect(response.status).toBe(404);
  });

  test('POST /api/users crée un nouvel utilisateur', async () => {
    const newUser = { name: 'Charlie', email: 'charlie@example.com' };
    const response = await request(app)
      .post('/api/users')
      .send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newUser.name);
  });

  test('POST /api/users retourne 400 sans email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Test' });
    expect(response.status).toBe(400);
  });

  test('POST /api/users retourne 400 sans name', async () => {
  const response = await request(app)
    .post('/api/users')
    .send({ email: 'test@example.com' });
  expect(response.status).toBe(400);
  });

  test('GET /health retourne status OK', async () => {
  const response = await request(app).get('/health');
  expect(response.status).toBe(200);
  expect(response.body.status).toBe('OK');
  expect(response.body).toHaveProperty('timestamp');
  });

});