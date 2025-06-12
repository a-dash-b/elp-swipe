
-- Add indexes for better performance on team finder queries
CREATE INDEX IF NOT EXISTS idx_responses_group_member_response ON public.responses(group_code, member_code, response);
CREATE INDEX IF NOT EXISTS idx_responses_member_project ON public.responses(member_code, project_code, response);

-- Create a function to check if a user has completed their selections
CREATE OR REPLACE FUNCTION public.user_has_completed_selections(
  p_group_code TEXT,
  p_member_code TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.responses 
    WHERE group_code = p_group_code 
    AND member_code = p_member_code
    LIMIT 1
  );
$$;

-- Create a function to get team member count for a group
CREATE OR REPLACE FUNCTION public.get_team_member_count(p_group_code TEXT)
RETURNS INTEGER
LANGUAGE SQL
STABLE
AS $$
  SELECT COUNT(DISTINCT member_code)
  FROM public.responses
  WHERE group_code = p_group_code;
$$;

-- Create a function to find users with common projects
CREATE OR REPLACE FUNCTION public.find_similar_users(
  p_member_code TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  similar_member_code TEXT,
  common_projects_count INTEGER,
  common_project_codes TEXT[]
)
LANGUAGE SQL
STABLE
AS $$
  WITH user_projects AS (
    SELECT project_code
    FROM public.responses
    WHERE member_code = p_member_code
    AND response = 1
  ),
  other_users AS (
    SELECT 
      r.member_code,
      ARRAY_AGG(r.project_code) as project_codes,
      COUNT(*) as total_likes
    FROM public.responses r
    WHERE r.member_code != p_member_code
    AND r.response = 1
    GROUP BY r.member_code
  ),
  similarity_scores AS (
    SELECT 
      ou.member_code,
      ARRAY(
        SELECT UNNEST(ou.project_codes)
        INTERSECT
        SELECT project_code FROM user_projects
      ) as common_codes,
      CARDINALITY(ARRAY(
        SELECT UNNEST(ou.project_codes)
        INTERSECT
        SELECT project_code FROM user_projects
      )) as common_count
    FROM other_users ou
  )
  SELECT 
    member_code,
    common_count,
    common_codes
  FROM similarity_scores
  WHERE common_count > 0
  ORDER BY common_count DESC
  LIMIT p_limit;
$$;
