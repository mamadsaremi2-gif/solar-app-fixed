import React from 'react'
import { cn } from '@/lib/utils'

export function Separator({ className = '', orientation = 'horizontal', ...props }) {
  return (
    <div
      className={cn(orientation === 'horizontal' ? 'h-px w-full bg-slate-200' : 'h-full w-px bg-slate-200', className)}
      {...props}
    />
  )
}
