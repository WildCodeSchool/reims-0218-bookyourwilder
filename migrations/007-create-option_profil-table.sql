-- Up
CREATE TABLE option_profil (
  id INTEGER PRIMARY KEY,
  nom_option VARCHAR(45),
  affichage_option TINYINT,
  texte_option TINYTEXT,
  wilder_id INTEGER,
  FOREIGN KEY(wilder_id) REFERENCES users(id)
);

-- Down
DROP TABLE option_profil;