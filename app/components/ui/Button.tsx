import clsx from "clsx"

export default function Button({ className, type = "button", ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={clsx("cursor-pointer rounded-sm bg-salmon text-white font-semibold px-5 py-3", className)}
      {...props}
    />
  )
}
