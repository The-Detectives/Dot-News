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
    id ,
    name VARCHAR(200)
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

