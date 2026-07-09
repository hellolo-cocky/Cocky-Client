import './ProblemDetailPage.css'; 

export interface ProblemItem {
  id: number;
  title: string;
  language?: string;
  level: string;
  rate: string | number;
  tags?: string[]; 
}

export interface ProblemDetailPageProps {
  problem: ProblemItem;
  onBack: () => void;
  onStartSolve: () => void; // 👈 부모에게 화면을 넘기라고 신호를 보낼 기능 추가
}

export default function ProblemDetailPage({ problem, onBack, onStartSolve }: ProblemDetailPageProps) {

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('복사되었습니다.');
    });
  };

  return (
    <section className="problem-detail-page">
      {/* 상단 헤더 영역 */}
      <div className="scene-header">
        <span className="scene-badge">SCENE 09</span>
        <div className="scene-title-group">
          <h2>문제 상세 진입</h2>
          <p>문제 카드 클릭 후 상세 설명과 풀이 시작 버튼을 표시합니다.</p>
        </div>
      </div>

      <div className="detail-layout">
        {/* 왼쪽 메인 문제 카드 */}
        <article className="problem-detail-card">
          <h1 className="problem-title">{problem.title}</h1>
          
          <div className="problem-description">
            <p>두 정수 A와 B를 입력받은 다음, A+B를 출력하세요.</p>
            <p>
              입력: 첫째 줄에 A와 B가 주어집니다.<br />
              출력: 첫째 줄에 A+B를 출력합니다.
            </p>
          </div>

          <div className="example-container">
            {/* 예제 입력 1 */}
            <div className="example-box">
              <div className="example-content">
                <strong>예제 입력 1</strong>
                <span className="example-value">1 2</span>
              </div>
              <button 
                type="button" 
                className="copy-button"
                onClick={() => handleCopy('1 2')}
              >
                복사
              </button>
            </div>

            {/* 예제 출력 1 */}
            <div className="example-box">
              <div className="example-content">
                <strong>예제 출력 1</strong>
                <span className="example-value">3</span>
              </div>
              <button 
                type="button" 
                className="copy-button"
                onClick={() => handleCopy('3')}
              >
                복사
              </button>
            </div>
          </div>

          {/* 하단 버튼 그룹 */}
          <div className="action-buttons">
            <button 
              type="button" 
              className="btn-primary"
              onClick={onStartSolve} // 👈 풀이 시작 버튼을 누르면 부모 컴포넌트가 작동합니다.
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