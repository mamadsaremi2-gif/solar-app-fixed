import React from 'react'
import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-violet-600 text-white hover:bg-violet-700 border-transparent',
  outline: 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-700 border-transparent hover:bg-slate-100',
}

const sizes = {
  default: 'h-10 px-4 py-2 text-sm',
  icon: 'h-10 w-10 p-0',
}

export const Button = React.forwardRef(function Button(
  { className = '', variant = 'default', size = 'default', type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl border font-medium transition focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        className
      )}
      {...props}
    />
  )
})
