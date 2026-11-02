import { useState } from 'react'
import './RankingPage.css'

type RankingPageProps = { onBack: () => void }
type Period = '오늘' | '주간' | '월간'

const rankings: Record<Period, { name: string; solved: number; change: string }[]> = {
  오늘: [{ name: 'algorabbit', solved: 8, change: '▲ 2' }, { name: 'code_turtle', solved: 7, change: '—' }, { name: 'junho_dev', solved: 5, change: '▲ 4' }, { name: 'study_crew', solved: 4, change: '▼ 1' }, { name: 'hello_cocky', solved: 3, change: '—' }],
  주간: [{ name: 'code_turtle', solved: 32, change: '▲ 1' }, { name: 'algorabbit', solved: 29, change: '▼ 1' }, { name: 'study_crew', solved: 24, change: '▲ 3' }, { name: 'junho_dev', solved: 21, change: '▲ 2' }, { name: 'hello_cocky', solved: 18, change: '—' }],
  월간: [{ name: 'study_crew', solved: 86, change: '▲ 2' }, { name: 'algorabbit', solved: 78, change: '—' }, { name: 'junho_dev', solved: 69, change: '▲ 4' }, { name: 'code_turtle', solved: 64, change: '▼ 2' }, { name: 'hello_cocky', solved: 57, change: '▲ 1' }],
}

export default function RankingPage({ onBack }: RankingPageProps) {
  const [period, setPeriod] = useState<Period>('주간')
  return (
    <main className="ranking-page">
      <header className="ranking-header"><button type="button" onClick={onBack}>← 홈</button><span>COCKY <i>RANKING</i></span><span>2025 · 함께 성장하는 개발자</span></header>
      <section className="ranking-content">
        <div className="ranking-intro"><span className="scene-label">COMMUNITY</span><h1>꾸준히 푼 오늘의 기록</h1><p>작은 문제 풀이가 모여 큰 실력이 됩니다.</p></div>
        <div className="ranking-summary"><article><span>이번 주 전체 풀이</span><strong>1,284 <small>문제</small></strong><em>지난주보다 12% 늘었어요</em></article><article><span>참여한 사용자</span><strong>246 <small>명</small></strong><em>함께 성장하는 콕키 크루</em></article><article><span>내 현재 순위</span><strong>24 <small>위</small></strong><em>상위 10% · 계속 이어가요</em></article></div>
        <section className="ranking-board">
          <div className="ranking-board-head"><div><h2>풀이 순위</h2><p>기간별로 꾸준한 풀이 기록을 확인하세요.</p></div><div className="period-tabs" role="tablist" aria-label="랭킹 기간">{(['오늘', '주간', '월간'] as Period[]).map((item) => <button key={item} type="button" role="tab" aria-selected={period === item} className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>{item}</button>)}</div></div>
          <div className="ranking-columns"><span>순위</span><span>사용자</span><span>푼 문제</span><span>순위 변화</span></div>
          {rankings[period].map((person, index) => <div className={`ranking-row ${person.name === 'hello_cocky' ? 'my-rank' : ''}`} key={person.name}><strong className={`rank-number rank-${index + 1}`}>{String(index + 1).padStart(2, '0')}</strong><div className="rank-user"><span className="rank-avatar">{person.name.slice(0, 1).toUpperCase()}</span><span>{person.name}{person.name === 'hello_cocky' && <i>ME</i>}</span></div><strong>{person.solved}<small> 문제</small></strong><span className={person.change.startsWith('▼') ? 'rank-down' : 'rank-up'}>{person.change}</span></div>)}
          <footer className="ranking-footnote">순위는 선택한 기간 동안 해결한 문제 수를 기준으로 집계됩니다.</footer>
        </section>
      </section>
    </main>
  )
}
