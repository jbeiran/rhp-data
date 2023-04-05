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

--modify code is null
alter table receipts alter column code drop not null;

-- modify date to timestamp
alter table receipts alter column dates type timestamp with time zone;

--credit_client table
CREATE TABLE IF NOT EXISTS credit_clients(
    credit_client_id serial primary key,
    client_code VARCHAR(255) NOT NULL,
    receipt_id int references receipts(receipt_id),
    dates date not null,
    exact numeric(10,2) not null,
    prodotto varchar(255),
    costo numeric(10,2)
);

--credit_agent table
CREATE TABLE IF NOT EXISTS credit_agents(
    credit_agent_id serial primary key,
    agent_code VARCHAR(255) NOT NULL,
    receipt_id int references receipts(receipt_id),
    dates date not null,
    exact numeric(10,2) not null,
    prodotto varchar(255),
    costo numeric(10,2),
    ok boolean not null default false,
);