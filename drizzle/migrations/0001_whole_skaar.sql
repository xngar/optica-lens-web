CREATE TABLE `uploaded_images` (
	`id` text PRIMARY KEY NOT NULL,
	`file_name` text NOT NULL,
	`content_type` text DEFAULT 'image/webp' NOT NULL,
	`base64_data` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` text NOT NULL
);
