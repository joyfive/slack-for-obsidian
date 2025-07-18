// SlackMessageModal.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/button"
import Checkbox from "@/components/checkbox"
import Modal from "@/components/Modal"

interface Message {
  id: string
  channel: string
  timestamp: string
  text: string
  replies?: {
    id: string
    text: string
    timestamp: string
  }[]
}

interface SlackMessageModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  date?: { startDate: string; endDate: string }
  messages: Message[]
}

export default function SlackMessageModal({
  isOpen,
  onClose,
  title,
  date = { startDate: "", endDate: "" },
  messages,
}: SlackMessageModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    if (isOpen) {
      fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: date.startDate,
          endDate: date.endDate,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            console.log("Messages fetched successfully:", data.messages)
            messages = data.messages // Update messages with fetched data
          } else {
            console.error("Failed to fetch messages:", data.error)
          }
        })
    }
  }, [isOpen])
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleReplies = (id: string) => {
    setExpandedReplies((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const allIds = messages.map((m) => m.id)
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

        <div className="flex-shrink-0 mb-2 text-sm text-gray-700">
          <Checkbox
            checked={selectedIds.length === allIds.length}
            onChange={toggleSelectAll}
            className="mr-2"
          />
          전체 선택
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {Array.from(new Set(messages.map((m) => m.channel))).map(
            (channel) => (
              <div key={channel}>
                <h3 className="text-base font-semibold text-[#333] mb-2">
                  # {channel}
                </h3>
                {messages
                  .filter((m) => m.channel === channel)
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className="border border-gray-200 rounded-md p-4 mb-4 bg-gray-50"
                    >
                      <div className="flex items-start gap-2">
                        <Checkbox
                          checked={selectedIds.includes(msg.id)}
                          onChange={() => toggleSelect(msg.id)}
                          className="mt-1"
                        />
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            {msg.timestamp}
                          </div>
                          <div className="text-gray-800 mb-2 whitespace-pre-wrap">
                            {msg.text}
                          </div>
                          {msg.replies && msg.replies.length > 0 && (
                            <div>
                              <button
                                onClick={() => toggleReplies(msg.id)}
                                className="text-blue-500 text-sm hover:underline"
                              >
                                💬 댓글 {msg.replies.length}개 보기
                              </button>
                              {expandedReplies[msg.id] && (
                                <div className="mt-2 pl-4 border-l border-gray-300 space-y-1">
                                  {msg.replies.map((r) => (
                                    <div
                                      key={r.id}
                                      className="text-sm text-gray-700"
                                    >
                                      • {r.text}
                                      <span className="text-xs text-gray-400 ml-2">
                                        {r.timestamp}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )
          )}
        </div>

        <div className="flex items-center justify-between mt-4 border-t pt-4">
          <span className="text-sm text-gray-600">
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
