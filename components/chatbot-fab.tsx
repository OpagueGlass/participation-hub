"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, X, Send, User } from "lucide-react"

export function ChatbotFAB() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          size="lg"
          className="fixed bottom-6 right-6 size-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="size-6" />
        </Button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[32rem] shadow-2xl flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Bot className="size-5 text-primary" />
              </div>
              <CardTitle className="text-base">Research Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="size-8" onClick={() => setIsOpen(false)}>
              <X className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4">
            <ScrollArea className="flex-1 pr-3 mb-4">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 rounded-full bg-primary/10 shrink-0">
                    <Bot className="size-3 text-primary" />
                  </div>
                  <div className="flex-1 bg-muted p-2.5 rounded-lg">
                    <p className="text-xs">
                      Hello! I can help answer questions about the datasets you're part of. What would you like to know?
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 justify-end">
                  <div className="bg-primary text-primary-foreground p-2.5 rounded-lg max-w-[80%]">
                    <p className="text-xs">Tell me about my current studies</p>
                  </div>
                  <div className="p-1.5 rounded-full bg-primary shrink-0">
                    <User className="size-3 text-primary-foreground" />
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="p-1.5 rounded-full bg-primary/10 shrink-0">
                    <Bot className="size-3 text-primary" />
                  </div>
                  <div className="flex-1 bg-muted p-2.5 rounded-lg">
                    <p className="text-xs">
                      You're participating in 3 active studies. The Mental Health and Well-being Study has your highest
                      contribution rate at 87%. Would you like details about a specific study?
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="space-y-2">
              <div className="flex gap-2">
                <Input placeholder="Ask a question..." className="flex-1" />
                <Button size="icon">
                  <Send className="size-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">Responses may take a few seconds</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
