"use client"
// Obsidian-themed Mobile-first UI (React + Tailwind)
// Components: LoginPage, HomePage

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/button"
import Spinner from "@/components/spinner"
import SlackModal from "@/components/SlackModal"
const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
const messages = [
  {
    id: "1",
    channel: "general",
    timestamp: "2023-10-01 12:00",
    text: "Hello, team!",
    replies: [
      {
        id: "1-1",
        text: "Hi there!",
        timestamp: "2023-10-01 12:05",
      },
    ],
  },
  {
    id: "2",
    channel: "general",
    timestamp: "2023-10-01 13:00",
    text: "Random thoughts here.",
  },
  {
    id: "3",
    channel: "random",
    timestamp: "2023-10-01 13:00",
    text: "Random thoughts here.",
  },
]
export default function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("오늘의 기록")
  const [date, setDate] = useState({ startDate: today, endDate: today })

  useEffect(() => {
    fetch("/api/auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response)
      .then((data) => {
        if (data.ok) {
          console.log("Authentication successful:", data)
          setIsAuthenticated(true)
          sessionStorage.setItem("auth_date", today) // Store token in session storage
          // Redirect to home page or perform other actions
        } else {
          console.error("Login failed:", data)
          setIsAuthenticated(false) // Ensure we set this to false if auth fails
          router.push("/login") // Redirect to login page
        }
      })
      .catch((error) => {
        console.error("Authentication error:", error.message)
        setIsAuthenticated(false) // Ensure we set this to false if there's an error
        router.push("/login") // Redirect to login page
      })
  }, [router])

  const todayOpen = () => {
    setTitle("오늘의 기록[" + date.endDate + "]")
    setDate({ startDate: "", endDate: today })
    setIsOpen(true)
    console.log(isOpen, title)
  }

  const periodOpen = () => {
    setTitle("구간 기록[" + date.startDate + " ~ " + date.endDate + "]")
    setDate({ startDate: date.startDate, endDate: date.endDate })
    setIsOpen(true)
    console.log(isOpen, title)
  }

  if (!isAuthenticated)
    <div className="min-h-screen bg-[#f3f1fa] flex flex-col items-center justify-center p-6">
      <Spinner size={48}></Spinner>
    </div>
  else
    return (
      <div className="min-h-screen bg-[#f6f4fc] px-6 py-12 flex flex-col justify-between">
        <div className="max-w-2xl mx-auto">
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
            date={date}
            messages={messages}
            title={title}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          ></SlackModal>
        )}
      </div>
    )
}
