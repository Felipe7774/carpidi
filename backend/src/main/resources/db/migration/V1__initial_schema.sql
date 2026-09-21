CREATE TABLE users (
  id UUID PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN','CLIENT')),
  PRIMARY KEY (user_id, role)
);
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

CREATE TABLE category (id UUID PRIMARY KEY, name VARCHAR(255) NOT NULL UNIQUE, slug VARCHAR(255), active BOOLEAN NOT NULL DEFAULT TRUE);
CREATE TABLE product (
  id UUID PRIMARY KEY, category_id UUID NOT NULL REFERENCES category(id), name VARCHAR(255) NOT NULL,
  description TEXT, base_price NUMERIC(12,2) NOT NULL, active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE product_variant (
  id UUID PRIMARY KEY, product_id UUID NOT NULL REFERENCES product(id), size VARCHAR(255), color VARCHAR(255), price NUMERIC(12,2)
);
CREATE TABLE inventory (
  id UUID PRIMARY KEY, variant_id UUID NOT NULL UNIQUE REFERENCES product_variant(id), available INT NOT NULL DEFAULT 0,
  reserved INT NOT NULL DEFAULT 0, version BIGINT NOT NULL DEFAULT 0, CHECK (available >= 0), CHECK (reserved >= 0)
);
CREATE TABLE orders (
  id UUID PRIMARY KEY, customer_id UUID NOT NULL REFERENCES users(id), status VARCHAR(30) NOT NULL,
  total NUMERIC(12,2), created_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE order_detail (
  id UUID PRIMARY KEY, order_id UUID NOT NULL REFERENCES orders(id), variant_id UUID NOT NULL REFERENCES product_variant(id),
  product_name VARCHAR(255), quantity INT NOT NULL CHECK (quantity > 0), unit_price NUMERIC(12,2)
);
CREATE TABLE payment (
  id UUID PRIMARY KEY, order_id UUID NOT NULL REFERENCES orders(id), provider VARCHAR(255), provider_reference VARCHAR(255),
  amount NUMERIC(12,2), status VARCHAR(255)
);
CREATE TABLE style_questionnaire (
  id UUID PRIMARY KEY, customer_id UUID NOT NULL REFERENCES users(id), body_type VARCHAR(255), skin_tone VARCHAR(255),
  height_range VARCHAR(255), style_preferences VARCHAR(255), consent BOOLEAN NOT NULL, created_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE recommendation (
  id UUID PRIMARY KEY, customer_id UUID REFERENCES users(id), product_id UUID REFERENCES product(id),
  reason VARCHAR(255), score DOUBLE PRECISION NOT NULL, created_at TIMESTAMPTZ NOT NULL
);
