// /app/api/login/route.js (Next.js 13+)
import { NextResponse } from "next/server"

export async function GET(req) {
  const token = process.env.LOGIN_TOKEN
  const payload = await req
  if ((payload.token = token)) {
    return new NextResponse(JSON.stringify({ ok: true }), {
      status: 200,
    })
  } else {
    return new NextResponse(JSON.stringify({ ok: false }), {
      status: 401,
    })
  }
}
