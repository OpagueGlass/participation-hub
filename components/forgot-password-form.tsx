"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Label } from "./ui/label";

enum SignUpStep {
  Email = 1,
  OTP,
}

function EmailStep({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot Your Password?</CardTitle>
          <CardDescription>Enter your email below to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                </div>
                <Input id="email" type="email" required placeholder="Enter your email" />
              </Field>
              <Field>
                <Button type="submit">Send OTP</Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/auth/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function OTPStep({ className, ...props }: React.ComponentProps<"div">) {
  const [otp, setOtp] = useState("");
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot Your Password?</CardTitle>
          <CardDescription>Enter the 6-digit verification code sent to your email</CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-center block text-lg mt-2">
              Verification Code
            </Label>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} className="w-12 h-12 text-2xl" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            Didn't receive the code?{" "}
            <Button variant="link" className="px-0 h-auto text-sm" onClick={() => {}}>
              Resend
            </Button>
          </div>
          <Button className="w-full mt-12" size="lg" asChild>
            <Link href="/dashboard">Reset Password</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const [signUpStep, setSignUpStep] = useState<SignUpStep>(SignUpStep.Email);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle OTP submission logic here
    setSignUpStep(SignUpStep.OTP);
  };

  if (signUpStep === SignUpStep.Email) {
    return <EmailStep onSubmit={handleEmailSubmit} className={className} {...props} />;
  }
  return <OTPStep className={className} {...props} />;
}
