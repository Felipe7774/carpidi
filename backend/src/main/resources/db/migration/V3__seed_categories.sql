INSERT INTO category (id, name, slug, active) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Ropa', 'ropa', TRUE),
  ('10000000-0000-0000-0000-000000000002', 'Zapatos', 'zapatos', TRUE),
  ('10000000-0000-0000-0000-000000000003', 'Accesorios', 'accesorios', TRUE)
ON CONFLICT (slug) DO NOTHING;
