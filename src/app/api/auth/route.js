// /app/api/login/route.js (Next.js 13+)
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  const LOGIN_TOKEN = cookieStore.get("LOGIN_TOKEN")?.value
  const auth_date = cookieStore.get("auth_date")?.value
  const token = process.env.LOGIN_TOKEN
  const cookieData = {
    LOGIN_TOKEN: LOGIN_TOKEN,
    auth_date: auth_date,
  }
  if (cookieData.LOGIN_TOKEN === token) {
    return new NextResponse(JSON.stringify({ ok: true, cookieData }), {
      status: 200,
    })
  } else {
    console.log(
      "Invalid token or no token found",
      "cookieData:",
      cookieData,
      "token:",
      token,
      cookieData.LOGIN_TOKEN === token
    )
    return new NextResponse(JSON.stringify({ ok: false }), {
      status: 401,
    })
  }
}
