import { NextResponse } from "next/server"

const SLACK_TOKEN = process.env.SLACK_TOKEN
const SLACK_API_BASE = "https://slack.com/api"
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
export async function GET(req) {
  try {
    // ✅ 쿼리 파라미터 확인
    const { searchParams } = new URL(req.url)
    const channel = searchParams.get("channel")
    const ts = searchParams.get("ts")

    if (!channel || !ts) {
      return NextResponse.json(
        { ok: false, message: "channel과 ts는 필수입니다." },
        { status: 400 }
      )
    }
    console.log("채널:", channel, "타임스탬프:", ts)
    // ✅ 댓글 요청
    const repliesRes = await fetch(
      `${SLACK_API_BASE}/conversations.replies?channel=${channel}&ts=${ts}&limit=10`,
      {
        headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
      }
    )
    if (!repliesRes.ok) {
      return NextResponse.json(
        { ok: false, message: "댓글을 가져오는 데 실패했습니다." },
        { status: repliesRes.status }
      )
    }

    const repliesData = await repliesRes.json()

    if (!repliesData.ok || !repliesData.messages) {
      console.warn("슬랙 API 응답 오류:", repliesData)
      return NextResponse.json(
        { ok: false, message: "슬랙 응답 오류" },
        { status: 500 }
      )
    }

    const replies = repliesData.messages.slice(1).map((msg) => ({
      text: msg.text,
      ts: formatSlackTimestamp(msg.ts),
      thread_ts: msg.thread_ts,
    }))

    return NextResponse.json({ ok: true, replies }, { status: 200 })
  } catch (err) {
    console.error("/api/messages/thread 에러:", err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
