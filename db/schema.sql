DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE Table `Department` (
`id` INT NOT NULL AUTO_INCREMENT,
`name` VARCHAR(30) NOT NULL,
PRIMARY KEY (`id`)
);

CREATE  TABLE `Role` (
`id` INT NOT NULL AUTO_INCREMENT,
`title` VARCHAR(30) NOT NULL,
`salary` DECIMAL,
`department_id` INT,
FOREIGN KEY (department_id),
REFERENCES Department (id),
PRIMARY KEY (`id`)
);

CREATE TABLE `Employee` (
`id` INT NOT NULL AUTO_INCREMENT,
`first_name` VARCHAR(30) NOT NULL,
`last_name` VARCHAR(30) NOT NULL,
`isManager` BOOLEAN,
`role_id` INT NOT NULL 
FOREIGN KEY (role_id),
REFERENCES Role (id),
`manager_id` INT,
FOREIGN KEY (Employee)
REFERENCES Employee (id),
PRIMARY KEY (`id`)
);

INSERT INTO Department (name) VALUE ("Music");

INSERT INTO Role (title , salary, department_id) VALUES ("Teacher" , 100000.00 , 1);

INSERT INTO Employee (first_name, last_name, role_id ) VALUES ("Teri" , "Yumae" , 1);
INSERT INTO Employee (first_name, last_name, role_id) VALUES ("Michael" , "Rilley", 1);
INSERT INTO Employee (first_name, last_name, role_id) VALUES ("Kristy" , "Juliano", 1);