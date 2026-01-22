"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Mail, Info } from "lucide-react"

export default function CreateResearchPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [emails, setEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState("")

  const handleAddEmail = () => {
    if (emailInput && !emails.includes(emailInput)) {
      setEmails([...emails, emailInput])
      setEmailInput("")
    }
  }

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Research</h1>
          <p className="text-muted-foreground">Set up a new research study and invite participants</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Research Details</CardTitle>
              <CardDescription>Provide basic information about your research study.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="title" 
                  placeholder="Enter research title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose and scope of your research..."
                  className="min-h-[150px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invite Participants</CardTitle>
              <CardDescription>Add participant email addresses to send invitations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Enter email address"
                    className="pl-10"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
                  />
                </div>
                <Button onClick={handleAddEmail}>
                  <Plus className="mr-2 size-4" />
                  Add
                </Button>
              </div>

              {emails.length > 0 && (
                <div className="space-y-2">
                  <Label>Invited Participants ({emails.length})</Label>
                  <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/50">
                    {emails.map((email) => (
                      <Badge key={email} variant="secondary" className="gap-1 pr-1">
                        {email}
                        <button
                          onClick={() => handleRemoveEmail(email)}
                          className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Participants will receive an email invitation to join your research study. They will need to create an account and provide consent before participating.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="size-4" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p className="font-medium text-foreground">Title</p>
                <p>Use a clear, descriptive title that participants can easily understand.</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">Description</p>
                <p>Explain the purpose of your research and what participants can expect.</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">Participants</p>
                <p>You can add more participants after creating the research.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Create Research</Button>
              <Button variant="outline" className="w-full bg-transparent">
                Save as Draft
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/admin/research">Cancel</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
