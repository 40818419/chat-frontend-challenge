type BlockProps = {
  children: React.ReactNode
  role?: React.AriaRole
  'aria-live'?: 'polite' | 'assertive' | 'off'
}

export function Block ({ children, role, 'aria-live': ariaLive }: BlockProps) {
  return <div className="flex w-full flex-1 justify-center items-center" role={role} aria-live={ariaLive}>{ children }</div>
}