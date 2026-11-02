import { useMemo, useState, type FormEvent } from 'react'
import './BoardPage.css'

type BoardPost = { id: number; title: string; category: string; author: string; date: string; comments: number; views: number }
type BoardPageProps = { onBack: () => void }

const seedPosts: BoardPost[] = [
  { id: 1, title: '이번 주 알고리즘 스터디 모집합니다', category: '스터디', author: 'study_crew', date: '오늘', comments: 12, views: 184 },
  { id: 2, title: '그래프 탐색 문제 같이 풀어요', category: '질문', author: 'junho_dev', date: '오늘', comments: 8, views: 96 },
  { id: 3, title: '백트래킹 문제 풀이 팁 공유', category: '정보', author: 'code_turtle', date: '어제', comments: 5, views: 142 },
  { id: 4, title: '처음 시작하는 분들을 위한 문제 추천', category: '자유', author: 'algorabbit', date: '어제', comments: 3, views: 77 },
]

export default function BoardPage({ onBack }: BoardPageProps) {
  const [posts, setPosts] = useState(seedPosts)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('전체')
  const [screen, setScreen] = useState<'list' | 'write' | 'detail'>('list')
  const [selected, setSelected] = useState<BoardPost | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<string[]>(['저도 참여하고 싶어요!', '저는 그래프 파트 맡아볼게요.'])
  const visiblePosts = useMemo(() => posts.filter((post) => (category === '전체' || post.category === category) && `${post.title} ${post.author}`.toLowerCase().includes(query.trim().toLowerCase())), [posts, category, query])

  const publish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || !body.trim()) return
    const post = { id: Date.now(), title: title.trim(), category: '자유', author: 'hello_cocky', date: '방금', comments: 0, views: 1 }
    setPosts((current) => [post, ...current])
    setSelected(post)
    setTitle('')
    setBody('')
    setScreen('detail')
  }

  return (
    <main className="board-page">
      <header className="board-header"><button type="button" onClick={onBack}>← 홈</button><strong>COCKY <span>COMMUNITY</span></strong><span>함께 나누며 성장하는 공간</span></header>
      <div className="board-layout">
        <aside className="board-sidebar"><span className="board-kicker">COMMUNITY</span><h1>게시판</h1><p>질문하고, 공유하고, 함께 풀어요.</p><nav aria-label="게시판 카테고리">{['전체', '질문', '스터디', '정보', '자유'].map((item) => <button key={item} className={category === item ? 'active' : ''} type="button" onClick={() => { setCategory(item); setScreen('list') }}><span>{item}</span><span>{item === '전체' ? posts.length : posts.filter((post) => post.category === item).length}</span></button>)}</nav><button type="button" className="board-write-side" onClick={() => setScreen('write')}>＋ 글쓰기</button></aside>
        <section className="board-main">
          {screen === 'write' ? <form className="board-write" onSubmit={publish}><button type="button" className="board-back-link" onClick={() => setScreen('list')}>← 목록으로</button><h2>새 글 작성</h2><label>제목<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="제목을 입력하세요" required /></label><label>내용<textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="내용을 입력하세요" rows={9} required /></label><div className="write-actions"><button type="button" onClick={() => setScreen('list')}>취소</button><button type="submit">등록하기</button></div></form> : screen === 'detail' && selected ? <article className="board-detail"><button type="button" className="board-back-link" onClick={() => setScreen('list')}>← 게시글 목록</button><span className="post-category">{selected.category}</span><h2>{selected.title}</h2><div className="post-meta">{selected.author} · {selected.date} · 조회 {selected.views}</div><p className="post-body">{body || '알고리즘 문제를 같이 풀면서 풀이 방법을 나누고 싶어요. 관심 있는 분들은 댓글로 알려주세요!'}</p><section className="comments"><h3>댓글 <span>{comments.length}</span></h3>{comments.map((item, index) => <p className="comment-row" key={`${item}-${index}`}><strong>{index === 0 ? 'study_crew' : 'junho_dev'}</strong>{item}</p>)}<form onSubmit={(event) => { event.preventDefault(); if (comment.trim()) { setComments((current) => [...current, comment.trim()]); setComment('') } }}><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="댓글을 입력하세요" aria-label="댓글" /><button type="submit">등록</button></form></section></article> : <><div className="board-title-row"><div><span className="board-kicker">SHARE YOUR THOUGHTS</span><h2>{category === '전체' ? '모든 게시글' : `${category} 게시글`}</h2><p>궁금한 점이나 나누고 싶은 이야기를 남겨보세요.</p></div><button type="button" onClick={() => setScreen('write')}>＋ 글쓰기</button></div><form className="board-search" onSubmit={(event) => event.preventDefault()}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목이나 작성자로 검색" aria-label="게시글 검색" /><button type="submit">검색</button></form><div className="board-list-head"><span>게시글</span><span>작성자</span><span>댓글</span><span>조회</span></div><div className="board-post-list">{visiblePosts.map((post) => <button className="board-post" type="button" key={post.id} onClick={() => { setSelected(post); setScreen('detail') }}><span className="board-post-title"><i>{post.category}</i><strong>{post.title}</strong><small>{post.date}</small></span><span>{post.author}</span><span>{post.comments}</span><span>{post.views}</span></button>)}{visiblePosts.length === 0 && <p className="board-empty">조건에 맞는 게시글이 없습니다.</p>}</div><p className="board-footer-note">좋은 질문과 답변으로 함께 성장해요.</p></>}
        </section>
      </div>
    </main>
  )
}
