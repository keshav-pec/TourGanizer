-- Migration to update tournaments table columns
-- Run this in your Supabase SQL Editor

-- Add new columns to tournaments table
ALTER TABLE tournaments 
  ADD COLUMN IF NOT EXISTS date date,
  ADD COLUMN IF NOT EXISTS time time,
  ADD COLUMN IF NOT EXISTS rounds int,
  ADD COLUMN IF NOT EXISTS out_rounds int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS members_per_team int;

-- Migrate existing data from old columns to new ones (if any data exists)
UPDATE tournaments 
SET date = start_date 
WHERE date IS NULL AND start_date IS NOT NULL;

-- Drop old columns that are no longer needed
ALTER TABLE tournaments 
  DROP COLUMN IF EXISTS location,
  DROP COLUMN IF EXISTS format,
  DROP COLUMN IF EXISTS start_date,
  DROP COLUMN IF EXISTS end_date;

-- Make new columns NOT NULL after data migration
-- Only run these if you have no existing data, or after ensuring all rows have values
-- ALTER TABLE tournaments ALTER COLUMN rounds SET NOT NULL;
-- ALTER TABLE tournaments ALTER COLUMN out_rounds SET NOT NULL;
-- ALTER TABLE tournaments ALTER COLUMN members_per_team SET NOT NULL;
