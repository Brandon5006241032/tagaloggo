const KEY = 'tagaloggo-progress-v1'
export const defaultProgress = { completedLessons: [], xp: 0, hearts: 5, streak: 0, lastStudyDate: null, learnedWords: [], vocabularyMastery: {}, accuracy: 0, totalAnswered: 0, correctAnswers: 0, onboardingDone: false, todayXP: 0, dailyGoal: 30, lastDailyDate: null, dailyBonusDate: null }
export function normalizeDailyProgress(progress) {
  const today = todayKey()
  if (progress.lastDailyDate === today) return progress
  return { ...progress, todayXP: 0, dailyGoal: Number(progress.dailyGoal) > 0 ? Number(progress.dailyGoal) : 30, lastDailyDate: today, dailyBonusDate: null }
}
export function applyDailyXP(progress, earned) {
  const base = normalizeDailyProgress(progress)
  const today = todayKey()
  const todayXP = base.todayXP + earned
  const dailyGoal = Number(base.dailyGoal) > 0 ? Number(base.dailyGoal) : 30
  const reached = base.todayXP < dailyGoal && todayXP >= dailyGoal && base.dailyBonusDate !== today
  return { ...base, xp: base.xp + earned + (reached ? 20 : 0), todayXP, dailyGoal, dailyBonusDate: reached ? today : base.dailyBonusDate }
}
export function loadProgress() { try { const raw = localStorage.getItem(KEY); const parsed = raw ? JSON.parse(raw) : {}; return normalizeDailyProgress({ ...defaultProgress, ...parsed, vocabularyMastery: parsed.vocabularyMastery || {} }) } catch { return normalizeDailyProgress(defaultProgress) } }
export function saveProgress(progress) { try { localStorage.setItem(KEY, JSON.stringify(progress)) } catch {} }
export function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}` }
export function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000) }
export function addDays(date, days) { const [year, month, day] = date.split('-').map(Number); const result = new Date(year, month - 1, day); result.setDate(result.getDate() + days); return `${result.getFullYear()}-${result.getMonth()+1}-${result.getDate()}` }
