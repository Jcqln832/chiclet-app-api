DROP TYPE IF EXISTS completed;
CREATE TYPE completed AS ENUM (
    'false',
    'true'
);

CREATE TABLE chiclet_items (
  id SERIAL PRIMARY KEY,
  completed completed NOT NULL,
  content TEXT NOT NULL,
  index INTEGER NOT NULL
);