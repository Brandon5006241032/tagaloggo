import { useState } from 'react'
import { useProgress } from '../context/ProgressContext'
import { useNavigate } from 'react-router-dom'

const steps = [
  {
    title: 'Selamat datang di TagalogGo',
    body: 'Aplikasi ini membantu kamu belajar Tagalog dari nol — sedikit demi sedikit, setiap hari.',
    action: 'Pelajari cara belajar →'
  },
  {
    title: 'Cara belajar',
    body: 'Setiap pelajaran memiliki 3–4 soal: kosakata baru, pilihan ganda, menyusun kalimat, dan melengkapi kalimat. Ada juga soal mendengarkan (listening) dari Unit 2 ke atas.',
    action: 'Mengerti →'
  },
  {
    title: 'XP, hearts, dan target harian',
    body: 'Jawaban benar dapat XP dan jangan sampai habis hearts-nya. Setiap hari ada target XP. Jika kamu menyelesaikan target, ada bonus +20 XP. Tetap belajar setiap hari untuk menjaga streak kamu.',
    action: 'Mulai belajar →'
  },
]

export default function Onboarding() {
  const { progress, update } = useProgress()
  const navigate = useNavigate()
  const [step, setStep] = useState(() => progress.onboardingDone ? -1 : 0)

  if (step < 0 || step >= steps.length) return null

  const s = steps[step]

  const next = () => {
    if (step === steps.length - 1) {
      update({ onboardingDone: true })
      setStep(-1)
      navigate('/learn')
    } else {
      setStep(step + 1)
    }
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        <div className="onboarding-step">
          <span className="onboarding-dots">
            {steps.map((_, i) => <span key={i} className={i === step ? 'active' : ''} />)}
          </span>
          <h2 className="onboarding-title">{s.title}</h2>
          <p className="onboarding-body">{s.body}</p>
          <button className="primary full" onClick={next}>
            {s.action}
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
