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
    "font-bold px-6 py-3 rounded-md shadow-md shadow-gray-200 hover:scale-105 transition"

  const variantStyles = {
    primary: "hover:opacity-90 text-white bg-legal-brown",
    "gray-fill": "bg-[#f2f2f2] text-[#555555] hover:bg-[#e6e6e6]",
    "gray-outline":
      "border border-legal-brown  bg-white text-legal-dark-brown hover:bg-[#f9f9f9]",
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
