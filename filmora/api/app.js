import express from "express";
import cors from "cors";
import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} from "./controller/userController.js";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  updateMovie
} from "./controller/movieController.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get("/users", getAllUsers);
app.post("/users", createUser);
app.delete("/users/:id", deleteUser);
app.put("/users/:id", updateUser);

app.get("/movies", getAllMovies);
app.post("/movies", createMovie);
app.delete("/movies/:id", deleteMovie);
app.put("/movies/:id", updateMovie);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando da na porta ${PORT}`);
});
