DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS article;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS contact;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    token TEXT
);


CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE
);

CREATE TABLE article (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    image VARCHAR(255),
    abstract TEXT,
    content TEXT,
    published_date VARCHAR(255),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE contact (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    phone VARCHAR(200),
    email VARCHAR(200),
    message TEXT,
    date VARCHAR(200)
);