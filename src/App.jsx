import { useState, useEffect, useMemo } from 'react'
import './index.css'

const SPLASH_BG = '/Copilot_20260418_182917.png'
const METHOD_BG = '/method-bg.png'

const toNumber = (v, d = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : d
}

const round = (n, d = 2) => Number(Number(n).toFixed(d))

export default function App() {
  const [step, setStep] = useState('splash')
  const [showCard, setShowCard] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowCard(true), 2000)
  }, [])

  if (step === 'splash') {
    return (
      <div
        className="fullscreen-bg"
        style={{ backgroundImage: `url(${SPLASH_BG})` }}
      >
        {showCard && (
          <div className="glass-card fade-in">
            <h1>محاسبات و راه‌اندازی پروژه‌های خورشیدی</h1>
            <button onClick={() => setStep('methods')}>ورود</button>
          </div>
        )}
      </div>
    )
  }

  if (step === 'methods') {
    return (
      <div
        className="fullscreen-bg"
        style={{ backgroundImage: `url(${METHOD_BG})` }}
      >
        <div className="cards-container fade-in">
          <MethodCard
            title="محاسبه بر اساس تجهیزات"
            onClick={() => setStep('equipment')}
          />
          <MethodCard
            title="محاسبه بر اساس توان کل"
            onClick={() => setStep('power')}
          />
          <MethodCard
            title="محاسبه بر اساس جریان کل"
            onClick={() => setStep('current')}
          />
        </div>
      </div>
    )
  }

  if (step === 'power') {
    return <PowerForm onBack={() => setStep('methods')} />
  }

  if (step === 'current') {
    return <CurrentForm onBack={() => setStep('methods')} />
  }

  return null
}

function MethodCard({ title, onClick }) {
  return (
    <div className="method-card">
      <h2>{title}</h2>
      <button onClick={onClick}>ورود</button>
    </div>
  )
}

/* ===================== POWER ===================== */

function PowerForm({ onBack }) {
  const [power, setPower] = useState('')
  const [hours, setHours] = useState('6')

  const result = useMemo(() => {
    const p = toNumber(power)
    const h = toNumber(hours)
    const energy = p * h
    return {
      power: round(p),
      energy: round(energy),
    }
  }, [power, hours])

  return (
    <div className="form-page">
      <button className="back" onClick={onBack}>بازگشت</button>

      <div className="form-card">
        <h2>محاسبه بر اساس توان کل</h2>

        <input
          placeholder="توان کل (وات)"
          value={power}
          onChange={(e) => setPower(e.target.value)}
        />

        <input
          placeholder="ساعت کار"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />

        <div className="result">
          <p>توان: {result.power} W</p>
          <p>انرژی: {result.energy} Wh</p>
        </div>

        <button className="calc-btn">محاسبه و مشاهده گزارش</button>
      </div>
    </div>
  )
}

/* ===================== CURRENT ===================== */

function CurrentForm({ onBack }) {
  const [current, setCurrent] = useState('')
  const [voltage, setVoltage] = useState('220')

  const result = useMemo(() => {
    const c = toNumber(current)
    const v = toNumber(voltage)
    const power = c * v
    return {
      current: round(c),
      power: round(power),
    }
  }, [current, voltage])

  return (
    <div className="form-page">
      <button className="back" onClick={onBack}>بازگشت</button>

      <div className="form-card">
        <h2>محاسبه بر اساس جریان کل</h2>

        <input
          placeholder="جریان کل (آمپر)"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />

        <input
          placeholder="ولتاژ"
          value={voltage}
          onChange={(e) => setVoltage(e.target.value)}
        />

        <div className="result">
          <p>جریان: {result.current} A</p>
          <p>توان: {result.power} W</p>
        </div>

        <button className="calc-btn">محاسبه و مشاهده گزارش</button>
      </div>
    </div>
  )
}
