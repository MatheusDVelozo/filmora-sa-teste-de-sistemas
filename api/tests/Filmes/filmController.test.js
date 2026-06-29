import { jest } from '@jest/globals';

const mockListFilms = jest.fn();
const mockGetFilmById = jest.fn();
const mockValidateFilm = jest.fn();
const mockCreateFilm = jest.fn();
const mockUpdateFilm = jest.fn();
const mockDeleteFilm = jest.fn();

jest.unstable_mockModule('../../services/filmServices.js', () => ({
  listFilms: mockListFilms,
  getFilmById: mockGetFilmById,
  validateFilm: mockValidateFilm,
  createFilm: mockCreateFilm,
  updateFilm: mockUpdateFilm,
  deleteFilm: mockDeleteFilm
}));

const filmController = await import('../../controller/filmController.js');

const createResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('filmController', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    mockListFilms.mockReset();
    mockGetFilmById.mockReset();
    mockValidateFilm.mockReset();
    mockCreateFilm.mockReset();
    mockUpdateFilm.mockReset();
    mockDeleteFilm.mockReset();
  });

  describe('listFilms', () => {
    it('deve listar todos os filmes sem filtro de busca', async () => {
      const films = [
        { id: 1, titulo: 'Matrix', ano: 1999 },
        { id: 2, titulo: 'Interestelar', ano: 2014 }
      ];
      mockListFilms.mockResolvedValue(films);

      const req = { query: {} };
      const res = createResponse();

      await filmController.listFilms(req, res);

      expect(mockListFilms).toHaveBeenCalledWith(undefined);
      expect(res.json).toHaveBeenCalledWith(films);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve repassar o termo de busca para o service', async () => {
      const films = [{ id: 1, titulo: 'Matrix', ano: 1999 }];
      mockListFilms.mockResolvedValue(films);

      const req = { query: { search: 'matrix' } };
      const res = createResponse();

      await filmController.listFilms(req, res);

      expect(mockListFilms).toHaveBeenCalledWith('matrix');
      expect(res.json).toHaveBeenCalledWith(films);
    });

    it('deve retornar 500 quando ocorrer erro ao listar', async () => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      mockListFilms.mockRejectedValue(new Error('erro no banco'));

      const req = { query: {} };
      const res = createResponse();

      await filmController.listFilms(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      console.log.mockRestore();
    });
  });

  describe('getFilm', () => {
    it('deve retornar um filme encontrado pelo id', async () => {
      const film = { id: 1, titulo: 'Matrix', ano: 1999 };
      mockGetFilmById.mockResolvedValue(film);

      const req = { params: { id: '1' } };
      const res = createResponse();

      await filmController.getFilm(req, res);

      expect(mockGetFilmById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(film);
    });

    it('deve retornar 404 quando o filme nao existir', async () => {
      mockGetFilmById.mockResolvedValue(undefined);

      const req = { params: { id: '999' } };
      const res = createResponse();

      await filmController.getFilm(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Filme não encontrado' });
    });

    it('deve retornar 500 quando ocorrer erro ao buscar', async () => {
      mockGetFilmById.mockRejectedValue(new Error('erro no banco'));

      const req = { params: { id: '1' } };
      const res = createResponse();

      await filmController.getFilm(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('createFilm', () => {
    it('deve validar e criar um filme para o usuario autenticado', async () => {
      const body = { titulo: 'Matrix', ano: 1999 };
      const createdFilm = { id: 1, ...body, usuario_id: 10 };
      mockCreateFilm.mockResolvedValue(createdFilm);

      const req = { body, user: { id: 10 } };
      const res = createResponse();

      await filmController.createFilm(req, res);

      expect(mockValidateFilm).toHaveBeenCalledWith(body);
      expect(mockCreateFilm).toHaveBeenCalledWith(body, 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdFilm);
    });

    it('deve retornar o status do erro quando o service informar status', async () => {
      const error = { status: 403, message: 'Sem permissão' };
      mockValidateFilm.mockImplementation(() => {
        throw error;
      });

      const req = { body: { titulo: 'Matrix', ano: 1999 }, user: { id: 10 } };
      const res = createResponse();

      await filmController.createFilm(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Sem permissão' });
      expect(mockCreateFilm).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando os dados forem invalidos', async () => {
      mockValidateFilm.mockImplementation(() => {
        throw new Error('Ano inválido');
      });

      const req = { body: { titulo: 'Matrix', ano: 1800 }, user: { id: 10 } };
      const res = createResponse();

      await filmController.createFilm(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Ano inválido' });
      expect(mockCreateFilm).not.toHaveBeenCalled();
    });
  });

  describe('updateFilm', () => {
    it('deve validar e atualizar um filme do usuario autenticado', async () => {
      const body = { titulo: 'Matrix Reloaded', ano: 2003 };
      const updatedFilm = { id: 1, ...body, usuario_id: 10 };
      mockUpdateFilm.mockResolvedValue(updatedFilm);

      const req = { params: { id: '1' }, body, user: { id: 10 } };
      const res = createResponse();

      await filmController.updateFilm(req, res);

      expect(mockValidateFilm).toHaveBeenCalledWith(body);
      expect(mockUpdateFilm).toHaveBeenCalledWith('1', body, 10);
      expect(res.json).toHaveBeenCalledWith(updatedFilm);
    });

    it('deve retornar o status do erro quando o filme nao puder ser atualizado', async () => {
      const error = { status: 404, message: 'Filme não encontrado' };
      mockUpdateFilm.mockRejectedValue(error);

      const req = { params: { id: '999' }, body: { titulo: 'Matrix', ano: 1999 }, user: { id: 10 } };
      const res = createResponse();

      await filmController.updateFilm(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Filme não encontrado' });
    });

    it('deve retornar 400 quando a validacao falhar', async () => {
      mockValidateFilm.mockImplementation(() => {
        throw new Error('Título é obrigatório');
      });

      const req = { params: { id: '1' }, body: { titulo: '', ano: 1999 }, user: { id: 10 } };
      const res = createResponse();

      await filmController.updateFilm(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Título é obrigatório' });
      expect(mockUpdateFilm).not.toHaveBeenCalled();
    });
  });

  describe('deleteFilm', () => {
    it('deve deletar um filme do usuario autenticado', async () => {
      mockDeleteFilm.mockResolvedValue();

      const req = { params: { id: '1' }, user: { id: 10 } };
      const res = createResponse();

      await filmController.deleteFilm(req, res);

      expect(mockDeleteFilm).toHaveBeenCalledWith('1', 10);
      expect(res.json).toHaveBeenCalledWith({ message: 'Filme deletado' });
    });

    it('deve retornar o status do erro quando o service informar status', async () => {
      const error = { status: 403, message: 'Sem permissão' };
      mockDeleteFilm.mockRejectedValue(error);

      const req = { params: { id: '1' }, user: { id: 20 } };
      const res = createResponse();

      await filmController.deleteFilm(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Sem permissão' });
    });

    it('deve retornar 500 quando ocorrer erro inesperado ao deletar', async () => {
      mockDeleteFilm.mockRejectedValue(new Error('erro no banco'));

      const req = { params: { id: '1' }, user: { id: 10 } };
      const res = createResponse();

      await filmController.deleteFilm(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
