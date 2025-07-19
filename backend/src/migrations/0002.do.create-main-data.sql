CREATE TABLE IF NOT EXISTS public.estimate_status (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NULL,
  color VARCHAR(9) NULL,
  created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.clients (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255),
  email VARCHAR(100),
  phone VARCHAR(100),
  created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS public.estimates (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  estimate_status_id INT NOT NULL,
  client_id INT,
  description TEXT,
  labor_cost NUMERIC,
  materials_total NUMERIC,
  total_cost NUMERIC,
  materials JSONB,
  created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (estimate_status_id) REFERENCES estimate_status (id),
  FOREIGN KEY (client_id) REFERENCES clients (id)
);

-- Insert estimate status values
INSERT INTO
  public.estimate_status ("name", color)
VALUES
  ('initiated', '#f1c40f'),
  ('in progress', '#d35400'),
  ('completed', '#16a085');
