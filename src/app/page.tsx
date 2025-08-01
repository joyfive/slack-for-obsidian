"use client"
// Obsidian-themed Mobile-first UI (React + Tailwind)
// Components: LoginPage, HomePage

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/button"
import Spinner from "@/components/spinner"
import SlackModal from "@/components/SlackModal"
import Logo from "../../public/today-s-slip.svg"
import Image from "next/image"
const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD`

export default function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState({ text: "오늘의 기록", date: today })
  const [date, setDate] = useState({ startDate: "", endDate: today })
  const [err, setErr] = useState("")

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
    setTitle({ text: "오늘의 기록", date: today })
    setDate({ startDate: "", endDate: today })
    setIsOpen(true)
  }

  const periodOpen = () => {
    setTitle({
      text: "오늘의 기록",
      date: date.startDate + "~" + date.endDate,
    })
    setDate({ startDate: date.startDate, endDate: date.endDate })
    if (!date.startDate || !date.endDate) {
      setErr("시작일과 종료일을 모두 선택해주세요.")
      return
    }
    if (new Date(date.startDate) > new Date(date.endDate)) {
      setErr("시작일은 종료일보다 이전이어야 합니다.")
      return
    }

    if (date.endDate > today) {
      setErr("종료일이 오늘 이후일 수 없습니다.")
      return
    }
    setErr("")
    setIsOpen(true)
  }

  if (!isAuthenticated)
    <div className="min-h-screen bg-[#f3f1fa] flex flex-col items-center justify-center p-8">
      <Spinner size={48}></Spinner>
    </div>
  else
    return (
      <div className="bg-legal-yellow bg-legal-pad min-h-screen px-6 py-16 flex flex-col justify-between">
        <div className="mt-8 max-w-2xl mx-auto">
          <Image
            src={Logo.src}
            width={96}
            height={96}
            alt="오늘의 SLIP 로고"
            className="w-24 h-24 mb-0 mx-auto"
          />
          <h1 className=" text-legal-brown mb-2 text-center">today-s-slip.</h1>
          <h2 className=" text-[#333] mb-2">오늘의 Slip, 내일의 기록으로</h2>
          <p className="mt-1 leading-7 text-md text-[#555555] mb-8">
            슬랙에 흘려쓴 메시지를 옵시디언에 남겨두세요. <br />
            오늘의 기억을 모아, 나만의 기록으로 아카이빙합니다.
          </p>

          <section className="py-4 space-y-6">
            <div className="mt-6 mb-11">
              <h2 className="text-sm font-bold text-[#555555] mb-4">
                오늘의 기록
              </h2>
              <Button className="w-full py-3" onClick={todayOpen}>
                오늘의 기록 보기
              </Button>
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#555555] mb-2 ">
                구간 기록
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <input
                  onChange={(e) =>
                    setDate({
                      startDate: e.target.value,
                      endDate: date.endDate,
                    })
                  }
                  type="date"
                  className="flex-1 border border-[#ececec] bg-white px-3 py-2 text-sm text-[#999999]"
                />
                <span className="text-[#999999]">~</span>
                <input
                  defaultValue={today}
                  onChange={(e) =>
                    setDate({
                      startDate: date.startDate,
                      endDate: e.target.value,
                    })
                  }
                  type="date"
                  className="flex-1 border border-[#ececec] bg-white px-3 py-2 text-sm text-[#999999]"
                />
              </div>
              {err && (
                <div className="absolute text-red-500 text-xs mt-[-4px] ml-3">
                  {err}
                </div>
              )}
              <Button className="mt-4 w-full py-3" onClick={periodOpen}>
                구간 기록 보기
              </Button>
            </div>
          </section>
        </div>
        {isOpen && (
          <SlackModal
            date={date}
            title={title}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          ></SlackModal>
        )}
      </div>
    )
}
