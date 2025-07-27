// /api/convert/route.js
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { messages } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { ok: false, message: "메시지 목록이 비어있습니다." },
        { status: 400 }
      )
    }

    let markdown = ""

    messages.forEach((msg) => {
      markdown += `## [#${msg.channel}] - ${msg.ts}\n`
      markdown += `> ${msg.text}\n`

      if (Array.isArray(msg.replies) && msg.replies.length > 0) {
        msg.replies.forEach((reply) => {
          markdown += `\n>> ${reply.ts} - ${reply.text}`
        })
        markdown += `\n`
      }

      markdown += `\n---\n\n`
    })

    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="slip-${Date.now()}.md"`,
      },
    })
  } catch (err) {
    console.error("Markdown 변환 오류:", err)
    return NextResponse.json(
      { ok: false, error: "마크다운 변환 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
