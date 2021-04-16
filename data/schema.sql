DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS article;
DROP TABLE IF EXISTS category;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(200),
    password VARCHAR(200),
    token TEXT
);


CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200)
);

CREATE TABLE article (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    cover_image VARCHAR(255),
    abstraction TEXT,
    content TEXT,
    published_at VARCHAR(255),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES category(id)
);