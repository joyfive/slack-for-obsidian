import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const SLACK_TOKEN = process.env.SLACK_TOKEN
const LOGIN_TOKEN = process.env.LOGIN_TOKEN
const SLACK_API_BASE = "https://slack.com/api"

export async function GET(req) {
  try {
    // ✅ 인증
    const cookieStore = cookies()
    const userToken = cookieStore.get("LOGIN_TOKEN")?.value
    if (userToken !== LOGIN_TOKEN) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

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
      return NextResponse.json(
        { ok: false, message: "슬랙 응답 오류" },
        { status: 500 }
      )
    }

    const replies = repliesData.messages.slice(1).map((msg) => ({
      text: msg.text,
      ts: msg.ts,
    }))

    return NextResponse.json({ ok: true, replies }, { status: 200 })
  } catch (err) {
    console.error("/api/messages/thread 에러:", err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
