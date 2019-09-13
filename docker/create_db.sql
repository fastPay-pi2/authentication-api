CREATE TABLE ADMINISTRATOR (
	cpf VARCHAR(11) PRIMARY KEY,
	password VARCHAR(30),
	name VARCHAR(200),
	phoneNumber VARCHAR(11) UNIQUE,
	birthday DATE,
	email VARCHAR(254) UNIQUE,
	image VARCHAR(100) --temporariamente
);

CREATE TABLE CLIENT (
	idClient SERIAL PRIMARY KEY,
	username VARCHAR(50) UNIQUE,
	password VARCHAR(30),
	name VARCHAR(200),
	phoneNumber VARCHAR(11),
	birthday DATE,
	email VARCHAR(254) UNIQUE,
	cpf CHAR(11) UNIQUE
);
