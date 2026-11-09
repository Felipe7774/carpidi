-- Adición de columna image_url a product y actualización de catálogo MVP
ALTER TABLE product ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

UPDATE product SET image_url = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80' WHERE slug = 'blazer-luna' AND image_url IS NULL;
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80' WHERE slug = 'vestido-aura' AND image_url IS NULL;
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80' WHERE slug = 'jean-nova' AND image_url IS NULL;
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80' WHERE slug = 'tenis-vela' AND image_url IS NULL;
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' WHERE slug = 'sandalia-siena' AND image_url IS NULL;
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' WHERE slug = 'bolso-olivia' AND image_url IS NULL;

