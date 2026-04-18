import { useEffect, useState } from 'react'
import './index.css'

const methods = [
  {
    key: 'equipment',
    title: 'محاسبه بر اساس تجهیزات',
  },
  {
    key: 'power',
    title: 'محاسبه بر اساس توان کل',
  },
  {
    key: 'current',
    title: 'محاسبه بر اساس جریان کل',
  },
]

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
      {(screen === 'splash' || screen === 'entry') && (
        <div className="landing-bg">
          <div className="landing-dark-layer" />

          {screen === 'entry' && (
            <div className="center-wrap">
              <div className="entry-panel">
                <div className="entry-shine" />
                <div className="entry-content">
                  <h1>محاسبات و راه‌اندازی پروژه‌های خورشیدی</h1>
                  <button
                    className="primary-btn"
                    onClick={() => setScreen('methods')}
                  >
                    ورود
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {screen === 'methods' && (
        <div className="methods-bg">
          <div className="methods-bg-overlay" />

          <div className="methods-hero">
            <div className="logo-glow" />
            <img
              src="/method-bg.png"
              alt="لوگو"
              className="hero-logo"
            />
          </div>

          <div className="methods-wrap">
            <div className="methods-grid">
              {methods.map((item) => (
                <div className="method-card" key={item.key}>
                  <div className="method-card-border" />
                  <div className="method-card-content">
                    <h2>{item.title}</h2>
                    <button
                      className="secondary-btn"
                      onClick={() => handleMethodEnter(item.title)}
                    >
                      ورود
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
