import request from 'supertest';
import app from '../../app.js';

describe('Auth Integration', () => {
  const user = {
    nome: 'João Teste',
    email: 'joao.teste@email.com',
    senha: '123456'
  };

  describe('POST /register', () => {
    it('deve criar um usuário', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(user);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
    });

    it('deve impedir email duplicado', async () => {
      await request(app)
        .post('/auth/register')
        .send(user);

      const response = await request(app)
        .post('/auth/register')
        .send(user);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Email já existe'
      });
    });

    it('deve validar email obrigatório', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          senha: '123456'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Email é obrigatório'
      });
    });

    it('deve validar senha mínima', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'teste@email.com',
          senha: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Senha deve ter ao menos 6 caracteres'
      });
    });
  });

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
      expect(response.body).toHaveProperty('email', 'me@email.com');
    });
  });
});