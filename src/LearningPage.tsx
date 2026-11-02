import { useState, type FormEvent } from 'react'
import './LearningPage.css'

type LearningPageProps = { onBack: () => void }
type Note = { id: number; title: string; topic: string; date: string; text: string }
const starterNotes: Note[] = [
  { id: 1, title: '배열 인덱스와 순회', topic: '배열', date: '11월 02일', text: '반복문 범위를 먼저 정리하고 경계값을 확인하자.' },
  { id: 2, title: '스택으로 괄호 검사하기', topic: '자료구조', date: '10월 31일', text: '닫는 괄호를 만났을 때 마지막 열린 괄호와 비교한다.' },
  { id: 3, title: '이분 탐색의 종료 조건', topic: '탐색', date: '10월 29일', text: '탐색 범위를 좁힐 때 mid를 포함할지 기준을 세우기.' },
]

export default function LearningPage({ onBack }: LearningPageProps) {
  const [notes, setNotes] = useState(starterNotes)
  const [writing, setWriting] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('전체')
  const topics = ['전체', ...new Set(notes.map((note) => note.topic))]
  const saveNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || !text.trim()) return
    setNotes((current) => [{ id: Date.now(), title: title.trim(), topic: '회고', date: '오늘', text: text.trim() }, ...current])
    setTitle(''); setText(''); setWriting(false)
  }

  return <main className="learning-page">
    <header className="learning-header"><button type="button" onClick={onBack}>← 홈</button><strong>COCKY <span>LEARNING LOG</span></strong><span>오늘의 배움을 남겨요</span></header>
    <div className="learning-content"><div className="learning-title"><div><span className="learning-kicker">MY STUDY</span><h1>학습 회고</h1><p>풀었던 문제를 기록하고 다음 풀이에 활용해보세요.</p></div><button type="button" onClick={() => setWriting((value) => !value)}>＋ 회고 작성</button></div>
      <section className="learning-summary"><article><span>이번 주 풀이</span><strong>18 <small>문제</small></strong><i>지난주보다 3개 더 풀었어요</i></article><article><span>연속 학습</span><strong>5 <small>일</small></strong><i>꾸준히 이어가는 중이에요</i></article><article><span>남긴 회고</span><strong>{notes.length} <small>개</small></strong><i>배운 내용을 기록했어요</i></article></section>
      {writing && <form className="learning-form" onSubmit={saveNote}><h2>새 회고</h2><label>제목<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="오늘 배운 내용을 한 줄로 적어주세요" required /></label><label>내용<textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="어떤 점이 어려웠나요? 다음에는 어떻게 풀어볼까요?" rows={4} required /></label><div><button type="button" onClick={() => setWriting(false)}>취소</button><button type="submit">저장하기</button></div></form>}
      <section className="learning-notes"><div className="notes-heading"><div><h2>풀이 기록</h2><p>최근에 남긴 학습 노트</p></div><div className="note-filters" aria-label="기록 주제 필터">{topics.map((topic) => <button type="button" key={topic} className={filter === topic ? 'active' : ''} onClick={() => setFilter(topic)}>{topic}</button>)}</div></div>{notes.filter((note) => filter === '전체' || note.topic === filter).map((note) => <article className="learning-note" key={note.id}><span className="note-mark">✎</span><div className="note-body"><div className="note-meta"><span>{note.topic}</span><time>{note.date}</time></div><h3>{note.title}</h3><p>{note.text}</p></div><span className="note-arrow">↗</span></article>)}</section>
    </div>
  </main>
}
