CREATE DATABASE IF NOT EXISTS moovies_db;
USE moovies_db;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (name, email, password) VALUES
('Matheus', 'matheus@example.com', 'senha123'),
('Bruno', 'bruno@example.com', 'senha456');
