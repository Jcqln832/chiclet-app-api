CREATE TABLE chiclet_users (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

ALTER TABLE chiclet_items
  ADD COLUMN
    user_id INTEGER REFERENCES chiclet_users(id)
    ON DELETE SET NULL;
