import { useEffect, useState } from 'react'
import './SchedulePage.css'
import { getApiErrorMessage } from './api/client'
import { problemsApi, learningApi } from './api/services'
import type { CurrentRound, RoundProblems, Topic } from './api/types'

type SchedulePageProps = { onBack: () => void; onSelectProblem?: (problem: { id: number; title: string; level: string; rate: string; tags: string[]; language?: string }) => void }

export default function SchedulePage({ onBack, onSelectProblem }: SchedulePageProps) {
  const [round, setRound] = useState<CurrentRound | null>(null)
  const [roundProblems, setRoundProblems] = useState<RoundProblems | null>(null)
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null)
  const [nextTopic, setNextTopic] = useState<Topic | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([learningApi.currentRound(), problemsApi.currentRound(), learningApi.currentTopic(), learningApi.nextTopic()])
      .then(([currentRound, problems, topic, upcomingTopic]) => {
        if (!active) return
        setRound(currentRound); setRoundProblems(problems); setCurrentTopic(topic); setNextTopic(upcomingTopic); setError('')
      })
      .catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, '학습 정보를 불러오지 못했습니다.')) })
    return () => { active = false }
  }, [])
  const formatDate = (value?: string) => value ? new Date(value).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

  return <main className="schedule-page">
    <header className="schedule-header"><button type="button" onClick={onBack}>← 홈</button><span>COCKY <i>LEARNING</i></span><span>학습을 계획하고 꾸준히 이어가요</span></header>
    <div className="schedule-content">
      <div className="schedule-title"><div><span className="schedule-kicker">MY LEARNING</span><h1>학습 스케줄</h1><p>현재 회차 일정과 출제된 문제를 확인하세요.</p></div></div>
      <section className="week-panel"><div className="week-heading"><div><span>회차 {round?.roundId ?? '—'}</span><h2>이번 회차 학습</h2></div><span className="week-progress">{roundProblems?.problems.length ?? 0} <i>문제</i></span></div>
        {error ? <p role="alert">{error}</p> : <><div className="day-detail"><div className="day-icon">✦</div><div className="day-task"><span>공개 {formatDate(round?.openAt)} · 마감 {formatDate(round?.closeAt)}</span><strong>{currentTopic?.topic ?? '현재 주제'}</strong><small>다음 주 주제: {nextTopic?.topic ?? '—'}</small></div><div className="day-state">{round?.isSunday ? '마감일' : '진행 중'}</div></div>
        <div className="round-problem-list">{roundProblems?.problems.map((problem) => <button type="button" key={problem.problemId} onClick={() => onSelectProblem?.({ id: problem.problemId, title: problem.title, level: problem.difficulty === 'EASY' ? 'Bronze' : problem.difficulty === 'HARD' ? 'Gold' : 'Normal', rate: '—', tags: [], language: problem.language })}><span>{problem.problemId}번 · {problem.title}</span><small>{problem.difficulty} · {problem.language}</small></button>)}</div></>}
      </section>
      <section className="generator-panel"><div className="generator-heading"><span className="generator-icon">✦</span><div><h2>이번 회차 문제</h2><p>서버에 등록된 문제를 선택해 풀이를 시작하세요.</p></div></div></section>
    </div>
  </main>
}
