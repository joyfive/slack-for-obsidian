import withPWA from "next-pwa"

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  // 기타 next 설정들...
}

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig)
