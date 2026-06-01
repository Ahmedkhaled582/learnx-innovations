import * as React from "react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  open?: boolean
  setOpen?: (open: boolean) => void
} | null>(null)

export function Select({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div ref={containerRef} className="position-relative d-inline-block w-100">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectTrigger must be used within Select")
  return (
    <button
      type="button"
      onClick={() => context.setOpen?.(!context.open)}
      className={cn(
        "form-select d-flex align-items-center justify-content-between",
        className
      )}
      style={{ cursor: "pointer", ...style }}
    >
      {children}
    </button>
  )
}

export function SelectValue({ children, placeholder }: { children?: React.ReactNode; placeholder?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectValue must be used within Select")
  return <span>{context.value ? context.value.charAt(0).toUpperCase() + context.value.slice(1) : placeholder || children}</span>
}

export function SelectContent({ children, className, position, style }: { children: React.ReactNode; className?: string; position?: string; style?: React.CSSProperties }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectContent must be used within Select")
  if (!context.open) return null
  return (
    <div
      className={cn(
        "dropdown-menu show position-absolute w-100 shadow",
        className
      )}
      style={{ top: "100%", left: 0, zIndex: 1000, display: "block", ...style }}
    >
      <div className="p-1">{children}</div>
    </div>
  )
}

export function SelectItem({
  children,
  value,
  className,
  style,
}: {
  children: React.ReactNode
  value: string
  className?: string
  style?: React.CSSProperties
}) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectItem must be used within Select")
  const isSelected = context.value === value
  return (
    <div
      onClick={() => {
        context.onValueChange?.(value)
        context.setOpen?.(false)
      }}
      className={cn(
        "dropdown-item d-flex align-items-center gap-2",
        isSelected && "active",
        className
      )}
      style={{ cursor: "pointer", ...style }}
    >
      {children}
    </div>
  )
}
