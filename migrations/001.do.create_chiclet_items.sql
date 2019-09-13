CREATE TABLE chiclet_items (
  id SERIAL PRIMARY KEY,
  completed BOOLEAN DEFAULT false,
  content TEXT NOT NULL,
  index INTEGER NOT NULL
);