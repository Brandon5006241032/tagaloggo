import { useProgress } from '../context/ProgressContext'
export function TopStats() { const { progress } = useProgress(); return <div className="top-stats"><span className="stat xp">✦ <b>{progress.xp}</b> XP</span><span className="stat streak">♨ <b>{progress.streak}</b></span><span className="stat hearts">♥ <b>{progress.hearts}</b></span><div className="avatar">F</div></div> }
export function Bar({ value, className = '' }) { return <div className={`bar ${className}`}><span style={{ width: `${Math.min(100, value)}%` }} /></div> }
