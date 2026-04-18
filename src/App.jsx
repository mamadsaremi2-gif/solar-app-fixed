import { useEffect, useState } from 'react'
import './index.css'

export default function App() {
  const [screen, setScreen] = useState('splash')

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('entry')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="landing-bg">
      {screen === 'entry' && (
        <div className="center-wrap">
          <div className="glass-card entry-card">
            <h1>محاسبات و راه‌اندازی پروژه‌های خورشیدی</h1>
            <button className="enter-btn" onClick={() => setScreen('methods')}>
              ورود
            </button>
          </div>
        </div>
      )}

      {screen === 'methods' && (
        <div className="methods-wrap">
          <div className="methods-grid">
            <div className="glass-card method-card">
              <div className="method-title">محاسبه بر اساس تجهیزات</div>
            </div>

            <div className="glass-card method-card">
              <div className="method-title">محاسبه بر اساس توان کل</div>
            </div>

            <div className="glass-card method-card">
              <div className="method-title">محاسبه بر اساس جریان کل</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
