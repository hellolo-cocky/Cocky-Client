import { useState } from 'react';
import './CodeEditorPage.css';
import { type ProblemItem } from './ProblemDetailPage';
import FeedbackPage from './FeedbackPage';
import JudgeLoadingPage from './JudgeLoadingPage';
import { getApiErrorMessage } from './api/client';
import { submissionsApi } from './api/services';
import type { CodeRunResult, Language, SubmissionResult } from './api/types';

// 1️⃣ App.tsx에서 전달하는 프롭스(Props) 타입 정의
interface CodeEditorPageProps {
  problem: ProblemItem;
  onBack: () => void;
}

export default function CodeEditorPage({ problem, onBack }: CodeEditorPageProps) { // 👈 2️⃣ 프롭스 받아오기
  const [activeLanguage, setActiveLanguage] = useState('Python');
  const [code, setCode] = useState(
    'import sys\na, b = map(int, sys.stdin.readline().split())\nprint(a + b)'
  );
  const [submissionPhase, setSubmissionPhase] = useState<'editing' | 'loading' | 'result'>('editing');
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);
  const [requestError, setRequestError] = useState('');
  const [runResult, setRunResult] = useState<CodeRunResult | null>(null);
  const [running, setRunning] = useState(false);

  const languages = ['Python', 'C', 'Java'];
  const languageCode: Language = activeLanguage.toUpperCase() as Language

  const submit = async () => {
    setRequestError('')
    setSubmissionPhase('loading')
    try {
      const result = await submissionsApi.submit({ problemId: problem.id, language: languageCode, code })
      let completedResult = result
      if (!result.feedback && result.verdict === 'AC') {
        const feedback = await submissionsApi.feedback(result.submissionId).catch(() => null)
        if (feedback) completedResult = { ...result, feedback }
      }
      setSubmission(completedResult)
      setSubmissionPhase('result')
    } catch (error) {
      setRequestError(getApiErrorMessage(error, '제출 결과를 불러오지 못했습니다.'))
      setSubmissionPhase('editing')
    }
  }

  const run = async () => {
    setRunning(true)
    setRequestError('')
    try {
      setRunResult(await submissionsApi.run({ language: languageCode, code, stdin: '' }))
    } catch (error) {
      setRequestError(getApiErrorMessage(error, '코드를 실행하지 못했습니다.'))
    } finally { setRunning(false) }
  }

  if (submissionPhase === 'loading') return <JudgeLoadingPage problem={problem} />
  if (submissionPhase === 'result' && submission) return <FeedbackPage problem={problem} submission={submission} language={activeLanguage} onBack={onBack} onRetry={() => { setSubmission(null); setSubmissionPhase('editing') }} />

  return (
    <section className="code-editor-page">
      {/* 상단 헤더 영역 */}
      <div className="scene-header">
        <div className="scene-title-group" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
          {/* 3️⃣ 목록으로 돌아가는 뒤로가기 버튼 추가 */}
          <button 
            type="button" 
            onClick={onBack}
            className="btn-back"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#333',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '30px',
              cursor: 'pointer'
            }}
          >
            ← 나가기
          </button>
          <div>
            {/* 4️⃣ 고정 텍스트 대신 실제 문제 제목과 정보 반영 */}
            <h2>{problem.title} 풀이</h2>
            <p>난이도: {problem.level} | 정답률: {problem.rate}</p>
          </div>
        </div>
      </div>

      <div className="editor-layout">
        {/* 1️⃣ 왼쪽 메인 코드 에디터 */}
        <article className="editor-card">
          {/* 언어 선택 탭 */}
          <div className="editor-tabs" role="tablist" aria-label="프로그래밍 언어">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`tab-btn ${activeLanguage === lang ? 'active' : ''}`}
                onClick={() => setActiveLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* 코드 입력 영역 */}
          <textarea
            className="code-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />

          {/* 하단 실행 및 제출 버튼 */}
          <div className="editor-actions">
            <button type="button" className="btn-run" onClick={run} disabled={running}>{running ? '실행 중…' : '실행'}</button>
            <button type="button" className="btn-submit" onClick={submit}>
              제출하기
            </button>
          </div>
          {requestError && <p className="submission-result" role="alert">{requestError}</p>}
          {runResult && <pre className="submission-result" role="status">{runResult.stdout || runResult.stderr || runResult.compileOutput || `실행 상태: ${runResult.status}`}</pre>}
        </article>

        {/* 2️⃣ 중간 지원 언어 ID 카드 */}
        <article className="language-info-card">
          <div className="info-header">
            <strong>지원 언어 ID</strong>
            <span className="judge-text">Judge0</span>
          </div>
          <p className="info-subtext">Python · C · Java</p>
        </article>
      </div>
    </section>
  );
}
