"use client"

import { useLanguage } from "@/lib/language-context"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "zh" : "en")}
      className="flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-200"
      title={language === "en" ? "Switch to Chinese" : "Switch to English"}
    >
      <Globe className="h-4 w-4" />
      <span>{language === "en" ? "中文" : "EN"}</span>
    </button>
  )
}
