import { lazy } from "react"

export const Qrmaker = lazy(() => import("../apps/QRTopPage"))
export const YearConverter = lazy(() => import("../apps/YearConverter"))
export const RandomStringGenerator = lazy(() => import("../apps/RandomStringGenerator"))
export const BlogCloud = lazy(() => import("../apps/BlogCloud"))
export const WordCounter = lazy(() => import("../apps/WordCounter"))
export const Hashapp = lazy(() => import("../apps/Hashapp"))
export const PrivacyPolicyMaker = lazy(() => import("../apps/PrivacyPolicyMaker"))
export const ByteCounter = lazy(() => import("../apps/ByteCounter"))
export const JsonPretty = lazy(() => import("../apps/JsonPretty"))
export const Pomodoro = lazy(() => import("../apps/Pomodoro/Pomodoro"))
export const ColorPalette = lazy(() => import("../apps/ColorPalette"))

//固定ページ
export const LandingPage = lazy(() => import("../pages/LandingPage"))
export const Contact = lazy(() => import("../pages/Contact"))
export const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"))
export const Error404 = lazy(() => import("../pages/Error404"))




