CREATE TABLE events (
	id SERIAL PRIMARY KEY,
	title VARCHAR(127) NOT NULL,
	date TIMESTAMP NOT NULL,
	description VARCHAR(255),
	image VARCHAR(255),
	price INT NOT NULL
);

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(127) NOT NULL,
	email VARCHAR(127) NOT NULL,
	password VARCHAR(127) NOT NULL
);

CREATE TABLE cart_items (
	id SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(id),
	event_id INT REFERENCES events(id)
);

CREATE TABLE tickets (
	id SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(id),
	event_id INT REFERENCES events(id) 
);
