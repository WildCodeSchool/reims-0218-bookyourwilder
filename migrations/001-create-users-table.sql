-- Up
CREATE TABLE option_profil (
  id INTEGER PRIMARY KEY,
  nom_option VARCHAR(45),
  affichage_option TINYINT,
  texte_option TINYTEXT,
  wilder_id INTEGER,
  FOREIGN KEY(wilder_id) REFERENCES users(id)
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  slug VARCHAR(255),
  title VARCHAR(40),
  firstName VARCHAR(60),
  lastName VARCHAR(60),
  bio TEXT,
  image VARCHAR(255),
  mail VARCHAR(255),
  urlFb VARCHAR(100),
  urlTw VARCHAR(100),
  mdp TEXT
);

CREATE TABLE notifications (
  id INTEGER PRIMARY KEY,
  texte VARCHAR(150),
  wilder_id INTEGER,
  FOREIGN KEY(wilder_id) REFERENCES users(id)
);

CREATE TABLE flux (
  id INTEGER PRIMARY KEY,
  texte TEXT,
  wilder_id INTEGER,
  FOREIGN KEY(wilder_id) REFERENCES users(id)
);

-- Down
DROP TABLE users;
DROP TABLE notifications;
DROP TABLE flux;
DROP TABLE option_profil;