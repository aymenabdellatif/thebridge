CREATE DATABASE IF NOT EXISTS eduxpert;
USE eduxpert;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  xp INT DEFAULT 0,
  niveau VARCHAR(50) DEFAULT 'Débutant',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  domaine VARCHAR(100),
  niveau ENUM('debutant','intermediaire','avance') DEFAULT 'debutant',
  contenu TEXT,
  duree VARCHAR(50) DEFAULT '2h',
  chapitres INT DEFAULT 4
);

CREATE TABLE IF NOT EXISTS progression (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  cours_id INT,
  score INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_cours (user_id, cours_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (cours_id) REFERENCES cours(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS entretiens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  domaine VARCHAR(100),
  score INT,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT IGNORE INTO cours (id, titre, domaine, niveau, contenu, duree, chapitres) VALUES
(1, 'JavaScript Complet', 'Développement Web', 'debutant', 'Variables, fonctions, DOM, async/await', '4h', 4),
(2, 'React.js Moderne', 'Développement Web', 'intermediaire', 'Composants, hooks, state, context', '5h', 4),
(3, 'Node.js & Express', 'Backend', 'intermediaire', 'Serveur, routes, middleware, API REST', '4h', 4),
(4, 'MySQL & SQL', 'Backend', 'debutant', 'CREATE, SELECT, JOIN, INDEX, transactions', '3h', 3),
(5, 'Algorithmes', 'Informatique', 'avance', 'Tri, recherche, complexité, arbres', '6h', 4),
(6, 'Préparer l\'entretien tech', 'Carrière', 'debutant', 'Questions fréquentes, live coding, soft skills', '2h', 3);
