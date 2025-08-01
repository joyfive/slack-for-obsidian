// SlackMessageModal.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/button"
import Checkbox from "@/components/checkbox"
import Modal from "@/components/Modal"
import { ChevronDown, ChevronRight } from "lucide-react"
import Spinner from "./spinner"
import clsx from "clsx"
import { toast } from "sonner"

interface Message {
  id: string
  channel: string
  ts: string
  text: string
  thread_ts: string | null
  reply_count: number // Optional, depending on API response
  replies?: { ts: string; text: string; thread_ts: string }[] // Optional, depending on API
}

interface SlackMessageModalProps {
  isOpen: boolean
  onClose: () => void
  title: { text: string; date: string }
  date?: { startDate: string; endDate: string }
}

export default function SlackMessageModal({
  isOpen,
  onClose,
  title = { text: "", date: "" },
  date = { startDate: "", endDate: "" },
}: SlackMessageModalProps) {
  const [channels, setChannels] = useState([{ id: "", name: "" }])
  const [expanded, setExpanded] = useState<string[]>([])
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({})
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [expandedReplies, setExpandedReplies] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const allIds: string[] = Object.keys(messagesMap).flatMap((chId) => {
    if (!messagesMap[chId]) return []
    else return (messagesMap[chId] ?? []).map((msg) => msg.id)
  })

  useEffect(() => {
    if (isOpen) {
      fetch(`/api/channels`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            console.log("Messages fetched successfully:", data)
            setChannels(data.results)
          } else {
            console.error("Failed to fetch messages:", data.error)
          }
        })
    }
    console.log("useEffect", date)
  }, [isOpen, date])

  const color = ["yellow", "cyan", "fuchsia", "emerald"]
  const colorThemes = color.map((c) => ({
    groupBg: `bg-${c}-100`,
    groupBorder: `border border-${c}-200`,
    groupShadow: `shadow-${c}-200 shadow-md`,
    messageShadow: `shadow-${c}-100 shadow-md`,
    messageBg: `bg-${c}-50`,
    cornerColor: `fold-note-${c}`,
    tapeBg: `bg-${c}-300 bg-opacity-50`,
    tapeCorner: `fold-note-${c}`,
  }))
  // const colorThemes = [
  //   {
  //     groupBg: "bg-yellow-100",
  //     groupBorder: "border border-yellow-200",
  //     groupShadow: "shadow-yellow-200 shadow-md",
  //     messageShadow: "shadow-yellow-100 shadow-md",
  //     messageBg: "bg-yellow-50",
  //     cornerColor: "fold-note-yellow",
  //     tapeBg: "bg-fuchsia-300 bg-opacity-50",
  //     tapeCorner: "fold-note-fuchsia",
  //   },
  //   {
  //     groupBg: "bg-cyan-100",
  //     groupBorder: "border border-cyan-200",
  //     groupShadow: "shadow-cyan-200 shadow-md",
  //     messageShadow: "shadow-cyan-100 shadow-md",
  //     messageBg: "bg-cyan-50",
  //     cornerColor: "fold-note-cyan",
  //     tapeBg: "bg-emerald-300 bg-opacity-50",
  //     tapeCorner: "fold-note-emerald",
  //   },
  //   {
  //     groupBg: "bg-fuchsia-100",
  //     groupBorder: "border border-fuchsia-200",
  //     groupShadow: "shadow-fuchsia-200 shadow-md",
  //     lightShadow: "shadow-fuchsia-100 shadow-md",
  //     messageBg: "bg-fuchsia-50",
  //     cornerColor: "fold-note-fuchsia",
  //     tapeBg: "bg-yellow-300 bg-opacity-50",
  //     tapeCorner: "fold-note-yellow",
  //   },
  //   {
  //     groupBg: "bg-emerald-100",
  //     groupBorder: "border border-emerald-200",
  //     groupShadow: "shadow-emerald-200 shadow-md",
  //     messageShadow: "shadow-emerald-100 shadow-md",
  //     messageBg: "bg-emerald-50",
  //     cornerColor: "fold-note-emerald",
  //     tapeBg: "bg-cyan-300 bg-opacity-50",
  //     tapeCorner: "fold-note-cyan",
  //   },
  // ]

  const handleExportClick = async () => {
    if (selectedIds.length === 0) {
      toast.error("내보낼 메시지를 선택해주세요.")
      return
    }

    const selectedMessages = []

    for (const [channelId, messages] of Object.entries(messagesMap)) {
      for (const msg of messages) {
        if (selectedIds.includes(msg.ts)) {
          selectedMessages.push({
            channel: channelId,
            ts: msg.ts,
            text: msg.text,
            replies: msg.replies || [],
          })
        }
      }
    }

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: selectedMessages }),
      })

      if (!res.ok) {
        toast.error("Markdown 추출에 실패했어요.")
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `slip-${new Date().toISOString().slice(0, 10)}.md`
      a.click()
      URL.revokeObjectURL(url)

      toast.success(".md 파일이 저장되었어요!")
    } catch (err) {
      console.error("다운로드 오류:", err)
      toast.error("다운로드 중 오류가 발생했어요.")
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleReplies = async (
    msgChannel: string,
    msgThreadTs: string,
    msgTs: string
  ) => {
    // 이미 열린 댓글이라면 닫기
    if (expanded.includes(msgThreadTs)) {
      setExpandedReplies(null)
      return
    }

    // 채널 확장
    setExpandedReplies(msgThreadTs)

    // 이미 댓글을 불러온 적이 있다면 API 호출 생략
    if (!messagesMap[msgThreadTs]) {
      try {
        setLoading(true)
        console.log("Fetching replies for", msgChannel, msgThreadTs, msgTs)
        const res = await fetch(
          `/api/messages/thread?channel=${msgChannel}&ts=${msgThreadTs}`
        )
        const data = await res.json()
        console.log("api 반환성공", data)
        setLoading(false)
        if (data.ok) {
          console.log("Replies loaded:", data.replies, messagesMap)

          // 메시지 맵에 댓글 추가
          setMessagesMap((prev) => ({
            ...prev,
            [msgChannel]:
              prev[msgChannel]?.map((msg) =>
                msg.thread_ts === msgThreadTs
                  ? { ...msg, replies: data.replies }
                  : msg
              ) ?? [],
          }))

          console.log("최종 메시지맵:", messagesMap)
        } else {
          console.error("메시지 요청 실패", data)
        }
      } catch (err) {
        console.error("에러 발생", err)
      }
    }

    setExpandedReplies(msgThreadTs)
  }
  const toggleChannel = async (channelId: string, channelName: string) => {
    setExpanded(
      (prev) =>
        prev.includes(channelId)
          ? prev.filter((id) => id !== channelId) // 이미 열려있으면 제거
          : [...prev, channelId] // 아니면 추가
    )

    console.log("토글채널", expanded, channelId, expanded.includes(channelId))
    // 이미 메시지를 불러온 적이 있다면 API 호출 생략
    if (!messagesMap[channelId]) {
      try {
        setLoading(true)
        const res = await fetch(
          `/api/messages?channelId=${channelId}&channelName=${channelName}&startDate=${date.startDate}&endDate=${date.endDate}`
        )
        const data = await res.json()
        console.log("api 반환성공", data)
        setLoading(false)
        if (data.ok) {
          setMessagesMap((prev) => ({ ...prev, [channelId]: data.results }))
        } else {
          console.error("메시지 요청 실패", data)
        }
      } catch (err) {
        console.error("에러 발생", err)
      }
    }
  }

  const toggleSelectAll = () => {
    setSelectedIds((prev) => (prev.length === allIds.length ? [] : allIds))
  }

  if (!isOpen) return null

  return (
    <Modal onClose={onClose}>
      <div className="w-full h-full flex flex-col overflow-hidden  bg-legal-yellow p-6 md:rounded-md rounded-none rounded-t-3xl shadow-lg shadow-legal-dark-brown">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg  font-bold font-serif text-gray-700">
            {title.text}
            <span className="ml-2 text-sm text-gray-500">{title.date}</span>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <div className="flex items-center justify-between  flex-shrink-0 pb-4 text-sm text-gray-700">
          <div className="flex">
            <Checkbox
              checked={selectedIds.length === allIds.length}
              onChange={toggleSelectAll}
              className="mr-2"
            />
            전체 선택
          </div>
          <p className="text-sm text-gray-500">
            ({selectedIds.length}개 선택됨)
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-white rounded-md">
          {channels.map((ch, index) => {
            const theme = colorThemes[index % colorThemes.length]
            return (
              <div
                key={ch.id}
                className={clsx(
                  `${theme.groupBg} px-3 py-3 rounded-lg transition-all duration-200 ease-in-out`,
                  expanded!.includes(ch.id)
                    ? `rotate-0 my-2 ${theme.groupBorder} ${theme.messageShadow} `
                    : `hover:scale-95 active:scale-95 rotate-1 mt-[-2px] ${theme.groupShadow}`
                )}
              >
                <button
                  onClick={() => toggleChannel(ch.id, ch.name)}
                  className="flex items-center justify-between text-base text-gray-500 w-full"
                >
                  <span className="font-serif font-light"># {ch.name}</span>
                  <div className="flex items-center gap-1">
                    {messagesMap[ch.id]?.length > 0 && (
                      <span className="ml-2 text-sm font-regular text-gray-400">
                        ({messagesMap[ch.id].length})
                      </span>
                    )}
                    {expanded.includes(ch.id) ? (
                      <ChevronDown size={16} color="#777" className="mr-1" />
                    ) : (
                      <ChevronRight size={16} color="#777" className="mr-1" />
                    )}
                  </div>
                </button>

                {/* 메시지 리스트 */}
                {expanded.includes(ch.id) && (
                  <div className="mt-3 space-y-2">
                    {loading && (
                      <div className="text-sm text-gray-500">
                        <Spinner size={16} />
                      </div>
                    )}
                    {messagesMap[ch.id] && messagesMap[ch.id].length > 0 ? (
                      messagesMap[ch.id].map(
                        (msg) => (
                          console.log("msg", msg),
                          (
                            <div>
                              <div
                                key={msg.ts}
                                className={`${theme.messageBg} ${theme.cornerColor} ${theme.groupBorder} ${theme.groupShadow} rounded-md p-3`}
                              >
                                <div className="flex items-start gap-2">
                                  <Checkbox
                                    checked={selectedIds.includes(msg.ts)}
                                    onChange={() => toggleSelect(msg.ts)}
                                    className="mt-1"
                                  />
                                  <div>
                                    <div className="text-xs text-gray-400 mb-1">
                                      {msg.ts}
                                    </div>
                                    <div className="text-sm text-gray-700 whitespace-pre-wrap mb-2">
                                      {msg.text}
                                    </div>

                                    {msg.thread_ts !== null &&
                                      msg.reply_count > 0 && (
                                        <>
                                          <button
                                            onClick={() => {
                                              toggleReplies(
                                                ch.id,
                                                msg.thread_ts!,
                                                msg.ts
                                              )
                                            }}
                                            className="text-gray-600 text-xs hover:bg-gray-50 hover:border-gray-200 hover:border px-2 py-1 rounded-md"
                                          >
                                            💬 댓글 {msg.reply_count}개 {">"}
                                          </button>
                                        </>
                                      )}
                                  </div>
                                </div>
                              </div>
                              {expandedReplies && (
                                <div className="pl-4">
                                  {msg.replies?.map((r) => (
                                    <div key={r.ts}>
                                      <div
                                        className={`absolute left-20 mt-[-8px] w-24 h-6 px-4 py-1 ${theme.tapeBg} -rotate-6 clip-zigzag ${theme.tapeCorner} ${theme.groupBorder} ${theme.groupShadow} rounded-md text-xs text-gray-600`}
                                      ></div>

                                      <div
                                        className={`mt-[-8px] text-sm text-gray-500 whitespace-pre-wrap bg-white bg-opacity-60 rounded-md p-4 shadow-md ${theme.groupShadow} ${theme.messageShadow}`}
                                      >
                                        <div className="text-xs text-gray-400 mb-1">
                                          🗨 {r.ts}
                                        </div>
                                        <div>{r.text}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        )
                      )
                    ) : (
                      <div className="text-sm text-gray-400 ">
                        추출할 메시지가 없습니다
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between mt-4 border-t pt-4 w-full ">
          <div className="flex gap-2 w-full">
            <Button variant="gray-outline" onClick={onClose} className="w-full">
              그만보기
            </Button>
            <Button
              variant="primary"
              onClick={handleExportClick}
              className="w-full"
            >
              기록하기
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
