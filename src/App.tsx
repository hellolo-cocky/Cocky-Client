import { useCallback, useEffect, useState, type FormEvent } from 'react'
import './App.css'
import AccountPage from './AccountPage'
import ProblemDetailPage, { type ProblemItem } from './ProblemDetailPage'
import CodeEditorPage from './CodeEditorPage'
import RankingPage from './RankingPage'
import BoardPage from './BoardPage'
import SchedulePage from './SchedulePage'
import LearningPage from './LearningPage'
import { authApi, learningApi, problemsApi, submissionsApi } from './api/services'
import { getApiErrorMessage, tokenStore } from './api/client'
import type { SubmissionResult, UserMe } from './api/types'

type Problem = {
  number: string
  title: string
  tags: string[]
  level: 'Bronze' | 'Normal' | 'Gold'
  accuracy: number
  language?: string
}

const levels = ['전체', 'Bronze', 'Normal', 'Gold'] as const

function App() {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<(typeof levels)[number]>('전체')
  const [sortPopular, setSortPopular] = useState(false)
  const [problems, setProblems] = useState<Problem[]>([])
  const [problemError, setProblemError] = useState('')
  const [profileError, setProfileError] = useState('')
  const [user, setUser] = useState<UserMe | null>(null)
  const [code, setCode] = useState('import sys\na, b = map(int, input().split())\nprint(a + b)')
  const [inlineSubmission, setInlineSubmission] = useState<SubmissionResult | null>(null)
  const [inlineError, setInlineError] = useState('')
  const [showAccount, setShowAccount] = useState(() => new URLSearchParams(window.location.search).has('code') || new URLSearchParams(window.location.search).has('error'))
  const [problemView, setProblemView] = useState<'list' | 'detail' | 'editor'>('list')
  const [showRanking, setShowRanking] = useState(false)
  const [showBoard, setShowBoard] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showLearning, setShowLearning] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState<ProblemItem>({ id: 1001, title: 'A+B', level: 'Bronze', rate: '53.4%', tags: ['수학', '구현'] })

  useEffect(() => {
    if (!tokenStore.getAccess()) return
    let active = true
    const difficulty = level === 'Bronze' ? 'EASY' : level === 'Normal' ? 'NORMAL' : level === 'Gold' ? 'HARD' : undefined
    problemsApi.list({ page: 0, size: 20, difficulty, keyword: query.trim() || undefined, sort: sortPopular ? 'POPULAR' : 'LATEST' })
      .then((result) => {
        if (!active) return
        setProblems(result.content.map((item) => ({
          number: String(item.problemId), title: item.title, tags: item.tags || [], language: item.language,
          level: item.difficulty === 'EASY' ? 'Bronze' : item.difficulty === 'HARD' ? 'Gold' : 'Normal', accuracy: 0,
        })))
        setProblemError('')
      })
      .catch((error) => { if (active) setProblemError(getApiErrorMessage(error, '문제 목록을 불러오지 못했습니다.')) })
    return () => { active = false }
  }, [level, query, sortPopular, user])

  useEffect(() => {
    if (!tokenStore.getAccess()) return
    let active = true
    learningApi.user().then((profile) => { if (active) setUser(profile) }).catch(() => { if (active) setUser(null) })
    const onExpired = () => setUser(null)
    window.addEventListener('cocky:session-expired', onExpired)
    return () => { active = false; window.removeEventListener('cocky:session-expired', onExpired) }
  }, [showAccount])

  useEffect(() => {
    const firstProblem = problems[0]
    if (!firstProblem) return
    setSelectedProblem((current) => current.id === 1001 && current.title === 'A+B' ? {
      id: Number(firstProblem.number), title: firstProblem.title, level: firstProblem.level,
      rate: '—', tags: firstProblem.tags, language: firstProblem.language,
    } : current)
  }, [problems])

  const handleAuthenticated = useCallback((profile: UserMe) => {
    setUser(profile)
    setShowAccount(false)
    window.history.replaceState({}, '', window.location.pathname)
  }, [])

  const submitHomeCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setInlineError('')
    try {
      setInlineSubmission(await submissionsApi.submit({ problemId: selectedProblem.id, language: 'PYTHON', code }))
    } catch (error) { setInlineError(getApiErrorMessage(error, '제출하지 못했습니다.')) }
  }

  const toggleAnonymous = async () => {
    if (!user) return
    setProfileError('')
    try {
      await learningApi.setAnonymous(!user.isAnonymousDefault)
      setUser(await learningApi.user())
    } catch (error) { setProfileError(getApiErrorMessage(error, '익명 설정을 변경하지 못했습니다.')) }
  }

  const startSolving = () => document.querySelector('#active-problem')?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  if (showAccount) return <AccountPage onBack={() => { setShowAccount(false); window.history.replaceState({}, '', window.location.pathname) }} onAuthenticated={handleAuthenticated} />
  if (showRanking) return <RankingPage onBack={() => setShowRanking(false)} />
  if (showBoard) return <BoardPage onBack={() => setShowBoard(false)} />
  if (showSchedule) return <SchedulePage onBack={() => setShowSchedule(false)} onSelectProblem={(problem) => { setSelectedProblem(problem); setShowSchedule(false); setProblemView('detail') }} />
  if (showLearning) return <LearningPage onBack={() => setShowLearning(false)} />
  if (problemView === 'detail') return <ProblemDetailPage problem={selectedProblem} onBack={() => setProblemView('list')} onStartSolve={() => setProblemView('editor')} />
  if (problemView === 'editor') return <CodeEditorPage problem={selectedProblem} onBack={() => setProblemView('detail')} />

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Cocky 홈">
          <img src="/assets/cocky-logo.png" alt="" />
          <span>Cocky</span>
        </a>
        <nav className="main-nav" aria-label="주요 메뉴">
          <a className="active" href="#problems">문제</a>
          <a href="#schedule" onClick={(event) => { event.preventDefault(); setShowSchedule(true) }}>학습</a>
          <a href="#ranking" onClick={(event) => { event.preventDefault(); setShowRanking(true) }}>랭킹</a>
          <a href="#board" onClick={(event) => { event.preventDefault(); setShowBoard(true) }}>게시판</a>
          <a href="#learning" onClick={(event) => { event.preventDefault(); setShowLearning(true) }}>회고</a>
        </nav>
        <button className="login-button" type="button" onClick={async () => { if (user) { await authApi.signOut().catch(() => undefined); setUser(null); setProblems([]) } else setShowAccount(true) }}>{user ? '로그아웃' : '로그인'}</button>
      </header>

      <main className="home-page" id="home">
        <section className="hero-row" aria-label="홈 소개">
          <div className="hero-card">
            <div className="eyebrow">오늘도 한 문제, 콕키와 함께</div>
            <h1>코딩 문제를 풀고<br />실력을 키워보세요.</h1>
            <p>백준처럼 딱딱하지 않게, 집중하기 좋은 회색톤 개발자 대시보드로<br className="desktop-break" /> 문제 탐색부터 풀이까지 한 번에 이어집니다.</p>
            <button className="primary-button start-button" type="button" onClick={startSolving}>시작하기</button>
            <div className="terminal-card" aria-label="오늘의 풀이 목록">
              <span>$ solve today</span>
              <span>1001 A+B</span>
              <span>10828 Stack</span>
              <span>1920 Search</span>
              <span className="terminal-status">status: focused</span>
            </div>
          </div>

          <aside className="profile-column">
            <section className="profile-card" id="progress" aria-label="내 프로필과 진행률">
              <h2>내 프로필</h2>
              <div className="profile-person">
                <div className="avatar" aria-hidden="true">
                  <img className="avatar-bg" src="/assets/profile-bg.svg" alt="" />
                  <img className="avatar-body" src="/assets/profile-person.svg" alt="" />
                  <img className="avatar-head" src="/assets/profile-head.svg" alt="" />
                </div>
                <div><strong>{user ? `안녕하세요! ${user.name} 님` : '로그인 후 이용할 수 있어요'}</strong><span>{user ? `${user.grade}학년 ${user.classNo}반 · ${user.department}` : '학생 계정으로 로그인해주세요'}</span></div>
              </div>
              <div className="progress-heading"><span>익명 설정</span><span className="progress-animals" aria-hidden="true">🐢</span><div className="progress-track"><i style={{ width: user?.isAnonymousDefault ? '100%' : '0%' }} /></div><span className="progress-animals" aria-hidden="true">🐇</span></div>
              <div className="week-count">이번 주 학습 정보는 회고 화면에서 확인할 수 있습니다.</div>
              {user && <button className="anonymous-toggle" type="button" onClick={toggleAnonymous}>{user.isAnonymousDefault ? '랭킹 익명 해제' : '랭킹에서 익명으로'}</button>}
              {profileError && <p className="profile-error" role="alert">{profileError}</p>}
            </section>
            <section className="stats-card" aria-label="문제 풀이 통계">
              <p>{user ? `학번 ${user.grade}-${user.classNo}-${user.number}` : '로그인 후 학습 기록을 확인할 수 있습니다.'}</p>
              <p>{user?.isAnonymousDefault ? '랭킹 익명 모드' : user?.email || '학생 계정 지원'}</p>
            </section>
          </aside>
        </section>

        <section className="problem-section" id="problems">
          <div className="section-heading"><span className="scene-label">문제 탐색</span><h2>Problem</h2><span className="section-caption">내 수준에 맞는 문제를 찾아보세요</span></div>
          <div className="filter-bar">
            <form className="search-form" onSubmit={(event) => event.preventDefault()} role="search">
              <img src="/assets/search.svg" alt="" />
              <input aria-label="문제 검색" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="문제 제목, 태그, 번호로 검색" />
              {query && <button className="clear-search" type="button" aria-label="검색어 지우기" onClick={() => setQuery('')}>×</button>}
              <button className="primary-button search-button" type="submit">검색</button>
            </form>
            <div className="level-filters" aria-label="난이도 필터">
              {levels.map((item) => <button key={item} className={level === item ? 'level-option selected' : `level-option ${item.toLowerCase()}`} type="button" aria-pressed={level === item} onClick={() => setLevel(item)}>{item}</button>)}
            </div>
            <button className="sort-button" type="button" onClick={() => setSortPopular((value) => !value)} aria-label="문제 정렬 변경">{sortPopular ? '인기순' : '최신순'} <span aria-hidden="true">↕</span></button>
          </div>
          <div className="problem-grid" aria-live="polite">
            {!tokenStore.getAccess() ? <p className="empty-state">문제 목록을 보려면 먼저 로그인해주세요.</p> : problemError ? <p className="empty-state" role="alert">{problemError}</p> : problems.length ? problems.map((problem) => (
              <article className="problem-card" key={problem.number} role="button" tabIndex={0} onClick={() => { setSelectedProblem({ id: Number(problem.number), title: problem.title, level: problem.level, rate: `${problem.accuracy.toFixed(1)}%`, tags: problem.tags }); setProblemView('detail') }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedProblem({ id: Number(problem.number), title: problem.title, level: problem.level, rate: `${problem.accuracy.toFixed(1)}%`, tags: problem.tags }); setProblemView('detail') } }}>
                <div className="problem-main"><h3>{problem.number}번 {problem.title}</h3><div className="tag-list">{problem.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div>
                <div className="problem-meta"><span className={`rank ${problem.level.toLowerCase()}`}>{problem.level}</span><div className="accuracy"><span>언어</span><strong>{problem.language || '—'}</strong></div></div>
              </article>
            )) : <p className="empty-state">검색 조건에 맞는 문제가 없습니다.</p>}
          </div>
        </section>

        <section className="active-section" id="active-problem">
          <div className="section-heading"><span className="scene-label">계속 풀기</span><h2>Now active</h2><span className="section-caption">이어 풀던 문제로 돌아가세요</span></div>
          <div className="active-grid">
            <article className="active-problem-card"><span className="active-kicker">현재 문제</span><h3>{selectedProblem.id}번 {selectedProblem.title}</h3><p>선택한 문제의 풀이를 제출하고 채점 결과를 확인하세요.</p><button className="text-button" type="button" onClick={() => document.querySelector<HTMLTextAreaElement>('.code-editor')?.focus()}>문제 이어 풀기 <span aria-hidden="true">→</span></button></article>
            <form className="editor-card" onSubmit={submitHomeCode}>
              <label htmlFor="solution-code">Python <span className="editor-dot" aria-hidden="true">●</span></label>
              <textarea id="solution-code" className="code-editor" value={code} onChange={(event) => { setCode(event.target.value); setInlineSubmission(null) }} spellCheck={false} aria-label="Python 코드 편집기" />
              <button className="editor-submit" type="submit">제출하기</button>
            </form>
            <section className="result-card" aria-live="polite">
              <div className="result-heading"><h3>제출 결과</h3><span className="result-menu" aria-hidden="true">···</span></div>
              <div className="result-body"><span className="accepted-badge">{inlineSubmission?.verdict ?? '—'}</span><span className="result-meta">{inlineSubmission ? `${Number(inlineSubmission.score).toFixed(2)}점` : '제출 후 결과 표시'}</span></div>
              <p className="result-footnote">{inlineError || (inlineSubmission ? `${inlineSubmission.passedCount}/${inlineSubmission.totalCount} 테스트 케이스 통과` : '아직 제출 기록이 없습니다.')}</p>
            </section>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
