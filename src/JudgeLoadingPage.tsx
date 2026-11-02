import './JudgeLoadingPage.css'
import { type ProblemItem } from './ProblemDetailPage'

type JudgeLoadingPageProps = { problem: ProblemItem }

export default function JudgeLoadingPage({ problem }: JudgeLoadingPageProps) {
  return <main className="judge-loading-page" role="status" aria-live="polite">
    <div className="judge-loading-card"><div className="judge-spinner" aria-hidden="true"><i /><i /><i /></div><span className="judge-loading-kicker">SUBMISSION CHECK</span><h1>답안을 확인하고 있어요</h1><p><strong>{problem.title}</strong> 제출 내용을 채점하고 있습니다.</p><div className="judge-progress"><i /></div><div className="judge-steps"><span className="done">제출 완료</span><span className="active">코드 실행 중</span><span>결과 확인</span></div></div>
  </main>
}
