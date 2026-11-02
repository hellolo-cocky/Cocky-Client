import './FeedbackPage.css'
import { type ProblemItem } from './ProblemDetailPage'

type FeedbackPageProps = { problem: ProblemItem; onBack: () => void; onRetry: () => void }

export default function FeedbackPage({ problem, onBack, onRetry }: FeedbackPageProps) {
  return <main className="feedback-page">
    <header className="feedback-header"><button type="button" onClick={onBack}>← 문제 목록</button><strong>COCKY <span>RESULT</span></strong><span>제출 결과</span></header>
    <section className="feedback-content">
      <div className="result-hero"><div className="result-check">✓</div><span>제출 완료</span><h1>정답입니다!</h1><p>차근차근 풀어낸 결과예요. 다음 문제도 이어서 도전해볼까요?</p><div className="result-stats"><div><small>문제 번호</small><strong>{problem.id}</strong></div><div><small>언어</small><strong>Python</strong></div><div><small>실행 시간</small><strong>12 ms</strong></div><div><small>메모리</small><strong>3.1 MB</strong></div></div></div>
      <section className="feedback-card"><div className="feedback-card-title"><div><span className="feedback-kicker">SOLUTION FEEDBACK</span><h2>풀이 피드백</h2></div><span className="feedback-tag">좋은 풀이</span></div><p className="feedback-copy">입력을 정확히 처리하고 결과를 출력했어요. 문제에서 요구하는 핵심 조건을 잘 확인했습니다.</p><div className="feedback-points"><article><span>✓</span><div><strong>입력 형식 확인</strong><small>문제 조건에 맞게 입력을 읽었습니다.</small></div></article><article><span>✓</span><div><strong>정확한 결과 출력</strong><small>요구한 형식으로 답을 출력했습니다.</small></div></article><article><span>↗</span><div><strong>다음 단계</strong><small>다른 풀이 방법도 비교해 보세요.</small></div></article></div><div className="feedback-actions"><button type="button" onClick={onBack}>문제 목록</button><button type="button" onClick={onRetry}>다시 풀기</button></div></section>
    </section>
  </main>
}
