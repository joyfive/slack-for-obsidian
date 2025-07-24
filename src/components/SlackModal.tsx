// SlackMessageModal.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/button"
import Checkbox from "@/components/checkbox"
import Modal from "@/components/Modal"
import { ChevronDown, ChevronRight } from "lucide-react"
import Spinner from "./spinner"

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
  title: string
  date?: { startDate: string; endDate: string }
}

export default function SlackMessageModal({
  isOpen,
  onClose,
  title,
  date = { startDate: "", endDate: "" },
}: SlackMessageModalProps) {
  const [channels, setChannels] = useState([{ id: "", name: "" }])
  const [expanded, setExpanded] = useState<string | null>(null)
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
    if (expanded === msgThreadTs) {
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
    console.log("toggleChannel", channelId, channelName)
    // 이미 열린 채널이라면 닫기
    if (expanded === channelId) {
      setExpanded(null)
      return
    }

    // 채널 확장
    setExpanded(channelId)

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
      <div className="w-full h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#111111]">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <div className="flex items-center flex-shrink-0 mb-2 text-sm text-gray-700">
          <Checkbox
            checked={selectedIds.length === allIds.length}
            onChange={toggleSelectAll}
            className="mr-2"
          />
          전체 선택
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {channels.map((ch) => (
            <div
              key={ch.id}
              className="border border-purple-100 rounded-md bg-white px-4 py-3 shadow-purple-100 shadow-sm"
            >
              {/* 채널 헤더 */}
              <button
                onClick={() => toggleChannel(ch.id, ch.name)}
                className="flex items-center text-md font-medium text-gray-600 w-full"
              >
                <div className="flex items-center justify-between w-full">
                  <span># {ch.name}</span>
                  {expanded === ch.id ? (
                    <ChevronDown size={16} color="#777" className="mr-1" />
                  ) : (
                    <ChevronRight size={16} color="#777" className="mr-1" />
                  )}
                </div>
                {messagesMap[ch.id]?.length > 0 && (
                  <span className="ml-2 text-sm text-gray-400">
                    ({messagesMap[ch.id].length})
                  </span>
                )}
              </button>

              {/* 메시지 리스트 */}
              {expanded === ch.id && (
                <div className="mt-3 space-y-3">
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
                          <div
                            key={msg.ts}
                            className="border border-purple-200 rounded-sm p-3 bg-purple-50"
                          >
                            <div className="flex items-start gap-2">
                              <Checkbox
                                checked={selectedIds.includes(msg.ts)}
                                onChange={() => toggleSelect(msg.ts)}
                                className="mt-1"
                              />
                              <div>
                                <div className="text-xs text-gray-500 mb-1">
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
                                        className="text-blue-500 text-sm hover:underline"
                                      >
                                        💬 댓글 {msg.reply_count}개 보기
                                      </button>
                                      {console.log(expandedReplies)}
                                      {expandedReplies && (
                                        <div className="mt-2 pl-4 border-l border-gray-300 space-y-1">
                                          {msg.replies?.map((r) => (
                                            <div
                                              key={r.ts}
                                              className="text-sm text-gray-700"
                                            >
                                              <span className="text-xs text-gray-500 mr-1">
                                                {r.ts}
                                              </span>
                                              🗨 {r.text}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </>
                                  )}
                              </div>
                            </div>
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
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 border-t pt-4">
          <span className="text-sm text-gray-400">
            ({selectedIds.length}개 선택됨)
          </span>
          <div className="flex gap-2">
            <Button variant="gray-outline" onClick={onClose}>
              그만보기
            </Button>
            <Button
              variant="primary"
              onClick={() => console.log("Export selected", selectedIds)}
            >
              .md로 추출
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
