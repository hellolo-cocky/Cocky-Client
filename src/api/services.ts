import { api, tokenStore } from './client'
import type {
  CodeRunResult, CurrentRound, FeedbackPeriod, PeriodFeedback, ProblemDetail, ProblemPage,
  RankingList, RankingScope, PeriodType, RoundProblems, SubmissionDetail, SubmissionPage,
  SubmissionRequest, SubmissionResult, Topic, UserMe,
} from './types'

export const authApi = {
  async signIn(code: string) {
    const { data } = await api.post<{ accessToken: string; refreshToken: string }>('/auth/signin', { code })
    tokenStore.set(data.accessToken, data.refreshToken)
    return data
  },
  async signOut() {
    try { await api.post('/auth/signout') } finally { tokenStore.clear() }
  },
}

export const problemsApi = {
  list(params: { page?: number; size?: number; language?: string; difficulty?: string; keyword?: string; sort?: string } = {}) {
    return api.get<ProblemPage>('/problems', { params }).then(({ data }) => data)
  },
  detail(problemId: number) {
    return api.get<ProblemDetail>(`/problems/${problemId}`).then(({ data }) => data)
  },
  currentRound() {
    return api.get<RoundProblems>('/rounds/current/problems').then(({ data }) => data)
  },
}

export const submissionsApi = {
  submit(request: SubmissionRequest) {
    return api.post<SubmissionResult>('/submissions', request).then(({ data }) => data)
  },
  run(request: { language: SubmissionRequest['language']; code: string; stdin?: string }) {
    return api.post<CodeRunResult>('/run', request).then(({ data }) => data)
  },
  history(page = 0, size = 20) {
    return api.get<SubmissionPage>('/submissions/me', { params: { page, size } }).then(({ data }) => data)
  },
  detail(submissionId: number) {
    return api.get<SubmissionDetail>(`/submissions/me/${submissionId}`).then(({ data }) => data)
  },
  feedback(submissionId: number) {
    return api.get<{ timeComplexityScore: number; readabilityScore: number; originalityScore: number; comment: string }>(`/submissions/${submissionId}/feedback`)
      .then(({ data, status }) => status === 202 ? null : ({
        timeComplexityScore: data.timeComplexityScore,
        readabilityScore: data.readabilityScore,
        originalityScore: data.originalityScore,
        comment: data.comment,
      }))
  },
}

export const rankingsApi = {
  list(period: PeriodType, scope: RankingScope = 'SCHOOL') {
    return api.get<RankingList>('/rankings', { params: { period, scope } }).then(({ data }) => data)
  },
}

export const learningApi = {
  currentRound: () => api.get<CurrentRound>('/rounds/current').then(({ data }) => data),
  currentTopic: () => api.get<Topic>('/topics/current').then(({ data }) => data),
  nextTopic: () => api.get<Topic>('/topics/next').then(({ data }) => data),
  user: () => api.get<UserMe>('/users/me').then(({ data }) => data),
  setAnonymous: (anonymousDefault: boolean) => api.patch('/users/me/anonymous', { anonymousDefault }).then(({ data }) => data),
  periodicFeedback: (period: FeedbackPeriod) => api.get<PeriodFeedback>('/feedback/periodic', { params: { period } }).then(({ data }) => data),
}
