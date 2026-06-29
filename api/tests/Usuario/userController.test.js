import { jest } from '@jest/globals';

const mockListUsers = jest.fn();
const mockFindUserById = jest.fn();
const mockFindUserByEmail = jest.fn();
const mockCreateUser = jest.fn();
const mockUpdateUser = jest.fn();
const mockDeleteUser = jest.fn();

jest.unstable_mockModule('../../services/userServices.js', () => ({
  listUsers: mockListUsers,
  findUserById: mockFindUserById,
  findUserByEmail: mockFindUserByEmail,
  createUser: mockCreateUser,
  updateUser: mockUpdateUser,
  deleteUser: mockDeleteUser
}));

const userController = await import('../../controller/userController.js');

const createResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('userController', () => {
  beforeEach(() => {
    mockListUsers.mockReset();
    mockFindUserById.mockReset();
    mockFindUserByEmail.mockReset();
    mockCreateUser.mockReset();
    mockUpdateUser.mockReset();
    mockDeleteUser.mockReset();
  });

  describe('getUsers', () => {
    it('deve listar todos os usuarios', async () => {
      const users = [
        { id: 1, nome: 'Ana', email: 'ana@email.com' },
        { id: 2, nome: 'Bruno', email: 'bruno@email.com' }
      ];
      mockListUsers.mockResolvedValue(users);

      const req = {};
      const res = createResponse();

      await userController.getUsers(req, res);

      expect(mockListUsers).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(users);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve retornar 500 quando ocorrer erro ao listar usuarios', async () => {
      mockListUsers.mockRejectedValue(new Error('erro no banco'));

      const req = {};
      const res = createResponse();

      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getUserById', () => {
    it('deve retornar um usuario encontrado pelo id', async () => {
      const user = { id: 1, nome: 'Ana', email: 'ana@email.com' };
      mockFindUserById.mockResolvedValue(user);

      const req = { params: { id: '1' } };
      const res = createResponse();

      await userController.getUserById(req, res);

      expect(mockFindUserById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('deve retornar 404 quando o usuario nao existir', async () => {
      mockFindUserById.mockResolvedValue(undefined);

      const req = { params: { id: '999' } };
      const res = createResponse();

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });

    it('deve retornar 500 quando ocorrer erro ao buscar usuario', async () => {
      mockFindUserById.mockRejectedValue(new Error('erro no banco'));

      const req = { params: { id: '1' } };
      const res = createResponse();

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('createUser', () => {
    it('deve criar um usuario com dados validos', async () => {
      const body = { nome: 'Ana', email: 'ana@email.com', senha: '123456' };
      const createdUser = { id: 1, nome: 'Ana', email: 'ana@email.com' };
      mockFindUserByEmail.mockResolvedValue(undefined);
      mockCreateUser.mockResolvedValue(createdUser);

      const req = { body };
      const res = createResponse();

      await userController.createUser(req, res);

      expect(mockFindUserByEmail).toHaveBeenCalledWith('ana@email.com');
      expect(mockCreateUser).toHaveBeenCalledWith(body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdUser);
    });

    it('deve retornar 400 quando email nao for informado', async () => {
      const req = { body: { nome: 'Ana', senha: '123456' } };
      const res = createResponse();

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email é obrigatório' });
      expect(mockFindUserByEmail).not.toHaveBeenCalled();
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando senha tiver menos de 6 caracteres', async () => {
      const req = { body: { nome: 'Ana', email: 'ana@email.com', senha: '123' } };
      const res = createResponse();

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Senha deve ter ao menos 6 caracteres' });
      expect(mockFindUserByEmail).not.toHaveBeenCalled();
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando email ja existir', async () => {
      mockFindUserByEmail.mockResolvedValue({ id: 1, email: 'ana@email.com' });

      const req = { body: { nome: 'Ana', email: 'ana@email.com', senha: '123456' } };
      const res = createResponse();

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email já existe' });
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    it('deve retornar 500 quando ocorrer erro ao criar usuario', async () => {
      mockFindUserByEmail.mockResolvedValue(undefined);
      mockCreateUser.mockRejectedValue(new Error('erro no banco'));

      const req = { body: { nome: 'Ana', email: 'ana@email.com', senha: '123456' } };
      const res = createResponse();

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('updateUser', () => {
    it('deve atualizar um usuario com dados validos', async () => {
      const body = { nome: 'Ana Silva', email: 'ana@email.com', senha: '123456' };
      const updatedUser = { id: 1, nome: 'Ana Silva', email: 'ana@email.com' };
      mockFindUserByEmail.mockResolvedValue({ id: 1, email: 'ana@email.com' });
      mockUpdateUser.mockResolvedValue(updatedUser);

      const req = { params: { id: '1' }, body };
      const res = createResponse();

      await userController.updateUser(req, res);

      expect(mockFindUserByEmail).toHaveBeenCalledWith('ana@email.com');
      expect(mockUpdateUser).toHaveBeenCalledWith('1', body);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it('deve permitir atualizar sem enviar senha', async () => {
      const body = { nome: 'Ana Silva', email: 'ana@email.com' };
      const updatedUser = { id: 1, nome: 'Ana Silva', email: 'ana@email.com' };
      mockFindUserByEmail.mockResolvedValue(undefined);
      mockUpdateUser.mockResolvedValue(updatedUser);

      const req = { params: { id: '1' }, body };
      const res = createResponse();

      await userController.updateUser(req, res);

      expect(mockUpdateUser).toHaveBeenCalledWith('1', body);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it('deve retornar 400 quando email nao for informado na atualizacao', async () => {
      const req = { params: { id: '1' }, body: { nome: 'Ana', senha: '123456' } };
      const res = createResponse();

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email é obrigatório' });
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando senha da atualizacao for curta', async () => {
      const req = { params: { id: '1' }, body: { nome: 'Ana', email: 'ana@email.com', senha: '123' } };
      const res = createResponse();

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Senha deve ter ao menos 6 caracteres' });
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando email pertencer a outro usuario', async () => {
      mockFindUserByEmail.mockResolvedValue({ id: 2, email: 'ana@email.com' });

      const req = { params: { id: '1' }, body: { nome: 'Ana', email: 'ana@email.com', senha: '123456' } };
      const res = createResponse();

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email já existe' });
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it('deve retornar 500 quando ocorrer erro ao atualizar usuario', async () => {
      mockFindUserByEmail.mockResolvedValue(undefined);
      mockUpdateUser.mockRejectedValue(new Error('erro no banco'));

      const req = { params: { id: '1' }, body: { nome: 'Ana', email: 'ana@email.com', senha: '123456' } };
      const res = createResponse();

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuario pelo id', async () => {
      mockDeleteUser.mockResolvedValue();

      const req = { params: { id: '1' } };
      const res = createResponse();

      await userController.deleteUser(req, res);

      expect(mockDeleteUser).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuário deletado' });
    });

    it('deve retornar 500 quando ocorrer erro ao deletar usuario', async () => {
      mockDeleteUser.mockRejectedValue(new Error('erro no banco'));

      const req = { params: { id: '1' } };
      const res = createResponse();

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
