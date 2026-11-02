import { useState } from 'react'
import './SchedulePage.css'

type SchedulePageProps = { onBack: () => void }
const days = ['월', '화', '수', '목', '금', '토', '일']
const initialTasks = [
  { day: '월', date: '02', title: '배열과 문자열', count: 3, done: true },
  { day: '화', date: '03', title: '자료구조', count: 2, done: true },
  { day: '수', date: '04', title: '정렬 알고리즘', count: 3, done: false },
  { day: '목', date: '05', title: '탐색과 이분 탐색', count: 2, done: false },
  { day: '금', date: '06', title: '주간 복습', count: 3, done: false },
]

export default function SchedulePage({ onBack }: SchedulePageProps) {
  const [selectedDay, setSelectedDay] = useState('수')
  const [level, setLevel] = useState('Bronze · Silver')
  const [count, setCount] = useState('3')
  const [created, setCreated] = useState(false)
  const selectedTask = initialTasks.find((task) => task.day === selectedDay)

  return <main className="schedule-page">
    <header className="schedule-header"><button type="button" onClick={onBack}>← 홈</button><span>COCKY <i>LEARNING</i></span><span>학습을 계획하고 꾸준히 이어가요</span></header>
    <div className="schedule-content">
      <div className="schedule-title"><div><span className="schedule-kicker">MY LEARNING</span><h1>학습 스케줄</h1><p>나만의 속도로 계획하고, 오늘의 목표를 채워보세요.</p></div><button type="button" className="schedule-new" onClick={() => document.querySelector('#problem-generator')?.scrollIntoView({ behavior: 'smooth' })}>＋ 문제 만들기</button></div>
      <section className="week-panel"><div className="week-heading"><div><span>2026년 11월 첫째 주</span><h2>이번 주 학습 계획</h2></div><span className="week-progress">2 <i>/ 5일 완료</i></span></div>
        <div className="week-days" role="tablist" aria-label="요일 선택">{days.map((day, index) => <button key={day} type="button" role="tab" aria-selected={selectedDay === day} className={`${selectedDay === day ? 'selected' : ''} ${index < 2 ? 'completed' : ''}`} onClick={() => setSelectedDay(day)}><span>{day}</span><strong>{String(index + 2).padStart(2, '0')}</strong><i>{index < 2 ? '완료' : initialTasks.some((task) => task.day === day) ? '학습' : '휴식'}</i></button>)}</div>
        <div className="day-detail"><div className="day-icon">{selectedTask?.done ? '✓' : '✦'}</div><div className="day-task"><span>{selectedDay}요일 · 11월 {selectedTask?.date ?? '07'}일</span><strong>{selectedTask?.title ?? '자유 학습'}</strong><small>{selectedTask ? `오늘 풀 문제 ${selectedTask.count}개` : '계획된 문제가 없습니다'}</small></div><div className="day-state">{selectedTask?.done ? '학습 완료' : selectedTask ? '학습 예정' : '일정 없음'}</div></div>
      </section>
      <section className="generator-panel" id="problem-generator"><div className="generator-heading"><span className="generator-icon">✦</span><div><h2>문제 출제</h2><p>원하는 난이도와 문제 수를 선택하면 학습 세트를 만들어요.</p></div></div><div className="generator-fields"><label>난이도<select value={level} onChange={(event) => setLevel(event.target.value)}><option>Bronze · Silver</option><option>Bronze</option><option>Silver</option><option>Gold</option><option>전체 난이도</option></select></label><label>문제 수<select value={count} onChange={(event) => setCount(event.target.value)}><option value="1">1문제</option><option value="3">3문제</option><option value="5">5문제</option><option value="10">10문제</option></select></label><button type="button" className="generate-button" onClick={() => setCreated(true)}>문제 출제하기 <span>→</span></button></div>{created && <div className="generated-result" role="status"><span>✓</span><div><strong>{level} 문제 {count}개를 준비했어요</strong><small>오늘의 학습 목록에 추가되었습니다.</small></div><button type="button" onClick={() => setCreated(false)}>확인</button></div>}</section>
    </div>
  </main>
}
