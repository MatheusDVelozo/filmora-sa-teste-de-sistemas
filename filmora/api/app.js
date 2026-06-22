import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import * as userController from './controller/userController.js';
import * as authController from './controller/authController.js';
import * as filmController from './controller/filmController.js';
import { authenticate, isAdmin } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Auth
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);
app.get('/auth/me', authenticate, authController.me);

// Users
app.get('/usuarios', userController.getUsers);
app.get('/usuarios/:id', userController.getUserById);
app.post('/usuarios', userController.createUser);
app.put('/usuarios/:id', userController.updateUser);
app.delete('/usuarios/:id', userController.deleteUser);

// Films
app.get('/filmes', filmController.listFilms);
app.get('/filmes/:id', filmController.getFilm);
app.post('/filmes', authenticate, isAdmin, filmController.createFilm);
app.put('/filmes/:id', authenticate, isAdmin, filmController.updateFilm);
app.delete('/filmes/:id', authenticate, isAdmin, filmController.deleteFilm);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
