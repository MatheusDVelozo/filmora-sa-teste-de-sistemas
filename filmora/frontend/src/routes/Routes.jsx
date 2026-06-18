import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import MovieDetails from '../pages/MovieDetails';
import MovieForm from '../pages/MovieForm';
import Layout from '../layouts/Layout';
// falta implementar ProtectedRoute e AdminRoute //

export default function AppRoutes() {
  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />

          <Route path="/perfil" element={<Profile />} />
          <Route path="/filmes/novo" element={<MovieForm />} />
          <Route path="/filmes/editar/:id" element={<MovieForm edit />} />

          <Route path="/filmes/:id" element={<MovieDetails />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
  );
}