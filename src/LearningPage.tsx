import { useEffect, useState } from 'react'
import './LearningPage.css'
import { getApiErrorMessage } from './api/client'
import { learningApi, submissionsApi } from './api/services'
import type { FeedbackPeriod, PeriodFeedback, SubmissionSummary } from './api/types'

type LearningPageProps = { onBack: () => void }
const periods: { value: FeedbackPeriod; label: string }[] = [
  { value: 'ROUND', label: '회차' }, { value: 'WEEKLY', label: '주간' }, { value: 'MONTHLY', label: '월간' },
]
const verdictLabels: Record<SubmissionSummary['verdict'], string> = { AC: '정답', WA: '오답', TLE: '시간 초과', RE: '런타임 오류', CE: '컴파일 오류', PENDING: '채점 중' }

export default function LearningPage({ onBack }: LearningPageProps) {
  const [period, setPeriod] = useState<FeedbackPeriod>('WEEKLY')
  const [feedback, setFeedback] = useState<PeriodFeedback | null>(null)
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.allSettled([learningApi.periodicFeedback(period), submissionsApi.history()]).then((results) => {
      if (!active) return
      const [feedbackResult, historyResult] = results
      if (feedbackResult.status === 'fulfilled') setFeedback(feedbackResult.value)
      else setFeedback(null)
      if (historyResult.status === 'fulfilled') setSubmissions(historyResult.value.content)
      else setSubmissions([])
      const failures = results.filter((result) => result.status === 'rejected')
      setError(failures.length ? getApiErrorMessage(failures[0].reason, '학습 기록을 불러오지 못했습니다.') : '')
    })
    return () => { active = false }
  }, [period])

  const solvedCount = submissions.filter((item) => item.verdict === 'AC').length
  const avgScore = submissions.length ? submissions.reduce((sum, item) => sum + Number(item.score), 0) / submissions.length : 0

  return <main className="learning-page">
    <header className="learning-header"><button type="button" onClick={onBack}>← 홈</button><strong>COCKY <span>LEARNING LOG</span></strong><span>오늘의 배움을 남겨요</span></header>
    <div className="learning-content">
      <div className="learning-title"><div><span className="learning-kicker">MY STUDY</span><h1>학습 회고</h1><p>실제 제출 기록과 기간별 학습 피드백을 확인하세요.</p></div></div>
      <div className="learning-summary"><article><span>불러온 제출</span><strong>{submissions.length} <small>건</small></strong><i>최근 제출 기록</i></article><article><span>정답 제출</span><strong>{solvedCount} <small>건</small></strong><i>불러온 기록 기준</i></article><article><span>평균 점수</span><strong>{avgScore.toFixed(2)}</strong><i>불러온 기록 기준</i></article></div>
      <section className="learning-notes">
        <div className="notes-heading"><div><h2>기간별 피드백</h2><p>회차와 기간을 선택해 학습 분석을 확인합니다.</p></div><div className="note-filters" aria-label="피드백 기간">{periods.map((item) => <button type="button" key={item.value} className={period === item.value ? 'active' : ''} aria-pressed={period === item.value} onClick={() => setPeriod(item.value)}>{item.label}</button>)}</div></div>
        {error && <p role="alert" className="learning-error">{error}</p>}
        {feedback ? <article className="learning-note"><span className="note-mark">✦</span><div className="note-body"><div className="note-meta"><span>{periods.find((item) => item.value === period)?.label} 분석</span></div><h3>{feedback.aiSummary || '분석 내용이 없습니다.'}</h3><p>{feedback.studyRecommend || '추천 학습 내용이 없습니다.'}</p><p>언어별 제출: {Object.entries(feedback.languageStats).map(([key, value]) => `${key} ${value}`).join(' · ') || '—'}</p><p>난이도별 제출: {Object.entries(feedback.difficultyStats).map(([key, value]) => `${key} ${value}`).join(' · ') || '—'}</p></div></article> : !error && <p className="learning-error">피드백 정보를 불러오는 중입니다.</p>}
      </section>
      <section className="learning-notes"><div className="notes-heading"><div><h2>풀이 기록</h2><p>서버에 저장된 최근 제출 목록</p></div></div>
        {submissions.map((item) => <article className="learning-note" key={item.submissionId}><span className="note-mark">{item.verdict === 'AC' ? '✓' : '·'}</span><div className="note-body"><div className="note-meta"><span>{item.language} · {item.difficulty}</span><time>{new Date(item.submittedAt).toLocaleString('ko-KR')}</time></div><h3>{item.problemTitle}</h3><p>{verdictLabels[item.verdict]} · 점수 {Number(item.score).toFixed(2)}{item.aiScore == null ? '' : ` · AI ${Number(item.aiScore).toFixed(2)}`}</p></div><span className="note-arrow">↗</span></article>)}
        {!submissions.length && !error && <p className="learning-error">제출 기록이 없습니다.</p>}
      </section>
    </div>
  </main>
}
