import request from 'supertest';
import app from '../../app.js';

describe('GET /me', () => {
  let token;

  beforeAll(async () => {
    await request(app)
      .post('/auth/register')
      .send({
        nome: 'User Me',
        email: 'me@email.com',
        senha: '123456'
      });

    const login = await request(app)
      .post('/auth/login')
      .send({
        email: 'me@email.com',
        senha: '123456'
      });

    token = login.body.token;
  });

  it('deve retornar usuário autenticado', async () => {
    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'email',
      'me@email.com'
    );
  });

  it('deve impedir acesso sem token', async () => {
    const response = await request(app)
      .get('/auth/me');

    expect(response.status).toBe(401);
  });

  it('deve impedir acesso com token inválido', async () => {
    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', 'Bearer token_invalido');

    expect(response.status).toBe(401);
  });
});