"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputTags } from "@/components/ui/input-tags";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { createNewResearch } from "@/lib/query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const newResearchSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export default function CreateResearchPage() {
  const [emails, setEmails] = useState<string[]>([]);
  const { session } = useAuth();

  const form = useForm<z.infer<typeof newResearchSchema>>({
    values: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof newResearchSchema>) {
    toast.promise(createNewResearch(session!.user!.id, data, emails), {
      loading: "Creating research study...",
      success: "Research study created successfully!",
      error: (err) => `Error creating research study: ${err.message}`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Research</h1>
          <p className="text-muted-foreground">Set up a new research study and invite participants</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Research Details</CardTitle>
              <CardDescription>Provide basic information about your research study.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <Input {...field} id="title" type="text" placeholder="Enter research title" required />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <Textarea
                          {...field}
                          id="description"
                          placeholder="Describe the purpose and scope of your research..."
                          required
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Field className="max-h-md">
                    <FieldLabel htmlFor="emails">Participant Emails</FieldLabel>
                    <InputTags
                      value={emails}
                      onChange={setEmails}
                      schema={z.email({ message: "Invalid email address" })}
                      placeholder="Enter zero or more email addresses, separated by commas"
                      className="h-[150px]"
                    />
                  </Field>
                  <Field>
                    <Button type="submit" className="w-full">
                      <Plus className="mr-2" /> Create Research Study
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
