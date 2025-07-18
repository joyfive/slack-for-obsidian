"use client"
// Obsidian-themed Mobile-first UI (React + Tailwind)
// Components: LoginPage, HomePage

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/button"
import Spinner from "@/components/spinner"
import SlackModal from "@/components/SlackModal"

const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
const messages = [
  {
    id: "1",
    channel: "general",
    timestamp: "2023-10-01T12:00:00Z",
    text: "Hello, team!",
    replies: [
      {
        id: "1-1",
        text: "Hi there!",
        timestamp: "2023-10-01T12:05:00Z",
      },
    ],
  },
  {
    id: "2",
    channel: "general",
    timestamp: "2023-10-01T13:00:00Z",
    text: "Random thoughts here.",
  },
  {
    id: "3",
    channel: "random",
    timestamp: "2023-10-01T13:00:00Z",
    text: "Random thoughts here.",
  },
]
export default function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("오늘의 기록")

  const todayOpen = () => {
    setTitle("오늘의 기록")
    setIsOpen(true)
    console.log(isOpen, title)
  }

  const periodOpen = () => {
    setTitle("구간 기록")
    setIsOpen(true)
    console.log(isOpen, title)
  }

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
      <div className="min-h-screen bg-[#f6f4fc] px-6 py-12 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] mb-2">
            오늘의 기쁨, 내일의 기쁨으로
          </h1>
          <p className="text-sm text-[#555555] mb-8">
            슬랙에 흘러쓴 메시지를 옵시디언에 남겨두세요. 오늘의 기억을 모아,
            나만의 기록으로 아카이빙합니다.
          </p>

          <section className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-[#555555] mb-2">
                오늘의 기록
              </h2>
              <Button
                className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6]"
                onClick={todayOpen}
              >
                오늘의 기록 보기
              </Button>
            </div>

            <div>
              <h2 className="text-sm font-medium text-[#555555] mb-2 ">
                구간 기록
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="date"
                  className="flex-1 rounded-md border border-[#ececec] bg-white px-3 py-2 text-sm text-[#999999]"
                />
                <span className="text-[#999999]">~</span>
                <input
                  type="date"
                  className="flex-1 rounded-md border border-[#ececec] bg-white px-3 py-2 text-sm text-[#999999]"
                />
              </div>
              <Button
                className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6]"
                onClick={periodOpen}
              >
                구간 기록 보기
              </Button>
            </div>
          </section>
        </div>
        {isOpen && (
          <SlackModal
            messages={messages}
            title={title}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          ></SlackModal>
        )}
        <div className="pt-6 border-t border-[#ececec] flex justify-between text-sm text-[#555555]">
          <button className="hover:underline">옵시디언으로 이동</button>
          <button className="hover:underline">로그아웃</button>
        </div>
      </div>
    )
}
