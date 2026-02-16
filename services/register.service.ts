'use server'

import { API_URL } from '@/app/constants'
import { fetcher } from '../lib/fetcher'
import { RegisterFormData } from '@/types/auth.type'

export async function register(data: RegisterFormData) {
  try {
    console.log('Attempting to register user:', { 
      email: data.email, 
      username: data.username 
    });
    
    const response = await fetcher(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Register response status:', response.status);

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = 'Registration failed';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error('Registration error:', errorData);
      } catch (e) {
        // Response body is not JSON or empty
        console.error('Failed to parse error response');
        errorMessage = `Registration failed with status ${response.status}`;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    const responseData = await response.json();
    console.log('Registration successful');
    
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}