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



