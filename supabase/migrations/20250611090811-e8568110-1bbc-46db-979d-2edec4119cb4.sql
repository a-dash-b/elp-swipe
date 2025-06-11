
-- Create proj2 table with the specified columns (using description instead of desc)
CREATE TABLE IF NOT EXISTS public.proj2 (
    id BIGSERIAL PRIMARY KEY,
    code TEXT,
    sec TEXT,
    cat TEXT,
    description TEXT,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.proj2 ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can customize this later)
CREATE POLICY "Allow all operations on proj2" ON public.proj2
    FOR ALL USING (true);

-- Create an index on the code column for better performance
CREATE INDEX IF NOT EXISTS idx_proj2_code ON public.proj2(code);
CREATE INDEX IF NOT EXISTS idx_proj2_sec ON public.proj2(sec);
