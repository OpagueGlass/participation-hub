"use client";

import { DatePickerInput } from "@/components/date-picker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { addPaperToCollection, deletePaperFromCollection, ResearchPaper, updatePaperInCollection } from "@/lib/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookMarked, Edit, ExternalLink, FilePlus, MoreVertical, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const researchPaperSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  authors: z.string().min(1, { message: "Authors are required" }),
  journal: z.string().min(1, { message: "Journal is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  publishedAt: z
    .date({ message: "Invalid date" })
    .max(new Date(), { message: "Published date cannot be in the future" })
    .optional()
    .refine((date) => date instanceof Date, { message: "Published date is required" }),
  link: z.httpUrl({ message: "Invalid URL" }),
});

const paperDialogMode = [
  {
    title: "Add Research Paper",
    description: "Add details about a published paper from this research",
    buttonText: "Add Paper",
    toast: {
      loading: "Adding research paper...",
      success: "Research paper added successfully!",
      error: ({ message }: { message: string }) => `Error adding research paper: ${message || "Unknown error"}`,
    },
  },
  {
    title: "Edit Research Paper",
    description: "Update details about this published research paper",
    buttonText: "Save Changes",
    toast: {
      loading: "Saving changes...",
      success: "Research paper updated successfully!",
      error: ({ message }: { message: string }) => `Error updating research paper: ${message || "Unknown error"}`,
    },
  },
] as const;

function PapersDialog({
  open,
  setOpen,
  dateInput,
  setDateInput,
  paperPromise,
  refetch,
  paper,
}: {
  paperPromise: (data: z.infer<typeof researchPaperSchema>) => ReturnType<typeof addPaperToCollection>;
  refetch: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  paper?: ResearchPaper;
  dateInput: string;
  setDateInput: (date: string) => void;
}) {
  const mode = paperDialogMode[paper ? 1 : 0];

  const form = useForm<z.infer<typeof researchPaperSchema>>({
    resolver: zodResolver(researchPaperSchema),
    values: {
      title: paper?.title || "",
      authors: paper?.authors || "",
      journal: paper?.journal || "",
      description: paper?.description || "",
      publishedAt: paper?.publishedAt,
      link: paper?.link || "",
    },
  });

  async function onSubmit(data: z.infer<typeof researchPaperSchema>) {
    toast.promise(paperPromise(data), {
      loading: mode.toast.loading,
      success: (error) => {
        if (error) {
          throw error;
        }
        refetch();
        form.reset();
        setDateInput("");
        setOpen(false);
        return mode.toast.success;
      },
      error: (error) => {
        setOpen(true);
        return mode.toast.error(error);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className="sm:max-w-[500px] flex flex-col p-0 gap-0">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle>{mode.title}</DialogTitle>
          <DialogDescription className="">{mode.description}</DialogDescription>
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
                  <Plus className="mr-2" /> {mode.buttonText}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AddPaperDialog({
  collectionId,
  open,
  setOpen,
  refetch,
}: {
  collectionId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}) {
  const [dateInput, setDateInput] = useState("");

  const addPaperPromise = (data: z.infer<typeof researchPaperSchema>) => {
    const d = data.publishedAt!;
    const utcDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    return addPaperToCollection(collectionId, {
      ...data,
      publishedAt: utcDate.toISOString(),
    });
  };

  return (
    <PapersDialog
      paperPromise={addPaperPromise}
      refetch={refetch}
      dateInput={dateInput}
      setDateInput={setDateInput}
      open={open}
      setOpen={setOpen}
    />
  );
}

function EditPaperDialog({
  open,
  setOpen,
  dateInput,
  setDateInput,
  refetch,
  paper,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
  paper: ResearchPaper | null;
  dateInput: string;
  setDateInput: (date: string) => void;
}) {
  if (!paper) {
    return null;
  }

  const editPaperPromise = (data: z.infer<typeof researchPaperSchema>) => {
    const d = data.publishedAt!;
    const utcDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    return updatePaperInCollection(paper.id, {
      ...data,
      publishedAt: utcDate.toISOString(),
    });
  };

  return (
    <PapersDialog
      paperPromise={editPaperPromise}
      refetch={refetch}
      dateInput={dateInput}
      setDateInput={setDateInput}
      open={open}
      setOpen={setOpen}
      paper={paper}
    />
  );
}

function DeletePaperDialog({
  paper,
  open,
  setOpen,
  refetch,
}: {
  paper: ResearchPaper | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}) {
  if (!paper) {
    return null;
  }

  const removePaper = () => {
    setOpen(false);
    toast.promise(deletePaperFromCollection(paper.id), {
      loading: "Deleting paper...",
      success: (error) => {
        if (error) {
          throw error;
        }
        refetch();
        return "Paper deleted successfully!";
      },
      error: (error) => {
        setOpen(true);
        return `Failed to delete paper: ${error.message || "Unknown error"}`;
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-sm ring-foreground/10 ring-1 p-4 rounded-xl outline-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {paper.title}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this paper? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="bg-muted/50 -mx-4 -mb-4 rounded-b-xl border-t p-4">
          <AlertDialogCancel onClick={() => setOpen(false)} size="sm" className="rounded-xl">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={removePaper} size="sm" className="rounded-xl" variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function PapersTab({
  papers,
  collectionId,
  refetch,
}: {
  papers: ResearchPaper[];
  collectionId: string;
  refetch: () => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [editDateInput, setEditDateInput] = useState("");

  const openAddModal = () => {
    setSelectedPaper(null);
    setAddOpen(true);
  };

  const openEditModal = (paper: ResearchPaper) => (e: Event) => {
    e.preventDefault();
    setSelectedPaper(paper);
    setEditDateInput(
      paper.publishedAt.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    );
    setEditOpen(true);
  };

  const openDeleteModal = (paper: ResearchPaper) => (e: Event) => {
    e.preventDefault();
    setSelectedPaper(paper);
    setDeleteOpen(true);
  };

  return (
    <TabsContent value="papers" className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Research Papers</CardTitle>
              <CardDescription>Add and manage published papers from this research study.</CardDescription>
            </div>
            <Button onClick={openAddModal}>
              <FilePlus className="mr-2 size-4" />
              Add Paper
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {papers.length > 0 ? (
              papers.map((paper) => (
                <div key={paper.id} className="relative p-4 border border-border rounded-lg transition-colors">
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
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="size-5 rounded-full">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={openEditModal(paper)}>
                            <Edit className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={openDeleteModal(paper)}>
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-0.5 font-semibold">{paper.authors}</p>
                  <p className="text-xs text-muted-foreground mb-2 italic">{paper.journal}</p>
                  <p className="text-sm text-muted-foreground mb-3">{paper.description}</p>

                  <Button size="sm" asChild variant="secondary">
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
      <AddPaperDialog collectionId={collectionId} refetch={refetch} open={addOpen} setOpen={setAddOpen} />
      <EditPaperDialog
        paper={selectedPaper}
        refetch={refetch}
        open={editOpen}
        setOpen={setEditOpen}
        dateInput={editDateInput}
        setDateInput={setEditDateInput}
      />
      <DeletePaperDialog paper={selectedPaper} refetch={refetch} open={deleteOpen} setOpen={setDeleteOpen} />
    </TabsContent>
  );
}
