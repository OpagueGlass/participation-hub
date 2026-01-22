"use client";

import { DatePickerInput } from "@/components/date-picker";
import StatCard from "@/components/stat-card";
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
import { InputTags } from "@/components/ui/input-tags";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getCollectionById, ResearchPaper } from "@/lib/query";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  BookMarked,
  Calendar,
  Edit,
  ExternalLink,
  FileText,
  ImageIcon,
  Mail,
  Plus,
  Trash2,
  Upload,
  UploadIcon,
  Users,
  X
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const uploadImageSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  image: z.instanceof(File).optional(),
});

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

type UploadImageFormData = z.infer<typeof uploadImageSchema>;

function ParticipantsDialog() {
  const [emails, setEmails] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Participants</DialogTitle>
          <DialogDescription>Add email addresses to send invitations to new participants.</DialogDescription>
        </DialogHeader>
        <InputTags
          value={emails}
          onChange={setEmails}
          schema={z.email({ message: "Invalid email address" })}
          description="Enter one or more email addresses, separated by commas"
        />
        <div className="flex items-center justify-between gap-4 mt-2">
          <Button variant="outline" onClick={() => setEmails([])}>
            <X className="mr-2 size-4" />
            Reset
          </Button>
          <Button
            className="flex-1"
            disabled={emails.length === 0}
            onClick={() => {
              console.log(emails);
              setOpen(false);
              toast.success(`Invitations sent to ${emails.length} participant${emails.length !== 1 ? "s" : ""}.`);
              setEmails([]);
            }}
          >
            <Mail className="mr-2 size-4" />
            Send Invitations ({emails.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ImagesDialog() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<UploadImageFormData>({
    resolver: zodResolver(uploadImageSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Please upload an image file");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Please upload an image file");
      }
    }
  };

  const onSubmit = (data: UploadImageFormData) => {
    if (!selectedFile) {
      setError("Please select an image file");
      return;
    }
    form.reset();
    setSelectedFile(null);
    setPreview(null);
    setOpen(false);
    console.log("Form data:", data);
    console.log("Selected file:", selectedFile);
    toast.success("Image uploaded successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 size-4" />
          Upload Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Analytics Image</DialogTitle>
          <DialogDescription>Add a new visualization to share with participants.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input {...field} id="title" type="text" placeholder="Enter image title" required />
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
                    required
                    placeholder="Describe what this visualization shows..."
                    rows={5}
                    maxLength={500}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <FieldLabel>Image File</FieldLabel>
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                  isDragging ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                  "aspect-video p-4",
                )}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {preview ? (
                  <div className="relative w-full h-full">
                    <Button
                      size="icon-sm"
                      variant="outline"
                      className="absolute top-1 right-1 size-6"
                      onClick={(e) => {
                        e.stopPropagation();

                        setSelectedFile(null);
                        setPreview(null);
                      }}
                    >
                      <X />
                    </Button>
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto object-contain rounded-md" />
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto size-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {isDragging ? "Drop image here" : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground">Image should have a 16:9 aspect ratio</p>
                  </div>
                )}
                <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              </div>
            </Field>

            <Field>
              <Button type="submit" className="w-full">
                <UploadIcon className="mr-2" /> Upload Image
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PapersDialog() {
  const [value, setValue] = useState("");

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

  function onSubmit(data: z.infer<typeof researchPaperSchema>) {
    form.reset();
    setValue("");
    toast.success("Research paper added successfully!");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" />
          Add Paper
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] flex flex-col px-6 pl-5 pr-0.5">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add Research Paper</DialogTitle>
          <DialogDescription>Add details about a published paper from this research</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full ">
          <form onSubmit={form.handleSubmit(onSubmit)} className="pl-1 pr-5.5">
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

function ParticipantsTab() {
  const participants = [
    { id: "1", email: "john.doe@example.com", consent: true, joinedAt: "Jan 20, 2023" },
    { id: "2", email: "jane.smith@example.com", consent: true, joinedAt: "Jan 22, 2023" },
    { id: "3", email: "mike.wilson@example.com", consent: false, joinedAt: "-" },
    { id: "4", email: "sarah.jones@example.com", consent: true, joinedAt: "Feb 1, 2023" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <TabsContent value="participants" className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Manage Participants</CardTitle>
              <CardDescription>View and invite participants to your research study</CardDescription>
            </div>

            <ParticipantsDialog />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md">
            <Table className="space-y-3">
              <TableHeader>
                <TableRow className="hover:bg-muted/40">
                  <TableHead className="font-semibold py-3">Email</TableHead>
                  <TableHead className="font-semibold py-3">Consent</TableHead>
                  <TableHead className="font-semibold py-3">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant, index) => (
                  <TableRow
                    key={participant.id}
                    className={`${index % 2 === 1 && "bg-muted/40"} hover:bg-muted/60 transition-colors`}
                  >
                    <TableCell className="font-medium py-3">{participant.email}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant={participant.consent ? "default" : "outline"}>
                        {participant.consent ? "Agreed" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-3">{participant.joinedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

function ImagesTab() {
  const images = [
    {
      id: "1",
      title: "Response Rate Trends",
      description: "Monthly response rates over 6 months",
      uploadedAt: "Mar 15, 2024",
    },
    {
      id: "2",
      title: "Data Quality Metrics",
      description: "Quality assessment scores by category",
      uploadedAt: "Mar 20, 2024",
    },
    {
      id: "3",
      title: "Engagement Heatmap",
      description: "Participant activity patterns by day and time",
      uploadedAt: "Apr 1, 2024",
    },
  ];

  return (
    <TabsContent value="images" className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Analytics Images</CardTitle>
              <CardDescription>Upload and manage analytics visualizations for participants.</CardDescription>
            </div>
            <ImagesDialog />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <Card key={image.id}>
                <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                  <ImageIcon className="size-12 text-muted-foreground" />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold">{image.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{image.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">Uploaded: {image.uploadedAt}</p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="mr-2 size-3" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

function PapersTab({ papers }: { papers: ResearchPaper[] }) {
  return (
    <TabsContent value="papers" className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Research Papers</CardTitle>
              <CardDescription>Add and manage published papers from this research study.</CardDescription>
            </div>
            <PapersDialog />
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

export default function ResearchDetailPage({ params }: { params: { id: string } }) {
  const research = {
    id: 1,
    title: "Mental Health and Well-being Study",
    description:
      "Longitudinal study examining factors affecting mental health in university students. This research aims to identify key predictors of mental well-being and develop targeted intervention strategies.",
    status: "Active",
    createdAt: "Jan 15, 2023",
    participants: [
      { id: "1", email: "john.doe@example.com", status: "Active", joinedAt: "Jan 20, 2023" },
      { id: "2", email: "jane.smith@example.com", status: "Active", joinedAt: "Jan 22, 2023" },
      { id: "3", email: "mike.wilson@example.com", status: "Pending", joinedAt: "-" },
      { id: "4", email: "sarah.jones@example.com", status: "Active", joinedAt: "Feb 1, 2023" },
    ],
  };

  const { data: collection } = useQuery({
    queryKey: ["collection", "99a71746-36b2-4def-a737-04562f741a24"],
    queryFn: () => getCollectionById("99a71746-36b2-4def-a737-04562f741a24"),
  });

  const stats = [
    { title: "Participants", value: research.participants.length, icon: Users },
    { title: "Images", value: 3, icon: ImageIcon },
    { title: "Papers", value: collection?.papers?.length ?? 0, icon: FileText },
    { title: "Created", value: research.createdAt, icon: Calendar },
  ];

  const tabs = [
    {
      label: "Participants",
      value: "participants",
      content: (index: number) => <ParticipantsTab key={index} />,
    },
    {
      label: "Analytics Images",
      value: "images",
      content: (index: number) => <ImagesTab key={index} />,
    },
    {
      label: "Research Papers",
      value: "papers",
      content: (index: number) => <PapersTab key={index} papers={collection?.papers ?? []} />,
    },
  ];

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{collection!.title}</h1>
            <p className="text-muted-foreground">{collection!.description}</p>
          </div>
          <Badge variant={collection!.status?.description === "Active" ? "default" : "secondary"} className="shrink-0">
            {collection!.status?.description}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      <Tabs defaultValue={tabs[0].value} className="space-y-6">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab, index) => tab.content(index))}
      </Tabs>
    </div>
  );
}
