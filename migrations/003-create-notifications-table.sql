-- Up
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY,
  texte VARCHAR(150),
  wilder_id INTEGER,
  FOREIGN KEY(wilder_id) REFERENCES users(id)
);

-- Down
DROP TABLE notifications;