import NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { fetcher } from './lib/fetcher';
import { API_URL } from './app/constants';
import { ApiAuthResponse , ApiAuthUser } from './types/auth.type';



declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      username: string;
      name: string;
      usertype: 'admin' | 'client';
      address?: string | null;
      phone?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    username: string;
    name: string;
    accessToken: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        try {
          const response = await fetcher(`${API_URL}/api/auth/dashboard/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!response.ok) {
            throw response;
          }

          const result = await response.json();
          const data: ApiAuthResponse = result.data;

          if (!data?.access_token) {
            throw response;
          }

          return {
            ...data.user,
            accessToken: data?.access_token,
          };
        } catch (error) {
          if (error instanceof Response) {
            return null;
          }

          throw new Error('An error has occurred during login request');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }

      const { exp: accessTokenExpires } = jwt.decode(
        token.accessToken as string
      );

      if (!accessTokenExpires) {
        return token;
      }

      const currentUnixTimestamp = Math.floor(Date.now() / 1000) + 10 * 60; // Add 10m to refresh before expiration
      const accessTokenHasExpired = currentUnixTimestamp > accessTokenExpires;

      if (accessTokenHasExpired) {
        return await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error) {
        throw new Error('Refresh token has expired');
      }

      session.user.id = token.id as string;
      session.user.name = token.name || '';
      session.user.email = token.email || '';
      session.user.usertype = token.usertype as 'admin' | 'client';
      session.user.username = token.username as string;
      session.user.address = token.address as string | null;
      session.user.phone = token.phone as string | null;
      session.accessToken = token.accessToken as string;


      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  events: {
    async signOut(params) {
      if ('token' in params && params.token) {
        await fetcher(`${API_URL}/api/auth/dashboard/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${params.token.accessToken}`,
          },
        });
      }
    },
  },
});

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetcher(`${API_URL}/api/dashboard/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (!response.ok) throw response;

    const refreshedAccessToken: { data: { access_token: string } } =
      await response.json();
    const { exp } = jwt.decode(refreshedAccessToken.data.access_token);

    return {
      ...token,
      accessToken: refreshedAccessToken.data.access_token,
      exp,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const jwt = {
  decode: (token: string | undefined) => {
    if (!token) return;

    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  },
};