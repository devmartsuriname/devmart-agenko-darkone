-- Assign admin role to info@devmart.sr
INSERT INTO public.user_roles (user_id, role)
VALUES ('18edf959-6f23-4a83-9add-e5475cc20442', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;