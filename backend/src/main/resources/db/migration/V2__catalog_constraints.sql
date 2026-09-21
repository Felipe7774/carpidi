ALTER TABLE category
  ALTER COLUMN slug SET NOT NULL;

ALTER TABLE category
  ADD CONSTRAINT uk_category_slug UNIQUE (slug);

ALTER TABLE product
  ADD COLUMN slug VARCHAR(160) NOT NULL;

ALTER TABLE product
  ADD CONSTRAINT uk_product_slug UNIQUE (slug);

ALTER TABLE product_variant
  ADD COLUMN sku VARCHAR(80) NOT NULL;

ALTER TABLE product_variant
  ALTER COLUMN price SET NOT NULL;

ALTER TABLE product_variant
  ADD CONSTRAINT uk_product_variant_sku UNIQUE (sku);

CREATE INDEX idx_product_active ON product(active);
CREATE INDEX idx_product_category ON product(category_id);
CREATE INDEX idx_variant_size_color ON product_variant(size, color);
