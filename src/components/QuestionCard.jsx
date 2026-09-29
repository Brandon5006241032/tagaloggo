import { useEffect, useState } from 'react'

export default function QuestionCard({ question, onAnswer, onNext, number, total }) {
  const [selected, setSelected] = useState(null)
  const [built, setBuilt] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [voiceReady, setVoiceReady] = useState(false)

  const choose = (value) => {
    if (feedback !== null) return
    setSelected(value)
    const correct = Array.isArray(question.answer)
      ? JSON.stringify(value) === JSON.stringify(question.answer)
      : value === question.answer
    setFeedback(correct)
    onAnswer(correct)
  }

  const submitWords = () => choose(built)
  const addWord = (word) => {
    if (!built.includes(word)) setBuilt([...built, word])
  }
  const reset = () => { setBuilt([]); setSelected(null); setFeedback(null) }
  const next = () => { reset(); onNext() }

  // Detect Filipino voice availability for graceful degradation
  useEffect(() => {
    if (!window.speechSynthesis) return
    const checkVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      setVoiceReady(voices.some(v => v.lang.toLowerCase().startsWith('tl')))
    }
    window.speechSynthesis.onvoiceschanged = checkVoice
    checkVoice()
  }, [])

  const speak = () => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(question.tagalog)
    utterance.lang = 'tl-PH'
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="question-wrap">
      <div className="q-meta">
        <span>PERTANYAAN {number} / {total}</span>
        <span className="q-dots">
          {Array.from({ length: total }, (_, i) => (
            <i className={i < number ? 'done' : ''} key={i} />
          ))}
        </span>
      </div>
      <div className="question-card">
        <p className="eyebrow">
          {question.type === 'vocab' ? 'KOSAKATA BARU'
            : question.type === 'listen' ? 'LISTENING'
            : question.prompt.toUpperCase()}
        </p>

        {question.type === 'vocab' && (
          <>
            <div className="vocab-spark">✦</div>
            <h2 className="tagalog-word">{question.tagalog}</h2>
            <p className="meaning">{question.meaning}</p>
            {question.note && <div className="tip">💡 {question.note}</div>}
          </>
        )}

        {question.type === 'choice' && (
          <>
            <h2 className="question-title">{question.prompt}</h2>
            <div className="prompt-word">{question.tagalog}</div>
            <div className="options">
              {question.options.map(o => (
                <button
                  key={o}
                  className={selected === o
                    ? (feedback === null ? 'selected' : o === question.answer ? 'correct' : 'wrong')
                    : ''}
                  onClick={() => choose(o)}
                >
                  {o}
                  <span>
                    {selected === o && feedback === true ? '✓'
                      : selected === o && feedback === false ? '×' : ''}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {question.type === 'listen' && (
          <>
            <h2 className="question-title">{question.prompt}</h2>
            {!voiceReady && (
              <div className="listen-notice">
                <span>🎧</span>
                <span>Suara Tagalog belum tersedia di perangkat ini. Dengarkan tetap diputar, tetapi pengucapannya mungkin kurang akurat.</span>
              </div>
            )}
            <button className="listen-btn" onClick={speak}>
              ▶ <span>Dengarkan</span>
            </button>
            <div className="prompt-word">{question.tagalog}</div>
            <div className="options">
              {question.options.map(o => (
                <button
                  key={o}
                  className={selected === o
                    ? (feedback === null ? 'selected' : o === question.answer ? 'correct' : 'wrong')
                    : ''}
                  onClick={() => choose(o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </>
        )}

        {question.type === 'translation' && (
          <>
            <h2 className="question-title">{question.prompt}</h2>
            <div className="prompt-word">{question.tagalog}</div>
            <div className="options">
              {question.options.map(o => (
                <button
                  key={o}
                  className={selected === o
                    ? (feedback === null ? 'selected' : o === question.answer ? 'correct' : 'wrong')
                    : ''}
                  onClick={() => choose(o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </>
        )}

        {question.type === 'fill' && (
          <>
            <h2 className="question-title">{question.prompt}</h2>
            <div className="sentence">{question.sentence}</div>
            <div className="options">
              {question.options.map(o => (
                <button
                  key={o}
                  className={selected === o
                    ? (feedback === null ? 'selected' : o === question.answer ? 'correct' : 'wrong')
                    : ''}
                  onClick={() => choose(o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </>
        )}

        {question.type === 'words' && (
          <>
            <h2 className="question-title">{question.prompt}</h2>
            <div className="sentence built">
              {built.length ? built.join(' ') : 'Pilih kata di bawah'}
            </div>
            <div className="word-bank">
              {question.words.map(w => (
                <button
                  key={w}
                  disabled={built.includes(w)}
                  onClick={() => addWord(w)}
                >
                  {w}
                </button>
              ))}
            </div>
            {built.length === question.words.length && (
              <button className="check-btn" onClick={submitWords}>
                Periksa jawaban
              </button>
            )}
          </>
        )}

        {feedback !== null && (
          <div className={`feedback ${feedback ? 'good' : 'bad'}`}>
            <b>{feedback ? '✓ Benar!' : '× Belum tepat'}</b>
            {!feedback && (
              <span>Jawaban yang benar: {Array.isArray(question.answer) ? question.answer.join(' ') : question.answer}</span>
            )}
          </div>
        )}
      </div>

      {question.type === 'vocab' && (
        <button className="primary full" onClick={next}>
          Lanjut <span>→</span>
        </button>
      )}

      {feedback !== null && (
        <button className="primary full" onClick={next}>
          {number === total ? 'Lihat hasil' : 'Lanjut'} <span>→</span>
        </button>
      )}
    </div>
  )
}
