// /app/api/convert/route.js (Next.js 13+)
import { NextResponse } from "next/server";

export async function POST(request) {
  const { url } = await request.json();
  if (!url) {
    return NextResponse.json({ error: "No URL" }, { status: 400 });
  }

  // 1. URL 파싱(channel, ts 추출) - 정규식 활용
  // 예시: https://xxx.slack.com/archives/CHANNEL_ID/p1234567890123456
  const match = url.match(/archives\/([^/]+)\/p(\d{16})/);
  if (!match) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  const channel = match[1];
  const ts = match[2].replace(/^(\d{10})(\d{6})$/, "$1.$2");

  // 2. 슬랙 API 호출 (SLACK_TOKEN 환경변수 필요)
  const SLACK_TOKEN = process.env.SLACK_TOKEN;
  if (!SLACK_TOKEN) {
    return NextResponse.json({ error: "No Slack token" }, { status: 500 });
  }

  // 3. fetch replies (스레드 전체 메시지)
  const resp = await fetch(
    `https://slack.com/api/conversations.replies?channel=${channel}&ts=${ts}`,
    { headers: { Authorization: `Bearer ${SLACK_TOKEN}` } }
  );
  const data = await resp.json();
  if (!data.ok) {
    return NextResponse.json({ error: "Slack API error" }, { status: 500 });
  }

  // 4. Markdown 변환 (아주 단순 포맷 예시)
  const md = data.messages
    .map(
      (msg) =>
        `- **${msg.user || msg.username}** [${new Date(
          Number(msg.ts.split(".")[0]) * 1000
        ).toLocaleString()}]\n\n${msg.text}\n`
    )
    .join("\n---\n");

  // 5. 파일로 응답
  return new Response(md, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="slack_archive.md"`,
    },
  });
}
