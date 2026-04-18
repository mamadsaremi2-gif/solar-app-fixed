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

function MethodForm({ selectedMethod, onBack }) {
  const [equipmentName, setEquipmentName] = useState('')
  const [equipmentCount, setEquipmentCount] = useState('')
  const [equipmentPower, setEquipmentPower] = useState('')
  const [totalPower, setTotalPower] = useState('')
  const [totalCurrent, setTotalCurrent] = useState('')
  const [systemVoltage, setSystemVoltage] = useState('220')

  return (
    <div className="form-page">
      <div className="form-bg-overlay" />

      <div className="form-shell">
        <div className="form-topbar glass-panel">
          <button className="back-btn" onClick={onBack}>
            بازگشت
          </button>

          <div className="form-title-wrap">
            <div className="form-title">{selectedMethod.title}</div>
          </div>
        </div>

        <div className="form-card glass-panel">
          {selectedMethod.key === 'equipment' && (
            <div className="form-grid">
              <div className="field">
                <label>نام تجهیز</label>
                <input
                  value={equipmentName}
                  onChange={(e) => setEquipmentName(e.target.value)}
                  placeholder="مثلاً کولر"
                />
              </div>

              <div className="field">
                <label>تعداد</label>
                <input
                  value={equipmentCount}
                  onChange={(e) => setEquipmentCount(e.target.value)}
                  placeholder="مثلاً 2"
                />
              </div>

              <div className="field">
                <label>توان هر تجهیز (وات)</label>
                <input
                  value={equipmentPower}
                  onChange={(e) => setEquipmentPower(e.target.value)}
                  placeholder="مثلاً 1200"
                />
              </div>
            </div>
          )}

          {selectedMethod.key === 'power' && (
            <div className="form-grid">
              <div className="field field-full">
                <label>توان کل مصرفی (وات)</label>
                <input
                  value={totalPower}
                  onChange={(e) => setTotalPower(e.target.value)}
                  placeholder="مثلاً 5000"
                />
              </div>
            </div>
          )}

          {selectedMethod.key === 'current' && (
            <div className="form-grid">
              <div className="field">
                <label>جریان کل (آمپر)</label>
                <input
                  value={totalCurrent}
                  onChange={(e) => setTotalCurrent(e.target.value)}
                  placeholder="مثلاً 18"
                />
              </div>

              <div className="field">
                <label>ولتاژ سیستم</label>
                <select
                  value={systemVoltage}
                  onChange={(e) => setSystemVoltage(e.target.value)}
                >
                  <option value="12">12V</option>
                  <option value="24">24V</option>
                  <option value="48">48V</option>
                  <option value="220">220V</option>
                </select>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button className="primary-btn">ادامه</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [selectedMethodKey, setSelectedMethodKey] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('entry')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const selectedMethod =
    methods.find((item) => item.key === selectedMethodKey) || null

  const handleMethodEnter = (methodKey) => {
    setSelectedMethodKey(methodKey)
    setScreen('form')
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
                      onClick={() => handleMethodEnter(item.key)}
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

      {screen === 'form' && selectedMethod && (
        <MethodForm
          selectedMethod={selectedMethod}
          onBack={() => {
            setScreen('methods')
            setSelectedMethodKey(null)
          }}
        />
      )}
    </>
  )
}
