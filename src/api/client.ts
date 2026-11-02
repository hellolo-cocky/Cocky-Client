import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from './types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api/v1' : 'https://cocky-api.https.gsmsv.site/api/v1')).replace(/\/$/, '')
const ACCESS_TOKEN_KEY = 'cocky.accessToken'
const REFRESH_TOKEN_KEY = 'cocky.refreshToken'

export const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })
const refreshClient = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })

export const tokenStore = {
  getAccess: () => sessionStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => sessionStorage.getItem(REFRESH_TOKEN_KEY),
  set: (accessToken: string, refreshToken: string) => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  clear: () => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

type RetriableRequest = InternalAxiosRequestConfig & { _retriedAfterRefresh?: boolean }
let refreshInFlight: Promise<string | null> | null = null

api.interceptors.request.use((config) => {
  const accessToken = tokenStore.getAccess()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

api.interceptors.response.use((response) => response, async (error: AxiosError<ApiError>) => {
  const request = error.config as RetriableRequest | undefined
  const code = error.response?.data?.code
  if (error.response?.status !== 401 || !request || request._retriedAfterRefresh) {
    return Promise.reject(error)
  }

  if (code === 'TOKEN_EXPIRED' && tokenStore.getRefresh()) {
    request._retriedAfterRefresh = true
    refreshInFlight ??= refreshClient.put('/auth/reissue', { refreshToken: tokenStore.getRefresh() })
      .then(({ data }: { data: { accessToken: string; refreshToken: string } }) => {
        tokenStore.set(data.accessToken, data.refreshToken)
        return data.accessToken
      })
      .catch(() => null)
      .finally(() => { refreshInFlight = null })

    const accessToken = await refreshInFlight
    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`
      return api(request)
    }
  }

  if (code === 'TOKEN_INVALID' || code === 'TOKEN_EXPIRED') {
    tokenStore.clear()
    window.dispatchEvent(new CustomEvent('cocky:session-expired'))
  }
  return Promise.reject(error)
})

export function getApiErrorMessage(error: unknown, fallback = '요청을 처리하지 못했습니다.') {
  if (axios.isAxiosError<ApiError>(error)) {
    const code = error.response?.data?.code
    if (!code) return fallback
    const messages: Record<string, string> = {
      INVALID_REQUEST: '요청 값을 확인해주세요.',
      TOKEN_EXPIRED: '로그인이 만료되었습니다. 다시 로그인해주세요.',
      TOKEN_INVALID: '로그인 정보를 확인할 수 없습니다. 다시 로그인해주세요.',
      SIGNUP_NOT_ALLOWED: 'DataGSM 계정의 가입 조건을 확인해주세요.',
      OAUTH_CODE_INVALID: '인증 코드가 유효하지 않습니다. 다시 로그인해주세요.',
    }
    return messages[code] || `요청 오류 (${code})`
  }
  return fallback
}
