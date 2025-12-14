import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';

import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { signIn } = useAuthContext();
  const [searchParams] = useSearchParams();

  const { showNotification } = useNotificationContext();

  const loginFormSchema = yup.object({
    email: yup
      .string()
      .trim()
      .email('Please enter a valid email')
      .required('Please enter your email')
      .max(255, 'Email must be less than 255 characters'),
    password: yup
      .string()
      .required('Please enter your password')
      .min(6, 'Password must be at least 6 characters'),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  type LoginFormFields = yup.InferType<typeof loginFormSchema>;

  const redirectUser = () => {
    const redirectLink = searchParams.get('redirectTo');
    if (redirectLink) navigate(redirectLink);
    else navigate('/');
  };

  const login = handleSubmit(async (values: LoginFormFields) => {
    setLoading(true);
    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        // Handle specific Supabase auth errors
        let errorMessage = 'Sign in failed. Please try again.';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email before signing in.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many attempts. Please wait and try again.';
        }
        
        showNotification({ message: errorMessage, variant: 'danger' });
        return;
      }
      
      showNotification({ message: 'Successfully signed in. Redirecting...', variant: 'success' });
      redirectUser();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      showNotification({ message: errorMessage, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  });

  return { loading, login, control };
};

export default useSignIn;
