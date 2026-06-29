import request from 'supertest';
import app from '../../app.js';

describe('POST /register', () => {
  const user = {
    nome: 'João Teste',
    email: 'joao.teste@email.com',
    senha: '123456'
  };

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