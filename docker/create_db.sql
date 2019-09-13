CREATE TABLE PRODUCT (
	id serial PRIMARY KEY,
	name varchar(200),
	image varchar(100),
	price float(2)
);

CREATE TABLE ITEM (
	rfid integer PRIMARY KEY,
	expirationDate DATE,
	idProduct integer,

	CONSTRAINT ITEM_PRODUCT_FK FOREIGN KEY (idProduct) REFERENCES PRODUCT (id) ON DELETE CASCADE ON UPDATE CASCADE
);
