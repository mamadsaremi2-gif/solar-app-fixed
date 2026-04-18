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

  const handleMethodEnter = (method) => {
    alert(`ورود به بخش: ${method}`)
  }

  return (
    <>
      {/* مرحله 1 و 2 */}
      {(screen === 'splash' || screen === 'entry') && (
        <div className="landing-bg">
          {screen === 'entry' && (
            <div className="center-wrap">
              <div className="glass-card entry-card">
                <h1>محاسبات و راه‌اندازی پروژه‌های خورشیدی</h1>
                <button
                  className="enter-btn"
                  onClick={() => setScreen('methods')}
                >
                  ورود
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* مرحله 3 */}
      {screen === 'methods' && (
        <div className="methods-bg">
          <div className="methods-wrap">
            <div className="methods-grid">

              <div className="glass-card method-card">
                <div className="method-title">محاسبه بر اساس تجهیزات</div>
                <button
                  className="method-enter-btn"
                  onClick={() => handleMethodEnter('تجهیزات')}
                >
                  ورود
                </button>
              </div>

              <div className="glass-card method-card">
                <div className="method-title">محاسبه بر اساس توان کل</div>
                <button
                  className="method-enter-btn"
                  onClick={() => handleMethodEnter('توان کل')}
                >
                  ورود
                </button>
              </div>

              <div className="glass-card method-card">
                <div className="method-title">محاسبه بر اساس جریان کل</div>
                <button
                  className="method-enter-btn"
                  onClick={() => handleMethodEnter('جریان کل')}
                >
                  ورود
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}
