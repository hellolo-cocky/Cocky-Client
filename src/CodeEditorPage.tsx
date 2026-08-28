import { useState } from 'react';
import './CodeEditorPage.css';
import { type ProblemItem } from './ProblemDetailPage'; // 👈 ProblemItem 타입 임포트

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

  const languages = ['Python', 'C', 'Java'];

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
          <div className="editor-tabs">
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
            <button type="button" className="btn-submit">
              제출하기
            </button>
          </div>
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