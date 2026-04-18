import React from 'react'
import { cn } from '@/lib/utils'

export function Badge({ className = '', ...props }) {
  return <span className={cn('inline-flex items-center rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700', className)} {...props} />
}
