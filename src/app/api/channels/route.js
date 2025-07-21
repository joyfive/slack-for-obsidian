import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const SLACK_TOKEN = process.env.SLACK_TOKEN
const LOGIN_TOKEN = process.env.LOGIN_TOKEN
const SLACK_API_BASE = "https://slack.com/api"

export async function GET() {
  try {
    // ✅ 인증
    const cookieStore = await cookies()
    const userToken = cookieStore.get("LOGIN_TOKEN")?.value
    if (userToken !== LOGIN_TOKEN) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    // ✅ 채널 목록 조회
    const channelsRes = await fetch(
      `${SLACK_API_BASE}/conversations.list?types=public_channel,private_channel`,
      {
        headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
      }
    )

    const channelsData = await channelsRes.json()
    if (!channelsData.ok) {
      return NextResponse.json(
        { ok: false, message: "채널 목록을 가져오는 데 실패했습니다." },
        { status: 500 }
      )
    }

    const results = channelsData.channels.map((channel) => ({
      id: channel.id,
      name: channel.name,
    }))

    return NextResponse.json({ ok: true, results: results }, { status: 200 })
  } catch (err) {
    console.error("GET /api/messages error:", err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
