-- Up
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  slug VARCHAR(255),
  firstName VARCHAR(60),
  lastName VARCHAR(60),
  bio TEXT,
  image VARCHAR(255),
  mail VARCHAR(255),
  mdp TEXT
);

-- Down
DROP TABLE users;