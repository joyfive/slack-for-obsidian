import React from "react"
import clsx from "clsx"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gray-fill" | "gray-outline"
  isLoading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#9C7FFF] to-[#7C4DFF] text-white hover:opacity-90",
    "gray-fill": "bg-[#f2f2f2] text-[#555555] hover:bg-[#e6e6e6]",
    "gray-outline":
      "border border-[#d9d9d9] text-[#555555] bg-white hover:bg-[#f9f9f9]",
  }

  const spinner = (
    <svg
      className="animate-spin h-4 w-4 mr-2 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )

  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(baseStyle, variantStyles[variant], className)}
      {...props}
    >
      {isLoading && spinner}
      {children}
    </button>
  )
}
