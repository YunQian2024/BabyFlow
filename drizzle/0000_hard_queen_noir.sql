CREATE TABLE `config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL,
	`group` text DEFAULT 'default' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `formula_milk_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`startTime` text NOT NULL,
	`endTime` text NOT NULL,
	`durationMinutes` integer NOT NULL,
	`milkIntake` integer NOT NULL
);
