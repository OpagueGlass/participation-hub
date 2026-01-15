import type React from "react"
import { ChatbotFAB } from "@/components/chatbot-fab"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ChatbotFAB />
    </>
  )
}
