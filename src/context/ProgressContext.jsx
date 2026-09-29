import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { addDays, applyDailyXP, defaultProgress, loadProgress, normalizeDailyProgress, saveProgress, todayKey, daysBetween } from '../utils/storage'
const ProgressContext = createContext(null)
const reviewDelay = mastery => [1, 2, 4, 7, 14, 30][Math.min(mastery, 5)]
export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(loadProgress)
  useEffect(() => saveProgress(progress), [progress])
  useEffect(() => {
    const rollover = () => setProgress(p => normalizeDailyProgress(p))
    const timer = window.setInterval(rollover, 60000)
    return () => window.clearInterval(timer)
  }, [])
  const update = (patch) => setProgress(p => ({ ...p, ...patch }))
  const applyXP = (p, earned) => applyDailyXP(p, earned)
  const answer = (correct, word) => setProgress(p => {
    const earned = correct ? 10 : 0
    const next = { ...applyXP(p, earned), hearts: correct ? p.hearts : Math.max(0, p.hearts - 1), totalAnswered: p.totalAnswered + 1, correctAnswers: p.correctAnswers + (correct ? 1 : 0), accuracy: Math.round(((p.correctAnswers + (correct ? 1 : 0)) / (p.totalAnswered + 1)) * 100) }
    if (!word) return next
    const current = p.vocabularyMastery[word] || { word, correctCount: 0, wrongCount: 0, mastery: 0, nextReviewDate: todayKey() }
    const mastery = correct ? Math.min(5, current.mastery + 1) : Math.max(0, current.mastery - 1)
    next.vocabularyMastery = { ...p.vocabularyMastery, [word]: { ...current, word, correctCount: current.correctCount + (correct ? 1 : 0), wrongCount: current.wrongCount + (correct ? 0 : 1), mastery, nextReviewDate: addDays(todayKey(), reviewDelay(mastery)) } }
    return next
  })
  const completeLesson = (id, perfect, words = []) => setProgress(p => {
    const today = todayKey(); const gap = p.lastStudyDate ? daysBetween(p.lastStudyDate, today) : 0
    const streak = p.lastStudyDate === today ? p.streak : (p.lastStudyDate && gap === 1 ? p.streak + 1 : Math.max(1, p.streak))
    const earned = 20 + (perfect ? 10 : 0)
    return { ...applyXP({ ...p, streak, lastStudyDate: today }, earned), completedLessons: p.completedLessons.includes(id) ? p.completedLessons : [...p.completedLessons, id], streak, lastStudyDate: today, learnedWords: [...new Set([...p.learnedWords, ...words])] }
  })
  const reset = () => setProgress(defaultProgress)
  const value = useMemo(() => ({ progress, update, answer, completeLesson, reset }), [progress])
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
export const useProgress = () => useContext(ProgressContext)
