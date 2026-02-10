import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const calendarVariants = cva(
  'p-3',
  {
    variants: {
      variant: {
        default: 'bg-background',
        ghost: 'bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface CalendarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calendarVariants> {}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(calendarVariants({ variant, className }))}
      {...props}
    />
  )
)
Calendar.displayName = 'Calendar'

export { Calendar, calendarVariants }