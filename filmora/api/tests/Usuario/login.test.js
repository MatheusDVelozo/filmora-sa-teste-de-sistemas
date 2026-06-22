import request from 'supertest';
import app from '../../app.js';

describe('POST /login', () => {
  beforeAll(async () => {
    await request(app)
      .post('/auth/register')
      .send({
        nome: 'Login User',
        email: 'login@email.com',
        senha: '123456'
      });
  });

  it('deve autenticar usuário válido', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'login@email.com',
        senha: '123456'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('deve retornar erro para credenciais inválidas', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'login@email.com',
        senha: 'senhaErrada'
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Credenciais inválidas'
    });
  });

  it('deve validar campos obrigatórios', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Email e senha são obrigatórios'
    });
  });
});