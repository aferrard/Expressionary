use expressionary_data;
insert into users value(
	NULL,
    0,
    "janesemail@serve.com",
    "janeuser",
    "janepass",
    NULL,
    "Jane",
    "Doe");

insert into users value(
	NULL,
    0,
    "johnsemail@serve.com",
    "johnuser",
    "johnpass",
    NULL,
    "John",
    "Smith");

insert into users value(
	NULL,
    0,
    "ayushsemail@serve.com",
    "ayushuser",
    "ayushpass",
    NULL,
    "Ayush",
    "Patel");

insert into users value(
	NULL,
    0,
    "barrysemail@serve.com",
    "barryuser",
    "barrypass",
    NULL,
    "Barry",
    "Allen");

insert into users value(
	NULL,
    0,
    "brucesemail@serve.com",
    "bruceuser",
    "brucepass",
    NULL,
    "Bruce",
    "Wayne");
    
select * from users;

insert into wordpage value(
	NULL,
    "word",
    "Human",
    0);

insert into wordpage value(
	NULL,
    "word",
    "Person",
    0);

insert into wordpage value(
	NULL,
    "word",
    "Life",
    0);

insert into wordpage value(
	NULL,
    "word",
    "Artificial Intelligence",
    0);

insert into wordpage value(
	NULL,
    "word",
    "Internet",
    0);

insert into wordpage value(
	NULL,
    "word",
    "Food",
    0);

insert into wordpage value(
	NULL,
    "word",
    "Computer",
    0);

insert into wordpage value(
	NULL,
    "word",
    "Machine",
    0);

insert into wordpage value(
	NULL,
    "word",
    "Technology",
    0);

insert into wordpage value(
	NULL,
    "word",
    "Pneumonoultramicroscopicsilicovolcanoconiosis",
    0);
    
select * from wordpage;

insert into posts value(
	NULL,
    NOW(),
    0,
    "homosapien",
    1,
    1);
    
insert into posts value(
	NULL,
    NOW(),
    0,
    "Intelligent animal",
    4,
    1);
    
delete from posts where wordPage_wp_id = 3;
    
select * from posts;


/*insert into users value(
	#shuold fail due to duplicate username
	NULL,
    0,
    "uniqueusertest@email.com",
    "thatguy",
    "thatguyotherpass",
    NULL,
    NULL);*/