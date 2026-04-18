import { useMemo, useState, useEffect } from 'react'
import { calculateSolarSystem } from './utils/solarCalculations'
import { exportProjectPdf } from './utils/pdfReport'
import { loadProjects, saveCurrentProject, deleteProject } from './utils/storage'
import './index.css'

const defaultLoads = [
  { name: 'لامپ LED', qty: 6, power: 12, hours: 6, surgeFactor: 1, type: 'AC' },
  { name: 'تلویزیون', qty: 1, power: 120, hours: 5, surgeFactor: 1.2, type: 'AC' },
  { name: 'یخچال', qty: 1, power: 180, hours: 10, surgeFactor: 3, type: 'AC' },
]

const defaultSettings = {
  sunHours: 5.5,
  systemEfficiency: 0.8,
  simultaneityFactor: 0.8,
  safetyFactor: 1.25,
  autonomyDays: 1,
  dod: 0.8,
  systemVoltage: 24,
  panelPower: 550,
  batteryVoltage: 12,
  controllerSafetyFactor: 1.25,
}

const defaultProjectInfo = {
  projectName: '',
  projectCode: '',
  customerName: '',
  location: '',
  reportDate: new Date().toISOString().slice(0, 10),
  preparedBy: 'Mohamad Saremi',
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function NumberInput({ label, value, onChange, step = 'any' }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export default function App() {
  const [projectInfo, setProjectInfo] = useState(defaultProjectInfo)
  const [loads, setLoads] = useState(defaultLoads)
  const [settings, setSettings] = useState(defaultSettings)
  const [savedProjects, setSavedProjects] = useState([])
  const [currentProjectId, setCurrentProjectId] = useState(uid())

  useEffect(() => {
    setSavedProjects(loadProjects())
  }, [])

  const result = useMemo(() => {
    return calculateSolarSystem({ loads, settings })
  }, [loads, settings])

  const updateLoad = (index, key, value) => {
    setLoads((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    )
  }

  const addLoad = () => {
    setLoads((prev) => [
      ...prev,
      { name: '', qty: 1, power: 0, hours: 0, surgeFactor: 1, type: 'AC' },
    ])
  }

  const removeLoad = (index) => {
    setLoads((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveProject = () => {
    const project = {
      id: currentProjectId,
      projectInfo,
      loads,
      settings,
      createdAt: new Date().toISOString(),
    }

    const updated = saveCurrentProject(project)
    setSavedProjects(updated)
    alert('پروژه ذخیره شد.')
  }

  const handleLoadProject = (project) => {
    setCurrentProjectId(project.id)
    setProjectInfo(project.projectInfo)
    setLoads(project.loads)
    setSettings(project.settings)
  }

  const handleDeleteProject = (projectId) => {
    const updated = deleteProject(projectId)
    setSavedProjects(updated)
  }

  const handleNewProject = () => {
    setCurrentProjectId(uid())
    setProjectInfo(defaultProjectInfo)
    setLoads(defaultLoads)
    setSettings(defaultSettings)
  }

  const handlePdf = () => {
    exportProjectPdf({
      projectInfo,
      result,
      loads: result.loads,
    })
  }

  return (
    <div className="app-shell">
      <div className="page-watermark" />

      <header className="topbar">
        <div>
          <h1>محاسبه و سایزینگ سیستم خورشیدی</h1>
          <p>نسخه حرفه‌ای با ذخیره پروژه، گزارش PDF و محاسبات مهندسی</p>
        </div>

        <div className="topbar-actions">
          <button className="primary-btn" onClick={handleSaveProject}>ذخیره پروژه</button>
          <button className="secondary-btn" onClick={handlePdf}>دانلود PDF</button>
          <button className="secondary-btn" onClick={handleNewProject}>پروژه جدید</button>
        </div>
      </header>

      <main className="layout">
        <section className="panel">
          <h2>اطلاعات پروژه</h2>

          <div className="grid-2">
            <label className="field">
              <span>نام پروژه</span>
              <input
                value={projectInfo.projectName}
                onChange={(e) => setProjectInfo((s) => ({ ...s, projectName: e.target.value }))}
              />
            </label>

            <label className="field">
              <span>کد پروژه</span>
              <input
                value={projectInfo.projectCode}
                onChange={(e) => setProjectInfo((s) => ({ ...s, projectCode: e.target.value }))}
              />
            </label>

            <label className="field">
              <span>نام مشتری</span>
              <input
                value={projectInfo.customerName}
                onChange={(e) => setProjectInfo((s) => ({ ...s, customerName: e.target.value }))}
              />
            </label>

            <label className="field">
              <span>محل اجرا</span>
              <input
                value={projectInfo.location}
                onChange={(e) => setProjectInfo((s) => ({ ...s, location: e.target.value }))}
              />
            </label>

            <label className="field">
              <span>تاریخ گزارش</span>
              <input
                type="date"
                value={projectInfo.reportDate}
                onChange={(e) => setProjectInfo((s) => ({ ...s, reportDate: e.target.value }))}
              />
            </label>

            <label className="field">
              <span>تهیه‌کننده</span>
              <input
                value={projectInfo.preparedBy}
                onChange={(e) => setProjectInfo((s) => ({ ...s, preparedBy: e.target.value }))}
              />
            </label>
          </div>
        </section>

        <section className="panel">
          <h2>لیست بارهای مصرفی</h2>

          <div className="loads-table">
            <div className="loads-head">
              <span>نام تجهیز</span>
              <span>تعداد</span>
              <span>توان (وات)</span>
              <span>ساعت/روز</span>
              <span>ضریب راه‌اندازی</span>
              <span>نوع</span>
              <span>عملیات</span>
            </div>

            {loads.map((load, index) => (
              <div className="loads-row" key={index}>
                <input
                  value={load.name}
                  onChange={(e) => updateLoad(index, 'name', e.target.value)}
                  placeholder="مثلاً یخچال"
                />

                <input
                  type="number"
                  value={load.qty}
                  onChange={(e) => updateLoad(index, 'qty', e.target.value)}
                />

                <input
                  type="number"
                  value={load.power}
                  onChange={(e) => updateLoad(index, 'power', e.target.value)}
                />

                <input
                  type="number"
                  value={load.hours}
                  onChange={(e) => updateLoad(index, 'hours', e.target.value)}
                />

                <input
                  type="number"
                  step="0.1"
                  value={load.surgeFactor}
                  onChange={(e) => updateLoad(index, 'surgeFactor', e.target.value)}
                />

                <select
                  value={load.type}
                  onChange={(e) => updateLoad(index, 'type', e.target.value)}
                >
                  <option value="AC">AC</option>
                  <option value="DC">DC</option>
                </select>

                <button className="danger-btn" onClick={() => removeLoad(index)}>
                  حذف
                </button>
              </div>
            ))}
          </div>

          <button className="primary-btn" onClick={addLoad}>
            افزودن بار جدید
          </button>
        </section>

        <section className="panel">
          <h2>تنظیمات طراحی</h2>

          <div className="grid-2">
            <NumberInput label="ساعات آفتابی مفید" value={settings.sunHours} onChange={(v) => setSettings((s) => ({ ...s, sunHours: v }))} />
            <NumberInput label="راندمان کل سیستم" value={settings.systemEfficiency} onChange={(v) => setSettings((s) => ({ ...s, systemEfficiency: v }))} step="0.01" />
            <NumberInput label="ضریب همزمانی" value={settings.simultaneityFactor} onChange={(v) => setSettings((s) => ({ ...s, simultaneityFactor: v }))} step="0.01" />
            <NumberInput label="ضریب اطمینان" value={settings.safetyFactor} onChange={(v) => setSettings((s) => ({ ...s, safetyFactor: v }))} step="0.01" />
            <NumberInput label="روزهای بکاپ" value={settings.autonomyDays} onChange={(v) => setSettings((s) => ({ ...s, autonomyDays: v }))} />
            <NumberInput label="DOD باتری" value={settings.dod} onChange={(v) => setSettings((s) => ({ ...s, dod: v }))} step="0.01" />
            <NumberInput label="ولتاژ سیستم" value={settings.systemVoltage} onChange={(v) => setSettings((s) => ({ ...s, systemVoltage: v }))} />
            <NumberInput label="توان هر پنل (وات)" value={settings.panelPower} onChange={(v) => setSettings((s) => ({ ...s, panelPower: v }))} />
            <NumberInput label="ولتاژ هر باتری" value={settings.batteryVoltage} onChange={(v) => setSettings((s) => ({ ...s, batteryVoltage: v }))} />
            <NumberInput label="ضریب اطمینان کنترلر" value={settings.controllerSafetyFactor} onChange={(v) => setSettings((s) => ({ ...s, controllerSafetyFactor: v }))} step="0.01" />
          </div>
        </section>

        <section className="panel">
          <h2>خلاصه نتایج</h2>

          <div className="result-grid">
            <div className="result-box"><strong>{result.summary.totalPower}</strong><span>توان کل مصرفی (وات)</span></div>
            <div className="result-box"><strong>{result.summary.dailyEnergyWh}</strong><span>انرژی روزانه (وات‌ساعت)</span></div>
            <div className="result-box"><strong>{result.summary.dailyEnergyKWh}</strong><span>انرژی روزانه (کیلووات‌ساعت)</span></div>
            <div className="result-box"><strong>{result.summary.coincidentPower}</strong><span>توان همزمان (وات)</span></div>
            <div className="result-box"><strong>{result.summary.totalSurgePower}</strong><span>توان راه‌اندازی (وات)</span></div>
          </div>
        </section>

        <section className="panel">
          <h2>تجهیزات پیشنهادی</h2>

          <div className="result-grid">
            <div className="result-box highlight"><strong>{result.recommendations.inverterPowerW}</strong><span>اینورتر پیشنهادی (وات)</span></div>
            <div className="result-box highlight"><strong>{result.recommendations.panelCount}</strong><span>تعداد پنل پیشنهادی</span></div>
            <div className="result-box highlight"><strong>{result.recommendations.totalPanelPowerW}</strong><span>توان کل پنل‌ها (وات)</span></div>
            <div className="result-box highlight"><strong>{result.recommendations.batteryCapacityAh}</strong><span>ظرفیت باتری موردنیاز (Ah)</span></div>
            <div className="result-box highlight"><strong>{result.recommendations.batteriesInSeries}</strong><span>تعداد باتری در سری</span></div>
            <div className="result-box highlight"><strong>{result.recommendations.controllerRecommendedCurrentA}</strong><span>کنترلر پیشنهادی (آمپر)</span></div>
          </div>
        </section>

        <section className="panel">
          <h2>جزئیات بارها</h2>

          <div className="detail-table">
            <div className="detail-head">
              <span>نام</span>
              <span>توان کل</span>
              <span>انرژی روزانه</span>
              <span>توان راه‌اندازی</span>
            </div>

            {result.loads.map((item, index) => (
              <div className="detail-row" key={index}>
                <span>{item.name}</span>
                <span>{item.itemPower} W</span>
                <span>{item.itemDailyEnergy} Wh</span>
                <span>{item.itemSurge} W</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>پروژه‌های ذخیره‌شده</h2>

          {savedProjects.length === 0 ? (
            <div className="ok-box">هنوز پروژه‌ای ذخیره نشده است.</div>
          ) : (
            <div className="saved-list">
              {savedProjects.map((project) => (
                <div className="saved-card" key={project.id}>
                  <div>
                    <strong>{project.projectInfo.projectName || 'بدون نام'}</strong>
                    <p>{project.projectInfo.customerName || '-'}</p>
                  </div>

                  <div className="saved-actions">
                    <button className="secondary-btn" onClick={() => handleLoadProject(project)}>بارگذاری</button>
                    <button className="danger-btn" onClick={() => handleDeleteProject(project.id)}>حذف</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <h2>هشدارها و نکات فنی</h2>

          {result.warnings.length === 0 ? (
            <div className="ok-box">هشدار خاصی وجود ندارد.</div>
          ) : (
            <ul className="warning-list">
              {result.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
