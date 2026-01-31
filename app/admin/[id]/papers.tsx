"use client";

import { DatePickerInput } from "@/components/date-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ResearchPaper } from "@/lib/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookMarked, Edit, ExternalLink, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addPaperToCollection } from "@/lib/query";

const researchPaperSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  authors: z.string().min(1, { message: "Authors are required" }),
  journal: z.string().min(1, { message: "Journal is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  publishedAt: z
    .date({ message: "Invalid date" })
    .max(new Date(), { message: "Published date cannot be in the future" }),
  link: z.httpUrl({ message: "Invalid URL" }),
});

function PapersDialog({ collectionId }: { collectionId: string }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof researchPaperSchema>>({
    resolver: zodResolver(researchPaperSchema),
    defaultValues: {
      title: "",
      authors: "",
      journal: "",
      description: "",
      publishedAt: undefined,
      link: "",
    },
  });

  async function onSubmit(data: z.infer<typeof researchPaperSchema>) {
    const { error } = await addPaperToCollection(collectionId, {
      ...data,
      published_at: data.publishedAt.toISOString(),
    });
    if (error) {
      toast.error(`Error adding research paper: ${error.message}`);
      return;
    }
    form.reset();
    setValue("");
    setOpen(false);
    toast.success("Research paper added successfully!");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" />
          Add Paper
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] flex flex-col p-0 gap-0">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle>Add Research Paper</DialogTitle>
          <DialogDescription className="">Add details about a published paper from this research</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] flex flex-col w-full px-6">
          <form className="px-1 pt-4 pb-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input {...field} id="title" type="text" placeholder="Enter paper title" required />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="authors"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="authors">Authors</FieldLabel>
                    <Input
                      {...field}
                      id="authors"
                      type="text"
                      placeholder="e.g., Smith, J., Doe, A., Wilson, M."
                      required
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="journal"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="journal">Journal</FieldLabel>
                    <Input {...field} id="journal" type="text" placeholder="Enter journal name" required />
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
                      placeholder="Brief abstract or summary of the paper..."
                      rows={5}
                      required
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="publishedAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <DatePickerInput
                    title="Published Date"
                    field={field}
                    fieldState={fieldState}
                    disabled={{ after: new Date() }}
                    value={value}
                    setValue={setValue}
                  />
                )}
              />
              <Controller
                name="link"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="link">Link</FieldLabel>
                    <Input {...field} id="link" type="url" placeholder="https://doi.org/..." required />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" className="w-full">
                  <Plus className="mr-2" /> Add Paper
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function PapersTab({ papers, collectionId }: { papers: ResearchPaper[]; collectionId: string }) {
  return (
    <TabsContent value="papers" className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Research Papers</CardTitle>
              <CardDescription>Add and manage published papers from this research study.</CardDescription>
            </div>
            <PapersDialog collectionId={collectionId}/>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {papers.length > 0 ? (
              papers.map((paper) => (
                <div
                  key={paper.id}
                  className="relative p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-row items-center mb-1 gap-2 justify-between align-top">
                    <h4 className="font-semibold">{paper.title}</h4>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className="text-xs align-top">
                        {paper.publishedAt.toLocaleDateString([], {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="size-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-0.5 font-semibold">{paper.authors}</p>
                  <p className="text-xs text-muted-foreground mb-2 italic">{paper.journal}</p>
                  <p className="text-sm text-muted-foreground mb-3">{paper.description}</p>

                  <Button size="sm" asChild>
                    <Link href={paper.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 size-4" />
                      Read Full Paper
                    </Link>
                  </Button>
                </div>
              ))
            ) : (
              <Empty className="border border-border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BookMarked />
                  </EmptyMedia>
                  <EmptyTitle>No Published Research</EmptyTitle>
                  <EmptyDescription>
                    Published research using data from this study will appear here once available.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
