-- ============================================================================
-- Phase 3B: RBAC Hardening — Admin-Only RPCs
-- ============================================================================

-- 1. Admin-only RPC: Assign a role to a user
-- Only callable by users with 'admin' role
CREATE OR REPLACE FUNCTION public.assign_role(_target_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Only admins can assign roles';
  END IF;
  
  -- Insert role (ignore if already exists due to unique constraint)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_target_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

-- 2. Admin-only RPC: Revoke a role from a user
CREATE OR REPLACE FUNCTION public.revoke_role(_target_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Only admins can revoke roles';
  END IF;
  
  DELETE FROM public.user_roles
  WHERE user_id = _target_user_id AND role = _role;
  
  RETURN TRUE;
END;
$$;

-- 3. Admin-only RPC: List all users with their roles
-- Returns a table of user_id, email, full_name, and roles array
CREATE OR REPLACE FUNCTION public.list_users_with_roles()
RETURNS TABLE(
  user_id uuid,
  email text,
  full_name text,
  roles app_role[]
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Only admins can list users with roles';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.email,
    p.full_name,
    COALESCE(
      (SELECT array_agg(r.role) FROM public.user_roles r WHERE r.user_id = p.id),
      '{}'::app_role[]
    ) as roles
  FROM public.user_profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- 4. Add a policy for admins to view all user profiles (needed for user management)
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));