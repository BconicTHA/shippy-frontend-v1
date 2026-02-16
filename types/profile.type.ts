export type UserProfile = {
  id: string;
  email: string;
  username: string;
  name: string;
  phone: string;
  address: string;
  usertype: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileData = {
  name?: string;
  phone?: string;
  address?: string;
};

export type ProfileResponse = {
  success: boolean;
  message: string;
  data?: UserProfile;
};