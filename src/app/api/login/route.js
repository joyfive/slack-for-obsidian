// /app/api/login/route.js (Next.js 13+)
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req) {
  const id = process.env.ID
  const pw = process.env.PW
  const token = process.env.LOGIN_TOKEN
  const body = await req.json()
  console.log(token, process.env.LOGIN_TOKEN)
  if ((body.id = id && body.pw === pw)) {
    console.log("로그인 성공", token)
    cookies().set("LOGIN_TOKEN", token)
    cookies().set("auth_date", new Date().toISOString().slice(0, 10)) // Store token in cookies

    return new NextResponse(
      JSON.stringify({
        ok: true,
        token: cookies().get("LOGIN_TOKEN"),
        auth_date: cookies().get("auth_date"),
      }),
      {
        status: 200,
      }
    )
  } else {
    ;(await cookies())
      .delete("LOGIN_TOKEN")(await cookies())
      .delete("auth_date")
    return new NextResponse(JSON.stringify({ ok: false }), {
      status: 401,
    })
  }
}
