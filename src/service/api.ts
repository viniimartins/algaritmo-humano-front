import axios, { AxiosError } from 'axios'
import { getSession, signOut } from 'next-auth/react'
import qs from 'qs'

import { env } from '@/env'

const baseURL = env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
})

let token: string | null = null

async function getToken() {
  if (!token) {
    const session = await getSession()

    if (session?.user.token) {
      token = session.user.token
    } else {
      token = null
    }
  }

  return token
}

api.interceptors.request.use(async (config) => {
  await getToken()

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error: AxiosError) {
    if (error?.response?.status === 401) {
      await signOut({
        redirect: true,
        callbackUrl: '/login',
      })
    }

    return Promise.reject(error)
  },
)
