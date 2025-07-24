import { NextResponse } from "next/server"

const SLACK_TOKEN = process.env.SLACK_TOKEN
const SLACK_API_BASE = "https://slack.com/api"

function toUnixTimestamp(dateStr) {
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? null : Math.floor(date.getTime() / 1000)
}
function formatSlackTimestamp(ts) {
  if (!ts || typeof ts !== "string") {
    console.warn("Invalid timestamp:", ts)
    return null
  }
  console.log(ts)
  const [secondsStr, microStr] = ts?.split(".")
  console.log(secondsStr, microStr)
  const timestampMs =
    parseInt(secondsStr) * 1000 + Math.floor(parseInt(microStr) / 1000) // 밀리초 단위로 변환
  const date = new Date(timestampMs)

  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  const hh = String(date.getHours()).padStart(2, "0")
  const min = String(date.getMinutes()).padStart(2, "0")
  const ss = String(date.getSeconds()).padStart(2, "0")

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
}
function getDateRange(startDateStr, endDateStr) {
  if (!endDateStr) throw new Error("endDate는 필수입니다")

  const endTs = toUnixTimestamp(endDateStr)
  if (endTs === null) throw new Error("endDate가 유효하지 않습니다")

  const startTs = toUnixTimestamp(startDateStr)

  if (!startDateStr || startTs === null) {
    const dayStart = new Date(endDateStr)
    dayStart.setHours(0, 0, 0, 0)
    const oldest = Math.floor(dayStart.getTime() / 1000)
    return { oldest, latest: oldest + 86400 }
  }

  return { oldest: startTs, latest: endTs + 86400 }
}

export async function GET(req) {
  try {
    // ✅ 파라미터 파싱
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get("startDate") || ""
    const endDate = searchParams.get("endDate") || ""
    const channelId = searchParams.get("channelId")
    const channelName = searchParams.get("channelName")
    const { oldest, latest } = getDateRange(startDate, endDate)
    console.log(startDate, endDate, oldest, latest, channelId, channelName)
    const messagesRes = await fetch(
      `${SLACK_API_BASE}/conversations.history?channel=${channelId}&oldest=${oldest}&latest=${latest}&inclusive=true`,
      {
        headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
      }
    )
    const messagesData = await messagesRes.json()
    console.log("messagesData", messagesData.messages)
    const results = []
    if (messagesData.ok && Array.isArray(messagesData.messages)) {
      const formattedMessages = messagesData.messages.map((msg) => ({
        text: msg.text,
        ts: formatSlackTimestamp(msg.ts),
        thread_ts: msg.thread_ts || null,
        reply_count: msg.reply_count || 0,
      }))
      console.log("formattedMessages", formattedMessages)
      results.push(...formattedMessages)
      console.log("results:", results)
      console.log(`채널 ${channelName} 메시지 처리 성공`, results)
      return NextResponse.json({ ok: true, results }, { status: 200 })
    } else {
      console.warn(`채널 ${channelName} 메시지 처리 실패`, messagesData)
      return NextResponse.json(
        { ok: false, message: "메시지 처리 실패" },
        { status: 400 }
      )
    }
  } catch (err) {
    console.error("GET /api/messages error:", err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
