import { useEffect, useState } from 'react'
import './index.css'

const methods = [
  {
    key: 'equipment',
    title: 'محاسبه بر اساس تجهیزات',
    icon: '☀',
  },
  {
    key: 'power',
    title: 'محاسبه بر اساس توان کل',
    icon: '⚡',
  },
  {
    key: 'current',
    title: 'محاسبه بر اساس جریان کل',
    icon: '∿',
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
              {methods.map((item, index) => (
                <div
                  className="method-card"
                  key={item.key}
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  <div className="method-card-border" />
                  <div className="method-card-content">
                    <div className="method-icon-wrap">
                      <div className="method-icon">{item.icon}</div>
                    </div>

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
