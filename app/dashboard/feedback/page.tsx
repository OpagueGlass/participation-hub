import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FeedbackPage() {
  const feedbackCategories = [
    {key: "login", label: "Login Difficulties"},
    {key: "dataset", label: "Dataset Enquiry"},
    {key: "chatbot", label: "Chatbot Malfunctions"},
    {key: "consent", label: "Consent Management"},
    {key: "suggestions", label: "Suggestions"},
    {key: "other", label: "Other"},
  ]


  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageCircle className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Feedback Form</h1>
              <p className="text-sm text-muted-foreground">Share your thoughts with the research team</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Submit Feedback</CardTitle>
              <CardDescription>
                Your feedback helps us improve the research experience and better understand your needs as a participant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* <div className="space-y-2">
                <Label htmlFor="study">Related Study (Optional)</Label>
                <Select>
                  <SelectTrigger id="study">
                    <SelectValue placeholder="Select a study" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Feedback</SelectItem>
                    <SelectItem value="study1">Mental Health and Well-being Study</SelectItem>
                    <SelectItem value="study2">Sleep Patterns Research</SelectItem>
                    <SelectItem value="study3">Digital Wellbeing Survey</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="category">Feedback Category</Label>
                <Select>
                  <SelectTrigger id="category"  className="min-w-[200px]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {feedbackCategories.map((category) => (
                      <SelectItem key={category.key} value={category.key}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="Please share your feedback, questions, or concerns here..."
                  className="min-h-[150px] max-h-[150px]"
                />
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">Submit Feedback</Button>
                {/* <Button variant="outline">Clear Form</Button> */}
              </div>

              <p className="text-sm text-muted-foreground">
                The research team typically responds within 2-3 business days. For urgent matters, please contact us
                directly.
              </p>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Previous Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">Technical Issue - Login Problem</p>
                    <p className="text-xs text-muted-foreground">Submitted on Oct 20, 2023</p>
                  </div>
                  <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">Resolved</span>
                </div>
                <p className="text-sm text-muted-foreground">Had trouble logging in with OTP verification...</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">Data Question - Study Results</p>
                    <p className="text-xs text-muted-foreground">Submitted on Sep 15, 2023</p>
                  </div>
                  <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">Resolved</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  When will the final results of the sleep study be available?
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
