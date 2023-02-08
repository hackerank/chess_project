drop database  chess_player_db;
drop user chess_palyer;
create user chess_player with password 'password';
create database chess_player_db with template=template0 owner=chess_player;
\connect chess_palyer_db;
alter default privileges grant all on tables to chess_player;
alter default privileges grant all on sequences to chess_player;

create table players_data (
    player_id integer primary not null,
    player_name varchar(32) not null,
    password text not null
);

create sequence players_data_seq increment 1 start 10000;

