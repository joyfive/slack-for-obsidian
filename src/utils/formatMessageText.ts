// utils/formatEmoji.ts
import emojiMap from "@/utils/SlackEmoji.json";

/**
 * 슬랙 텍스트 내 :emoji: 문자를 유니코드 이모지로 치환합니다.
 * unknown 이모지는 그대로 둡니다.
 */
export const formatMsgText = (text: string): string => {
  if (!text) return "";

  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/(:[a-zA-Z0-9_+~-]+:)/g, (match) => {
      return (emojiMap as Record<string, string>)[match] || match;
    });
};
