import React from 'react'
import { cn } from '@/lib/utils'

const SelectContext = React.createContext(null)

export function Select({ value = '', onValueChange, children }) {
  const [internalValue, setInternalValue] = React.useState(value)
  const [placeholder, setPlaceholder] = React.useState('')
  const [options, setOptions] = React.useState([])

  React.useEffect(() => {
    setInternalValue(value)
  }, [value])

  const registerOption = React.useCallback((option) => {
    setOptions((prev) => (prev.some((item) => item.value === option.value) ? prev : [...prev, option]))
  }, [])

  return (
    <SelectContext.Provider
      value={{
        value: internalValue,
        setValue: (next) => {
          setInternalValue(next)
          onValueChange?.(next)
        },
        placeholder,
        setPlaceholder,
        options,
        registerOption,
      }}
    >
      {children}
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ className = '' }) {
  const ctx = React.useContext(SelectContext)
  return (
    <select
      className={cn('h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200', className)}
      value={ctx?.value ?? ''}
      onChange={(e) => ctx?.setValue(e.target.value)}
    >
      <option value="">{ctx?.placeholder || 'انتخاب کنید'}</option>
      {(ctx?.options || []).map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  )
}

export function SelectValue({ placeholder }) {
  const ctx = React.useContext(SelectContext)
  React.useEffect(() => {
    ctx?.setPlaceholder(placeholder || '')
  }, [ctx, placeholder])
  return null
}

export function SelectContent({ children }) {
  return <>{children}</>
}

export function SelectItem({ value, children }) {
  const ctx = React.useContext(SelectContext)
  React.useEffect(() => {
    ctx?.registerOption({ value, label: typeof children === 'string' ? children : String(value) })
  }, [ctx, value, children])
  return null
}
