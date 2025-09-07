import React from "react"

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-lg border bg-white dark:bg-gray-900 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = "", ...props }) {
  return (
    <h3
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = "", ...props }) {
  return (
    <p
      className={`text-sm text-muted-foreground text-gray-600 dark:text-gray-400 ${className}`}
      {...props}
    >
      {children}
    </p>
  )
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-4 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
}
