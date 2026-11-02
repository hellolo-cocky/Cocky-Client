import { useMemo, useState } from 'react'
import './App.css'
import AccountPage from './AccountPage'
import ProblemDetailPage, { type ProblemItem } from './ProblemDetailPage'
import CodeEditorPage from './CodeEditorPage'
import RankingPage from './RankingPage'
import BoardPage from './BoardPage'
import SchedulePage from './SchedulePage'
import LearningPage from './LearningPage'

type Problem = {
  number: string
  title: string
  tags: string[]
  level: 'Bronze' | 'Normal' | 'Gold'
  accuracy: number
}

const problems: Problem[] = [
  { number: '1001', title: 'A+B', tags: ['수학', '구현'], level: 'Bronze', accuracy: 53.4 },
  { number: '10828', title: '스택', tags: ['자료구조', '스택'], level: 'Normal', accuracy: 37.8 },
  { number: '1920', title: '수 찾기', tags: ['정렬', '이분 탐색'], level: 'Normal', accuracy: 30.1 },
  { number: '1759', title: '암호 만들기', tags: ['백트래킹', '조합'], level: 'Gold', accuracy: 44.7 },
]

const levels = ['전체', 'Bronze', 'Normal', 'Gold'] as const

function App() {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<(typeof levels)[number]>('전체')
  const [sortLowFirst, setSortLowFirst] = useState(true)
  const [code, setCode] = useState('import sys\na, b = map(int, input().split())\nprint(a + b)')
  const [submitted, setSubmitted] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [problemView, setProblemView] = useState<'list' | 'detail' | 'editor'>('list')
  const [showRanking, setShowRanking] = useState(false)
  const [showBoard, setShowBoard] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showLearning, setShowLearning] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState<ProblemItem>({ id: 1001, title: 'A+B', level: 'Bronze', rate: '53.4%', tags: ['수학', '구현'] })

  const visibleProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return problems
      .filter((problem) => level === '전체' || problem.level === level)
      .filter((problem) => {
        const searchable = `${problem.number} ${problem.title} ${problem.tags.join(' ')}`.toLowerCase()
        return searchable.includes(normalizedQuery)
      })
      .sort((first, second) => sortLowFirst ? first.accuracy - second.accuracy : second.accuracy - first.accuracy)
  }, [level, query, sortLowFirst])

  const startSolving = () => document.querySelector('#active-problem')?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  if (showAccount) return <AccountPage onBack={() => setShowAccount(false)} />
  if (showRanking) return <RankingPage onBack={() => setShowRanking(false)} />
  if (showBoard) return <BoardPage onBack={() => setShowBoard(false)} />
  if (showSchedule) return <SchedulePage onBack={() => setShowSchedule(false)} />
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
        <button className="login-button" type="button" onClick={() => setShowAccount(true)}>로그인</button>
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
                <div><strong>안녕하세요! 김준호 님</strong><span>알고리즘 새싹 개발자</span></div>
              </div>
              <div className="progress-heading"><span>진행률</span><span className="progress-animals" aria-hidden="true">🐢</span><div className="progress-track"><i /></div><span className="progress-animals" aria-hidden="true">🐇</span></div>
              <div className="week-count">이번주 푼 문제 <span>— — —</span> 18</div>
            </section>
            <section className="stats-card" aria-label="문제 풀이 통계">
              <p>Bronze 4 <span className="text-muted">Normal 6</span> <span className="gold-text">Gold 2</span></p>
              <p><span className="java-text">Java 2</span> <span className="python-text">Python 7</span> <span className="c-text">C 3</span></p>
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
            <button className="sort-button" type="button" onClick={() => setSortLowFirst((value) => !value)} aria-label="정답률 정렬 변경">정답률 {sortLowFirst ? '낮은순' : '높은순'} <span aria-hidden="true">↕</span></button>
          </div>
          <div className="problem-grid" aria-live="polite">
            {visibleProblems.length ? visibleProblems.map((problem) => (
              <article className="problem-card" key={problem.number} role="button" tabIndex={0} onClick={() => { setSelectedProblem({ id: Number(problem.number), title: problem.title, level: problem.level, rate: `${problem.accuracy.toFixed(1)}%`, tags: problem.tags }); setProblemView('detail') }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedProblem({ id: Number(problem.number), title: problem.title, level: problem.level, rate: `${problem.accuracy.toFixed(1)}%`, tags: problem.tags }); setProblemView('detail') } }}>
                <div className="problem-main"><h3>{problem.number}번 {problem.title}</h3><div className="tag-list">{problem.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div>
                <div className="problem-meta"><span className={`rank ${problem.level.toLowerCase()}`}>{problem.level}</span><div className="accuracy"><span>정답률</span><strong>{problem.accuracy.toFixed(1)}%</strong></div></div>
              </article>
            )) : <p className="empty-state">검색 조건에 맞는 문제가 없습니다.</p>}
          </div>
        </section>

        <section className="active-section" id="active-problem">
          <div className="section-heading"><span className="scene-label">계속 풀기</span><h2>Now active</h2><span className="section-caption">이어 풀던 문제로 돌아가세요</span></div>
          <div className="active-grid">
            <article className="active-problem-card"><span className="active-kicker">오늘의 문제</span><h3>1001번 A+B</h3><p>두 정수 A와 B를 입력받아 A+B를 출력합니다.</p><button className="text-button" type="button" onClick={() => document.querySelector<HTMLTextAreaElement>('.code-editor')?.focus()}>문제 이어 풀기 <span aria-hidden="true">→</span></button></article>
            <form className="editor-card" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
              <label htmlFor="solution-code">Python <span className="editor-dot" aria-hidden="true">●</span></label>
              <textarea id="solution-code" className="code-editor" value={code} onChange={(event) => { setCode(event.target.value); setSubmitted(false) }} spellCheck={false} aria-label="Python 코드 편집기" />
              <button className="editor-submit" type="submit">제출하기</button>
            </form>
            <section className="result-card" aria-live="polite">
              <div className="result-heading"><h3>제출 결과</h3><span className="result-menu" aria-hidden="true">···</span></div>
              <div className="result-body"><span className={submitted ? 'accepted-badge submitted' : 'accepted-badge'}>{submitted ? 'Accepted' : 'Accepted'}</span><span className="result-meta">40 ms · 31256 KB</span></div>
              <p className="result-footnote">{submitted ? '정답입니다! 풀이 기록에 저장했어요.' : '최근 제출이 정답으로 처리됐어요.'}</p>
            </section>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
