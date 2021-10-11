SET NAMES utf8;

-- Création de la table Utilisateurs
CREATE TABLE Users (
  id SMALLINT unsigned NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  pictureurl VARCHAR(255) DEFAULT NULL,
  isadmin TINYINT NOT NULL,
  PRIMARY KEY(id),
  UNIQUE KEY ind_uni_email (email)
) ENGINE=InnoDB;

-- Création de la table Publications
CREATE TABLE Posts (
  id MEDIUMINT unsigned NOT NULL AUTO_INCREMENT,
  publication_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id SMALLINT unsigned,
  imageurl VARCHAR(255),
  content TEXT,
  PRIMARY KEY(id)
) ENGINE=InnoDB;

-- Création de la table des Commentaires
CREATE TABLE Comments (
  id INT unsigned NOT NULL AUTO_INCREMENT,
  publication_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content TEXT NOT NULL,
  user_id SMALLINT unsigned,
  post_id MEDIUMINT unsigned NOT NULL,
  PRIMARY KEY(id)
) ENGINE=InnoDB;

-- Création de la table like/dislike
CREATE TABLE Likes (
  id INT unsigned NOT NULL AUTO_INCREMENT,
  rate TINYINT NOT NULL,
  user_id SMALLINT unsigned NOT NULL,
  post_id MEDIUMINT unsigned NOT NULL,
  PRIMARY KEY(id)
) ENGINE=InnoDB;
