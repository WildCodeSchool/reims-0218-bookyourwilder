-- Up
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  slug VARCHAR(255),
  firstName VARCHAR(60),
  lastName VARCHAR(60),
  bio TEXT,
  image VARCHAR(255),
  title VARCHAR(40)
);

-- Down
DROP TABLE users;