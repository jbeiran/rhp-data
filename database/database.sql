--users table
create table users(
    user_id serial primary key,
    email varchar(255) unique not null,
    password varchar(255) not null,
    role int not null default 0,
    created_at date default current_date
);

--change role to 1 for admin
update users set role = 1 where user_id = 1;

--receipts table
create table receipts(
    receipt_id serial primary key,
    verify_bank boolean not null default false,
    dates date not null,
    _hours int not null,
    recharge numeric(10,2) not null,
    notes varchar(255),
    method varchar(255) not null,
    exact numeric(10,2) not null,
    code varchar(255) not null
);

-- modify date to timestamp
alter table receipts alter column dates type timestamp with time zone;

