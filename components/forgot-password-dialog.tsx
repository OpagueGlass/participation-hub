"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<"email" | "sent">("email")

  const handleSubmit = () => {
    setStep("sent")
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setStep("email"), 200)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="px-0 text-sm ">
          Forgot password?
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            {step === "email"
              ? "Enter your email address and we'll send you a password reset link"
              : "Check your email for a password reset link"}
          </DialogDescription>
        </DialogHeader>
        {step === "email" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input id="reset-email" type="email" placeholder="participant@example.com" />
            </div>
            <Button className="w-full" onClick={handleSubmit}>
              Send Reset Link
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-sm">
              We've sent a password reset link to your email address. Please check your inbox and follow the
              instructions to reset your password.
            </div>
            <Button className="w-full" onClick={handleClose}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
