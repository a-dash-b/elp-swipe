
-- Create responses table to store user interactions
CREATE TABLE IF NOT EXISTS public.responses (
    id BIGSERIAL PRIMARY KEY,
    group_code TEXT NOT NULL,
    member_code TEXT NOT NULL,
    project_code TEXT NOT NULL,
    response INTEGER NOT NULL CHECK (response IN (0, 1)), -- 0 for pass, 1 for like
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can customize this later)
CREATE POLICY "Allow all operations on responses" ON public.responses
    FOR ALL USING (true);

-- Create an index for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_responses_group_member ON public.responses(group_code, member_code);
CREATE INDEX IF NOT EXISTS idx_responses_project ON public.responses(project_code);
