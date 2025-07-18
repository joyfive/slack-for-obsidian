"use client"
// Obsidian-themed Mobile-first UI (React + Tailwind)
// Components: LoginPage, HomePage

import React, { useState } from "react"
import { Button } from "@/components/button"
import { useRouter } from "next/navigation"
export default function LoginPage() {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const login = () => {
    setIsLoading(true)
    setError("")
    // Simulate a login request
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, pw: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setIsLoading(false)
          router.push("/")
          // Redirect to home page or perform other actions
        } else {
          setIsLoading(false)
          console.error("Login failed:", data.error)
          setError("로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.")
        }
      })
      .catch((error) => {
        setIsLoading(false)
        console.error("Login error:", error)
        setError("로그인 중 오류 발생: " + error.message)
      })
  }
  return (
    <div className="min-h-screen bg-[#f3f1fa] flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-semibold text-[#111111] mb-6">로그인</h1>
      <input
        type="text"
        placeholder="아이디"
        onChange={(e) => setId(e.target.value)}
        className="w-full max-w-xs p-3 mb-3 border border-[#ececec] rounded-md text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#9a6aff]"
      />
      <input
        type="password"
        placeholder="비밀번호"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-xs p-3 mb-6 border border-[#ececec] rounded-md text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#9a6aff]"
      />
      <Button
        disabled={false}
        variant="primary"
        onClick={login}
        isLoading={isLoading}
        className="w-full max-w-xs"
      >
        로그인
      </Button>
      <p className="text-sm text-pink-500 mt-4">{error}</p>
    </div>
  )
}
