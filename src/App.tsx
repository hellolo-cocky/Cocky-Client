import { useEffect, useState, type KeyboardEvent } from 'react'
import avatar from './assets/avatar.svg'
import cockyLogo from './assets/cocky-logo.png'
import rabbit from './assets/rabbit.png'
import searchIcon from './assets/search-magnifying-glass.svg'
import turtle from './assets/turtle.png'
import './App.css'

const allProblems = [
  { title: '1001번 A+B', tags: ['수학', '구현'], level: 'Bronze', rate: 53.4 },
  { title: '1920번 수 찾기', tags: ['정렬', '이분 탐색'], level: 'Normal', rate: 30.1 },
  { title: '10828번 스택', tags: ['자료구조', '스택'], level: 'Normal', rate: 37.8 },
  { title: '1759번 암호 만들기', tags: ['백트래킹', '조합'], level: 'Gold', rate: 44.7 },
  { title: '2751번 수 정렬하기', tags: ['정렬'], level: 'Bronze', rate: 42.3 },
  { title: '1005번 ACM Craft', tags: ['동적계획법', '위상정렬'], level: 'Gold', rate: 25.6 },
]

const navItems = ['문제', '학습', '랭킹', '게시판', '회고']
const difficultyFilters = ['Bronze', 'Normal', 'Gold']
const sortOptions = ['최신 순', '정답률 낮은 순', '정답률 높은 순']

const problemSelectionTemplates = [
  { title: '1001번 A+B', language: 'Python', level: 'Normal', rate: '30.1%' },
  { title: '1920번 수 찾기', language: 'C', level: 'Normal', rate: '30.1%' },
  { title: '10828번 스택', language: 'Python', level: 'Normal', rate: '37.8%' },
  { title: '1759번 암호 만들기', language: 'Java', level: 'Gold', rate: '44.7%' },
  { title: '2751번 수 정렬하기', language: 'C', level: 'Normal', rate: '42.3%' },
  { title: '1005번 ACM Craft', language: 'Java', level: 'Gold', rate: '25.6%' },
  { title: '11720번 숫자의 합', language: 'Python', level: 'Normal', rate: '47.9%' },
  { title: '1152번 단어의 개수', language: 'Python', level: 'Normal', rate: '34.4%' },
  { title: '1260번 DFS와 BFS', language: 'Java', level: 'Normal', rate: '36.2%' },
  { title: '1931번 회의실 배정', language: 'C', level: 'Gold', rate: '38.9%' },
]

const PROBLEM_PAGE_SIZE = 10
const problemSelectionItems = Array.from({ length: 30 }, (_, index) => {
  const template = problemSelectionTemplates[index % problemSelectionTemplates.length]
  return {
    ...template,
    id: index + 1,
  }
})

function ChevronIcon({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return (
    <svg
      width="10"
      height="16"
      viewBox="0 0 10 16"
      fill="none"
      style={{ transform: direction === 'left' ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      <path
        d="M1 1L9 8L1 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SceneTitle({ scene, title }: { scene: string; title: string }) {
  return (
    <section className="section-title">
      <span className="scene-pill">{scene}</span>
      <h2>{title}</h2>
    </section>
  )
}

function ProblemSelectionPage({ onRankingClick }: { onRankingClick: () => void }) {
  const [activeTab, setActiveTab] = useState('문제 목록')
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(problemSelectionItems.length / PROBLEM_PAGE_SIZE)
  const currentProblems = problemSelectionItems.slice(
    (currentPage - 1) * PROBLEM_PAGE_SIZE,
    currentPage * PROBLEM_PAGE_SIZE,
  )

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  return (
    <section className="problem-page">
      <div className="problem-page-heading">
        <div>
          <SceneTitle scene="SCENE 01" title="시작하기 후 문제 선택" />
          <p>
            홈의 시작하기 버튼을 누르면 오늘 추천 문제와 문제 목록으로 이동하고,
            선택한 문제는 풀이 화면으로 이어집니다.
          </p>
        </div>
      </div>

      <article className="problem-selection-card">
        <h2>풀이 할 문제를 선택하세요</h2>

        <div className="problem-selection-toolbar">
          <div className="problem-selection-tabs">
            {['문제 목록', '추천 문제 풀기', '최근 풀이'].map((tab) => (
              <button
                className={activeTab === tab ? 'active' : ''}
                key={tab}
                type="button"
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="problem-selection-actions">
            <button type="button">피드백 보기</button>
            <button type="button" onClick={onRankingClick}>랭킹 보기</button>
          </div>
        </div>

        <div className="problem-selection-list">
          {currentProblems.map((problem) => (
            <article className="problem-selection-row" key={problem.id}>
              <strong>{problem.title}</strong>
              <span className="problem-language">{problem.language}</span>
              <span className={`problem-level ${problem.level.toLowerCase()}`}>
                {problem.level}
              </span>
              <span className="problem-rate">{problem.rate}</span>
              <button type="button">풀기</button>
            </article>
          ))}
        </div>

        <nav className="problem-pagination" aria-label="문제 목록 페이지">
          <button
            className="arrow"
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            <ChevronIcon direction="left" />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              className={currentPage === page ? 'active' : ''}
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="arrow"
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          >
            <ChevronIcon direction="right" />
          </button>
        </nav>
      </article>
    </section>
  )
}

function App() {
  const [activeNav, setActiveNav] = useState(-1)
  const [selectedDifficulty, setSelectedDifficulty] = useState(0)
  const [sortBy, setSortBy] = useState('최신순')
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const userInfo = {
    name: '김민준',
    number: '1206',
    department: '소프트웨어 개발과',
    solvedThisWeek: 18,
    bronze: 4,
    normal: 6,
    gold: 2,
    java: 2,
    python: 7,
    c: 3,
  }

  const profileStats = isLoggedIn
    ? userInfo
    : {
        ...userInfo,
        solvedThisWeek: 0,
        bronze: 0,
        normal: 0,
        gold: 0,
        java: 0,
        python: 0,
        c: 0,
      }

  const resetProblemControls = () => {
    setSelectedDifficulty(0)
    setSortBy('최신 순')
    setSearchQuery('')
    setAppliedSearchQuery('')
    setShowSortDropdown(false)
  }

  useEffect(() => {
    resetProblemControls()
  }, [activeNav])

  const handleNavClick = (index: number) => {
    resetProblemControls()
    setActiveNav(index)
  }

  const handleStartClick = () => {
    handleNavClick(1)
  }

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery.trim())
  }

  const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getSortedProblems = (problems: typeof allProblems) => {
    const sorted = [...problems]
    switch (sortBy) {
      case '정답률 낮은 순':
        return sorted.sort((a, b) => a.rate - b.rate)
      case '정답률 높은 순':
        return sorted.sort((a, b) => b.rate - a.rate)
      case '최신 순':
        return sorted
      default:
        return sorted
    }
  }

  const filterProblems = () => {
    let filtered = allProblems
    if (selectedDifficulty > 0) {
      filtered = filtered.filter(p => p.level === difficultyFilters[selectedDifficulty - 1])
    }

    if (appliedSearchQuery) {
      const normalizedQuery = appliedSearchQuery.toLowerCase()
      filtered = filtered.filter((problem) => {
        const problemNumber = problem.title.match(/\d+/)?.[0] ?? ''
        return (
          problem.title.toLowerCase().includes(normalizedQuery) ||
          problemNumber.includes(normalizedQuery) ||
          problem.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
        )
      })
    }

    return getSortedProblems(filtered)
  }

  const filteredProblems = filterProblems()

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#" onClick={(e) => {
          e.preventDefault()
          handleNavClick(-1)
        }} aria-label="Cocky home">
          <img className="brand-mark" src={cockyLogo} alt="" />
          <span>Cocky</span>
        </a>
        <nav className="nav" aria-label="주요 메뉴">
          {navItems.map((item, index) => (
            <a
              className={activeNav === index + 1 ? 'active' : ''}
              href="#"
              key={item}
              onClick={(e) => {
                e.preventDefault()
                handleNavClick(index + 1)
              }}
            >
              {item}
            </a>
          ))}
        </nav>
        <button className="login-button" type="button" onClick={handleLogin}>
          {isLoggedIn ? '로그아웃' : '로그인'}
        </button>
      </header>

      <main className={`workspace ${activeNav === 1 ? 'problem-page-workspace' : ''}`}>
        <div className="content">
          {activeNav === -1 && (
            <>
              <SceneTitle scene="SCENE 01" title="Home" />

              <section className="hero-row">
                <article className="hero-card">
                  <div className="hero-copy-block">
                    <h1>
                      코딩 문제를 풀고<br />
                      실력을 키워보세요.
                    </h1>
                    <p>
                      백준처럼 딱딱하지 않게, 집중하기 좋은 회색톤 개발자 대시보드로<br />
                      문제 탐색부터 풀이까지 한 번에 이어집니다.
                    </p>
                  </div>
                  <button className="primary-button" type="button" onClick={handleStartClick}>
                    시작하기
                  </button>
                  <aside className="terminal-card" aria-label="오늘의 추천 문제">
                    <span>$ solve today</span>
                    <div>
                      <strong>1001 A+B</strong>
                      <strong>10828 Stack</strong>
                      <strong>1920 Search</strong>
                    </div>
                    <span>status: focused</span>
                  </aside>
                </article>

                <aside className="profile-wrap">
                  <article className="profile-card-unified">
                    <h2>내 프로필</h2>
                    {isLoggedIn ? (
                      <div className="profile-row">
                        <img className="avatar" src={avatar} alt="" />
                        <div>
                          <strong>안녕하세요! {userInfo.name} 님</strong>
                          <p>{userInfo.number} {userInfo.department}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="login-empty">
                        <strong>아직 로그인하지 않았습니다</strong>
                        <p>
                          로그인하면 이번 주 풀이 현황과
                          <br />
                          학습 통계를 확인할 수 있어요.
                        </p>
                      </div>
                    )}
                    <div className="progress-row">
                      <strong>진행률</strong>
                      <img className="pace-icon turtle" src={turtle} alt="" />
                      <div className="progress-track">
                        <div className="progress-fill-bars">
                          {[...Array(9)].map((_, i) => (
                            <div
                              key={i}
                              className={`progress-bar ${
                                i < Math.min(profileStats.solvedThisWeek, 9) ? 'filled' : ''
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <img className="pace-icon rabbit" src={rabbit} alt="" />
                    </div>
                    <p className="weekly-count">이번 주 푼 문제&nbsp; --- &nbsp; <b>{profileStats.solvedThisWeek}</b></p>
                    <div className="stat-row">
                      <span className="bronze-stat">Bronze <b>{profileStats.bronze}</b></span>
                      <span className="normal-stat">Normal <b>{profileStats.normal}</b></span>
                      <span className="gold-stat">Gold <b>{profileStats.gold}</b></span>
                      <span className="java-stat">Java <b>{profileStats.java}</b></span>
                      <span className="python-stat">Python <b>{profileStats.python}</b></span>
                      <span className="c-stat">C <b>{profileStats.c}</b></span>
                    </div>
                  </article>
                </aside>
              </section>

              <SceneTitle scene="SCENE 02" title="Problem" />

              <section className="filter-panel" aria-label="문제 필터">
                <label className="search-box">
                  <img src={searchIcon} alt="" />
                  <input
                    placeholder="문제 제목, 태그, 번호로 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                  />
                  <button type="button" onClick={handleSearch}>검색</button>
                </label>
                <div className="filter-tabs">
                  {['전체', ...difficultyFilters].map((filter, index) => (
                    <button
                      className={index === selectedDifficulty ? 'selected' : ''}
                      type="button"
                      key={filter}
                      onClick={() => setSelectedDifficulty(index)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="sort-dropdown-wrapper">
                  <button
                    className="sort-button"
                    type="button"
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                  >
                    {sortBy}
                  </button>
                  {showSortDropdown && (
                    <ul className="sort-dropdown-menu">
                      {sortOptions.map(option => (
                        <li key={option}>
                          <button
                            type="button"
                            onClick={() => {
                              setSortBy(option)
                              setShowSortDropdown(false)
                            }}
                          >
                            {option}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <section className="problem-grid" aria-label="추천 문제">
                {filteredProblems.length > 0 ? filteredProblems.map((problem) => (
                  <article className="problem-card" key={problem.title}>
                    <div>
                      <h3>{problem.title}</h3>
                      <div className="tag-row">
                        {problem.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="problem-meta">
                      <span className={problem.level.toLowerCase()}>{problem.level}</span>
                      <div className="acceptance">
                        <small>정답률</small>
                        <strong>{problem.rate.toFixed(1)}%</strong>
                      </div>
                    </div>
                  </article>
                )) : (
                  <p className="empty-result">검색 조건에 맞는 문제가 없습니다.</p>
                )}
              </section>
            </>
          )}

          {activeNav === 1 && (
            <ProblemSelectionPage onRankingClick={() => handleNavClick(3)} />
          )}

          {activeNav === 2 && (
            <SceneTitle scene="SCENE 03" title="Study" />
          )}

          {activeNav === 3 && (
            <SceneTitle scene="SCENE 04" title="Ranking" />
          )}

          {activeNav === 4 && (
            <SceneTitle scene="SCENE 05" title="Board" />
          )}

          {activeNav === 5 && (
            <SceneTitle scene="SCENE 06" title="Retrospective" />
          )}
        </div>
      </main>
    </>
  )
}

export default App
