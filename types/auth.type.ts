export type ApiAuthUser = {
  id: string;
  email: string;
  username: string;
  name: string;
  usertype:string;
};

export type ApiAuthResponse = {
  user: ApiAuthUser;
  access_token: string;
};

export type RegisterFormData = {
  username: string
  name: string
  email: string
  usertype: 'admin' | 'client'
  password: string
  password_confirmation: string
}