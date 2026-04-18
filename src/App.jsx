import { useEffect, useMemo, useState } from 'react'
import './index.css'

const methods = [
  { key: 'power', title: 'محاسبه بر اساس توان کل', icon: '⚡' },
  { key: 'current', title: 'محاسبه بر اساس جریان کل', icon: '∿' },
]

function toNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function round(value) {
  return Math.round(value * 100) / 100
}

function GenericReportPage({ title, cards, notes, onBackToForm, onBackToMethods }) {
  return (
    <div className="report-page">
      <div className="report-bg-overlay" />

      <div className="report-shell">
        <div className="report-topbar glass-panel">
          <button className="back-btn" onClick={onBackToMethods}>
            انتخاب روش
          </button>

          <div className="report-title-wrap">
            <div className="report-title">{title}</div>
          </div>

          <button className="back-btn" onClick={onBackToForm}>
            بازگشت به فرم
          </button>
        </div>

        <div className="report-card glass-panel">
          <div className="section-title">نتایج اصلی</div>

          <div className="results-grid">
            {cards.map((card, idx) => (
              <div className="result-box" key={idx}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>

          <div className="section-title">نکات فنی</div>

          <div className="warnings-list">
            {notes.map((item, idx) => (
              <div className="warning-item" key={idx}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PowerMethodForm({ onBack, onContinue }) {
  const [totalPower, setTotalPower] = useState('')
  const [dailyHours, setDailyHours] = useState('6')
  const [sunHours, setSunHours] = useState('5')
  const [systemVoltage, setSystemVoltage] = useState('24')
  const [backupDays, setBackupDays] = useState('1')
  const [systemEfficiency, setSystemEfficiency] = useState('0.8')
  const [simultaneityFactor, setSimultaneityFactor] = useState('1')
  const [surgeFactor, setSurgeFactor] = useState('1.25')
  const [panelUnitPower, setPanelUnitPower] = useState('550')
  const [batteryUnitVoltage, setBatteryUnitVoltage] = useState('12')
  const [batteryUnitCapacityAh, setBatteryUnitCapacityAh] = useState('200')
  const [batteryDod, setBatteryDod] = useState('0.8')

  const result = useMemo(() => {
    const safePower = Math.max(toNumber(totalPower), 0)
    const safeDailyHours = Math.max(toNumber(dailyHours, 6), 0)
    const safeSunHours = Math.max(toNumber(sunHours, 5), 1)
    const safeVoltage = Math.max(toNumber(systemVoltage, 24), 1)
    const safeBackupDays = Math.max(toNumber(backupDays, 1), 1)
    const safeEfficiency = Math.min(Math.max(toNumber(systemEfficiency, 0.8), 0.1), 1)
    const safeSimultaneity = Math.min(Math.max(toNumber(simultaneityFactor, 1), 0.1), 1)
    const safeSurgeFactor = Math.max(toNumber(surgeFactor, 1.25), 1)
    const safePanelUnitPower = Math.max(toNumber(panelUnitPower, 550), 1)
    const safeBatteryUnitVoltage = Math.max(toNumber(batteryUnitVoltage, 12), 1)
    const safeBatteryUnitCapacityAh = Math.max(toNumber(batteryUnitCapacityAh, 200), 1)
    const safeBatteryDod = Math.min(Math.max(toNumber(batteryDod, 0.8), 0.1), 1)

    const coincidentPower = safePower * safeSimultaneity
    const surgePower = coincidentPower * safeSurgeFactor
    const dailyEnergyWh = coincidentPower * safeDailyHours
    const inverterSuggestedW = Math.ceil(Math.max(coincidentPower * 1.25, surgePower))
    const requiredPvPowerW = Math.ceil(dailyEnergyWh / (safeSunHours * safeEfficiency))
    const panelCount = Math.max(Math.ceil(requiredPvPowerW / safePanelUnitPower), 1)
    const totalPanelPowerW = panelCount * safePanelUnitPower

    const batteryRequiredWh = dailyEnergyWh * safeBackupDays
    const batteryRequiredAh = Math.ceil(batteryRequiredWh / (safeVoltage * safeBatteryDod))
    const batterySeriesCount = Math.max(Math.ceil(safeVoltage / safeBatteryUnitVoltage), 1)
    const batteryParallelCount = Math.max(Math.ceil(batteryRequiredAh / safeBatteryUnitCapacityAh), 1)
    const totalBatteryCount = batterySeriesCount * batteryParallelCount
    const controllerSuggestedA = Math.ceil((totalPanelPowerW / safeVoltage) * 1.25)

    return {
      safePower: round(safePower),
      coincidentPower: round(coincidentPower),
      surgePower: round(surgePower),
      dailyEnergyWh: round(dailyEnergyWh),
      dailyEnergyKWh: round(dailyEnergyWh / 1000),
      inverterSuggestedW,
      requiredPvPowerW,
      panelCount,
      totalPanelPowerW,
      batteryRequiredAh,
      batterySeriesCount,
      batteryParallelCount,
      totalBatteryCount,
      controllerSuggestedA,
      notes: [
        'این روش زمانی مناسب است که فقط توان کل بارها را در اختیار داری.',
        'برای بارهای موتوری، ضریب راه‌اندازی را با دقت وارد کن.',
        'برای خروجی دقیق‌تر، روش محاسبه بر اساس تجهیزات بهتر است.',
      ],
    }
  }, [
    totalPower,
    dailyHours,
    sunHours,
    systemVoltage,
    backupDays,
    systemEfficiency,
    simultaneityFactor,
    surgeFactor,
    panelUnitPower,
    batteryUnitVoltage,
    batteryUnitCapacityAh,
    batteryDod,
  ])

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
          <div className="section-title">ورودی‌های محاسبه</div>

          <div className="form-grid">
            <div className="field">
              <label>توان کل مصرفی (وات)</label>
              <input value={totalPower} onChange={(e) => setTotalPower(e.target.value)} placeholder="مثلاً 5000" />
            </div>
            <div className="field">
              <label>ساعت کار روزانه</label>
              <input value={dailyHours} onChange={(e) => setDailyHours(e.target.value)} placeholder="مثلاً 6" />
            </div>
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
              <label>روزهای بکاپ</label>
              <input value={backupDays} onChange={(e) => setBackupDays(e.target.value)} placeholder="مثلاً 1" />
            </div>
            <div className="field">
              <label>راندمان سیستم</label>
              <input value={systemEfficiency} onChange={(e) => setSystemEfficiency(e.target.value)} placeholder="مثلاً 0.8" />
            </div>
            <div className="field">
              <label>ضریب همزمانی</label>
              <input value={simultaneityFactor} onChange={(e) => setSimultaneityFactor(e.target.value)} placeholder="مثلاً 1" />
            </div>
            <div className="field">
              <label>ضریب راه‌اندازی</label>
              <input value={surgeFactor} onChange={(e) => setSurgeFactor(e.target.value)} placeholder="مثلاً 1.25" />
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

          <div className="section-title">پیش‌نمایش سریع</div>

          <div className="results-grid">
            <div className="result-box">
              <span>توان همزمان</span>
              <strong>{result.coincidentPower} W</strong>
            </div>
            <div className="result-box">
              <span>انرژی روزانه</span>
              <strong>{result.dailyEnergyKWh} kWh</strong>
            </div>
            <div className="result-box">
              <span>اینورتر پیشنهادی</span>
              <strong>{result.inverterSuggestedW} W</strong>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="primary-btn"
              onClick={() =>
                onContinue({
                  title: 'گزارش نهایی محاسبه بر اساس توان کل',
                  cards: [
                    { label: 'توان کل مصرفی', value: `${result.safePower} W` },
                    { label: 'توان همزمان', value: `${result.coincidentPower} W` },
                    { label: 'توان راه‌اندازی', value: `${result.surgePower} W` },
                    { label: 'انرژی روزانه', value: `${result.dailyEnergyWh} Wh` },
                    { label: 'انرژی روزانه', value: `${result.dailyEnergyKWh} kWh` },
                    { label: 'اینورتر پیشنهادی', value: `${result.inverterSuggestedW} W` },
                    { label: 'توان PV موردنیاز', value: `${result.requiredPvPowerW} W` },
                    { label: 'تعداد پنل', value: `${result.panelCount}` },
                    { label: 'توان کل پنل‌ها', value: `${result.totalPanelPowerW} W` },
                    { label: 'باتری موردنیاز', value: `${result.batteryRequiredAh} Ah` },
                    { label: 'سری / موازی باتری', value: `${result.batterySeriesCount} / ${result.batteryParallelCount}` },
                    { label: 'تعداد کل باتری', value: `${result.totalBatteryCount}` },
                    { label: 'کنترلر پیشنهادی', value: `${result.controllerSuggestedA} A` },
                  ],
                  notes: result.notes,
                })
              }
            >
              محاسبه و مشاهده گزارش
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CurrentMethodForm({ onBack, onContinue }) {
  const [totalCurrent, setTotalCurrent] = useState('')
  const [systemVoltage, setSystemVoltage] = useState('220')
  const [dailyHours, setDailyHours] = useState('6')
  const [sunHours, setSunHours] = useState('5')
  const [backupDays, setBackupDays] = useState('1')
  const [systemEfficiency, setSystemEfficiency] = useState('0.8')
  const [surgeFactor, setSurgeFactor] = useState('1.25')
  const [panelUnitPower, setPanelUnitPower] = useState('550')
  const [batteryUnitVoltage, setBatteryUnitVoltage] = useState('12')
  const [batteryUnitCapacityAh, setBatteryUnitCapacityAh] = useState('200')
  const [batteryDod, setBatteryDod] = useState('0.8')

  const result = useMemo(() => {
    const safeCurrent = Math.max(toNumber(totalCurrent), 0)
    const safeVoltage = Math.max(toNumber(systemVoltage, 220), 1)
    const safeDailyHours = Math.max(toNumber(dailyHours, 6), 0)
    const safeSunHours = Math.max(toNumber(sunHours, 5), 1)
    const safeBackupDays = Math.max(toNumber(backupDays, 1), 1)
    const safeEfficiency = Math.min(Math.max(toNumber(systemEfficiency, 0.8), 0.1), 1)
    const safeSurgeFactor = Math.max(toNumber(surgeFactor, 1.25), 1)
    const safePanelUnitPower = Math.max(toNumber(panelUnitPower, 550), 1)
    const safeBatteryUnitVoltage = Math.max(toNumber(batteryUnitVoltage, 12), 1)
    const safeBatteryUnitCapacityAh = Math.max(toNumber(batteryUnitCapacityAh, 200), 1)
    const safeBatteryDod = Math.min(Math.max(toNumber(batteryDod, 0.8), 0.1), 1)

    const totalPower = safeCurrent * safeVoltage
    const surgePower = totalPower * safeSurgeFactor
    const dailyEnergyWh = totalPower * safeDailyHours
    const inverterSuggestedW = Math.ceil(Math.max(totalPower * 1.25, surgePower))
    const requiredPvPowerW = Math.ceil(dailyEnergyWh / (safeSunHours * safeEfficiency))
    const panelCount = Math.max(Math.ceil(requiredPvPowerW / safePanelUnitPower), 1)
    const totalPanelPowerW = panelCount * safePanelUnitPower
    const batteryRequiredWh = dailyEnergyWh * safeBackupDays
    const batteryRequiredAh = Math.ceil(batteryRequiredWh / (safeVoltage * safeBatteryDod))
    const batterySeriesCount = Math.max(Math.ceil(safeVoltage / safeBatteryUnitVoltage), 1)
    const batteryParallelCount = Math.max(Math.ceil(batteryRequiredAh / safeBatteryUnitCapacityAh), 1)
    const totalBatteryCount = batterySeriesCount * batteryParallelCount
    const controllerSuggestedA = Math.ceil((totalPanelPowerW / safeVoltage) * 1.25)

    return {
      safeCurrent: round(safeCurrent),
      safeVoltage: round(safeVoltage),
      totalPower: round(totalPower),
      surgePower: round(surgePower),
      dailyEnergyWh: round(dailyEnergyWh),
      dailyEnergyKWh: round(dailyEnergyWh / 1000),
      inverterSuggestedW,
      requiredPvPowerW,
      panelCount,
      totalPanelPowerW,
      batteryRequiredAh,
      batterySeriesCount,
      batteryParallelCount,
      totalBatteryCount,
      controllerSuggestedA,
      notes: [
        'در این روش توان کل از حاصل‌ضرب جریان کل در ولتاژ سیستم محاسبه شده است.',
        'برای بارهای موتوری، ضریب راه‌اندازی را دقیق وارد کن.',
        'اگر جریان تخمینی باشد، نتایج این روش نیز تخمینی خواهند بود.',
      ],
    }
  }, [
    totalCurrent,
    systemVoltage,
    dailyHours,
    sunHours,
    backupDays,
    systemEfficiency,
    surgeFactor,
    panelUnitPower,
    batteryUnitVoltage,
    batteryUnitCapacityAh,
    batteryDod,
  ])

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
          <div className="section-title">ورودی‌های محاسبه</div>

          <div className="form-grid">
            <div className="field">
              <label>جریان کل (آمپر)</label>
              <input value={totalCurrent} onChange={(e) => setTotalCurrent(e.target.value)} placeholder="مثلاً 18" />
            </div>
            <div className="field">
              <label>ولتاژ سیستم</label>
              <select value={systemVoltage} onChange={(e) => setSystemVoltage(e.target.value)}>
                <option value="12">12V</option>
                <option value="24">24V</option>
                <option value="48">48V</option>
                <option value="220">220V</option>
              </select>
            </div>
            <div className="field">
              <label>ساعت کار روزانه</label>
              <input value={dailyHours} onChange={(e) => setDailyHours(e.target.value)} placeholder="مثلاً 6" />
            </div>
            <div className="field">
              <label>ساعات آفتابی مفید</label>
              <input value={sunHours} onChange={(e) => setSunHours(e.target.value)} placeholder="مثلاً 5" />
            </div>
            <div className="field">
              <label>روزهای بکاپ</label>
              <input value={backupDays} onChange={(e) => setBackupDays(e.target.value)} placeholder="مثلاً 1" />
            </div>
            <div className="field">
              <label>راندمان سیستم</label>
              <input value={systemEfficiency} onChange={(e) => setSystemEfficiency(e.target.value)} placeholder="مثلاً 0.8" />
            </div>
            <div className="field">
              <label>ضریب راه‌اندازی</label>
              <input value={surgeFactor} onChange={(e) => setSurgeFactor(e.target.value)} placeholder="مثلاً 1.25" />
            </div>
            <div className="field">
              <label>توان هر پنل</label>
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

          <div className="section-title">پیش‌نمایش سریع</div>

          <div className="results-grid">
            <div className="result-box">
              <span>توان کل</span>
              <strong>{result.totalPower} W</strong>
            </div>
            <div className="result-box">
              <span>انرژی روزانه</span>
              <strong>{result.dailyEnergyKWh} kWh</strong>
            </div>
            <div className="result-box">
              <span>اینورتر پیشنهادی</span>
              <strong>{result.inverterSuggestedW} W</strong>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="primary-btn"
              onClick={() =>
                onContinue({
                  title: 'گزارش نهایی محاسبه بر اساس جریان کل',
                  cards: [
                    { label: 'جریان کل', value: `${result.safeCurrent} A` },
                    { label: 'ولتاژ سیستم', value: `${result.safeVoltage} V` },
                    { label: 'توان کل', value: `${result.totalPower} W` },
                    { label: 'توان راه‌اندازی', value: `${result.surgePower} W` },
                    { label: 'انرژی روزانه', value: `${result.dailyEnergyWh} Wh` },
                    { label: 'انرژی روزانه', value: `${result.dailyEnergyKWh} kWh` },
                    { label: 'اینورتر پیشنهادی', value: `${result.inverterSuggestedW} W` },
                    { label: 'توان PV موردنیاز', value: `${result.requiredPvPowerW} W` },
                    { label: 'تعداد پنل', value: `${result.panelCount}` },
                    { label: 'توان کل پنل‌ها', value: `${result.totalPanelPowerW} W` },
                    { label: 'باتری موردنیاز', value: `${result.batteryRequiredAh} Ah` },
                    { label: 'سری / موازی باتری', value: `${result.batterySeriesCount} / ${result.batteryParallelCount}` },
                    { label: 'تعداد کل باتری', value: `${result.totalBatteryCount}` },
                    { label: 'کنترلر پیشنهادی', value: `${result.controllerSuggestedA} A` },
                  ],
                  notes: result.notes,
                })
              }
            >
              محاسبه و مشاهده گزارش
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MethodCard({ title, icon, onClick }) {
  return (
    <div className="method-card">
      <div className="method-card-border" />
      <div className="method-card-content">
        <div className="method-icon-wrap">
          <div className="method-icon">{icon}</div>
        </div>
        <h2>{title}</h2>
        <button className="secondary-btn" onClick={onClick}>ورود</button>
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [selectedMethodKey, setSelectedMethodKey] = useState(null)
  const [genericReportData, setGenericReportData] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setScreen('methods'), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {screen === 'splash' && (
        <div className="landing-bg">
          <div className="landing-dark-layer" />
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
                <div key={item.key} style={{ animationDelay: `${index * 0.12}s` }}>
                  <MethodCard
                    title={item.title}
                    icon={item.icon}
                    onClick={() => {
                      setSelectedMethodKey(item.key)
                      setScreen('form')
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {screen === 'form' && selectedMethodKey === 'power' && (
        <PowerMethodForm
          onBack={() => {
            setScreen('methods')
            setSelectedMethodKey(null)
          }}
          onContinue={(data) => {
            setGenericReportData(data)
            setScreen('report')
          }}
        />
      )}

      {screen === 'form' && selectedMethodKey === 'current' && (
        <CurrentMethodForm
          onBack={() => {
            setScreen('methods')
            setSelectedMethodKey(null)
          }}
          onContinue={(data) => {
            setGenericReportData(data)
            setScreen('report')
          }}
        />
      )}

      {screen === 'report' && genericReportData && (
        <GenericReportPage
          title={genericReportData.title}
          cards={genericReportData.cards}
          notes={genericReportData.notes}
          onBackToForm={() => setScreen('form')}
          onBackToMethods={() => {
            setScreen('methods')
            setSelectedMethodKey(null)
            setGenericReportData(null)
          }}
        />
      )}
    </>
  )
}
