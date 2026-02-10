import clsx from "clsx"

export default function Input({ className, ref, disabled, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      ref={ref}
      disabled={disabled}
      className={clsx(
        "mr-2 rounded-sm bg-white border-astral border-2 text-heading text-sm block w-full px-3 py-2.5 shadow-xs placeholder:text-body",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...props}
    />
  )
}
