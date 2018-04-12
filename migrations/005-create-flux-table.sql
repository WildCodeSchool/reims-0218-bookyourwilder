-- Up
CREATE TABLE flux (
  id INTEGER PRIMARY KEY,
  texte TEXT,
  wilder_id INTEGER,
  FOREIGN KEY(wilder_id) REFERENCES users(id)
);

-- Down
DROP TABLE flux;