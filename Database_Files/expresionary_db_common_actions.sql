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

insert into users value(
	NULL,
    0,
    "a@a.com",
    "a",
    "a",
    "default.png",
    "",
    "",
    0,
    0);
    
insert into users value(
	NULL,
    0,
    "b@b.com",
    "b",
    "b",
    "default.png",
    "",
    "",
    0,
    0);