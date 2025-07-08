"use client"
import React, { useState } from "react"

export default function SlackToObsidian() {
  const [slackUrl, setSlackUrl] = useState("")
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [error, setError] = useState("")

  const handlePasteAndDownload = async () => {
    setError("")
    setIsDownloading(true)
    setIsDownloaded(false)

    let urlToUse = ""

    // 1. 클립보드 접근 가능여부 체크
    if (navigator.clipboard) {
      try {
        const text = await navigator.clipboard.readText()
        setSlackUrl(text)
        urlToUse = text
      } catch (e) {
        // 클립보드 접근 실패시 인풋 데이터 fallback
        urlToUse = slackUrl
      }
    } else {
      // 클립보드 미지원 브라우저: 인풋 데이터 fallback
      urlToUse = slackUrl
    }

    // 2. urlToUse(클립보드 or 인풋)에 데이터 존재 여부
    if (!urlToUse) {
      setError("클립보드 접근이 불가하며, 입력된 링크도 없습니다.")
      setIsDownloading(false)
      return
    }

    // 3. 유효한 Slack URL 여부 검사
    if (!/^https?:\/\/.*slack\.com\/archives\//.test(urlToUse)) {
      setError("유효한 Slack 스레드 링크가 아닙니다.")
      setIsDownloading(false)
      return
    }

    // 4. 정상 Slack URL이면 API 호출
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToUse }),
      })
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        setError(
          errJson?.error ? `API 오류: ${errJson.error}` : "API 호출 실패"
        )
        setIsDownloading(false)
        return
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "slack_archive.md"
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      setIsDownloaded(true)
    } catch (e) {
      setError("다운로드 실패")
    } finally {
      setIsDownloading(false)
    }
  }

  // 단축어 실행
  const handleShortcut = () => {
    window.location.href = "shortcuts://run-shortcut?name=md_for_obsidian"
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-xs flex flex-col gap-5">
        <h1 className="text-xl font-semibold text-center mb-2 text-gray-700">
          Slack → Obsidian md
        </h1>
        <input
          type="text"
          className="w-full rounded-xl border p-3 text-base text-gray-600 focus:outline-none bg-gray-50"
          placeholder="클립보드 또는 직접 붙여넣기"
          value={slackUrl}
          onChange={(e) => setSlackUrl(e.target.value)}
        />

        <button
          onClick={handlePasteAndDownload}
          disabled={isDownloading}
          className={`w-full py-2 rounded-xl ${
            isDownloading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          } text-base font-semibold`}
        >
          {isDownloading
            ? "붙여넣기 및 다운로드 중..."
            : "붙여넣기 및 다운로드"}
        </button>

        <button
          onClick={handleShortcut}
          disabled={!isDownloaded}
          className={`w-full py-2 rounded-xl ${
            !isDownloaded
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          } text-base font-semibold`}
        >
          단축어 실행(Obsidian 이동)
        </button>

        {isDownloaded && (
          <div className="text-green-700 text-center text-sm">
            다운로드 완료!
            <br />
            단축어 실행 버튼을 눌러 Obsidian으로 이동하세요.
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center text-xs mt-2">{error}</div>
        )}
      </div>
    </div>
  )
}
