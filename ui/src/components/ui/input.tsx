import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-base border-[3px] border-foreground/25 bg-input selection:bg-primary selection:text-primary-foreground px-4 py-2.5 text-sm font-medium text-foreground shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] file:border-0 file:bg-transparent file:text-sm file:font-bold placeholder:text-muted-foreground/70 focus-visible:outline-hidden focus-visible:shadow-[6px_6px_0_0_rgba(0,0,0,0.15)] focus-visible:-translate-y-0.5 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
