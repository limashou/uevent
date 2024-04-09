DROP DATABASE IF EXISTS uevent_lubiviy_poliatskiy;

CREATE DATABASE uevent_lubiviy_poliatskiy;

CREATE TYPE ticket_status AS ENUM ('buy', 'reserved');
CREATE TYPE roles AS ENUM('worker','news_maker','editor','founder');
CREATE TYPE formats AS ENUM('conferences','lectures','workshops','fests');
CREATE TYPE themes AS ENUM('business','politics','psychology');
CREATE TYPE statuses AS ENUM('available, sold out');
CREATE TYPE ticket_types AS ENUM('common','VIP');

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(45) NOT NULL UNIQUE,
    password VARCHAR(70) NOT NULL,
    photo VARCHAR(256) NOT NULL DEFAULT 'default.png',
    email VARCHAR(256) NOT NULL UNIQUE,
    full_name VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS companies(
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE ,
    email VARCHAR(80) NOT NULL UNIQUE,
    location VARCHAR(256) NOT NULL ,
    description TEXT,
    photo VARCHAR(256),
    founder_id INTEGER NOT NULL,
    creation_day TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (founder_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS company_members(
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    role roles,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES  companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_id FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS company_news(
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL ,
    poster VARCHAR(256),
    title VARCHAR(90) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES  companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events(
    id SERIAL PRIMARY KEY,
    name VARCHAR(70) NOT NULL,
    poster VARCHAR(256),
    notification BOOLEAN DEFAULT FALSE,
    description TEXT,
    location VARCHAR(256),
    date TIMESTAMP,
    format formats,
    theme themes,
    company_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    ticket_type ticket_types,
    price DECIMAL(10, 2) NOT NULL,
    available_tickets INT NOT NULL,
    status statuses,
    CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS user_tickets (
    id SERIAL PRIMARY KEY,
    ticket_status ticket_types,
    user_id INT NOT NULL,
    ticket_id INT NOT NULL,
    show_username BOOLEAN DEFAULT TRUE,
    purchase_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_id FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS company_notification (
    id SERIAL PRIMARY KEY ,
    title VARCHAR(50),
    description TEXT,
    company_id INTEGER NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES  companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_notification (
    id SERIAL PRIMARY KEY ,
    title VARCHAR(50),
    description TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--     type ("companiya, events"),
--     company_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS event_comments(
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL ,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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


-- CREATE TABLE IF NOT EXISTS locations (
--                                          id SERIAL PRIMARY KEY,
--                                          street_address VARCHAR(255) NOT NULL,
--                                          city VARCHAR(100) NOT NULL,
--                                          state VARCHAR(100),
--                                          country VARCHAR(100) NOT NULL,
--                                          postal_code VARCHAR(20),
--                                          latitude DECIMAL(10, 6),
--                                          longitude DECIMAL(10, 6)
-- );