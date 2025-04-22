CREATE TABLE `Note` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`title` varchar(255) NOT NULL,
	`text` text NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `Note_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `Note` ADD CONSTRAINT `Note_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE no action ON UPDATE no action;