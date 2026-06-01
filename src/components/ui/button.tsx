import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "danger"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    let baseClass = "btn d-inline-flex align-items-center justify-content-center"
    let variantClass = ""
    let sizeClass = ""
    let inlineStyle: React.CSSProperties = {}

    switch (variant) {
      case "ghost":
        variantClass = "btn-link text-decoration-none border-0 p-0"
        break
      case "outline":
        variantClass = "btn-outline-secondary"
        break
      case "danger":
        variantClass = "btn-danger"
        break
      default:
        variantClass = "btn-primary"
    }

    if (size === "icon") {
      sizeClass = "p-1"
      inlineStyle = { width: "32px", height: "32px", borderRadius: "8px" }
    } else if (size === "sm") {
      sizeClass = "btn-sm"
    } else if (size === "lg") {
      sizeClass = "btn-lg"
    }

    return (
      <button
        ref={ref}
        className={cn(baseClass, variantClass, sizeClass, className)}
        style={{ ...inlineStyle, ...props.style }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
