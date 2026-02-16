'use server'

import { API_URL } from '@/app/constants'
import { fetcher } from '../lib/fetcher'
import { UpdateProfileData } from '@/types/profile.type'

/**
 * Get current user profile
 */
export async function getProfile(token: string) {
  try {
    const response = await fetcher(`${API_URL}/api/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch profile';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `Failed to fetch profile with status ${response.status}`;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    const responseData = await response.json();
    
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

/**
 * Update user profile
 */
export async function updateProfile(token: string, data: UpdateProfileData) {
  try {
    console.log('Attempting to update profile');
    
    const response = await fetcher(`${API_URL}/api/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update profile';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error('Update profile error:', errorData);
      } catch (e) {
        errorMessage = `Failed to update profile with status ${response.status}`;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    const responseData = await response.json();
    console.log('Profile updated successfully');
    
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}