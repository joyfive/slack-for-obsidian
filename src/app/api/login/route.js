// /app/api/login/route.js (Next.js 13+)
import { NextResponse } from "next/server"

export async function POST(req) {
  const id = process.env.ID
  const pw = process.env.PW
  const token = process.env.LOGIN_TOKEN
  const body = await req.json()
  console.log(token)
  if ((body.id = id && body.pw === pw)) {
    return new NextResponse(JSON.stringify({ ok: true }), {
      status: 200,
      token: token,
    })
  } else {
    return new NextResponse(JSON.stringify({ ok: false }), {
      status: 401,
    })
  }
}
