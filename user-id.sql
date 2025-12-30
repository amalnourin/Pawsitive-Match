USE pawsitive_match;

-- Add the user_id column to link the request back to the user
ALTER TABLE adoption_requests ADD COLUMN user_id INT;