"use client"

import { ChangeEvent } from "react"

type CheckboxProps = {
  id?: string
  label?: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  className?: string
}

export default function Checkbox({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
}: CheckboxProps) {
  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      {label && <span className="text-sm text-gray-800">{label}</span>}
    </label>
  )
}
