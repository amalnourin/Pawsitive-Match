USE pawsitive_match;
SET SQL_SAFE_UPDATES = 0;
-- 1. Adds the 'status' column (to track Pending, Approved, Rejected)
ALTER TABLE adoption_requests 
ADD COLUMN status VARCHAR(20) DEFAULT 'Pending';

-- 2. Adds the 'update_date' column (Needed for the PUT update endpoint)
ALTER TABLE adoption_requests 
ADD COLUMN update_date TIMESTAMP;

-- 3. Update existing requests so they appear as Pending (Optional but recommended)
UPDATE adoption_requests 
SET status = 'Pending' 
WHERE status IS NULL;