use expressionary_data;
insert into users value(
	NULL,
    0,
    "janesemail@serve.com",
    "janeuser",
    "janepass",
    "Jane",
    "Doe");

insert into users value(
	NULL,
    0,
    "johnsemail@serve.com",
    "johnuser",
    "johnpass",
    "John",
    "Smith");

insert into users value(
	NULL,
    0,
    "ayushsemail@serve.com",
    "ayushuser",
    "ayushpass",
    "Ayush",
    "Patel");

insert into users value(
	NULL,
    0,
    "barrysemail@serve.com",
    "barryuser",
    "barrypass",
    "Barry",
    "Allen");

insert into users value(
	NULL,
    0,
    "brucesemail@serve.com",
    "bruceuser",
    "brucepass",
    "Bruce",
    "Wayne");
    
select * from users;

insert into wordpage value(
	NULL,
    "Human",
    0);

insert into wordpage value(
	NULL,
    "Person",
    0);

insert into wordpage value(
	NULL,
    "Life",
    0);

insert into wordpage value(
	NULL,
    "Artificial Intelligence",
    0);

insert into wordpage value(
	NULL,
    "Internet",
    0);

insert into wordpage value(
	NULL,
    "Food",
    0);

insert into wordpage value(
	NULL,
    "Computer",
    0);

insert into wordpage value(
	NULL,
    "Machine",
    0);

insert into wordpage value(
	NULL,
    "Technology",
    0);

insert into wordpage value(
	NULL,
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


insert into users value(
	#shuold fail due to duplicate username
	NULL,
    0,
    "uniqueusertest@email.com",
    "thatguy",
    "thatguyotherpass",
    NULL,
    NULL);