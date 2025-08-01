"use client"

import { ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"

type ModalProps = {
  children: ReactNode
  onClose: () => void
}

export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={`
          bg-legal-brown shadow-color-legal-dark-brown shadow-xl overflow-auto
          w-full h-full rounded-none md:rounded-lg
          md:w-[70vw] md:h-[80vh]
          md:p-6 p-0 pt-6
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
