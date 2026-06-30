-- Create requests schema
CREATE SCHEMA IF NOT EXISTS requests_schema;

-- Create solicitudes_servicio table
CREATE TABLE IF NOT EXISTS requests_schema.solicitudes_servicio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  category_id VARCHAR(255) NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  preferred_date VARCHAR(20),
  status VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_solicitudes_user_id ON requests_schema.solicitudes_servicio(user_id);
CREATE INDEX idx_solicitudes_status ON requests_schema.solicitudes_servicio(status);
CREATE INDEX idx_solicitudes_created_at ON requests_schema.solicitudes_servicio(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE requests_schema.solicitudes_servicio ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow users to insert their own requests
CREATE POLICY "Users can insert their own requests"
  ON requests_schema.solicitudes_servicio
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id IS NOT NULL);

-- Allow users to view their own requests
CREATE POLICY "Users can view their own requests"
  ON requests_schema.solicitudes_servicio
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Allow users to update their own requests
CREATE POLICY "Users can update their own requests"
  ON requests_schema.solicitudes_servicio
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Allow users to delete their own requests
CREATE POLICY "Users can delete their own requests"
  ON requests_schema.solicitudes_servicio
  FOR DELETE
  USING (auth.uid()::text = user_id);

-- Grant permissions to service_role
GRANT ALL PRIVILEGES ON requests_schema.solicitudes_servicio TO service_role;
GRANT USAGE ON SCHEMA requests_schema TO service_role;
