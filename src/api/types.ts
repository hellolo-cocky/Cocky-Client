export type ApiError = { code: string; message: string }

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD'
export type Language = 'PYTHON' | 'C' | 'JAVA'
export type Verdict = 'AC' | 'WA' | 'TLE' | 'RE' | 'CE' | 'PENDING'
export type PeriodType = 'TWO_DAY' | 'WEEKLY' | 'MONTHLY'
export type FeedbackPeriod = 'ROUND' | 'WEEKLY' | 'MONTHLY'
export type RankingScope = 'SCHOOL' | 'GRADE' | 'CLASS_VS_CLASS' | 'WITHIN_CLASS'

export type ProblemSummary = {
  problemId: number
  title: string
  language: Language
  difficulty: Difficulty
}

export type ProblemListItem = ProblemSummary & { tags: string[] }
export type ProblemPage = { content: ProblemListItem[]; page: number; totalPages: number }
export type ProblemDetail = ProblemSummary & { content: string }
export type RoundProblems = { roundId: number; problems: ProblemSummary[] }

export type SubmissionRequest = {
  problemId: number
  language: Language
  code: string
  isAnonymous?: boolean
}

export type SubmissionFeedback = {
  timeScore?: number
  timeComplexityScore?: number
  readabilityScore: number
  originalityScore: number
  comment: string
}

export type SubmissionResult = {
  submissionId: number
  verdict: Verdict
  score: number
  passedCount: number
  totalCount: number
  feedback: SubmissionFeedback | null
}

export type CodeRunResult = {
  status: string
  stdout: string
  stderr: string
  compileOutput: string
  timeMs: number | null
}

export type SubmissionSummary = {
  submissionId: number
  problemId: number
  problemTitle: string
  difficulty: Difficulty
  language: Language
  verdict: Verdict
  score: number
  aiScore: number | null
  submittedAt: string
}

export type SubmissionPage = {
  content: SubmissionSummary[]
  number: number
  totalPages: number
  totalElements: number
}

export type SubmissionDetail = SubmissionSummary & {
  code: string
  timeComplexityScore: number | null
  readabilityScore: number | null
  originalityScore: number | null
  comment: string | null
}

export type RankingEntry = { rank: number; userId: number; nickname: string; score: number }
export type RankingList = { rankings: RankingEntry[] }
export type CurrentRound = { roundId: number; openAt: string; closeAt: string; isSunday: boolean }
export type Topic = { topicOrder: number; topic: string }
export type UserMe = {
  id: number
  email: string
  name: string
  department: string
  grade: number
  classNo: number
  number: number
  role: string
  isAnonymousDefault: boolean
}
export type PeriodFeedback = {
  period: FeedbackPeriod
  languageStats: Record<string, number>
  difficultyStats: Record<string, number>
  wrongTypeStats: Record<string, number>
  aiSummary: string
  studyRecommend: string | null
}
