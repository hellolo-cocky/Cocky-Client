import { useEffect, useState } from 'react'
import './AccountPage.css'
import { authApi, learningApi } from './api/services'
import { getApiErrorMessage } from './api/client'
import type { UserMe } from './api/types'

type AccountPageProps = { onBack: () => void; onAuthenticated: (user: UserMe) => void }
const OAUTH_STATE_KEY = 'cocky.datagsm.oauthState'

export default function AccountPage({ onBack, onAuthenticated }: AccountPageProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const clientId = import.meta.env.VITE_DATAGSM_CLIENT_ID as string | undefined

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (!code) {
      const oauthError = params.get('error')
      if (oauthError) setError(params.get('error_description') || 'DataGSM 인증을 완료하지 못했습니다.')
      return
    }

    const receivedState = params.get('state')
    const savedState = sessionStorage.getItem(OAUTH_STATE_KEY)
    sessionStorage.removeItem(OAUTH_STATE_KEY)
    if (!receivedState || !savedState || receivedState !== savedState) {
      setError('인증 상태가 일치하지 않습니다. 다시 로그인해주세요.')
      return
    }

    let active = true
    setBusy(true)
    authApi.signIn(code)
      .then(() => learningApi.user())
      .then((user) => { if (active) onAuthenticated(user) })
      .catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, '로그인하지 못했습니다.')) })
      .finally(() => { if (active) setBusy(false) })
    return () => { active = false }
  }, [onAuthenticated])

  const startLogin = () => {
    if (!clientId) {
      setError('VITE_DATAGSM_CLIENT_ID 설정이 필요합니다.')
      return
    }
    const state = crypto.randomUUID()
    sessionStorage.setItem(OAUTH_STATE_KEY, state)
    const redirectUri = import.meta.env.VITE_DATAGSM_REDIRECT_URI || `${window.location.origin}${window.location.pathname}`
    const url = new URL('https://oauth.authorization.datagsm.kr/v1/oauth/authorize')
    url.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: 'code', state }).toString()
    window.location.assign(url.toString())
  }

  return <main className="account-page">
    <button type="button" className="account-back" onClick={onBack}>← 홈으로</button>
    <section className="account-card">
      <a className="account-brand" href="#home" onClick={(event) => { event.preventDefault(); onBack() }}>
        <img src="/assets/cocky-logo.png" alt="" /> Cocky
      </a>
      <div className="account-heading">
        <span className="scene-label">DATAGSM ACCOUNT</span>
        <h1>{busy ? '로그인 처리 중이에요' : '학교 계정으로 시작해요'}</h1>
        <p>DataGSM 인증을 통해 콕키에 로그인합니다.</p>
      </div>
      {error && <p className="account-notice" role="alert">{error}</p>}
      {busy ? <p className="account-notice" role="status">인증 정보를 확인하고 있습니다.</p> : <button className="account-submit" type="button" onClick={startLogin}>DataGSM으로 로그인 <span>→</span></button>}
    </section>
  </main>
}
