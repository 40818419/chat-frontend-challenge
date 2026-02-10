import clsx from "clsx"

type CardProps = {
  align?: "start" | "end"
  variant?: "primary" | "default"
  'aria-label'?: string
  children: React.ReactNode
}

export function Card({ align = "start", variant = "default", 'aria-label': ariaLabel, children }: CardProps) {
  return (
    <div className={clsx('flex w-full', align === 'end' ? 'justify-end' : 'justify-start')} aria-label={ariaLabel}>
      <div className={clsx(
        'rounded-sm border border-gray-300 p-4 max-w-[80%] sm:max-w-[75%]',
        variant === 'primary' ? 'bg-double-pearl-lusta' : 'bg-white'
      )}>
        {children}
      </div>
    </div>
  )
}
