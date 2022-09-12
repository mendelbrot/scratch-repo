DROP TABLE IF EXISTS sharks;

CREATE TABLE sharks(
id SERIAL PRIMARY KEY,
name VARCHAR(50) NOT NULL,
color VARCHAR(50) NOT NULL);

INSERT INTO sharks VALUES
(DEFAULT, 'stanny', 'blue'),
(DEFAULT, 'chester', 'pink');
