CREATE TABLE `users_table` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`salt` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_table_email_unique` UNIQUE(`email`)
);
