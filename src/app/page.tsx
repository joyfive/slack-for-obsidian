"use client"
// Obsidian-themed Mobile-first UI (React + Tailwind)
// Components: LoginPage, HomePage

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/button"
import Spinner from "@/components/spinner"

const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

export default function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState("")

  useEffect(() => {
    const token = sessionStorage.getItem("LOGIN_TOKEN")
    setToken(token || "")
  }, [])

  fetch("/api/auth", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        setIsAuthenticated(true)
        sessionStorage.setItem("auth_date", today) // Store token in session storage
        // Redirect to home page or perform other actions
      } else {
        console.error("Login failed:", data.error)
        setIsAuthenticated(false) // Ensure we set this to false if auth fails
        setToken("") // Clear token if authentication fails
        router.push("/login")
      }
    })
    .catch((error) => {
      console.error("auth error:", error)
      router.push("/login")
    })

  if (!isAuthenticated)
    <div className="min-h-screen bg-[#f3f1fa] flex flex-col items-center justify-center p-6">
      <Spinner size={48}></Spinner>
    </div>
  else
    return (
      <div className="min-h-screen bg-[#f3f1fa] flex flex-col justify-between p-6">
        <div>
          <h1 className="text-xl font-bold text-[#111111] mb-2">
            오늘의 기쁨, 내일의 기쁨으로
          </h1>
          <p className="text-sm text-[#555555] mb-6">
            슬랙에 흘려쓴 메시지를 옵시디언에 남겨두세요. 오늘의 기억을 모아,
            나만의 기록으로 아카이빙합니다.
          </p>

          <div className="mb-4">
            <label className="block text-[#111111] text-sm font-medium mb-1">
              오늘의 기록
            </label>
            <Button className="w-full bg-[#6C4AB6] text-white py-2 rounded-md text-sm">
              [{today}] 기록 보기
            </Button>
          </div>

          <div className="mb-8">
            <label className="block text-[#111111] text-sm font-medium mb-1">
              구간 기록
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="date"
                placeholder="시작일"
                className="flex-1 p-2 border border-[#ececec] rounded-md text-sm text-[#111111]"
              />
              <span className="text-[#999999] text-sm">~</span>
              <input
                type="date"
                defaultValue={today}
                className="flex-1 p-2 border border-[#ececec] rounded-md text-sm text-[#111111]"
              />
            </div>
            <Button className="w-full bg-[#6C4AB6] text-white py-2 rounded-md text-sm">
              구간 기록 보기
            </Button>
          </div>
        </div>

        <footer className="border-t border-[#ececec] pt-4 flex justify-between text-sm text-[#555555]">
          <button className="underline">옵시디언으로 이동</button>
          <button className="underline">로그아웃</button>
        </footer>
      </div>
    )
}
