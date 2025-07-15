// /app/api/login/route.js (Next.js 13+)
import { NextResponse } from "next/server"

export async function POST(req) {
  const id = process.env.ID
  const pw = process.env.PW
  const body = await req.json()
  console.log("Received body:", body, id, pw)
  if ((body.id = id && body.pw === pw)) {
    return new NextResponse(JSON.stringify({ ok: true }), {
      status: 200,
    })
  } else {
    return new NextResponse(JSON.stringify({ ok: false }), {
      status: 401,
    })
  }
}
