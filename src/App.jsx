import { useEffect, useMemo, useState } from 'react'
import './index.css'

const methods = [
  { key: 'equipment', title: 'محاسبه بر اساس تجهیزات', icon: '☀' },
  { key: 'power', title: 'محاسبه بر اساس توان کل', icon: '⚡' },
  { key: 'current', title: 'محاسبه بر اساس جریان کل', icon: '∿' },
]

function createEmptyLoad() {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    qty: '1',
    power: '',
    hours: '',
    surgeFactor: '1',
  }
}

function toNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function round(value) {
  return Math.round(value * 100) / 100
}

function EquipmentReportPage({ data, onBackToForm, onBackToMethods }) {
  const {
    settings,
    rows,
    result,
  } = data

  return (
    <div className="report-page">
      <div className="report-bg-overlay" />

      <div className="report-shell">
        <div className="report-topbar glass-panel">
          <button className="back-btn" onClick={onBackToMethods}>
            انتخاب روش
          </button>

          <div className="report-title-wrap">
            <div className="report-title">گزارش نهایی محاسبه تجهیزات</div>
          </div>

          <button className="back-btn" onClick={onBackToForm}>
            بازگشت به فرم
          </button>
        </div>

        <div className="report-card glass-panel">
          <div className="section-title">خلاصه طراحی</div>

          <div className="summary-grid">
            <div className="summary-box">
              <span>ولتاژ سیستم</span>
              <strong>{settings.systemVoltage} V</strong>
            </div>

            <div className="summary-box">
              <span>ساعات آفتابی</span>
              <strong>{settings.sunHours}</strong>
            </div>

            <div className="summary-box">
              <span>راندمان سیستم</span>
              <strong>{settings.systemEfficiency}</strong>
            </div>

            <div className="summary-box">
              <span>ضریب همزمانی</span>
              <strong>{settings.simultaneityFactor}</strong>
            </div>

            <div className="summary-box">
              <span>روزهای بکاپ</span>
              <strong>{settings.backupDays}</strong>
            </div>

            <div className="summary-box">
              <span>DOD باتری</span>
              <strong>{settings.batteryDod}</strong>
            </div>
          </div>

          <div className="section-title">نتایج اصلی</div>

          <div className="results-grid">
            <div className="result-box">
              <span>توان متصل کل</span>
              <strong>{result.totalConnectedPower} W</strong>
            </div>

            <div className="result-box">
              <span>توان همزمان</span>
              <strong>{result.coincidentPower} W</strong>
            </div>

            <div className="result-box">
              <span>توان راه‌اندازی</span>
              <strong>{result.totalSurgePower} W</strong>
            </div>

            <div className="result-box">
              <span>انرژی روزانه</span>
              <strong>{result.dailyEnergyWh} Wh</strong>
            </div>

            <div className="result-box">
              <span>انرژی روزانه</span>
              <strong>{result.dailyEnergyKWh} kWh</strong>
            </div>

            <div className="result-box">
              <span>اینورتر پیشنهادی</span>
              <strong>{result.inverterSuggestedW} W</strong>
            </div>

            <div className="result-box">
              <span>توان PV موردنیاز</span>
              <strong>{result.requiredPvPowerW} W</strong>
            </div>

            <div className="result-box">
              <span>تعداد پنل</span>
              <strong>{result.panelCount}</strong>
            </div>

            <div className="result-box">
              <span>توان کل پنل‌ها</span>
              <strong>{result.totalPanelPowerW} W</strong>
            </div>

            <div className="result-box">
              <span>باتری موردنیاز</span>
              <strong>{result.batteryRequiredAh} Ah</strong>
            </div>

            <div className="result-box">
              <span>سری / موازی باتری</span>
              <strong>{result.batterySeriesCount} / {result.batteryParallelCount}</strong>
            </div>

            <div className="result-box">
              <span>تعداد کل باتری</span>
              <strong>{result.totalBatteryCount}</strong>
            </div>

            <div className="result-box">
              <span>کنترلر پیشنهادی</span>
              <strong>{result.controllerSuggestedA} A</strong>
            </div>
          </div>

          <div className="section-title">جدول تجهیزات</div>

          <div className="report-table">
            <div className="report-head">
              <div>نام تجهیز</div>
              <div>تعداد</div>
              <div>توان</div>
              <div>ساعت کار</div>
              <div>ضریب راه‌اندازی</div>
              <div>توان کل</div>
              <div>انرژی روزانه</div>
            </div>

            {rows.map((item) => (
              <div className="report-row" key={item.id}>
                <div>{item.name || '-'}</div>
                <div>{item.qtyNum}</div>
                <div>{item.powerNum} W</div>
                <div>{item.hoursNum}</div>
                <div>{item.surgeFactorNum}</div>
                <div>{item.totalPower} W</div>
                <div>{item.dailyEnergy} Wh</div>
              </div>
            ))}
          </div>

          <div className="section-title">هشدارها و نکات فنی</div>

          {result.warnings.length === 0 ? (
            <div className="note-box">هشدار خاصی در تنظیمات فعلی دیده نشد.</div>
          ) : (
            <div className="warnings-list">
              {result.warnings.map((warning, index) => (
                <div className="warning-item" key={index}>
                  {warning}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EquipmentMethodForm({ onBack, onContinue }) {
  const [loads, setLoads] = useState([
    { id: '1', name: 'لامپ LED', qty: '6', power: '12', hours: '6', surgeFactor: '1' },
    { id: '2', name: 'تلویزیون', qty: '1', power: '120', hours: '5', surgeFactor: '1.2' },
    { id: '3', name: 'یخچال', qty: '1', power: '180', hours: '10', surgeFactor: '3' },
  ])

  const [sunHours, setSunHours] = useState('5')
  const [systemVoltage, setSystemVoltage] = useState('24')
  const [backupDays, setBackupDays] = useState('1')
  const [systemEfficiency, setSystemEfficiency] = useState('0.8')
  const [simultaneityFactor, setSimultaneityFactor] = useState('0.8')
  const [panelUnitPower, setPanelUnitPower] = useState('550')
  const [batteryUnitVoltage, setBatteryUnitVoltage] = useState('12')
  const [batteryUnitCapacityAh, setBatteryUnitCapacityAh] = useState('200')
  const [batteryDod, setBatteryDod] = useState('0.8')

  const calculatedRows = useMemo(() => {
    return loads.map((item) => {
      const qty = Math.max(toNumber(item.qty), 0)
      const power = Math.max(toNumber(item.power), 0)
      const hours = Math.max(toNumber(item.hours), 0)
      const surgeFactor = Math.max(toNumber(item.surgeFactor, 1), 1)

      const totalPower = qty * power
      const dailyEnergy = totalPower * hours
      const surgePower = totalPower * surgeFactor

      return {
        ...item,
        qtyNum: qty,
        powerNum: power,
        hoursNum: hours,
        surgeFactorNum: surgeFactor,
        totalPower: round(totalPower),
        dailyEnergy: round(dailyEnergy),
        surgePower: round(surgePower),
      }
    })
  }, [loads])

  const result = useMemo(() => {
    const totalConnectedPower = calculatedRows.reduce((sum, item) => sum + item.totalPower, 0)
    const dailyEnergyWh = calculatedRows.reduce((sum, item) => sum + item.dailyEnergy, 0)
    const totalSurgePower = calculatedRows.reduce((sum, item) => sum + item.surgePower, 0)

    const safeSunHours = Math.max(toNumber(sunHours, 5), 1)
    const safeSystemVoltage = Math.max(toNumber(systemVoltage, 24), 1)
    const safeBackupDays = Math.max(toNumber(backupDays, 1), 1)
    const safeEfficiency = Math.min(Math.max(toNumber(systemEfficiency, 0.8), 0.1), 1)
    const safeSimultaneity = Math.min(Math.max(toNumber(simultaneityFactor, 0.8), 0.1), 1)
    const safePanelUnitPower = Math.max(toNumber(panelUnitPower, 550), 1)
    const safeBatteryUnitVoltage = Math.max(toNumber(batteryUnitVoltage, 12), 1)
    const safeBatteryUnitCapacityAh = Math.max(toNumber(batteryUnitCapacityAh, 200), 1)
    const safeBatteryDod = Math.min(Math.max(toNumber(batteryDod, 0.8), 0.1), 1)

    const coincidentPower = totalConnectedPower * safeSimultaneity
    const inverterSuggestedW = Math.ceil(Math.max(coincidentPower * 1.25, totalSurgePower))

    const requiredPvPowerW = dailyEnergyWh / (safeSunHours * safeEfficiency)
    const panelCount = Math.max(Math.ceil(requiredPvPowerW / safePanelUnitPower), 1)
    const totalPanelPowerW = panelCount * safePanelUnitPower

    const batteryRequiredWh = dailyEnergyWh * safeBackupDays
    const batteryRequiredAh = batteryRequiredWh / (safeSystemVoltage * safeBatteryDod)

    const batterySeriesCount = Math.max(Math.ceil(safeSystemVoltage / safeBatteryUnitVoltage), 1)
    const batteryParallelCount = Math.max(Math.ceil(batteryRequiredAh / safeBatteryUnitCapacityAh), 1)
    const totalBatteryCount = batterySeriesCount * batteryParallelCount

    const controllerSuggestedA = Math.ceil((totalPanelPowerW / safeSystemVoltage) * 1.25)

    const warnings = []

    if (safeSystemVoltage === 12 && totalConnectedPower > 1500) {
      warnings.push('برای این توان، سیستم 12 ولت مناسب نیست و 24 یا 48 ولت پیشنهاد می‌شود.')
    }

    if (safeSystemVoltage === 24 && totalConnectedPower > 4000) {
      warnings.push('برای این توان، سیستم 48 ولت پیشنهاد می‌شود.')
    }

    if (safeSunHours < 4) {
      warnings.push('ساعات آفتابی مفید پایین در نظر گرفته شده و تعداد پنل بیشتر خواهد شد.')
    }

    if (safeEfficiency < 0.75) {
      warnings.push('راندمان سیستم پایین وارد شده است؛ تلفات سیستم را بررسی کن.')
    }

    if (controllerSuggestedA > 100) {
      warnings.push('جریان کنترلر بالاست؛ بررسی استفاده از چند MPPT یا ولتاژ بالاتر توصیه می‌شود.')
    }

    if (totalSurgePower > inverterSuggestedW * 0.95) {
      warnings.push('توان راه‌اندازی نزدیک به مرز انتخاب اینورتر است؛ حاشیه اطمینان را بیشتر کن.')
    }

    return {
      totalConnectedPower: round(totalConnectedPower),
      coincidentPower: round(coincidentPower),
      totalSurgePower: round(totalSurgePower),
      dailyEnergyWh: round(dailyEnergyWh),
      dailyEnergyKWh: round(dailyEnergyWh / 1000),
      inverterSuggestedW,
      requiredPvPowerW: Math.ceil(requiredPvPowerW),
      panelCount,
      totalPanelPowerW,
      batteryRequiredWh: Math.ceil(batteryRequiredWh),
      batteryRequiredAh: Math.ceil(batteryRequiredAh),
      batterySeriesCount,
      batteryParallelCount,
      totalBatteryCount,
      controllerSuggestedA,
      warnings,
    }
  }, [
    calculatedRows,
    sunHours,
    systemVoltage,
    backupDays,
    systemEfficiency,
    simultaneityFactor,
    panelUnitPower,
    batteryUnitVoltage,
    batteryUnitCapacityAh,
    batteryDod,
  ])

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
          <div className="section-title">تنظیمات مهندسی</div>

          <div className="form-grid compact-grid">
            <div className="field">
              <label>ساعات آفتابی مفید</label>
              <input value={sunHours} onChange={(e) => setSunHours(e.target.value)} placeholder="مثلاً 5" />
            </div>

            <div className="field">
              <label>ولتاژ سیستم</label>
              <select value={systemVoltage} onChange={(e) => setSystemVoltage(e.target.value)}>
                <option value="12">12V</option>
                <option value="24">24V</option>
                <option value="48">48V</option>
              </select>
            </div>

            <div className="field">
              <label>روزهای بکاپ باتری</label>
              <input value={backupDays} onChange={(e) => setBackupDays(e.target.value)} placeholder="مثلاً 1" />
            </div>

            <div className="field">
              <label>راندمان سیستم</label>
              <input value={systemEfficiency} onChange={(e) => setSystemEfficiency(e.target.value)} placeholder="مثلاً 0.8" />
            </div>

            <div className="field">
              <label>ضریب همزمانی</label>
              <input value={simultaneityFactor} onChange={(e) => setSimultaneityFactor(e.target.value)} placeholder="مثلاً 0.8" />
            </div>

            <div className="field">
              <label>توان هر پنل (وات)</label>
              <input value={panelUnitPower} onChange={(e) => setPanelUnitPower(e.target.value)} placeholder="مثلاً 550" />
            </div>

            <div className="field">
              <label>ولتاژ هر باتری</label>
              <input value={batteryUnitVoltage} onChange={(e) => setBatteryUnitVoltage(e.target.value)} placeholder="مثلاً 12" />
            </div>

            <div className="field">
              <label>ظرفیت هر باتری (Ah)</label>
              <input value={batteryUnitCapacityAh} onChange={(e) => setBatteryUnitCapacityAh(e.target.value)} placeholder="مثلاً 200" />
            </div>

            <div className="field">
              <label>DOD باتری</label>
              <input value={batteryDod} onChange={(e) => setBatteryDod(e.target.value)} placeholder="مثلاً 0.8" />
            </div>
          </div>

          <div className="section-header">
            <div className="section-title">لیست تجهیزات</div>
            <button className="mini-btn" onClick={addLoad}>
              افزودن تجهیز
            </button>
          </div>

          <div className="loads-table">
            <div className="loads-head loads-head-8">
              <div>نام تجهیز</div>
              <div>تعداد</div>
              <div>توان</div>
              <div>ساعت کار</div>
              <div>ضریب راه‌اندازی</div>
              <div>توان کل</div>
              <div>انرژی روزانه</div>
              <div>حذف</div>
            </div>

            {calculatedRows.map((item) => (
              <div className="loads-row loads-row-8" key={item.id}>
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

                <input
                  value={item.surgeFactor}
                  onChange={(e) => updateLoad(item.id, 'surgeFactor', e.target.value)}
                  placeholder="مثلاً 3"
                />

                <div className="readonly-cell">{item.totalPower} W</div>
                <div className="readonly-cell">{item.dailyEnergy} Wh</div>

                <button className="remove-btn" onClick={() => removeLoad(item.id)}>
                  حذف
                </button>
              </div>
            ))}
          </div>

          <div className="section-title">نتایج مهندسی</div>

          <div className="results-grid">
            <div className="result-box">
              <span>توان متصل کل</span>
              <strong>{result.totalConnectedPower} W</strong>
            </div>

            <div className="result-box">
              <span>توان همزمان</span>
              <strong>{result.coincidentPower} W</strong>
            </div>

            <div className="result-box">
              <span>توان راه‌اندازی</span>
              <strong>{result.totalSurgePower} W</strong>
            </div>

            <div className="result-box">
              <span>انرژی روزانه</span>
              <strong>{result.dailyEnergyWh} Wh</strong>
            </div>

            <div className="result-box">
              <span>انرژی روزانه</span>
              <strong>{result.dailyEnergyKWh} kWh</strong>
            </div>

            <div className="result-box">
              <span>اینورتر پیشنهادی</span>
              <strong>{result.inverterSuggestedW} W</strong>
            </div>

            <div className="result-box">
              <span>توان PV موردنیاز</span>
              <strong>{result.requiredPvPowerW} W</strong>
            </div>

            <div className="result-box">
              <span>تعداد پنل</span>
              <strong>{result.panelCount}</strong>
            </div>

            <div className="result-box">
              <span>توان کل پنل‌ها</span>
              <strong>{result.totalPanelPowerW} W</strong>
            </div>

            <div className="result-box">
              <span>باتری موردنیاز</span>
              <strong>{result.batteryRequiredAh} Ah</strong>
            </div>

            <div className="result-box">
              <span>سری / موازی باتری</span>
              <strong>{result.batterySeriesCount} / {result.batteryParallelCount}</strong>
            </div>

            <div className="result-box">
              <span>تعداد کل باتری</span>
              <strong>{result.totalBatteryCount}</strong>
            </div>

            <div className="result-box">
              <span>کنترلر پیشنهادی</span>
              <strong>{result.controllerSuggestedA} A</strong>
            </div>
          </div>

          <div className="section-title">هشدارها و نکات فنی</div>

          {result.warnings.length === 0 ? (
            <div className="note-box">هشدار خاصی در تنظیمات فعلی دیده نشد.</div>
          ) : (
            <div className="warnings-list">
              {result.warnings.map((warning, index) => (
                <div className="warning-item" key={index}>
                  {warning}
                </div>
              ))}
            </div>
          )}

          <div className="form-actions">
            <button
              className="primary-btn"
              onClick={() =>
                onContinue({
                  settings: {
                    sunHours,
                    systemVoltage,
                    backupDays,
                    systemEfficiency,
                    simultaneityFactor,
                    panelUnitPower,
                    batteryUnitVoltage,
                    batteryUnitCapacityAh,
                    batteryDod,
                  },
                  rows: calculatedRows,
                  result,
                })
              }
            >
              ادامه
            </button>
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
          <button className="back-btn" onClick={onBack}>بازگشت</button>
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
          <button className="back-btn" onClick={onBack}>بازگشت</button>
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
  const [equipmentReportData, setEquipmentReportData] = useState(null)

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
    setEquipmentReportData(null)
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
                  <button className="primary-btn" onClick={() => setScreen('methods')}>
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
            <img src="/method-bg.png" alt="لوگو" className="hero-logo" />
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
          onContinue={(data) => {
            setEquipmentReportData(data)
            setScreen('equipment-report')
          }}
        />
      )}

      {screen === 'equipment-report' && equipmentReportData && (
        <EquipmentReportPage
          data={equipmentReportData}
          onBackToForm={() => setScreen('form')}
          onBackToMethods={() => {
            setScreen('methods')
            setSelectedMethodKey(null)
            setEquipmentReportData(null)
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
