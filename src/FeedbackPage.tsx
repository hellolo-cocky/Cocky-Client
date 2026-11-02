import './FeedbackPage.css'
import { type ProblemItem } from './ProblemDetailPage'
import type { SubmissionResult } from './api/types'

type FeedbackPageProps = { problem: ProblemItem; submission: SubmissionResult; language: string; onBack: () => void; onRetry: () => void }

const verdictLabels: Record<SubmissionResult['verdict'], string> = { AC: '정답입니다!', WA: '오답입니다.', TLE: '시간 초과', RE: '런타임 오류', CE: '컴파일 오류', PENDING: '채점 중입니다.' }

export default function FeedbackPage({ problem, submission, language, onBack, onRetry }: FeedbackPageProps) {
  const feedback = submission.feedback
  return <main className="feedback-page">
    <header className="feedback-header"><button type="button" onClick={onBack}>← 문제 목록</button><strong>COCKY <span>RESULT</span></strong><span>제출 결과</span></header>
    <section className="feedback-content">
      <div className="result-hero"><div className="result-check">{submission.verdict === 'AC' ? '✓' : '!'}</div><span>제출 완료 · {submission.verdict}</span><h1>{verdictLabels[submission.verdict]}</h1><p>{submission.passedCount} / {submission.totalCount} 테스트 케이스 통과</p><div className="result-stats"><div><small>문제 번호</small><strong>{problem.id}</strong></div><div><small>언어</small><strong>{language}</strong></div><div><small>획득 점수</small><strong>{Number(submission.score).toFixed(2)}</strong></div><div><small>통과 케이스</small><strong>{submission.passedCount}/{submission.totalCount}</strong></div></div></div>
      <section className="feedback-card"><div className="feedback-card-title"><div><span className="feedback-kicker">SOLUTION FEEDBACK</span><h2>풀이 피드백</h2></div><span className="feedback-tag">{feedback ? 'AI 피드백' : '피드백 없음'}</span></div><p className="feedback-copy">{feedback?.comment || '이번 제출에는 상세 피드백이 제공되지 않았습니다.'}</p>{feedback && <div className="feedback-points"><article><span>✓</span><div><strong>시간 효율</strong><small>{Number(feedback.timeScore ?? feedback.timeComplexityScore).toFixed(2)}점</small></div></article><article><span>✓</span><div><strong>가독성</strong><small>{Number(feedback.readabilityScore).toFixed(2)}점</small></div></article><article><span>↗</span><div><strong>독창성</strong><small>{Number(feedback.originalityScore).toFixed(2)}점</small></div></article></div>}<div className="feedback-actions"><button type="button" onClick={onBack}>문제 목록</button><button type="button" onClick={onRetry}>다시 풀기</button></div></section>
    </section>
  </main>
}
