CREATE DATABASE isc;
use isc;
CREATE TABLE cards(
	CardID VARCHAR(30) PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Balance DECIMAL(13, 2) NOT NULL
);

CREATE TABLE users(
	UserID VARCHAR(30) PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Pin VARCHAR(100) NOT NULL,
    Privilege VARCHAR(100) NOT NULL
);

INSERT INTO users (UserID, FirstName, LastName, Pin, Privilege)
VALUES('0', 'Admin', 'Admin', '1234', 'Admin');