import './ProblemDetailPage.css';
import { useEffect, useState } from 'react';
import { getApiErrorMessage } from './api/client';
import { problemsApi } from './api/services';

export interface ProblemItem {
  id: number;
  title: string;
  language?: string;
  level: string;
  rate: string | number;
  tags?: string[]; 
  description?: string;
}

export interface ProblemDetailPageProps {
  problem: ProblemItem;
  onBack: () => void;
  onStartSolve: () => void; // 부모에게 화면을 넘기라고 신호를 보낼 기능 추가
}

export default function ProblemDetailPage({ problem, onBack, onStartSolve }: ProblemDetailPageProps) {
  const [description, setDescription] = useState(problem.description || '');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    problemsApi.detail(problem.id)
      .then((detail) => { if (active) setDescription(detail.content); })
      .catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, '문제 상세를 불러오지 못했습니다.')); });
    return () => { active = false; };
  }, [problem.id]);

  return (
    <section className="problem-detail-page">
      {/* 상단 헤더 영역 */}
      <div className="scene-header">
        <div className="scene-title-group">
          <h2>문제 상세</h2>
          <p>문제 설명과 예제를 확인하고 풀이를 시작하세요.</p>
        </div>
      </div>

      <div className="detail-layout">
        {/* 왼쪽 메인 문제 카드 */}
        <article className="problem-detail-card">
          <h1 className="problem-title">{problem.title}</h1>
          
          <div className="problem-description">{error ? <p role="alert">{error}</p> : description ? <p>{description}</p> : <p>문제 내용을 불러오는 중입니다.</p>}</div>

          {/* 하단 버튼 그룹 */}
          <div className="action-buttons">
            <button 
              type="button" 
              className="btn-primary"
              onClick={onStartSolve} // 풀이 시작 버튼을 누르면 부모 컴포넌트가 작동합니다.
            >
              풀이 시작
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onBack} 
            >
              문제 목록
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
