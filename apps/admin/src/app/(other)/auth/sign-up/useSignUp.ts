import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { signUp } = useAuthContext();
  const { showNotification } = useNotificationContext();

  const signUpFormSchema = yup.object({
    name: yup
      .string()
      .trim()
      .required('Please enter your name')
      .max(100, 'Name must be less than 100 characters'),
    email: yup
      .string()
      .trim()
      .email('Please enter a valid email')
      .required('Please enter your email')
      .max(255, 'Email must be less than 255 characters'),
    password: yup
      .string()
      .required('Please enter a password')
      .min(6, 'Password must be at least 6 characters')
      .max(72, 'Password must be less than 72 characters'),
    acceptTerms: yup
      .boolean()
      .oneOf([true], 'You must accept the terms and conditions'),
  });

  const { control, handleSubmit, register, formState: { errors } } = useForm({
    resolver: yupResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      acceptTerms: false,
    },
  });

  type SignUpFormFields = yup.InferType<typeof signUpFormSchema>;

  const handleSignUp = handleSubmit(async (values: SignUpFormFields) => {
    setLoading(true);
    try {
      const { error } = await signUp(values.email, values.password, values.name);
      
      if (error) {
        // Handle specific Supabase auth errors
        let errorMessage = 'Sign up failed. Please try again.';
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists.';
        } else if (error.message.includes('Password should be')) {
          errorMessage = 'Password does not meet requirements.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        }
        
        showNotification({ message: errorMessage, variant: 'danger' });
        return;
      }
      
      showNotification({ 
        message: 'Account created! Please check your email to confirm your account.', 
        variant: 'success' 
      });
      navigate('/auth/sign-in');
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      showNotification({ message: errorMessage, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  });

  return { loading, handleSignUp, control, register, errors };
};

export default useSignUp;
