DROP DATABASE IF EXISTS uevent_lubiviy_poliatskiy;

CREATE DATABASE uevent_lubiviy_poliatskiy;

CREATE TYPE ticket_statuses AS ENUM ('bought', 'reserved');
CREATE TYPE formats AS ENUM('conferences','lectures','workshops','fests');
CREATE TYPE themes AS ENUM('business','politics','psychology');
CREATE TYPE statuses AS ENUM('available', 'sold out');
CREATE TYPE ticket_types AS ENUM('common','VIP');
CREATE TYPE discount_types AS ENUM('percentage','fixed_amount');

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(45) NOT NULL UNIQUE,
    password VARCHAR(70) NOT NULL,
    photo VARCHAR(256) NOT NULL DEFAULT 'default.png',
    email VARCHAR(256) NOT NULL UNIQUE,
    show_email BOOLEAN DEFAULT FALSE,
    full_name VARCHAR(60) NOT NULL,
    last_read_notification INTEGER DEFAULT 0

);

CREATE TABLE IF NOT EXISTS companies(
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE ,
    email VARCHAR(80) NOT NULL UNIQUE,
    location VARCHAR(256) NOT NULL ,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    description TEXT,
    photo VARCHAR(256),
    founder_id INTEGER UNIQUE NOT NULL,
    creation_day TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_read_notification INTEGER DEFAULT 0,
    CONSTRAINT fk_user_id FOREIGN KEY (founder_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS company_roles(
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(25) NOT NULL,
    event_creation BOOLEAN DEFAULT FALSE,
    company_edit BOOLEAN DEFAULT FALSE,
    news_creation BOOLEAN DEFAULT FALSE,
    eject_members BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS company_members(
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    member_id INTEGER UNIQUE NOT NULL,
    role_id INTEGER NOT NULL ,
    worked_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES  companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_id FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES company_roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS company_news(
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL ,
    poster VARCHAR(256),
    title VARCHAR(90) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES  companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events(
    id SERIAL PRIMARY KEY,
    name VARCHAR(70) NOT NULL,
    poster VARCHAR(256),
    notification BOOLEAN DEFAULT FALSE,
    description TEXT,
    location VARCHAR(256),
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    date TIMESTAMP WITH TIME ZONE,
    format formats,
    theme themes,
    company_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    ticket_type ticket_types,
    price DECIMAL(10, 2) NOT NULL,
    available_tickets INT NOT NULL,
    status statuses,
    event_id INTEGER NOT NULL,
    CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT unique_event_ticket UNIQUE (event_id, ticket_type)
);


CREATE TABLE IF NOT EXISTS user_tickets (
    id SERIAL PRIMARY KEY,
    ticket_status ticket_statuses,
    user_id INT NOT NULL,
    ticket_id INT NOT NULL,
    show_username BOOLEAN DEFAULT TRUE,
    session_id VARCHAR(256),
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_id FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS company_notification (
    id SERIAL PRIMARY KEY ,
    title VARCHAR(50),
    description TEXT,
    company_id INTEGER NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES  companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_subscribe(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    company_id INTEGER NOT NULL,
    update_events BOOLEAN,
    new_news BOOLEAN,
    new_events BOOLEAN,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES  companies(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_subscribe UNIQUE (user_id, company_id)

);

CREATE TABLE IF NOT EXISTS notification(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    description TEXT,
    link VARCHAR(80) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_notification(
    id SERIAL PRIMARY KEY,
    user_subscribe_id INTEGER NOT NULL,
    notification_id INTEGER NOT NULL,
    CONSTRAINT fk_user_subscribe_id FOREIGN KEY (user_subscribe_id) REFERENCES user_subscribe(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_id FOREIGN KEY (notification_id) REFERENCES notification(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS event_comments(
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL ,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS promo_codes(
    id SERIAL PRIMARY KEY,
    code VARCHAR(20),
    discount INTEGER NOT NULL ,
    discount_type discount_types,
    event_id INTEGER NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
);

DO $$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'mpoljatsky') THEN
            CREATE USER mpoljatsky WITH PASSWORD 'securepass';
        END IF;
    END $$;

GRANT ALL PRIVILEGES ON DATABASE uevent_lubiviy_poliatskiy TO mpoljatsky;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mpoljatsky;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mpoljatsky;

GRANT INSERT ON TABLE companies TO mpoljatsky;

INSERT INTO company_roles(role_name,event_creation,company_edit,news_creation,eject_members)
VALUES ('founder',true,true,true,true),
       ('editor',true,true,true,false),
       ('news_maker',false,false,true,false),
       ('worker',false,false,false,false);

