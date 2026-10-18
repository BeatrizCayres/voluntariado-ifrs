CREATE DATABASE IF NOT EXISTS voluntariado_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE voluntariado_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    eventDate DATE NOT NULL,
    capacity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inscrições de voluntários em eventos
CREATE TABLE IF NOT EXISTS event_volunteers (
    event_id INT NOT NULL,
    volunteer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, volunteer_id),
    CONSTRAINT fk_event_volunteers_event FOREIGN KEY (event_id)
        REFERENCES events (id) ON DELETE CASCADE,
    CONSTRAINT fk_event_volunteers_volunteer FOREIGN KEY (volunteer_id)
        REFERENCES volunteers (id) ON DELETE CASCADE
);

INSERT INTO events (name, category, location, eventDate, capacity)
VALUES
('Doação de sangue', 'Doação', 'Porto Alegre', '2026-10-15', 500),
('Arrecadação de alimentos', 'Arrecadação', 'Caxias do Sul', '2026-10-22', 800),
('Campanha do agasalho', 'Doação', 'Gramado', '2026-11-05', 1000),
('Mutirão ambiental', 'Ambiental', 'Campus Porto Alegre', '2026-11-20', 2);

INSERT INTO volunteers (name, email, telephone)
VALUES
('Ana Torres', 'anatorres@gmail.com', '54988888888'),
('Jorge Falcão', 'jorge11@gmail.com', '54988887878'),
('João Gomes', 'gomesjoao@gmail.com', '54988898700');

INSERT INTO event_volunteers (event_id, volunteer_id)
VALUES
(1, 1),
(1, 2);

-- Senha: 123456
INSERT INTO users (email, password, role)
VALUES (
  'usuario@ifrs.edu.br',
  '$2b$10$382cEJJYi5YxSBNvWmufHeoPHX3dqIB9NP2R2XWzt/w.DnC0gmCr2',
  'user'
);

-- Senha: 123456
INSERT INTO users (email, password, role)
VALUES (
  'admin@ifrs.edu.br',
  '$2b$10$MEeeCiEPyuyX0gAqyM9MyOYkYV7umDPVszsFrsiuTdeSFwoOYWCpa',
  'admin'
);
