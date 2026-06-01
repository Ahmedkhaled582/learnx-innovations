import * as React from "react"
import { cn } from "@/lib/utils"

export function Avatar({ className, children, style }: { className?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className={cn("position-relative d-inline-flex align-items-center justify-content-center overflow-hidden bg-light", className)}
      style={{ width: "40px", height: "40px", borderRadius: "12px", flexShrink: 0, ...style }}
    >
      {children}
    </div>
  )
}

export function AvatarImage({ className, src, alt, style }: { className?: string; src?: string; alt?: string; style?: React.CSSProperties }) {
  if (!src) return null
  return (
    <img
      src={src}
      alt={alt}
      className={cn("w-100 h-100 object-fit-cover", className)}
      style={style}
    />
  )
}

export function AvatarFallback({ className, children, style }: { className?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className={cn("w-100 h-100 d-flex align-items-center justify-content-center text-muted fw-bold", className)}
      style={{ backgroundColor: "#e9ecef", ...style }}
    >
      {children}
    </div>
  )
}
