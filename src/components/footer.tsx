"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type FooterProps = {
  children?: ReactNode
}

export default function Footer({ children }: FooterProps) {
  const [isView, setIsView] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const isLogin = sessionStorage.getItem("auth_date") === today
    setIsView(!!isLogin)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem("isLogin")
    sessionStorage.removeItem("token") // 토큰 삭제
    router.push("/login") // 로그인 페이지로 이동
  }

  if (!isView) return null

  return (
    <footer className="pt-6 border-t border-[#ececec] flex justify-between text-sm text-[#555555]">
      <Link
        href="shortcuts://run-shortcut?name=md_for_obsidian"
        target="_blank"
        className="hover:underline"
      >
        옵시디언으로 이동
      </Link>
      <button onClick={handleLogout} className="hover:underline">
        로그아웃
      </button>
      {children}
    </footer>
  )
}
