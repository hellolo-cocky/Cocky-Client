import avatar from './assets/avatar.svg'
import checkRing from './assets/check-ring-light.svg'
import cockyLogo from './assets/cocky-logo.png'
import progressFill from './assets/progress-fill.svg'
import rabbit from './assets/rabbit.png'
import searchIcon from './assets/search-magnifying-glass.svg'
import turtle from './assets/turtle.png'
import './App.css'

const problems = [
  { title: '1001번 A+B', tags: ['수학', '구현'], level: 'Bronze', rate: '53.4%' },
  { title: '1920번 수 찾기', tags: ['정렬', '이분 탐색'], level: 'Normal', rate: '30.1%' },
  { title: '10828번 스택', tags: ['자료구조', '스택'], level: 'Normal', rate: '37.8%' },
  { title: '1759번 암호 만들기', tags: ['백트래킹', '조합'], level: 'Gold', rate: '44.7%' },
]

const navItems = ['문제', '랭킹', '게시판', '학습노트']
const filters = ['전체', 'Bronze', 'Normal', 'Gold']

function SceneTitle({ scene, title }: { scene: string; title: string }) {
  return (
    <section className="section-title">
      <span className="scene-pill">{scene}</span>
      <h2>{title}</h2>
    </section>
  )
}

function App() {
  return (
    <>
      <header className="topbar">
        <a className="brand" href="#" aria-label="Cocky home">
          <img className="brand-mark" src={cockyLogo} alt="" />
          <span>Cocky</span>
        </a>
        <nav className="nav" aria-label="주요 메뉴">
          {navItems.map((item, index) => (
            <a className={index === 0 ? 'active' : ''} href="#" key={item}>
              {item}
            </a>
          ))}
        </nav>
        <button className="login-button" type="button">
          로그인
        </button>
      </header>

      <main className="workspace">
        <div className="content">
          <SceneTitle scene="SCENE 01" title="Home" />

          <section className="hero-row">
            <article className="hero-card">
              <div className="hero-copy-block">
                <h1>
                  코딩 문제를 풀고<br />
                  실력을 키워보세요
                </h1>
                <p>
                  백준처럼 딱딱하지 않게, 집중하기 좋은 회색톤 개발자 대시보드로<br />
                  문제 탐색부터 풀이까지 한 번에 이어집니다.
                </p>
              </div>
              <button className="primary-button" type="button">
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
              <article className="profile-card">
                <h2>내 프로필</h2>
                <div className="profile-row">
                  <img className="avatar" src={avatar} alt="" />
                  <div>
                    <strong>안녕하세요! 김민준 님</strong>
                    <p>[10기] 1206 소프트웨어 개발과</p>
                  </div>
                </div>
                <div className="progress-row">
                  <strong>진행률</strong>
                  <img className="pace-icon turtle" src={turtle} alt="" />
                  <div className="progress-track">
                    <img src={progressFill} alt="" />
                  </div>
                  <img className="pace-icon rabbit" src={rabbit} alt="" />
                </div>
                <p className="weekly-count">이번주 푼 문제&nbsp; --- &nbsp;18</p>
              </article>
              <div className="stat-strip">
                <span>Bronze 4</span>
                <span>Normal 6</span>
                <span>Gold 2</span>
                <span>Python 7</span>
                <span>C 3</span>
                <span>Java 2</span>
              </div>
            </aside>
          </section>

          <SceneTitle scene="SCENE 02" title="Problem" />

          <section className="filter-panel" aria-label="문제 필터">
            <label className="search-box">
              <img src={searchIcon} alt="" />
              <input placeholder="문제 제목, 태그, 번호로 검색" />
              <button type="button">검색</button>
            </label>
            <div className="filter-tabs">
              {filters.map((filter, index) => (
                <button className={index === 0 ? 'selected' : ''} type="button" key={filter}>
                  {filter}
                </button>
              ))}
            </div>
            <button className="sort-button" type="button">
              정답률 낮은순
            </button>
          </section>

          <section className="problem-grid" aria-label="추천 문제">
            {problems.map((problem) => (
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
                    <strong>{problem.rate}</strong>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <SceneTitle scene="SCENE 03" title="Now active" />

          <section className="active-grid">
            <article className="active-problem">
              <h3>1001번 A+B</h3>
              <p>두 정수 A와 B를 입력받아 A+B를 출력합니다.</p>
            </article>
            <article className="code-card">
              <pre>{`Python |    import sys
a, b = map(int, input().split())
print(a + b)`}</pre>
              <button type="button">제출 완료</button>
            </article>
            <article className="result-card">
              <h3>제출 결과</h3>
              <div className="result-row">
                <p>
                  <img src={checkRing} alt="" /> Accepted
                </p>
                <span>40 ms · 31256 KB</span>
              </div>
            </article>
          </section>
        </div>
      </main>
    </>
  )
}

export default App
