CREATE TABLE `poop_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createTime` text NOT NULL,
	`color` text NOT NULL,
	`shape` text NOT NULL,
	`image` text,
	`remark` text
);
