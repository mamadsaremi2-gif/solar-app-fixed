export function toNum(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function round(value, digits = 2) {
  const factor = 10 ** digits
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function calculateSolarSystem({
  loads = [],
  settings = {},
}) {
  const safeLoads = Array.isArray(loads) ? loads : []

  const {
    sunHours = 5.5,
    systemEfficiency = 0.8,
    simultaneityFactor = 0.8,
    safetyFactor = 1.25,
    autonomyDays = 1,
    dod = 0.8,
    systemVoltage = 24,
    panelPower = 550,
    batteryVoltage = 12,
    controllerSafetyFactor = 1.25,
  } = settings

  let totalPower = 0
  let dailyEnergyWh = 0
  let totalSurgePower = 0

  const normalizedLoads = safeLoads.map((item, index) => {
    const name = item.name?.trim() || `بار ${index + 1}`
    const qty = Math.max(0, toNum(item.qty, 0))
    const power = Math.max(0, toNum(item.power, 0))
    const hours = Math.max(0, toNum(item.hours, 0))
    const surgeFactor = Math.max(1, toNum(item.surgeFactor, 1))
    const type = item.type || 'AC'

    const itemPower = qty * power
    const itemDailyEnergy = itemPower * hours
    const itemSurge = itemPower * surgeFactor

    totalPower += itemPower
    dailyEnergyWh += itemDailyEnergy
    totalSurgePower += itemSurge

    return {
      name,
      qty,
      power,
      hours,
      surgeFactor,
      type,
      itemPower: round(itemPower),
      itemDailyEnergy: round(itemDailyEnergy),
      itemSurge: round(itemSurge),
    }
  })

  const coincidentPower = totalPower * toNum(simultaneityFactor, 0.8)
  const inverterRecommendedPower = Math.max(
    coincidentPower * toNum(safetyFactor, 1.25),
    totalSurgePower
  )

  const requiredPVPower =
    dailyEnergyWh / Math.max(toNum(sunHours, 5.5) * toNum(systemEfficiency, 0.8), 0.01)

  const panelCount = Math.max(
    1,
    Math.ceil(requiredPVPower / Math.max(toNum(panelPower, 550), 1))
  )

  const totalPanelPower = panelCount * toNum(panelPower, 550)

  const batteryEnergyWh = dailyEnergyWh * Math.max(toNum(autonomyDays, 1), 1)

  const requiredBatteryAh =
    batteryEnergyWh /
    Math.max(
      toNum(systemVoltage, 24) * Math.max(toNum(dod, 0.8), 0.01),
      0.01
    )

  const controllerCurrent =
    totalPanelPower / Math.max(toNum(systemVoltage, 24), 1)

  const controllerRecommendedCurrent =
    controllerCurrent * Math.max(toNum(controllerSafetyFactor, 1.25), 1)

  const batteriesInSeries = Math.max(
    1,
    Math.ceil(toNum(systemVoltage, 24) / Math.max(toNum(batteryVoltage, 12), 1))
  )

  const warnings = []

  if (dailyEnergyWh <= 0) {
    warnings.push('انرژی روزانه صفر یا نامعتبر است.')
  }

  if (sunHours < 3) {
    warnings.push('ساعات آفتابی واردشده کم است؛ تعداد پنل ممکن است زیاد شود.')
  }

  if (systemEfficiency < 0.65) {
    warnings.push('راندمان سیستم پایین در نظر گرفته شده است.')
  }

  if (dod > 0.9) {
    warnings.push('مقدار DOD خیلی زیاد است و می‌تواند عمر باتری را کم کند.')
  }

  if (coincidentPower > inverterRecommendedPower * 0.95) {
    warnings.push('اینورتر نزدیک به مرز کاری انتخاب شده است.')
  }

  if (controllerRecommendedCurrent > 100) {
    warnings.push('جریان کنترلر بالاست؛ احتمالاً باید از چند MPPT یا ولتاژ سیستم بالاتر استفاده شود.')
  }

  if (systemVoltage === 12 && totalPower > 1500) {
    warnings.push('برای این توان، سیستم 12 ولت مناسب نیست؛ 24 یا 48 ولت پیشنهاد می‌شود.')
  }

  if (systemVoltage === 24 && totalPower > 4000) {
    warnings.push('برای این توان، سیستم 48 ولت پیشنهاد می‌شود.')
  }

  return {
    loads: normalizedLoads,
    summary: {
      totalPower: round(totalPower),
      dailyEnergyWh: round(dailyEnergyWh),
      dailyEnergyKWh: round(dailyEnergyWh / 1000),
      coincidentPower: round(coincidentPower),
      totalSurgePower: round(totalSurgePower),
    },
    recommendations: {
      inverterPowerW: round(inverterRecommendedPower),
      inverterPowerKW: round(inverterRecommendedPower / 1000),
      requiredPVPowerW: round(requiredPVPower),
      panelPowerW: round(panelPower),
      panelCount,
      totalPanelPowerW: round(totalPanelPower),
      batteryEnergyWh: round(batteryEnergyWh),
      batteryCapacityAh: round(requiredBatteryAh),
      batteryVoltage: round(batteryVoltage),
      batteriesInSeries,
      controllerCurrentA: round(controllerCurrent),
      controllerRecommendedCurrentA: round(controllerRecommendedCurrent),
      systemVoltage: round(systemVoltage),
    },
    warnings,
  }
}
