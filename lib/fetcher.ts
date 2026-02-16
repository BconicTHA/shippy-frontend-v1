'use server'

import { auth } from '@/auth'

const DEBUG = true

export async function fetcher(url: string, options: RequestInit = {}) {
  const { headers, ...restOptions } = options

  const session = await auth()

  if (DEBUG) {
    console.log('fetcher url', url)
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: {
      ...(restOptions.body && !(restOptions.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      Accept: 'application/json',
      ...headers,
      Authorization: `Bearer ${session?.accessToken}`,
    },
  })

  if (DEBUG) {
    console.info(`${url} response:`, response)
  }

  return response
}
