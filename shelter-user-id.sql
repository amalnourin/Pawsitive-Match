USE pawsitive_match;

-- This command adds the missing column to the pets table
ALTER TABLE pets 
ADD COLUMN shelter_user_id INT;