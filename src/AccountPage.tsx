import { useState } from 'react'
import './AccountPage.css'

type AccountPageProps = { onBack: () => void }

export default function AccountPage({ onBack }: AccountPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const switchMode = (next: 'login' | 'signup') => {
    setMode(next)
    setSubmitted(false)
  }

  return (
    <main className="account-page">
      <button type="button" className="account-back" onClick={onBack}>← 홈으로</button>
      <section className="account-card">
        <a className="account-brand" href="#home" onClick={(event) => { event.preventDefault(); onBack() }}>
          <img src="/assets/cocky-logo.png" alt="" /> Cocky
        </a>
        <div className="account-tabs" role="tablist" aria-label="계정 메뉴">
          <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'selected' : ''} onClick={() => switchMode('login')}>로그인</button>
          <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'selected' : ''} onClick={() => switchMode('signup')}>회원가입</button>
        </div>
        <div className="account-heading">
          <span className="scene-label">WELCOME TO COCKY</span>
          <h1>{mode === 'login' ? '다시 만나 반가워요' : '콕키와 시작해요'}</h1>
          <p>{mode === 'login' ? '로그인하고 오늘의 문제를 이어 풀어보세요.' : '계정을 만들고 매일 한 문제씩 도전해보세요.'}</p>
        </div>
        <form className="account-form" noValidate onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
          {mode === 'signup' && <label>이름<input value={name} onChange={(event) => setName(event.target.value)} placeholder="이름을 입력하세요" autoComplete="name" />{submitted && !name.trim() && <span className="field-error">이름을 입력해주세요.</span>}</label>}
          <label>이메일<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" autoComplete="email" aria-invalid={submitted && !emailValid} />{submitted && !emailValid && <span className="field-error">올바른 이메일 주소를 입력해주세요.</span>}</label>
          <label>비밀번호<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="8자 이상 입력하세요" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} aria-invalid={submitted && password.length < 8} />{submitted && password.length < 8 && <span className="field-error">비밀번호는 8자 이상 입력해주세요.</span>}</label>
          {mode === 'login' && <button type="button" className="forgot-password">비밀번호를 잊으셨나요?</button>}
          {submitted && emailValid && password.length >= 8 && (mode === 'login' || name.trim()) && <p className="account-notice" role="status">계정 API 연결 후 이용할 수 있습니다.</p>}
          <button className="account-submit" type="submit">{mode === 'login' ? '로그인' : '회원가입'} <span>→</span></button>
        </form>
        <p className="account-switch">{mode === 'login' ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'} <button type="button" onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? '회원가입' : '로그인'}</button></p>
      </section>
    </main>
  )
}
