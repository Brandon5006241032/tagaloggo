import { useMemo, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { TopStats } from './components/Stats'
import QuestionCard from './components/QuestionCard'
import { ProgressProvider, useProgress } from './context/ProgressContext'
import { lessons, units } from './data/lessons'
import { vocabulary } from './data/vocabulary'
import Onboarding from './components/Onboarding'
import { isLessonUnlocked, isUnitComplete } from './utils/progression'
import { todayKey } from './utils/storage'
import './App.css'

function Layout({ children }) {
  const { progress } = useProgress()
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <header>
          <div>
            <span className="mobile-brand">Tagalog<span>Go</span></span>
            <p className="greeting">{progress.completedLessons.length ? 'Selamat datang kembali 👋' : 'Selamat datang 👋'}</p>
            <h1>Belajar Tagalog, sedikit demi sedikit.</h1>
          </div>
          <TopStats />
        </header>
        {children}
      </main>
      <Onboarding />
    </div>
  )
}

function computeWeeklyXP(progress) {
  const now = new Date()
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
    const isToday = i === 0
    days.push({
      key,
      dayLabel: ['M','S','R','K','J','S','S'][i],
      xp: isToday ? progress.todayXP : 0
    })
  }
  return days
}

function Home() {
  const { progress } = useProgress()
  const navigate = useNavigate()
  const completed = new Set(progress.completedLessons)
  const weeklyDays = useMemo(() => computeWeeklyXP(progress), [progress])
  return (
    <>
      <section className="hero-card">
        <div>
          <span className="kicker">LANJUTKAN BELAJAR</span>
          <h2>{completed.size ? 'Kamu makin lancar!' : 'Mulai perjalananmu.'}</h2>
          <p>{completed.size ? 'Satu pelajaran kecil lagi hari ini?' : 'Pelajari percakapan Tagalog sehari-hari dengan cara yang santai.'}</p>
          <button className="primary" onClick={() => navigate(`/learn/${lessons.find(l => !completed.has(l.id) && isLessonUnlocked(l, progress.completedLessons))?.id || lessons[0].id}`)}>
            Mulai belajar <span>→</span>
          </button>
        </div>
        <div className="hero-illustration">🌴<b>kumusta!</b></div>
      </section>

      <div className="section-heading">
        <div>
          <span className="kicker">PERJALANANMU</span>
          <h2>Pelajaran</h2>
        </div>
        <NavLink to="/learn">Lihat semua →</NavLink>
      </div>

      <div className="lesson-grid">
        {lessons.slice(0, 4).map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} done={completed.has(lesson.id)} unlocked={isLessonUnlocked(lesson, progress.completedLessons)} />
        ))}
      </div>

      <section className="progress-panel">
        <div>
          <span className="kicker">TARGET HARIAN</span>
          <h2>{Math.min(progress.todayXP, progress.dailyGoal)} / {progress.dailyGoal} XP</h2>
          <p>{progress.todayXP >= progress.dailyGoal ? 'Target harian tercapai! Bonus +20 XP.' : `${progress.dailyGoal - progress.todayXP} XP lagi untuk target hari ini.`}</p>
          <div className="bar"><span style={{ width: `${Math.min(100, (progress.todayXP / progress.dailyGoal) * 100)}%` }} /></div>
        </div>
        <div style={{marginLeft: '40px'}}>
          <span className="kicker">PROGRES 7 HARI TERAKHIR</span>
          <h2>{progress.xp} XP terkumpul</h2>
          <p>{progress.streak ? `Streak ${progress.streak} hari. Pertahankan!` : 'Belajar hari ini untuk memulai streak.'}</p>
          <div className="weekly-bars">
          {weeklyDays.map((d) => (
              <div key={d.key}>
                <span style={{ height: `${d.xp > 0 ? Math.max(12, (d.xp / d.goal) * 60) : 0}px` }} className={d.xp > 0 ? 'filled' : ''} />
                <small>{d.dayLabel}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function LessonCard({ lesson, done, unlocked }) {
  const label = done ? 'Selesai' : unlocked ? '→' : 'Terkunci'
  const content = <><div className="lesson-icon">{lesson.icon}</div><div><span className="unit-label">UNIT {lesson.unit}</span><h3>{lesson.title}</h3><p>{lesson.subtitle}</p></div><span className="lesson-status">{label}</span></>
  return unlocked ? <NavLink to={`/learn/${lesson.id}`} className={`lesson-card ${lesson.color} ${done ? 'completed' : ''}`}>{content}</NavLink> : <div className={`lesson-card ${lesson.color} locked`} aria-disabled="true">{content}</div>
}

function Learn() {
  const { progress } = useProgress()
  const completed = progress.completedLessons
  return <><div className="section-heading"><div><span className="kicker">KURIKULUM</span><h2>Semua pelajaran</h2></div></div>{units.map(unit => { const unitComplete = isUnitComplete(unit.id, completed); const unitUnlocked = unit.id === 1 || isUnitComplete(unit.id - 1, completed); return <section className={`unit ${unitUnlocked ? '' : 'unit-locked'}`} key={unit.id}><div className="unit-heading"><div><span className="kicker">UNIT {unit.id}</span><h2>{unit.title}</h2><p>{unit.sub}</p></div><span>{lessons.filter(l => l.unit === unit.id && !l.review && completed.includes(l.id)).length}/{lessons.filter(l => l.unit === unit.id && !l.review).length} selesai{unitComplete ? ' ✓' : ''}</span></div><div className="lesson-grid">{lessons.filter(l => l.unit === unit.id).map(lesson => <LessonCard key={lesson.id} lesson={lesson} done={completed.includes(lesson.id)} unlocked={isLessonUnlocked(lesson, completed)} />)}</div></section>})}</>
}

function Lesson() {
  const { id } = useParams(); const navigate = useNavigate(); const { progress, answer, completeLesson } = useProgress(); const lesson = lessons.find(item => item.id === id); const [index, setIndex] = useState(0); const [correct, setCorrect] = useState(0)
  if (!lesson) return <Empty title="Pelajaran tidak ditemukan" />
  if (!isLessonUnlocked(lesson, progress.completedLessons)) return <Empty title="Pelajaran masih terkunci" />
  const question = lesson.questions[index]
  const handleAnswer = value => { setCorrect(c => c + (value ? 1 : 0)); answer(value, question.word || null) }
  const finish = () => { completeLesson(lesson.id, correct === lesson.questions.length, lesson.questions.filter(q => q.type === 'vocab').map(q => q.tagalog)); navigate('/learn') }
  return <div className="lesson-view"><button className="back-link" onClick={() => navigate('/learn')}>← Kembali ke pelajaran</button><div className="lesson-header"><span className={`lesson-icon ${lesson.color}`}>{lesson.icon}</span><div><span className="kicker">UNIT {lesson.unit}</span><h2>{lesson.title}</h2><p>{lesson.subtitle}</p></div></div><QuestionCard question={question} number={index + 1} total={lesson.questions.length} onAnswer={handleAnswer} onNext={() => index === lesson.questions.length - 1 ? finish() : setIndex(i => i + 1)} /></div>
}

function Review() {
  const { progress, answer } = useProgress()
  const today = todayKey()
  const reviewItems = useMemo(() => lessons.filter(lesson => lesson.review).flatMap(lesson => lesson.questions.map(question => {
    const tagalog = question.word || question.words?.[0] || question.prompt.match(/[“"]([^”"]+)[”"]/)?.[1] || null
    const vocabularyWord = vocabulary.find(word => tagalog && word.tagalog.toLowerCase() === tagalog.toLowerCase())
    return { ...question, lesson, tagalog, vocabularyWord }
  })).sort((a, b) => {
    const left = a.tagalog ? progress.vocabularyMastery[a.tagalog] : null
    const right = b.tagalog ? progress.vocabularyMastery[b.tagalog] : null
    const leftDue = left?.nextReviewDate && left.nextReviewDate <= today ? 1 : 0
    const rightDue = right?.nextReviewDate && right.nextReviewDate <= today ? 1 : 0
    return rightDue - leftDue || (left?.mastery || 0) - (right?.mastery || 0)
  }), [progress.vocabularyMastery, today])
  const [activeIndex, setActiveIndex] = useState(null)
  const [sessionItems, setSessionItems] = useState(null)
  const [quizDone, setQuizDone] = useState(false)
  const activeItem = activeIndex === null ? null : sessionItems?.[activeIndex]
  const startReview = index => { setSessionItems(reviewItems); setActiveIndex(index); setQuizDone(false) }
  const handleAnswer = correct => answer(correct, activeItem?.tagalog || null)
  const handleNext = () => {
    if (activeIndex < sessionItems.length - 1) setActiveIndex(index => index + 1)
    else { setActiveIndex(null); setSessionItems(null); setQuizDone(true) }
  }

  return (
    <>
      <div className="section-heading"><div><span className="kicker">ULANGI LAGI</span><h2>Review kosakata</h2></div><span className="pill">{reviewItems.length} soal</span></div>
      {activeItem ? (
        <div className="lesson-view">
          <button className="back-link" onClick={() => { setActiveIndex(null); setSessionItems(null) }}>← Kembali ke review</button>
          <div className="lesson-header"><span className="lesson-icon purple">⭐</span><div><span className="kicker">UNIT {activeItem.lesson.unit}</span><h2>{activeItem.lesson.title}</h2><p>{activeItem.lesson.subtitle}</p></div></div>
          <QuestionCard question={activeItem} number={activeIndex + 1} total={reviewItems.length} onAnswer={handleAnswer} onNext={handleNext} />
        </div>
      ) : quizDone ? (
        <div className="review-done"><h2>Selesai hari ini 🎉</h2><p>Semua soal review sudah kamu kerjakan.</p><button className="primary full" onClick={() => { setQuizDone(false); startReview(0) }}>Review lagi <span>→</span></button></div>
      ) : (
        <div className="review-grid">
          {reviewItems.map((item, index) => {
            const mastery = item.tagalog ? progress.vocabularyMastery[item.tagalog] : null
            const isDue = mastery?.nextReviewDate && mastery.nextReviewDate <= today
            return <article className={`word-card ${isDue ? 'due' : ''}`} key={item.id} onClick={() => startReview(index)}>
              <span className="card-cat">UNIT {item.lesson.unit}</span><h3>{item.prompt}</h3><p className="word-meaning">{item.tagalog || 'Latihan kalimat'}</p>
              {mastery && <span className="mastery-badge">{mastery.mastery}/5</span>}{isDue && <span className="due-badge">Segera</span>}<span className="card-hint">Tap untuk mulai</span>
            </article>
          })}
        </div>
      )}
    </>
  )
}

function Grammar() {
  const grammarEntries = [
    { title: 'Ako si Ana', meaning: 'Identitas dengan nama (pakai "si" untuk orang)', example: 'Ako si Ana.', lessonId: 'perkenalan', note: 'Pakai "si" untuk nama orang. Contoh: Ako si Budi.' },
    { title: 'Ako ay estudyante', meaning: 'Identitas dengan pekerjaan atau sifat (pakai "ay")', example: 'Ako ay estudyante.', lessonId: 'ako-ay', note: 'Pakai "ay" untuk sifat atau pekerjaan. Berbeda dengan "Ako si" yang hanya untuk nama.' },
    { title: 'Gusto ko ng…', meaning: 'Mengungkapkan keinginan', example: 'Gusto ko ng tubig.', lessonId: 'gusto-ko', note: 'Struktur: "Gusto ko ng + benda". Contoh: Gusto ko ng kape.' },
    { title: 'Ang / Ng / Sa', meaning: 'Kata penanda: subjek / objek / arah', example: 'Malaki ang bahay ko. / Gusto ko ng kape. / Pumunta ako sa paaralan.', lessonId: 'partikel-dasar', note: 'Ang = subjek utama. Ng = objek atau kepunyaan. Sa = ke, di, atau arah.' },
    { title: 'Kumusta ka?', meaning: 'Sapaan sehari-hari', example: 'Kumusta ka, Juan?', lessonId: 'sapaan', note: 'Digunakan untuk bertanya "apa kabar?". Jawaban: "Kumusta" atau "Oo, mabuti."' },
    { title: 'Oo / Hindi', meaning: 'Ya / Tidak', example: 'Oo, gusto ko. / Hindi, terima kasih.', lessonId: 'jawaban-dasar', note: '"Oo" = ya (setuju). "Hindi" = tidak (menolak).' },
  ]

  return (
    <>
      <div className="section-heading">
        <div>
          <span className="kicker">PANDUAN SINGKAT</span>
          <h2>Grammar dasar</h2>
          <p>Polanya sederhana, gunakan berulang kali.</p>
        </div>
      </div>
      <div className="grammar-grid">
        {grammarEntries.map((entry, index) => {
          const lesson = lessons.find(l => l.id === entry.lessonId)
          return (
            <article key={entry.title} className="grammar-entry">
              <span className="grammar-number">0{index + 1}</span>
              <h3>{entry.title}</h3>
              <p>{entry.meaning}</p>
              <code>{entry.example}</code>
              {entry.note && <p className="grammar-note">{entry.note}</p>}
              {lesson && (
                <NavLink to={`/learn/${entry.lessonId}`} className="grammar-link">
                  Pelajari di Unit {lesson.unit} →
                </NavLink>
              )}
            </article>
          )
        })}
      </div>
    </>
  )
}

function Profile() { const { progress, reset } = useProgress(); return <><div className="section-heading"><div><span className="kicker">PROFIL BELAJAR</span><h2>Profil kamu</h2></div></div><section className="profile-card"><div className="big-avatar">F</div><div><h2>Kaibigan Tagalog</h2><p>Pelajar yang konsisten</p></div><div className="profile-stats"><b>{progress.xp}<small>XP</small></b><b>{progress.streak}<small>hari streak</small></b><b>{progress.accuracy}%<small>akurasi</small></b></div></section><section className="settings-card"><h3>Data belajar</h3><p>Progres tersimpan otomatis di perangkat ini.</p><button className="secondary" onClick={() => { if (window.confirm('Hapus semua progres?')) reset() }}>Reset progres</button></section></> }
function Empty({ title }) { return <section className="empty"><span>✦</span><h2>{title}</h2><p>Halaman ini sedang disiapkan.</p></section> }
function AppContent() { return <Layout><Routes><Route path="/" element={<Home />} /><Route path="/app" element={<Home />} /><Route path="/learn" element={<Learn />} /><Route path="/learn/:id" element={<Lesson />} /><Route path="/review" element={<Review />} /><Route path="/grammar" element={<Grammar />} /><Route path="/profile" element={<Profile />} /><Route path="*" element={<Empty title="Halaman tidak ditemukan" />} /></Routes></Layout> }
export default function App() { return <BrowserRouter><ProgressProvider><AppContent /></ProgressProvider></BrowserRouter> }
