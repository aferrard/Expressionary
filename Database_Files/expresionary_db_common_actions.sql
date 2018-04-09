use expressionary_data;

#reset votes
DELETE FROM posts_voted;
UPDATE users SET points = 0;
UPDATE posts SET points = 0;
UPDATE wordpage SET totalPoints = 0;

#get tables
select * from posts;
select * from users;
select * from wordpage;
select * from posts_voted;