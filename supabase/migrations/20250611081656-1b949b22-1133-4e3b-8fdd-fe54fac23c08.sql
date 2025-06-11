
-- Create proj table for CSV uploads
CREATE TABLE IF NOT EXISTS public.proj (
    id BIGSERIAL PRIMARY KEY,
    code TEXT,
    description TEXT,
    sec TEXT,
    cat TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional - you can modify policies as needed)
ALTER TABLE public.proj ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can restrict this later)
CREATE POLICY "Allow all operations on proj" ON public.proj
    FOR ALL USING (true);
