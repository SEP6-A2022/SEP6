DELETE FROM stars WHERE person_id NOT IN (SELECT id FROM people);
DELETE FROM stars WHERE movie_id NOT IN (SELECT id FROM movies);
DELETE FROM directors WHERE person_id NOT IN (SELECT id FROM people);
DELETE FROM directors WHERE movie_id NOT IN (SELECT id FROM movies);
DELETE FROM ratings WHERE movie_id NOT IN (SELECT id FROM movies);
