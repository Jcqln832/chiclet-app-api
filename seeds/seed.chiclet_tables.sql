BEGIN;

TRUNCATE
  chiclet_users,
  chiclet_items
  RESTART IDENTITY CASCADE;

INSERT INTO chiclet_users (user_name, password)
VALUES
  ('lunaLove', '$2a$11$Nm2wqmL2hmyCYyKoVGXS1.CV7JOTa4tjV/A3dxCJIMkJP3hI5Kneu'),
  ('nevilleLong', '$2a$11$4e032ASL8OMGD5VaUxoMHesrK.vaTWL0OA524xLiPR05RviIggt2i'),
  ('fleurDella', '$2a$11$gwa/LQdDFmth3wyZhcE1S.QgJtyI83cpL/us3sguqW1bdhboekP2G');
  
INSERT INTO chiclet_items (user_id, months, completed, content, index)
VALUES
  (1, 'February', 'false', 'First test item', 201902),
  (1, 'April', 'true', 'Another item', 201904),
  (2, 'June', 'false', 'fundraiser success', 201906),
  (2, 'July', 'true', 'complete 3rd book', 201907),
  (3, 'September', 'false', 'tournament', 201909),
  (3, 'November', 'false', 'volunteer in the community', 201911);

COMMIT;


