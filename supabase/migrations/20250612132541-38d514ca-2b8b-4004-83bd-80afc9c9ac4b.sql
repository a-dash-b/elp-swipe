
-- Create a table to store student names and their corresponding member codes
CREATE TABLE public.students (
  id BIGSERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  member_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on member_code for fast lookups
CREATE INDEX idx_students_member_code ON public.students(member_code);

-- Add Row Level Security (make it publicly readable since this is reference data)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read student data (for displaying names)
CREATE POLICY "Anyone can view student names" 
  ON public.students 
  FOR SELECT 
  USING (true);

-- Create policy to allow inserts (for when you upload the CSV)
CREATE POLICY "Allow inserts for student data" 
  ON public.students 
  FOR INSERT 
  WITH CHECK (true);
