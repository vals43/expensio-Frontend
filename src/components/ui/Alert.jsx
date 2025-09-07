import React from "react"

export function Alert({ variant = "default", children, className = "", ...props }) {
  let baseClasses =
    "relative w-full rounded-lg border p-4 text-sm transition-colors"

  let variantClasses = ""
  if (variant === "default") {
    variantClasses = "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
  }
  if (variant === "destructive") {
    variantClasses = "border-red-500/50 text-red-900 dark:text-red-100 bg-red-50 dark:bg-red-900/20"
  }

  return (
    <div
      role="alert"
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function AlertTitle({ children, className = "", ...props }) {
  return (
    <h5
      className={`mb-1 font-medium leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h5>
  )
}

export function AlertDescription({ children, className = "", ...props }) {
  return (
    <div className={`text-sm leading-relaxed ${className}`} {...props}>
      {children}
    </div>
  )
}
