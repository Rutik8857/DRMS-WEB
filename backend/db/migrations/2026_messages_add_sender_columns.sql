-- add missing sender_role and sender_id columns, drop legacy columns if needed

-- rename old 'sender' to 'sender_role' if appropriate
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS sender_role VARCHAR(20) NOT NULL DEFAULT '';

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS sender_id INT NOT NULL DEFAULT 0;

-- drop legacy fields
ALTER TABLE messages
  DROP COLUMN IF EXISTS roomId;

ALTER TABLE messages
  DROP COLUMN IF EXISTS sender;
