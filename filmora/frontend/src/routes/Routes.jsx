import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import MovieDetails from '../pages/MovieDetails';
import MovieForm from '../pages/MovieForm';
import Layout from '../layouts/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

export default function AppRoutes() {
  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />

          <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/filmes/novo" element={<ProtectedRoute><AdminRoute><MovieForm /></AdminRoute></ProtectedRoute>} />
          <Route path="/filmes/editar/:id" element={<ProtectedRoute><AdminRoute><MovieForm edit /></AdminRoute></ProtectedRoute>} />

          <Route path="/filmes/:id" element={<MovieDetails />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
  );
}
