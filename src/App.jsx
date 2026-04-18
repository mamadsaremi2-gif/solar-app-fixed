import { useEffect, useMemo, useState } from 'react'
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

function createEmptyLoad() {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    qty: '1',
    power: '',
    hours: '',
  }
}

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function EquipmentMethodForm({ onBack }) {
  const [loads, setLoads] = useState([
    { id: '1', name: 'لامپ LED', qty: '6', power: '12', hours: '6' },
    { id: '2', name: 'تلویزیون', qty: '1', power: '120', hours: '5' },
  ])
  const [sunHours, setSunHours] = useState('5')
  const [systemVoltage, setSystemVoltage] = useState('24')
  const [batteryBackupDays, setBatteryBackupDays] = useState('1')

  const calculatedRows = useMemo(() => {
    return loads.map((item) => {
      const qty = toNumber(item.qty)
      const power = toNumber(item.power)
      const hours = toNumber(item.hours)

      const totalPower = qty * power
      const dailyEnergy = totalPower * hours

      return {
        ...item,
        qtyNum: qty,
        powerNum: power,
        hoursNum: hours,
        totalPower,
        dailyEnergy,
      }
    })
  }, [loads])

  const totals = useMemo(() => {
    const totalPower = calculatedRows.reduce((sum, item) => sum + item.totalPower, 0)
    const dailyEnergy = calculatedRows.reduce((sum, item) => sum + item.dailyEnergy, 0)

    const safeSunHours = Math.max(toNumber(sunHours), 1)
    const safeVoltage = Math.max(toNumber(systemVoltage), 1)
    const safeBackupDays = Math.max(toNumber(batteryBackupDays), 1)

    const inverterSuggested = Math.ceil(totalPower * 1.25)
    const panelSuggestedW = Math.ceil(dailyEnergy / safeSunHours / 0.8)
    const batterySuggestedAh = Math.ceil((dailyEnergy * safeBackupDays) / safeVoltage)
    const controllerSuggestedA = Math.ceil(panelSuggestedW / safeVoltage)

    return {
      totalPower,
      dailyEnergy,
      inverterSuggested,
      panelSuggestedW,
      batterySuggestedAh,
      controllerSuggestedA,
    }
  }, [calculatedRows, sunHours, systemVoltage, batteryBackupDays])

  const updateLoad = (id, key, value) => {
    setLoads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    )
  }

  const addLoad = () => {
    setLoads((prev) => [...prev, createEmptyLoad()])
  }

  const removeLoad = (id) => {
    setLoads((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="form-page">
      <div className="form-bg-overlay" />

      <div className="form-shell">
        <div className="form-topbar glass-panel">
          <button className="back-btn" onClick={onBack}>
            بازگشت
          </button>

          <div className="form-title-wrap">
            <div className="form-title">محاسبه بر اساس تجهیزات</div>
          </div>

          <div />
        </div>

        <div className="form-card glass-panel">
          <div className="section-title">تنظیمات پایه</div>

          <div className="form-grid compact-grid">
            <div className="field">
              <label>ساعات آفتابی مفید</label>
              <input
                value={sunHours}
                onChange={(e) => setSunHours(e.target.value)}
                placeholder="مثلاً 5"
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
              </select>
            </div>

            <div className="field">
              <label>روزهای بکاپ باتری</label>
              <input
                value={batteryBackupDays}
                onChange={(e) => setBatteryBackupDays(e.target.value)}
                placeholder="مثلاً 1"
              />
            </div>
          </div>

          <div className="section-header">
            <div className="section-title">لیست تجهیزات</div>
            <button className="mini-btn" onClick={addLoad}>
              افزودن تجهیز
            </button>
          </div>

          <div className="loads-table">
            <div className="loads-head">
              <div>نام تجهیز</div>
              <div>تعداد</div>
              <div>توان (وات)</div>
              <div>ساعت کار</div>
              <div>توان کل</div>
              <div>انرژی روزانه</div>
              <div>حذف</div>
            </div>

            {calculatedRows.map((item) => (
              <div className="loads-row" key={item.id}>
                <input
                  value={item.name}
                  onChange={(e) => updateLoad(item.id, 'name', e.target.value)}
                  placeholder="نام تجهیز"
                />

                <input
                  value={item.qty}
                  onChange={(e) => updateLoad(item.id, 'qty', e.target.value)}
                  placeholder="تعداد"
                />

                <input
                  value={item.power}
                  onChange={(e) => updateLoad(item.id, 'power', e.target.value)}
                  placeholder="وات"
                />

                <input
                  value={item.hours}
                  onChange={(e) => updateLoad(item.id, 'hours', e.target.value)}
                  placeholder="ساعت"
                />

                <div className="readonly-cell">{item.totalPower} W</div>
                <div className="readonly-cell">{item.dailyEnergy} Wh</div>

                <button
                  className="remove-btn"
                  onClick={() => removeLoad(item.id)}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>

          <div className="section-title">نتایج محاسبات</div>

          <div className="results-grid">
            <div className="result-box">
              <span>توان کل</span>
              <strong>{totals.totalPower} W</strong>
            </div>

            <div className="result-box">
              <span>انرژی روزانه</span>
              <strong>{totals.dailyEnergy} Wh</strong>
            </div>

            <div className="result-box">
              <span>اینورتر پیشنهادی</span>
              <strong>{totals.inverterSuggested} W</strong>
            </div>

            <div className="result-box">
              <span>پنل پیشنهادی</span>
              <strong>{totals.panelSuggestedW} W</strong>
            </div>

            <div className="result-box">
              <span>باتری پیشنهادی</span>
              <strong>{totals.batterySuggestedAh} Ah</strong>
            </div>

            <div className="result-box">
              <span>کنترلر پیشنهادی</span>
              <strong>{totals.controllerSuggestedA} A</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PowerMethodForm({ onBack }) {
  const [totalPower, setTotalPower] = useState('')

  return (
    <div className="form-page">
      <div className="form-bg-overlay" />
      <div className="form-shell">
        <div className="form-topbar glass-panel">
          <button className="back-btn" onClick={onBack}>
            بازگشت
          </button>

          <div className="form-title-wrap">
            <div className="form-title">محاسبه بر اساس توان کل</div>
          </div>

          <div />
        </div>

        <div className="form-card glass-panel">
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
        </div>
      </div>
    </div>
  )
}

function CurrentMethodForm({ onBack }) {
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
            <div className="form-title">محاسبه بر اساس جریان کل</div>
          </div>

          <div />
        </div>

        <div className="form-card glass-panel">
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

      {screen === 'form' && selectedMethod?.key === 'equipment' && (
        <EquipmentMethodForm
          onBack={() => {
            setScreen('methods')
            setSelectedMethodKey(null)
          }}
        />
      )}

      {screen === 'form' && selectedMethod?.key === 'power' && (
        <PowerMethodForm
          onBack={() => {
            setScreen('methods')
            setSelectedMethodKey(null)
          }}
        />
      )}

      {screen === 'form' && selectedMethod?.key === 'current' && (
        <CurrentMethodForm
          onBack={() => {
            setScreen('methods')
            setSelectedMethodKey(null)
          }}
        />
      )}
    </>
  )
}
