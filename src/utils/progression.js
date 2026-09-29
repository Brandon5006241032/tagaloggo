import { lessons } from '../data/lessons'

export function unitLessons(unitId) {
  return lessons.filter(lesson => lesson.unit === unitId)
}

export function isUnitComplete(unitId, completedLessons) {
  return unitLessons(unitId).every(lesson => completedLessons.includes(lesson.id))
}

export function isLessonUnlocked(lesson, completedLessons) {
  if (completedLessons.includes(lesson.id)) return true
  if (lesson.unit > 1 && !isUnitComplete(lesson.unit - 1, completedLessons)) return false
  const sameUnit = unitLessons(lesson.unit)
  if (lesson.review) return sameUnit.filter(item => !item.review).every(item => completedLessons.includes(item.id))
  const regularLessons = sameUnit.filter(item => !item.review)
  const index = regularLessons.findIndex(item => item.id === lesson.id)
  return index === 0 || completedLessons.includes(regularLessons[index - 1]?.id)
}
