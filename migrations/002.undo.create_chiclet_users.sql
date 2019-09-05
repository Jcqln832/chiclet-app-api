ALTER TABLE chiclet_items
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS chiclet_users;
