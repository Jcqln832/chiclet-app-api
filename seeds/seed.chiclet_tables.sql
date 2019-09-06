BEGIN;

TRUNCATE
  chiclet_users,
  chiclet_items
  RESTART IDENTITY CASCADE;

INSERT INTO chiclet_users (user_name, password)
VALUES
  ('lunaLove', 'secretpw1*'),
  ('nevilleLong', 'secretpw2*'),
  ('fleurDella', 'secretpw3*');
  
INSERT INTO chiclet_items (user_id, months, completed, content, index)
VALUES
  (1, 'February', 'false', 'First test item', 201902),
  (1, 'April', 'true', 'Another item', 201904),
  (2, 'June', 'false', 'fundraiser success', 201906),
  (2, 'July', 'true', 'complete 3rd book', 201907),
  (3, 'September', 'false', 'tournament', 201909),
  (3, 'November', 'false', 'volunteer in the community', 201911);

COMMIT;

