BEGIN;

TRUNCATE
  chiclet_users,
  chiclet_items
  RESTART IDENTITY CASCADE;

INSERT INTO chiclet_users (user_name, password)
VALUES
  ('harryP', '$2a$11$Nm2wqmL2hmyCYyKoVGXS1.CV7JOTa4tjV/A3dxCJIMkJP3hI5Kneu'),
  ('ronW', '$2a$11$4e032ASL8OMGD5VaUxoMHesrK.vaTWL0OA524xLiPR05RviIggt2i');
  
INSERT INTO chiclet_items (completed, content, index, user_id)
VALUES
  ('false', 'First test item', 201902, 1),
  ('true', 'Another item', 201904, 1),
  ('false', 'fundraiser success', 201906, 1),
  ('true', 'complete 3rd book', 201907, 2),
  ('false', 'tournament', 201909, 2),
  ('false', 'volunteer in the community', 201911, 2);

COMMIT;



