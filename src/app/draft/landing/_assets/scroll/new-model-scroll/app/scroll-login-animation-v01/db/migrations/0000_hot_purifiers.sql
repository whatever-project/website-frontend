ALTER TABLE `scroll_preferences`
MODIFY COLUMN `view` enum('front','elevated','perspective','side') NOT NULL DEFAULT 'front';
