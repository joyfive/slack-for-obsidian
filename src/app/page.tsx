"use client";
import React, { useState } from "react";

export default function SlackToObsidian() {
  const [slackUrl, setSlackUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [error, setError] = useState("");

  // 붙여넣기 + 다운로드 (하나의 버튼)
  const handlePasteAndDownload = async () => {
    setError("");
    setIsDownloading(true);
    setIsDownloaded(false);
    try {
      // 1. 클립보드 읽기
      const text = await navigator.clipboard.readText();
      setSlackUrl(text);

      if (!text || !/^https?:\/\/.*slack\.com\/archives\//.test(text)) {
        setError("유효한 Slack 스레드 링크가 아닙니다.");
        setIsDownloading(false);
        return;
      }

      // 2. 백엔드 변환/다운로드 (여기선 임시 대기, 실제 API 호출/다운로드로 교체)
      await new Promise((res) => setTimeout(res, 1200));
      // (실제 다운로드 코드 예시)
      // const res = await fetch("/api/convert", { method: "POST", body: JSON.stringify({ url: text }) });
      // const blob = await res.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // a.href = url; a.download = "slack_archive.md"; a.click();

      setIsDownloaded(true);
    } catch (e) {
      setError("클립보드 접근 또는 다운로드 실패");
    } finally {
      setIsDownloading(false);
    }
  };

  // 단축어 실행
  const handleShortcut = () => {
    window.location.href = "shortcuts://run-shortcut?name=md_for_obsidian";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-xs flex flex-col gap-5">
        <h1 className="text-xl font-semibold text-center mb-2">
          Slack → Obsidian md
        </h1>
        <input
          type="text"
          className="w-full rounded-xl border p-3 text-base focus:outline-none bg-gray-50"
          placeholder="클립보드의 Slack 스레드 링크가 자동 입력됩니다"
          value={slackUrl}
          readOnly
        />

        <button
          onClick={handlePasteAndDownload}
          disabled={isDownloading}
          className={`w-full py-2 rounded-xl ${
            isDownloading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          } text-base font-semibold`}
        >
          {isDownloading
            ? "붙여넣기 및 다운로드 중..."
            : "붙여넣기 및 다운로드"}
        </button>

        <button
          onClick={handleShortcut}
          disabled={!isDownloaded}
          className={`w-full py-2 rounded-xl ${
            !isDownloaded
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          } text-base font-semibold`}
        >
          단축어 실행(Obsidian 이동)
        </button>

        {isDownloaded && (
          <div className="text-green-700 text-center text-sm">
            다운로드 완료!
            <br />
            단축어 실행 버튼을 눌러 Obsidian으로 이동하세요.
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center text-xs mt-2">{error}</div>
        )}
      </div>
    </div>
  );
}
