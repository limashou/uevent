-- Удаляем базу данных, если она существует
DROP DATABASE IF EXISTS uevent_lubiviy_poliatskiy;

-- Создаем базу данных, если она не существует
CREATE DATABASE uevent_lubiviy_poliatskiy;

-- Создаем пользователя, если он не существует
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'mpoljatsky') THEN
        CREATE USER mpoljatsky WITH PASSWORD 'securepass';
    END IF;
END $$;

-- Предоставляем все привилегии пользователю на базу данных
GRANT ALL PRIVILEGES ON DATABASE uevent_lubiviy_poliatskiy TO mpoljatsky;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mpoljatsky;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mpoljatsky;

-- Подключаемся к базе данных
\c uevent_lubiviy_poliatskiy;

-- Создаем таблицу пользователей
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
    name VARCHAR(30),
    email VARCHAR(80),
    location VARCHAR(80),
    founder_id INTEGER NOT NULL,
    CONSTRAINT fk_user_id FOREIGN KEY (founder_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS company_members(
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    role VARCHAR(10),
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES  companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_id FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS company_news(
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL ,
    title varchar(90) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES  companies(id) ON DELETE CASCADE
);

CREATE TYPE formats AS ENUM('conferences','lectures','workshops','fests');
CREATE TYPE themes AS ENUM('business','politics','psychology');

CREATE TABLE IF NOT EXISTS events(
    id SERIAL PRIMARY KEY,
    name VARCHAR(70) NOT NULL,
    description TEXT,
    date TIMESTAMP,
    format formats,
    theme themes,
    company_id INTEGER NOT NULL,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TYPE statuses AS ENUM('available','sold', 'reserved');
CREATE TYPE ticket_types AS ENUM('common','VIP');

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    ticket_type ticket_types,
    price DECIMAL(10, 2) NOT NULL,
    available_tickets INT NOT NULL,
    status statuses,
    buyer_name VARCHAR(100),
    buyer_email VARCHAR(100),
    purchase_date TIMESTAMP,
    CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
);

CREATE TYPE ticket_status AS ENUM ('sold', 'reserved');

CREATE TABLE IF NOT EXISTS user_tickets (
    id SERIAL PRIMARY KEY,
    ticket_status ticket_types,
    user_id INT NOT NULL,
    ticket_id INT NOT NULL,
    purchase_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_id FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS list_of_users_who_will_come (
    id SERIAL PRIMARY KEY,
    visitor_name VARCHAR(90),
    show_name BOOLEAN DEFAULT FALSE,
    event_id INTEGER NOT NULL,
    user_tickets_id INTEGER NOT NULL,
    CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_tickets_id FOREIGN KEY (user_tickets_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS event_comments(
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL ,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- BEGIN TRANSACTION;
--
-- UPDATE tickets
-- SET available_tickets = available_tickets - 1
-- WHERE event_id = ?event_id
--   AND ticket_type = ?type
--   AND available_tickets > 0;
--
-- COMMIT;