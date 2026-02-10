import clsx from "clsx"

export default function Button({ className, type = "button", disabled, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        "rounded-sm bg-salmon text-white font-semibold px-5 py-3",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className,
      )}
      {...props}
    />
  )
}
