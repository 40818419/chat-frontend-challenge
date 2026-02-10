import clsx from "clsx"

export default function Input({ className, ref, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      ref={ref}
      className={clsx(
        "mr-2 rounded-sm bg-white border-astral border-2 text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body",
        className,
      )}
      {...props}
    />
  )
}
