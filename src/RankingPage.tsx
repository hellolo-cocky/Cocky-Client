import { useEffect, useState } from 'react'
import './RankingPage.css'
import { getApiErrorMessage } from './api/client'
import { learningApi, rankingsApi } from './api/services'
import type { RankingEntry, RankingScope } from './api/types'

type RankingPageProps = { onBack: () => void }
type Period = '오늘' | '주간' | '월간'
const periodCodes: Record<Period, 'TWO_DAY' | 'WEEKLY' | 'MONTHLY'> = { 오늘: 'TWO_DAY', 주간: 'WEEKLY', 월간: 'MONTHLY' }
const scopes: { value: RankingScope; label: string }[] = [
  { value: 'SCHOOL', label: '학교' }, { value: 'GRADE', label: '학년' },
  { value: 'CLASS_VS_CLASS', label: '반 대항' }, { value: 'WITHIN_CLASS', label: '반 내' },
]

export default function RankingPage({ onBack }: RankingPageProps) {
  const [period, setPeriod] = useState<Period>('주간')
  const [scope, setScope] = useState<RankingScope>('SCHOOL')
  const [entries, setEntries] = useState<RankingEntry[]>([])
  const [myUserId, setMyUserId] = useState<number | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    Promise.all([rankingsApi.list(periodCodes[period], scope), learningApi.user()])
      .then(([result, user]) => { if (active) { setEntries(result.rankings); setMyUserId(user.id); setError('') } })
      .catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, '랭킹을 불러오지 못했습니다.')) })
    return () => { active = false }
  }, [period, scope])
  const mine = entries.find((entry) => entry.userId === myUserId)
  return (
    <main className="ranking-page">
      <header className="ranking-header"><button type="button" onClick={onBack}>← 홈</button><span>COCKY <i>RANKING</i></span><span>2025 · 함께 성장하는 개발자</span></header>
      <section className="ranking-content">
        <div className="ranking-intro"><span className="scene-label">COMMUNITY</span><h1>꾸준히 푼 오늘의 기록</h1><p>작은 문제 풀이가 모여 큰 실력이 됩니다.</p></div>
        <div className="ranking-summary"><article><span>랭킹 참여자</span><strong>{entries.length} <small>명</small></strong><em>선택한 기간과 범위</em></article><article><span>최고 점수</span><strong>{Number(entries[0]?.score ?? 0).toFixed(2)}</strong><em>현재 조회 결과</em></article><article><span>내 현재 순위</span><strong>{mine?.rank ?? '—'} <small>{mine ? '위' : ''}</small></strong><em>{mine?.nickname ?? '랭킹에서 내 기록을 확인하세요'}</em></article></div>
        <section className="ranking-board">
          <div className="ranking-board-head"><div><h2>풀이 순위</h2><p>기간별로 꾸준한 풀이 기록을 확인하세요.</p></div><div className="period-tabs" role="tablist" aria-label="랭킹 기간">{(['오늘', '주간', '월간'] as Period[]).map((item) => <button key={item} type="button" role="tab" aria-selected={period === item} className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>{item}</button>)}</div></div>
          <label className="ranking-scope">범위 <select value={scope} onChange={(event) => setScope(event.target.value as RankingScope)}>{scopes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <div className="ranking-columns"><span>순위</span><span>사용자</span><span>점수</span><span>사용자 ID</span></div>
          {error ? <p className="ranking-footnote" role="alert">{error}</p> : entries.map((person, index) => <div className={`ranking-row ${person.userId === myUserId ? 'my-rank' : ''}`} key={person.userId}><strong className={`rank-number rank-${index + 1}`}>{String(person.rank).padStart(2, '0')}</strong><div className="rank-user"><span className="rank-avatar">{person.nickname.slice(0, 1).toUpperCase()}</span><span>{person.nickname}{person.userId === myUserId && <i>ME</i>}</span></div><strong>{Number(person.score).toFixed(2)}<small> 점</small></strong><span>{person.userId}</span></div>)}
          <footer className="ranking-footnote">점수는 선택한 기간 동안의 제출 결과를 기준으로 집계됩니다.</footer>
        </section>
      </section>
    </main>
  )
}
