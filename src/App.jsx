import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Sun, Battery, Zap, Calculator, FileText, TriangleAlert } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const logo = '/logo-watermark.png';

const EQUIPMENT_PRESETS = [
  { name: "کولر گازی 12000", power: 1000, voltage: 230, surgeFactor: 2.2, category: "motor" },
  { name: "کولر گازی 18000", power: 1500, voltage: 230, surgeFactor: 2.5, category: "motor" },
  { name: "کولر گازی 24000", power: 1800, voltage: 230, surgeFactor: 2.8, category: "motor" },
  { name: "کولر گازی 30000", power: 2100, voltage: 230, surgeFactor: 3, category: "motor" },
  { name: "کولر گازی 36000", power: 2800, voltage: 230, surgeFactor: 3, category: "motor" },
  { name: "کولر گازی 48000", power: 3500, voltage: 230, surgeFactor: 3, category: "motor" },
  { name: "کولر گازی 60000", power: 4500, voltage: 230, surgeFactor: 3, category: "motor" },
  { name: "کولر آبی 2500", power: 350, voltage: 230, surgeFactor: 1.8, category: "motor" },
  { name: "کولر آبی 6000", power: 1000, voltage: 230, surgeFactor: 2, category: "motor" },
  { name: "بخاری برقی", power: 2000, voltage: 230, surgeFactor: 1, category: "resistive" },
  { name: "تلویزیون LED", power: 100, voltage: 230, surgeFactor: 1, category: "electronic" },
  { name: "یخچال", power: 300, voltage: 230, surgeFactor: 3, category: "motor" },
  { name: "یخچال فریزر", power: 400, voltage: 230, surgeFactor: 3, category: "motor" },
  { name: "ماشین لباسشویی", power: 1000, voltage: 230, surgeFactor: 2.5, category: "motor" },
  { name: "ماشین ظرفشویی", power: 1500, voltage: 230, surgeFactor: 2.5, category: "motor" },
  { name: "مایکروویو", power: 1500, voltage: 230, surgeFactor: 1.2, category: "electronic" },
  { name: "لامپ LED", power: 10, voltage: 230, surgeFactor: 1, category: "lighting" },
  { name: "ریسه روشنایی", power: 10, voltage: 230, surgeFactor: 1, category: "lighting" },
  { name: "مودم", power: 20, voltage: 230, surgeFactor: 1, category: "electronic" },
  { name: "لپ‌تاپ", power: 80, voltage: 230, surgeFactor: 1.1, category: "electronic" },
  { name: "کامپیوتر", power: 120, voltage: 230, surgeFactor: 1.2, category: "electronic" },
  { name: "پمپ آب", power: 650, voltage: 230, surgeFactor: 3, category: "motor" },
  { name: "کف‌کش", power: 600, voltage: 230, surgeFactor: 3, category: "motor" },
  { name: "هواکش", power: 150, voltage: 230, surgeFactor: 1.8, category: "motor" },
  { name: "پنکه سقفی", power: 80, voltage: 230, surgeFactor: 1.6, category: "motor" },
  { name: "جاروبرقی", power: 1000, voltage: 230, surgeFactor: 2, category: "motor" },
  { name: "اتو", power: 1800, voltage: 230, surgeFactor: 1, category: "resistive" },
  { name: "آبگرم‌کن برقی", power: 2500, voltage: 230, surgeFactor: 1, category: "resistive" },
];

const DEFAULT_ROWS = [
  { id: "1", name: "یخچال", power: 300, qty: 1, hours: 10, voltage: 230, surgeFactor: 3 },
  { id: "2", name: "لامپ LED", power: 10, qty: 10, hours: 6, voltage: 230, surgeFactor: 1 },
  { id: "3", name: "تلویزیون LED", power: 100, qty: 1, hours: 5, voltage: 230, surgeFactor: 1 },
];

const DEFAULT_SETTINGS = {
  projectCode: "",
  reportDate: new Intl.DateTimeFormat("fa-IR").format(new Date()),
  projectName: "",
  customerName: "",
  location: "",
  systemVoltage: 24,
  nominalAcVoltage: 230,
  panelWatt: 600,
  panelVoc: 52,
  panelVmp: 44,
  panelImp: 13.6,
  maxSeriesPanels: 2,
  maxParallelStrings: 3,
  sunHours: 5.5,
  inverterSafetyFactor: 1.25,
  inverterEfficiency: 0.92,
  batteryEfficiency: 0.9,
  depthOfDischarge: 0.5,
  autonomyDays: 1,
  controllerSafetyFactor: 1.25,
  dailyLossFactor: 0.85,
  batteryUnitVoltage: 12,
  batteryUnitAh: 100,
  simultaneousLoadFactor: 1,
  cableLossPercent: 3,
  pvOversizeFactor: 1.15,
  mpptMaxVoc: 150,
  mpptMaxCurrent: 80,
  designTemperatureFactor: 1.15,
  surgeDiversityFactor: 0.65,
};

const inverterCatalog = [
  { power: 1600, voltage: 12, surge: 3000, type: "Pure Sine Wave" },
  { power: 3200, voltage: 24, surge: 6000, type: "Pure Sine Wave" },
  { power: 3500, voltage: 48, surge: 7000, type: "Pure Sine Wave" },
  { power: 5500, voltage: 48, surge: 10000, type: "Hybrid / Pure Sine Wave" },
  { power: 6000, voltage: 48, surge: 12000, type: "Hybrid / Pure Sine Wave" },
  { power: 8000, voltage: 96, surge: 15000, type: "Hybrid / Pure Sine Wave" },
  { power: 10000, voltage: 96, surge: 18000, type: "Hybrid / Pure Sine Wave" },
];

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function round2(v) {
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

function ceilSafe(v) {
  if (!Number.isFinite(v) || v <= 0) return 0;
  return Math.ceil(v);
}

function format(v, maximumFractionDigits = 6) {
  return new Intl.NumberFormat("fa-IR", { maximumFractionDigits }).format(Number.isFinite(v) ? v : 0);
}

function safeRatio(numerator, denominator, fallback = 0) {
  const d = Number(denominator);
  if (!Number.isFinite(d) || d === 0) return fallback;
  const result = Number(numerator) / d;
  return Number.isFinite(result) ? result : fallback;
}

function nextId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function fitImageToPage(canvas, pdfWidth, pdfHeight) {
  const widthRatio = pdfWidth / Math.max(canvas.width, 1);
  const heightRatio = pdfHeight / Math.max(canvas.height, 1);
  const scale = Math.min(widthRatio, heightRatio);
  return {
    width: canvas.width * scale,
    height: canvas.height * scale,
  };
}



function loadStoredAppState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("solar-sizing-app-state");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveStoredAppState(state) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("solar-sizing-app-state", JSON.stringify(state));
  } catch {}
}

function sanitizeSettings(settings) {
  return {
    ...settings,
    systemVoltage: Math.max(num(settings.systemVoltage), 1),
    nominalAcVoltage: Math.max(num(settings.nominalAcVoltage), 1),
    panelWatt: Math.max(num(settings.panelWatt), 1),
    panelVoc: Math.max(num(settings.panelVoc), 1),
    panelVmp: Math.max(num(settings.panelVmp), 1),
    panelImp: Math.max(num(settings.panelImp), 0.1),
    maxSeriesPanels: Math.max(num(settings.maxSeriesPanels), 1),
    maxParallelStrings: Math.max(num(settings.maxParallelStrings), 1),
    sunHours: Math.max(num(settings.sunHours), 0.1),
    inverterSafetyFactor: Math.max(num(settings.inverterSafetyFactor), 1),
    inverterEfficiency: clamp(num(settings.inverterEfficiency), 0.01, 1),
    batteryEfficiency: clamp(num(settings.batteryEfficiency), 0.01, 1),
    depthOfDischarge: clamp(num(settings.depthOfDischarge), 0.01, 1),
    autonomyDays: Math.max(num(settings.autonomyDays), 0),
    controllerSafetyFactor: Math.max(num(settings.controllerSafetyFactor), 1),
    dailyLossFactor: clamp(num(settings.dailyLossFactor), 0.01, 1),
    batteryUnitVoltage: Math.max(num(settings.batteryUnitVoltage), 1),
    batteryUnitAh: Math.max(num(settings.batteryUnitAh), 1),
    simultaneousLoadFactor: clamp(num(settings.simultaneousLoadFactor), 0, 1.5),
    cableLossPercent: clamp(num(settings.cableLossPercent), 0, 30),
    pvOversizeFactor: Math.max(num(settings.pvOversizeFactor), 1),
    mpptMaxVoc: Math.max(num(settings.mpptMaxVoc), 1),
    mpptMaxCurrent: Math.max(num(settings.mpptMaxCurrent), 1),
    designTemperatureFactor: Math.max(num(settings.designTemperatureFactor), 1),
    surgeDiversityFactor: clamp(num(settings.surgeDiversityFactor), 0.2, 1),
  };
}

function suggestInverter(requiredPower, requiredSurgePower, systemVoltage) {
  const compatible = inverterCatalog
    .filter((x) => x.voltage === num(systemVoltage))
    .sort((a, b) => a.power - b.power);

  const found = compatible.find((x) => x.power >= requiredPower && x.surge >= requiredSurgePower);
  if (found) return found;
  if (compatible.length > 0) return compatible[compatible.length - 1];

  const fallback = [...inverterCatalog]
    .sort((a, b) => a.power - b.power)
    .find((x) => x.power >= requiredPower && x.surge >= requiredSurgePower);

  return fallback || inverterCatalog[inverterCatalog.length - 1];
}

function buildWarnings({
  mode,
  settings,
  systemVoltageValues,
  inverterSuggested,
  pvSeriesCount,
  pvParallelStrings,
  totalVocCold,
  controllerCurrent,
  basePower,
}) {
  const warnings = [];

  if (mode === "equipment" && systemVoltageValues.length > 1) {
    warnings.push("در لیست تجهیزات بیش از یک سطح ولتاژ وجود دارد؛ جریان کل به‌صورت تقریبی محاسبه شده است و بهتر است به تفکیک ولتاژ بررسی شود.");
  }

  if (inverterSuggested.voltage !== num(settings.systemVoltage)) {
    warnings.push("در کاتالوگ فعلی اینورتر، مدل کاملاً منطبق با ولتاژ سیستم یافت نشد و نزدیک‌ترین گزینه پیشنهاد شده است.");
  }

  if (totalVocCold > num(settings.mpptMaxVoc)) {
    warnings.push("ولتاژ رشته پنل در شرایط سرد از حداکثر ولتاژ MPPT بیشتر شده است؛ تعداد پنل سری را کاهش دهید.");
  }

  if (controllerCurrent > num(settings.mpptMaxCurrent)) {
    warnings.push("جریان آرایه خورشیدی از ظرفیت MPPT تعریف‌شده بیشتر است؛ یا تعداد استرینگ‌ها را کم کنید یا MPPT قوی‌تر انتخاب کنید.");
  }

  if (pvSeriesCount > num(settings.maxSeriesPanels)) {
    warnings.push("تعداد پنل سری پیشنهادی از محدودیت تعریف‌شده بیشتر است.");
  }

  if (pvParallelStrings > num(settings.maxParallelStrings)) {
    warnings.push("تعداد استرینگ‌های موازی پیشنهادی از محدودیت تعریف‌شده بیشتر است.");
  }

  if (basePower <= 0) {
    warnings.push("توان یا مصرف معتبری برای پروژه ثبت نشده است.");
  }

  return warnings;
}

function buildValidations(settings) {
  const issues = [];

  if (num(settings.inverterEfficiency) <= 0 || num(settings.inverterEfficiency) > 1) {
    issues.push("راندمان اینورتر باید بین 0 و 1 باشد.");
  }
  if (num(settings.batteryEfficiency) <= 0 || num(settings.batteryEfficiency) > 1) {
    issues.push("راندمان باتری باید بین 0 و 1 باشد.");
  }
  if (num(settings.depthOfDischarge) <= 0 || num(settings.depthOfDischarge) > 1) {
    issues.push("عمق دشارژ باید بین 0 و 1 باشد.");
  }
  if (num(settings.dailyLossFactor) <= 0 || num(settings.dailyLossFactor) > 1) {
    issues.push("ضریب تلفات سیستم باید بین 0 و 1 باشد.");
  }
  if (![12, 24, 48, 96].includes(num(settings.systemVoltage))) {
    issues.push("ولتاژ سیستم بهتر است یکی از مقادیر 12، 24، 48 یا 96 ولت باشد.");
  }

  return issues;
}

function computeSizing({ mode, rows, settings, totalPowerInput, totalCurrentInput, totalVoltageInput, totalHoursInput }) {
  const s = sanitizeSettings(settings);

  const validRows = rows
    .map((r) => ({
      ...r,
      power: Math.max(num(r.power), 0),
      qty: Math.max(num(r.qty), 0),
      hours: Math.max(num(r.hours), 0),
      voltage: Math.max(num(r.voltage), 0),
      surgeFactor: Math.max(num(r.surgeFactor || 1), 1),
    }))
    .filter((r) => r.power > 0 && r.qty > 0 && r.hours > 0 && r.voltage > 0);

  const fromRows = validRows.map((r) => {
    const powerTotal = r.power * r.qty;
    const dailyEnergy = powerTotal * r.hours;
    const current = safeRatio(powerTotal, r.voltage, 0);
    const surgePower = powerTotal * r.surgeFactor;
    return { ...r, powerTotal, dailyEnergy, current, surgePower };
  });

  const rowsTotalPower = fromRows.reduce((s0, r) => s0 + r.powerTotal, 0);
  const rowsDailyEnergy = fromRows.reduce((s0, r) => s0 + r.dailyEnergy, 0);
  const maxSingleSurge = Math.max(...fromRows.map((r) => r.surgePower), 0);
  const diversifiedRunningPower = rowsTotalPower * s.simultaneousLoadFactor;
  const diversifiedExtraSurge = Math.max(0, maxSingleSurge - diversifiedRunningPower);
  const rowsEstimatedSurge = diversifiedRunningPower + diversifiedExtraSurge * s.surgeDiversityFactor;

  let basePower = rowsTotalPower;
  let baseEnergy = rowsDailyEnergy;
  let networkVoltage = s.nominalAcVoltage;
  let baseCurrent = 0;
  let surgePower = rowsEstimatedSurge;

  if (mode === "power") {
    basePower = Math.max(num(totalPowerInput), 0);
    networkVoltage = Math.max(num(totalVoltageInput), 1) || s.nominalAcVoltage;
    baseCurrent = safeRatio(basePower, networkVoltage, 0);
    baseEnergy = basePower * Math.max(num(totalHoursInput), 0);
    surgePower = basePower * 1.2;
  } else if (mode === "current") {
    networkVoltage = Math.max(num(totalVoltageInput), 1) || s.nominalAcVoltage;
    baseCurrent = Math.max(num(totalCurrentInput), 0);
    basePower = baseCurrent * networkVoltage;
    baseEnergy = basePower * Math.max(num(totalHoursInput), 0);
    surgePower = basePower * 1.2;
  } else {
    const uniqueVoltages = [...new Set(fromRows.map((x) => num(x.voltage)).filter((v) => v > 0))];
    networkVoltage = uniqueVoltages.length === 1 ? uniqueVoltages[0] : s.nominalAcVoltage;
    baseCurrent = safeRatio(basePower, networkVoltage, 0);
  }

  const simultaneousPower = basePower * s.simultaneousLoadFactor;
  const inverterRequired = (simultaneousPower * s.inverterSafetyFactor) / s.inverterEfficiency;
  const requiredSurgePower = Math.max(surgePower, inverterRequired * 1.15);
  const inverterSuggested = suggestInverter(inverterRequired, requiredSurgePower, s.systemVoltage);

  const effectiveDailyEnergyPerPanel = s.panelWatt * s.sunHours * s.dailyLossFactor * (1 - s.cableLossPercent / 100);
  const panelCountForEnergy = ceilSafe((baseEnergy * s.pvOversizeFactor) / Math.max(effectiveDailyEnergyPerPanel, 1));

  const allowableSeriesByVoc = Math.floor(s.mpptMaxVoc / Math.max(s.panelVoc * s.designTemperatureFactor, 1));
  const boundedSeriesLimit = Math.max(Math.min(allowableSeriesByVoc || 1, s.maxSeriesPanels), 1);
  const pvSeriesCount = clamp(boundedSeriesLimit, 1, 999);
  const pvParallelStrings = ceilSafe(panelCountForEnergy / Math.max(pvSeriesCount, 1));
  const panelRecommended = pvSeriesCount * pvParallelStrings;

  const totalVocCold = pvSeriesCount * s.panelVoc * s.designTemperatureFactor;
  const stringVmp = pvSeriesCount * s.panelVmp;
  const arrayCurrent = pvParallelStrings * s.panelImp;
  const arrayPower = panelRecommended * s.panelWatt;

  const autonomyDays = Math.max(s.autonomyDays, 1);
  const batteryWhRequired = (baseEnergy * autonomyDays) / s.batteryEfficiency;
  const batteriesInSeries = ceilSafe(s.systemVoltage / Math.max(s.batteryUnitVoltage, 1));
  const usableBatteryWhPerBank = s.systemVoltage * s.batteryUnitAh * s.depthOfDischarge;
  const batteryBankCount = ceilSafe(batteryWhRequired / Math.max(usableBatteryWhPerBank, 1));
  const totalBatteryUnits = batteryBankCount * Math.max(batteriesInSeries, 1);

  const controllerCurrent = arrayCurrent * s.controllerSafetyFactor;
  const totalUsableBatteryWh = batteryBankCount * s.systemVoltage * s.batteryUnitAh * s.depthOfDischarge * s.batteryEfficiency;
  const backupHours = safeRatio(totalUsableBatteryWh, Math.max(basePower, 1), 0);

  const validationIssues = buildValidations(s);
  const systemVoltageValues = [...new Set(fromRows.map((x) => num(x.voltage)).filter((v) => v > 0))];
  const warnings = buildWarnings({
    mode,
    settings: s,
    systemVoltageValues,
    inverterSuggested,
    pvSeriesCount,
    pvParallelStrings,
    totalVocCold,
    controllerCurrent,
    basePower,
  });

  const recommendedMinChargingVoltage = s.systemVoltage * 1.2;

  const engineeringNotes = [
    `آرایه پیشنهادی خورشیدی به‌صورت ${format(pvParallelStrings)} استرینگ موازی و ${format(pvSeriesCount)} پنل در هر استرینگ پیشنهاد می‌شود.`,
    `ولتاژ تقریبی کاری آرایه ${format(round2(stringVmp))} ولت و ولتاژ بی‌باری سرد آن ${format(round2(totalVocCold))} ولت است.`,
    `اینورتر منتخب از نوع ${inverterSuggested.type} با توان نامی ${format(inverterSuggested.power)} وات و توان لحظه‌ای ${format(inverterSuggested.surge)} وات است.`,
    `ظرفیت قابل‌استفاده بانک باتری حدود ${format(round2(totalUsableBatteryWh))} وات‌ساعت برآورد می‌شود.`,
    stringVmp < recommendedMinChargingVoltage
      ? `هشدار طراحی: ولتاژ کاری آرایه برای شارژ مطمئن سیستم ${format(s.systemVoltage)} ولت پایین به نظر می‌رسد و بهتر است تعداد پنل سری بازبینی شود.`
      : `ولتاژ کاری آرایه برای شارژ سیستم ${format(s.systemVoltage)} ولت در محدوده قابل‌قبول اولیه قرار دارد.`,
    `توان تقریبی کل آرایه خورشیدی ${format(round2(arrayPower))} وات است.`,
  ];

  return {
    sanitizedSettings: s,
    items: fromRows,
    basePower,
    baseEnergy,
    baseCurrent,
    networkVoltage,
    simultaneousPower,
    surgePower,
    inverterRequired,
    requiredSurgePower,
    inverterSuggested,
    effectiveDailyEnergyPerPanel,
    panelCountForEnergy,
    panelRecommended,
    pvSeriesCount,
    pvParallelStrings,
    totalVocCold,
    stringVmp,
    arrayCurrent,
    arrayPower,
    batteryWhRequired,
    batteryBankCount,
    batteriesInSeries,
    totalBatteryUnits,
    controllerCurrent,
    totalUsableBatteryWh,
    backupHours,
    validationIssues,
    warnings,
    engineeringNotes,
  };
}

export default function SolarEnergySizingProfessionalApp() {
  const initialState = loadStoredAppState();

  const pdfReportRef = useRef(null);
  const [showCustomerForm, setShowCustomerForm] = useState(initialState?.showCustomerForm ?? false);
  const [mode, setMode] = useState(initialState?.mode ?? "equipment");
  const [showIntro, setShowIntro] = useState(initialState?.showIntro ?? true);
  const [showSelector, setShowSelector] = useState(initialState?.showSelector ?? false);
  const [rows, setRows] = useState(Array.isArray(initialState?.rows) && initialState.rows.length > 0 ? initialState.rows : DEFAULT_ROWS);
  const [settings, setSettings] = useState(initialState?.settings ? { ...DEFAULT_SETTINGS, ...initialState.settings } : DEFAULT_SETTINGS);
  const [totalPowerInput, setTotalPowerInput] = useState(initialState?.totalPowerInput ?? 3000);
  const [totalCurrentInput, setTotalCurrentInput] = useState(initialState?.totalCurrentInput ?? 15);
  const [totalVoltageInput, setTotalVoltageInput] = useState(initialState?.totalVoltageInput ?? 230);
  const [totalHoursInput, setTotalHoursInput] = useState(initialState?.totalHoursInput ?? 6);
  const [pdfStatus, setPdfStatus] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installStatus, setInstallStatus] = useState("");

  const result = useMemo(
    () =>
      computeSizing({
        mode,
        rows,
        settings,
        totalPowerInput,
        totalCurrentInput,
        totalVoltageInput,
        totalHoursInput,
      }),
    [mode, rows, settings, totalPowerInput, totalCurrentInput, totalVoltageInput, totalHoursInput]
  );


  useEffect(() => {
    saveStoredAppState({
      showCustomerForm,
      mode,
      showIntro,
      showSelector,
      rows,
      settings,
      totalPowerInput,
      totalCurrentInput,
      totalVoltageInput,
      totalHoursInput,
    });
  }, [showCustomerForm, mode, showIntro, showSelector, rows, settings, totalPowerInput, totalCurrentInput, totalVoltageInput, totalHoursInput]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setInstallStatus("نسخه نصبی برنامه آماده است.");
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setInstallStatus("برنامه با موفقیت نصب شد.");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error) => {
        console.error("SW REGISTER ERROR:", error);
      });
    });
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      setInstallStatus("در این مرورگر یا این مرحله، اعلان نصب هنوز در دسترس نیست.");
      return;
    }

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice?.outcome === "accepted") {
      setInstallStatus("درخواست نصب پذیرفته شد.");
    } else {
      setInstallStatus("نصب برنامه لغو شد.");
    }
    setDeferredPrompt(null);
  };

  const selectMode = (nextMode) => {
    setMode(nextMode);
    setShowSelector(false);
    setShowCustomerForm(true);
  };

  const goBackToSelector = () => {
    setShowCustomerForm(false);
    setShowSelector(true);
  };

  const resetAll = () => {
    setRows(DEFAULT_ROWS);
    setSettings(DEFAULT_SETTINGS);
    setMode("equipment");
    setShowIntro(true);
    setShowSelector(false);
    setShowCustomerForm(false);
    setTotalPowerInput(3000);
    setTotalCurrentInput(15);
    setTotalVoltageInput(230);
    setTotalHoursInput(6);
    setPdfStatus("");
  };

  const setField = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const exportPDF = async () => {
    try {
      setPdfStatus("");

      if (typeof window === "undefined" || !pdfReportRef.current) {
        setPdfStatus("بخش گزارش PDF آماده نیست.");
        return;
      }

      await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = await html2canvas(pdfReportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: -window.scrollY,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4", compress: true });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 6;
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      const fitted = fitImageToPage(canvas, availableWidth, availableHeight);
      const x = (pageWidth - fitted.width) / 2;
      const y = (pageHeight - fitted.height) / 2;

      pdf.addImage(imgData, "JPEG", x, y, fitted.width, fitted.height, undefined, "FAST");
      pdf.save(`solar-report-${settings.projectCode || "project"}.pdf`);
      setPdfStatus("خروجی PDF با موفقیت آماده شد.");
    } catch (err) {
      console.error("PDF ERROR:", err);
      setPdfStatus("خطا در گرفتن خروجی PDF. دوباره تلاش کنید.");
    }
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: nextId(), name: "تجهیز جدید", power: 0, qty: 1, hours: 1, voltage: 230, surgeFactor: 1 },
    ]);
  };

  const addPreset = (presetName) => {
    const preset = EQUIPMENT_PRESETS.find((x) => x.name === presetName);
    if (!preset) return;
    setRows((prev) => [
      ...prev,
      {
        id: nextId(),
        name: preset.name,
        power: preset.power,
        qty: 1,
        hours: 1,
        voltage: preset.voltage,
        surgeFactor: preset.surgeFactor,
      },
    ]);
  };

  const updateRow = (id, key, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  };

  const removeRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  if (showIntro) {
    return (
      <div dir="rtl" className="watermark-bg flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <Card className="w-full max-w-md rounded-3xl border-0 shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center gap-6 py-14">
            <img src={logo} alt="logo" className="h-20 w-20 object-contain" />
            <div className="text-center text-xl font-bold">محاسبه آنلاین نیروگاه خورشیدی</div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                onClick={() => {
                  setShowIntro(false);
                  setShowSelector(true);
                }}
                className="rounded-2xl px-8"
              >
                ورود
              </Button>
              <Button type="button" variant="outline" onClick={installApp} className="rounded-2xl px-8">
                نصب برنامه
              </Button>
            </div>
            {installStatus ? <div className="text-center text-xs text-slate-500">{installStatus}</div> : null}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showSelector) {
    return (
      <div dir="rtl" className="watermark-bg min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <div className="text-2xl font-extrabold text-slate-800 md:text-3xl">انتخاب نوع محاسبه</div>
            <div className="mt-2 text-sm text-slate-500">فقط یکی از سه روش زیر را انتخاب کنید تا وارد صفحه اختصاصی همان روش شوید.</div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <ModeCard
              title="محاسبه بر اساس جریان کل"
              desc="وقتی جریان کل مصرف اندازه‌گیری شده است"
              color="bg-orange-500"
              items={[
                "ثبت جریان کل مصرفی (آمپر)",
                "تعیین ولتاژ سیستم (AC یا DC)",
                "تعیین ساعات کار روزانه",
              ]}
              onClick={() => selectMode("current")}
            />
            <ModeCard
              title="محاسبه بر اساس توان کل"
              desc="وقتی مجموع توان مصرف‌کننده‌ها را می‌دانید"
              color="bg-emerald-600"
              items={[
                "ثبت توان کل مصرفی (وات)",
                "تعیین ولتاژ سیستم (AC یا DC)",
                "تعیین ساعات کار روزانه",
              ]}
              onClick={() => selectMode("power")}
            />
            <ModeCard
              title="محاسبه بر اساس تجهیزات"
              desc="برای ثبت نام وسیله، تعداد، توان و ساعات کار"
              color="bg-blue-600"
              items={[
                "ثبت اطلاعات هر وسیله",
                "تعیین تعداد هر وسیله",
                "تعیین توان و ساعات کار روزانه",
              ]}
              onClick={() => selectMode("equipment")}
            />
          </div>
        </div>
      </div>
    );
  }

  if (showCustomerForm) {
    return (
      <div dir="rtl" className="watermark-bg flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <Card className="w-full max-w-2xl rounded-3xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-xl font-extrabold">اطلاعات مشتری و پروژه</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Input placeholder="نام پروژه" value={settings.projectName} onChange={(e) => setField("projectName", e.target.value)} />
            <Input placeholder="کد پروژه" value={settings.projectCode} onChange={(e) => setField("projectCode", e.target.value)} />
            <Input placeholder="نام مشتری" value={settings.customerName} onChange={(e) => setField("customerName", e.target.value)} />
            <Input placeholder="محل اجرا" value={settings.location} onChange={(e) => setField("location", e.target.value)} />
            <Input placeholder="تاریخ گزارش" value={settings.reportDate} onChange={(e) => setField("reportDate", e.target.value)} />

            <div className="mt-4 flex justify-between md:col-span-2">
              <Button variant="outline" onClick={goBackToSelector}>بازگشت</Button>
              <Button onClick={() => setShowCustomerForm(false)}>ورود به محاسبات</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">خروجی نهایی در یک صفحه A4 فشرده می‌شود.</div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={installApp} className="rounded-2xl">نصب برنامه</Button>
            <Button variant="outline" onClick={resetAll} className="rounded-2xl">شروع مجدد</Button>
            <Button onClick={exportPDF} className="rounded-2xl bg-green-600">
              <FileText className="ml-2 h-4 w-4" /> خروجی PDF
            </Button>
          </div>
        </div>

        {installStatus ? (
          <div className="mb-3 rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-700">
            {installStatus}
          </div>
        ) : null}

        {pdfStatus ? (
          <div className={`mb-3 rounded-2xl px-4 py-3 text-sm ${pdfStatus.includes("خطا") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
            {pdfStatus}
          </div>
        ) : null}

        <div className="absolute -left-[99999px] top-0 w-[794px] bg-white text-slate-900" dir="rtl">
          <div ref={pdfReportRef} className="h-[1123px] w-[794px] bg-white p-8">
            <PdfReport mode={mode} settings={settings} result={result} logo={logo} />
          </div>
        </div>

        <Card className="rounded-3xl border-0 shadow-lg">
          <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xl font-extrabold text-slate-800">
                {mode === "equipment"
                  ? "صفحه اختصاصی محاسبه بر اساس تجهیزات"
                  : mode === "power"
                    ? "صفحه اختصاصی محاسبه بر اساس توان کل"
                    : "صفحه اختصاصی محاسبه بر اساس جریان کل"}
              </div>
              <div className="mt-1 text-sm text-slate-500">محاسبات بر پایه فرمول‌های موجود در اپلیکیشن انجام می‌شود.</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-2xl" onClick={goBackToSelector}>بازگشت به انتخاب روش</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-2">
            {mode === "equipment" && (
              <Card className="rounded-3xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>ورود اطلاعات تجهیزات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-2 md:flex-row">
                      <Select onValueChange={addPreset}>
                        <SelectTrigger className="w-full rounded-2xl md:w-72">
                          <SelectValue placeholder="افزودن تجهیز آماده" />
                        </SelectTrigger>
                        <SelectContent>
                          {EQUIPMENT_PRESETS.map((item) => (
                            <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={addRow} className="rounded-2xl">
                        <Plus className="ml-2 h-4 w-4" />
                        افزودن ردیف
                      </Button>
                    </div>
                    <Badge variant="secondary" className="rounded-xl px-3 py-1 text-sm">تعداد اقلام معتبر: {format(result.items.length)}</Badge>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>نام تجهیز</TableHead>
                          <TableHead>توان واحد</TableHead>
                          <TableHead>تعداد</TableHead>
                          <TableHead>ساعت کار</TableHead>
                          <TableHead>ولتاژ</TableHead>
                          <TableHead>ضریب راه‌اندازی</TableHead>
                          <TableHead>توان کل</TableHead>
                          <TableHead>انرژی روزانه</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((row) => {
                          const powerTotal = num(row.power) * num(row.qty);
                          const dailyEnergy = powerTotal * num(row.hours);
                          return (
                            <TableRow key={row.id}>
                              <TableCell className="min-w-[170px]"><Input value={row.name} onChange={(e) => updateRow(row.id, "name", e.target.value)} /></TableCell>
                              <TableCell><Input type="text" inputMode="decimal" value={row.power} onChange={(e) => updateRow(row.id, "power", e.target.value)} className="text-right" /></TableCell>
                              <TableCell><Input type="text" inputMode="decimal" value={row.qty} onChange={(e) => updateRow(row.id, "qty", e.target.value)} className="text-right" /></TableCell>
                              <TableCell><Input type="text" inputMode="decimal" value={row.hours} onChange={(e) => updateRow(row.id, "hours", e.target.value)} className="text-right" /></TableCell>
                              <TableCell><Input type="text" inputMode="decimal" value={row.voltage} onChange={(e) => updateRow(row.id, "voltage", e.target.value)} className="text-right" /></TableCell>
                              <TableCell><Input type="text" inputMode="decimal" value={row.surgeFactor} onChange={(e) => updateRow(row.id, "surgeFactor", e.target.value)} className="text-right" /></TableCell>
                              <TableCell>{format(powerTotal)} W</TableCell>
                              <TableCell>{format(dailyEnergy)} Wh</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => removeRow(row.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {mode === "power" && (
              <Card className="rounded-3xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>ورود اطلاعات بر اساس توان کل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <LabeledInput label="توان کل مصرفی" desc="مجموع توان مصرف‌کننده‌ها بر حسب وات" value={totalPowerInput} onChange={setTotalPowerInput} />
                    <LabeledInput label="ولتاژ سیستم / شبکه" desc="ولتاژ متناظر با توان مصرفی" value={totalVoltageInput} onChange={setTotalVoltageInput} />
                    <LabeledInput label="ساعات کار روزانه" desc="میانگین زمان کار کل بار در طول روز" value={totalHoursInput} onChange={setTotalHoursInput} />
                  </div>
                </CardContent>
              </Card>
            )}

            {mode === "current" && (
              <Card className="rounded-3xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>ورود اطلاعات بر اساس جریان کل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <LabeledInput label="جریان کل مصرفی" desc="مقدار اندازه‌گیری‌شده بر حسب آمپر" value={totalCurrentInput} onChange={setTotalCurrentInput} />
                    <LabeledInput label="ولتاژ سیستم / شبکه" desc="ولتاژ متناظر با جریان اندازه‌گیری‌شده" value={totalVoltageInput} onChange={setTotalVoltageInput} />
                    <LabeledInput label="ساعات کار روزانه" desc="میانگین زمان کار مصرف در روز" value={totalHoursInput} onChange={setTotalHoursInput} />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle>پارامترهای طراحی سیستم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <LabeledInput label="ولتاژ سیستم" desc="12، 24، 48 یا 96 ولت" value={settings.systemVoltage} onChange={(v) => setField("systemVoltage", v)} />
                  <LabeledInput label="ولتاژ نامی شبکه" desc="معمولاً 230 ولت" value={settings.nominalAcVoltage} onChange={(v) => setField("nominalAcVoltage", v)} />
                  <LabeledInput label="توان هر پنل" desc="توان نامی پنل خورشیدی" value={settings.panelWatt} onChange={(v) => setField("panelWatt", v)} />
                  <LabeledInput label="Voc پنل" desc="ولتاژ بی‌باری هر پنل" value={settings.panelVoc} onChange={(v) => setField("panelVoc", v)} />
                  <LabeledInput label="Vmp پنل" desc="ولتاژ کاری هر پنل" value={settings.panelVmp} onChange={(v) => setField("panelVmp", v)} />
                  <LabeledInput label="Imp پنل" desc="جریان کاری هر پنل" value={settings.panelImp} onChange={(v) => setField("panelImp", v)} />
                  <LabeledInput label="ساعات مفید تابش" desc="میانگین ساعات تابش موثر روزانه" value={settings.sunHours} onChange={(v) => setField("sunHours", v)} />
                  <LabeledInput label="ضریب همزمانی بار" desc="درصد بارهای همزمان روشن" value={settings.simultaneousLoadFactor} onChange={(v) => setField("simultaneousLoadFactor", v)} />
                  <LabeledInput label="راندمان اینورتر" desc="عددی بین 0 تا 1" value={settings.inverterEfficiency} onChange={(v) => setField("inverterEfficiency", v)} />
                  <LabeledInput label="راندمان باتری" desc="عددی بین 0 تا 1" value={settings.batteryEfficiency} onChange={(v) => setField("batteryEfficiency", v)} />
                  <LabeledInput label="عمق دشارژ" desc="عددی بین 0 تا 1" value={settings.depthOfDischarge} onChange={(v) => setField("depthOfDischarge", v)} />
                  <LabeledInput label="روزهای پشتیبانی" desc="مدت بکاپ بدون خورشید" value={settings.autonomyDays} onChange={(v) => setField("autonomyDays", v)} />
                  <LabeledInput label="ولتاژ هر باتری" desc="مثلاً 12 ولت" value={settings.batteryUnitVoltage} onChange={(v) => setField("batteryUnitVoltage", v)} />
                  <LabeledInput label="ظرفیت هر باتری" desc="آمپر ساعت" value={settings.batteryUnitAh} onChange={(v) => setField("batteryUnitAh", v)} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> خروجی محاسبات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <StatCard title="توان کل مصرفی" value={`${format(round2(result.basePower))} W`} icon={<Zap className="h-4 w-4" />} />
                  <StatCard title="انرژی روزانه" value={`${format(round2(result.baseEnergy))} Wh`} icon={<Sun className="h-4 w-4" />} />
                  <StatCard title="جریان کل" value={`${format(round2(result.baseCurrent))} A`} icon={<Zap className="h-4 w-4" />} />
                  <StatCard title="توان همزمان" value={`${format(round2(result.simultaneousPower))} W`} icon={<Zap className="h-4 w-4" />} />
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <ResultLine label="اینورتر موردنیاز" value={`${format(round2(result.inverterRequired))} W`} />
                  <ResultLine label="توان راه‌اندازی موردنیاز" value={`${format(round2(result.requiredSurgePower))} W`} />
                  <ResultLine label="اینورتر پیشنهادی" value={`${format(result.inverterSuggested.power)} W / ${format(result.inverterSuggested.voltage)} V`} />
                  <ResultLine label="تعداد پنل پیشنهادی" value={`${format(result.panelRecommended)} عدد`} />
                  <ResultLine label="چیدمان پنل" value={`${format(result.pvParallelStrings)} موازی × ${format(result.pvSeriesCount)} سری`} />
                  <ResultLine label="کنترلر شارژ" value={`${format(round2(result.controllerCurrent))} A`} />
                  <ResultLine label="Voc سرد آرایه" value={`${format(round2(result.totalVocCold))} V`} />
                  <ResultLine label="Vmp آرایه" value={`${format(round2(result.stringVmp))} V`} />
                  <ResultLine label="باتری موردنیاز" value={`${format(result.totalBatteryUnits)} عدد`} />
                  <ResultLine label="زمان بکاپ تقریبی" value={`${format(round2(result.backupHours))} ساعت`} />
                </div>
              </CardContent>
            </Card>

            {result.validationIssues.length > 0 && (
              <Card className="rounded-3xl border-amber-200 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                    <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                    <div className="space-y-1">
                      <div className="font-bold">موارد نیازمند بازبینی</div>
                      {result.validationIssues.map((issue, index) => (
                        <div key={index}>• {issue}</div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Battery className="h-5 w-5" /> جمع‌بندی مهندسی</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {result.engineeringNotes.map((note, index) => (
                  <div key={index} className="rounded-2xl bg-slate-50 px-3 py-3 text-slate-700">• {note}</div>
                ))}
              </CardContent>
            </Card>

            {result.warnings.length > 0 && (
              <Card className="rounded-3xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-amber-700">هشدارهای طراحی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-amber-900">
                  {result.warnings.map((warning, index) => (
                    <div key={index} className="rounded-2xl bg-amber-50 px-3 py-3">• {warning}</div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeCard({ title, desc, color, items, onClick }) {
  return (
    <Card className="rounded-3xl bg-white shadow-xl">
      <CardContent className="space-y-4 p-5">
        <div className={`rounded-2xl p-4 text-center text-white ${color}`}>
          <div className="text-lg font-bold">{title}</div>
          <div className="mt-1 text-xs text-white/90">{desc}</div>
        </div>
        <div className="space-y-2 text-right text-sm font-medium text-slate-600">
          {items.map((item) => (
            <div key={item}>✓ {item}</div>
          ))}
        </div>
        <Button className="w-full rounded-2xl bg-violet-600" onClick={onClick}>
          ورود به مرحله بعد
        </Button>
      </CardContent>
    </Card>
  );
}

function PdfReport({ mode, settings, result, logo, minimal }) {
  return (
    <>
      <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
        <div>
          <div className="text-2xl font-extrabold">گزارش نهایی طراحی سیستم خورشیدی</div>
          <div className="mt-2 text-sm text-slate-500">خلاصه مهندسی پروژه در یک صفحه A4</div>
        </div>
        <img src={logo} alt="logo" className="h-16 w-16 object-contain" />
      </div>

      {!minimal && (
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="mb-3 text-base font-extrabold">اطلاعات پروژه</div>
          <div className="space-y-2">
            <div>نام پروژه: <span className="font-semibold">{settings.projectName || "-"}</span></div>
            <div>کد پروژه: <span className="font-semibold">{settings.projectCode || "-"}</span></div>
            <div>نام مشتری: <span className="font-semibold">{settings.customerName || "-"}</span></div>
            <div>محل اجرا: <span className="font-semibold">{settings.location || "-"}</span></div>
            <div>تاریخ گزارش: <span className="font-semibold">{settings.reportDate || "-"}</span></div>
            <div>روش محاسبه: <span className="font-semibold">{mode === "equipment" ? "بر اساس تجهیزات" : mode === "power" ? "بر اساس توان کل" : "بر اساس جریان کل"}</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="mb-3 text-base font-extrabold">خلاصه بار مصرفی</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3">توان کل: <span className="font-bold">{format(round2(result.basePower))} W</span></div>
            <div className="rounded-xl bg-slate-50 p-3">انرژی روزانه: <span className="font-bold">{format(round2(result.baseEnergy))} Wh</span></div>
            <div className="rounded-xl bg-slate-50 p-3">جریان کل: <span className="font-bold">{format(round2(result.baseCurrent))} A</span></div>
            <div className="rounded-xl bg-slate-50 p-3">توان همزمان: <span className="font-bold">{format(round2(result.simultaneousPower))} W</span></div>
          </div>
        </div>
      </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="mb-3 text-base font-extrabold">نتایج اصلی طراحی</div>
          <div className="space-y-2 text-sm">
            <div>اینورتر موردنیاز: <span className="font-bold">{format(round2(result.inverterRequired))} W</span></div>
            <div>توان راه‌اندازی: <span className="font-bold">{format(round2(result.requiredSurgePower))} W</span></div>
            <div>اینورتر پیشنهادی: <span className="font-bold">{format(result.inverterSuggested.power)} W / {format(result.inverterSuggested.voltage)} V</span></div>
            <div>تعداد پنل: <span className="font-bold">{format(result.panelRecommended)} عدد</span></div>
            <div>چیدمان پنل: <span className="font-bold">{format(result.pvParallelStrings)} موازی × {format(result.pvSeriesCount)} سری</span></div>
            <div>کنترلر شارژ: <span className="font-bold">{format(round2(result.controllerCurrent))} A</span></div>
            <div>Voc سرد آرایه: <span className="font-bold">{format(round2(result.totalVocCold))} V</span></div>
            <div>Vmp آرایه: <span className="font-bold">{format(round2(result.stringVmp))} V</span></div>
            <div>تعداد کل باتری: <span className="font-bold">{format(result.totalBatteryUnits)} عدد</span></div>
            <div>زمان بکاپ: <span className="font-bold">{format(round2(result.backupHours))} ساعت</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="mb-3 text-base font-extrabold">پارامترهای کلیدی طراحی</div>
          <div className="space-y-2 text-sm">
            <div>ولتاژ سیستم: <span className="font-bold">{format(result.sanitizedSettings.systemVoltage)} V</span></div>
            <div>توان هر پنل: <span className="font-bold">{format(result.sanitizedSettings.panelWatt)} W</span></div>
            <div>ساعات مفید تابش: <span className="font-bold">{format(result.sanitizedSettings.sunHours)} h</span></div>
            <div>راندمان اینورتر: <span className="font-bold">{format(result.sanitizedSettings.inverterEfficiency)}</span></div>
            <div>راندمان باتری: <span className="font-bold">{format(result.sanitizedSettings.batteryEfficiency)}</span></div>
            <div>عمق دشارژ: <span className="font-bold">{format(result.sanitizedSettings.depthOfDischarge)}</span></div>
            <div>ولتاژ باتری: <span className="font-bold">{format(result.sanitizedSettings.batteryUnitVoltage)} V</span></div>
            <div>ظرفیت باتری: <span className="font-bold">{format(result.sanitizedSettings.batteryUnitAh)} Ah</span></div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 p-4">
        <div className="mb-3 text-base font-extrabold">جمع‌بندی مهندسی</div>
        <div className="space-y-2 text-sm leading-7">
          {result.engineeringNotes.slice(0, 4).map((note, index) => (
            <div key={index}>• {note}</div>
          ))}
          {result.warnings.length > 0 ? (
            <div className="mt-2 rounded-xl bg-amber-50 p-3 text-amber-900">
              <div className="mb-1 font-bold">هشدارهای مهم:</div>
              {result.warnings.slice(0, 3).map((warning, index) => (
                <div key={index}>• {warning}</div>
              ))}
            </div>
          ) : (
            <div className="mt-2 rounded-xl bg-emerald-50 p-3 text-emerald-800">در بررسی اولیه، تعارض مهمی بین ولتاژ پنل، MPPT و جریان آرایه مشاهده نشد.</div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="mb-8 font-bold">تأیید فنی</div>
          <div>نام و امضا:</div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="mb-8 font-bold">تأیید کارفرما</div>
          <div>نام و امضا:</div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">{icon}{title}</div>
      <div className="text-base font-bold md:text-lg">{value}</div>
    </div>
  );
}

function ResultLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
      <span className="text-slate-600">{label}</span>
      <span className="break-words text-left font-semibold">{value}</span>
    </div>
  );
}

function LabeledInput({ label, desc, value, onChange, type = "text" }) {
  return (
    <div className="rounded-2xl border bg-white p-3 shadow-sm">
      <div className="mb-1 text-sm font-semibold text-slate-800">{label}</div>
      <div className="mb-3 text-xs leading-6 text-slate-500">{desc}</div>
      <div className="flex items-center gap-2">
        <Input
          type={type}
          inputMode="decimal"
          dir="ltr"
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? "" : e.target.value)}
          className="text-right"
        />
      </div>
    </div>
  );
}
