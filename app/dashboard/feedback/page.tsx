"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { addFeedback, getUserFeedback } from "@/lib/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const feedbackTypes = [
  { key: 1, label: "Login Difficulties" },
  { key: 2, label: "Dataset Enquiry" },
  { key: 3, label: "Chatbot Malfunctions" },
  { key: 4, label: "Consent Management" },
  { key: 5, label: "Suggestions" },
  { key: 6, label: "Other" },
];

const feedbackSchema = z.object({
  feedbackType: z.number().refine((val) => feedbackTypes.some((cat) => cat.key === val), {
    message: "Please select a valid feedback category",
  }),
  description: z.string().min(10, "Please provide a more detailed message (at least 10 characters)"),
});

export default function FeedbackPage() {
  const { session } = useAuth();

  const { data: userFeedback } = useQuery({
    queryKey: ["userFeedback", session!.user!.id],
    queryFn: () => getUserFeedback(session!.user!.id),
    enabled: !!session?.user?.id,
  });

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    values: {
      feedbackType: 0,
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof feedbackSchema>) {
    toast.promise(addFeedback(session!.user?.id, data), {
      loading: "Submitting your feedback...",
      success: (err) => {
        if (err) {
          throw err;
        }
        form.reset();
        return "Thank you for your feedback!";
      },
      error: (err) => `Error submitting feedback: ${err.message}`,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <MessageCircle className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feedback Form</h1>
          <p className="text-sm text-muted-foreground">Share your thoughts with the research team</p>
        </div>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>
              Your feedback helps us improve the research experience and better understand your needs as a participant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="feedbackType"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="w-[300px]">
                      <Label htmlFor="feedbackType">Feedback Category</Label>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value === 0 ? "" : String(field.value)}
                      >
                        <SelectTrigger id="feedbackType" className="w-[200px] max-w-[200px]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {feedbackTypes.map((category) => (
                            <SelectItem key={category.key} value={category.key.toString()}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className="w-[300px]" />}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="description">Your Message</Label>
                      <Textarea
                        id="description"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="Please share your feedback, questions, or concerns here..."
                        className="min-h-[150px]"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
              <Field>
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Spinner />}
                  Submit Feedback
                </Button>
              </Field>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Previous Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userFeedback && userFeedback.length > 0 ? (
              userFeedback.map((feedback) => (
                <div key={feedback.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm">
                        {feedbackTypes[feedback.feedback_type - 1]?.label || "General Feedback"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted on{" "}
                        {new Date(feedback.submitted_at).toLocaleDateString([], {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{feedback.description}</p>
                </div>
              ))
            ) : (
              <p className=" p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                You have not submitted any feedback yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
