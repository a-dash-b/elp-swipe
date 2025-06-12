
-- Remove all test member responses from the database
-- This includes member_code = '0000' and any numeric codes >= 1000
DELETE FROM responses 
WHERE member_code = '0000' 
   OR (member_code ~ '^[0-9]+$' AND CAST(member_code AS INTEGER) >= 1000);
