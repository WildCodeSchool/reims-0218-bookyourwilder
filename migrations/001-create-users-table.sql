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
  firstName VARCHAR(60),
  lastName VARCHAR(60),
  title VARCHAR(40),
  projet VARCHAR(40),
  slug VARCHAR(255),
  bio TEXT,
  coteWild VARCHAR(40),
  image VARCHAR(255),
  mail VARCHAR(255),
  urlLi VARCHAR(100),
  urlGh VARCHAR(100),
  password TEXT,
  mobility VARCHAR(150),
  adress VARCHAR(250)
);

CREATE TABLE notifications (
  id INTEGER PRIMARY KEY,
  texte VARCHAR(150),
  wilder_id INTEGER,
  FOREIGN KEY(wilder_id) REFERENCES users(id)
);

CREATE TABLE fluxs (
  id INTEGER PRIMARY KEY,
  texte TEXT,
  wilder_id INTEGER,
  date_message TEXT,
  FOREIGN KEY(wilder_id) REFERENCES users(id)
);

-- Down
DROP TABLE users;
DROP TABLE notifications;
DROP TABLE fluxs;
DROP TABLE option_profil;