import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Bot, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ChatbotPage() {
  return (

          <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Bot className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Research Chatbot</h1>
          <p className="text-sm text-muted-foreground">Ask questions about your datasets</p>
        </div>
      </div>


        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-base">Chat History</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 shrink-0">
                    <Bot className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      Hello! I'm here to help you understand your research participation. You can ask me questions about
                      the datasets you're part of, such as study details, your contributions, or general information
                      about the research.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 justify-end">
                  <div className="flex-1 bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%] ml-auto">
                    <p className="text-sm">What studies am I currently participating in?</p>
                  </div>
                  <div className="p-2 rounded-full bg-primary shrink-0">
                    <User className="size-4 text-primary-foreground" />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 shrink-0">
                    <Bot className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      You are currently participating in 3 active studies:
                      <br />
                      <br />
                      1. Mental Health and Well-being Study - Started January 2023
                      <br />
                      2. Sleep Patterns Research - Started March 2023
                      <br />
                      3. Digital Wellbeing Survey - Completed in June 2023
                      <br />
                      <br />
                      Would you like more details about any specific study?
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="mt-4 flex gap-2">
              <Input placeholder="Type your question here..." className="flex-1" />
              <Button size="icon">
                <Send className="size-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-2 text-center">
              Note: Responses may take several seconds to generate
            </p>
          </CardContent>
        </Card>
    </div>
  )
}
