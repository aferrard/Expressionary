use expressionary_data;
insert into users value(
	NULL,
    0,
    "janesemail@serve.com",
    "janeuser",
    "janepass",
    "default.png",
    "Jane",
    "Doe",
    0);

insert into users value(
	NULL,
    0,
    "johnsemail@serve.com",
    "johnuser",
    "johnpass",
    "default.png",
    "John",
    "Smith",
    0);

insert into users value(
	NULL,
    0,
    "ayushsemail@serve.com",
    "ayushuser",
    "ayushpass",
    "default.png",
    "Ayush",
    "Patel",
    0);

insert into users value(
	NULL,
    0,
    "barrysemail@serve.com",
    "barryuser",
    "barrypass",
    "Flash_series_logo.png",
    "Barry",
    "Allen",
    0);

insert into users value(
	NULL,
    0,
    "brucesemail@serve.com",
    "bruceuser",
    "brucepass",
    "Batman-logo-A33AD65044-seeklogo.com.png",
    "Bruce",
    "Wayne",
    0);
    
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
    
insert into wordpage value(
	NULL,
    "image",
    "Syria_bombing.png",
    0);
    
insert into wordpage value(
	NULL,
    "image",
    "starwarspresidential",
    0);
    
select * from wordpage;

insert into posts value(
	NULL,
    NOW(),
    0,
    "text",
    "homosapien",
    1,
    1);
    
insert into posts value(
	NULL,
    NOW(),
    0,
    "text",
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