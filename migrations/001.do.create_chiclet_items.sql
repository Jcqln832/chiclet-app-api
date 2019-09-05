DROP TYPE IF EXISTS months;
CREATE TYPE months AS ENUM (
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
);

DROP TYPE IF EXISTS completed;
CREATE TYPE completed AS ENUM (
    'true',
    'false'
);

CREATE TABLE chiclet_items (
  id SERIAL PRIMARY KEY,
  months months,
  completed completed,
  content TEXT NOT NULL,
  index INTEGER NOT NULL
);