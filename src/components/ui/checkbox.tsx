import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate, onCheckedChange, ...props }, ref) => {
    const localRef = React.useRef<HTMLInputElement>(null)
    React.useImperativeHandle(ref, () => localRef.current!)

    React.useEffect(() => {
      if (localRef.current) {
        localRef.current.indeterminate = !!indeterminate
      }
    }, [indeterminate])

    return (
      <input
        type="checkbox"
        ref={localRef}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className={cn("form-check-input", className)}
        style={{ cursor: "pointer", ...props.style }}
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"
