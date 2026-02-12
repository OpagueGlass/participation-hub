"use client";

import StatCard from "@/components/stat-card";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteResearchCollection,
  getCollectionById,
  getResearchParticipant,
  updateResearchDetails,
} from "@/lib/query";
import { useQuery } from "@tanstack/react-query";
import { Edit, FileText, ImageIcon, MoreVertical, SquarePen, Trash2, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ImagesTab } from "./images";
import { PapersTab } from "./papers";
import { ParticipantsTab } from "./participants";

const statusOptions = [
  { key: 1, label: "Active" },
  { key: 2, label: "Completed" },
];

const newResearchSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.number().refine((val) => statusOptions.some((status) => status.key === val), {
    message: "Please select a valid status",
  }),
});

function EditCollectionDialog({
  collection,
  form,
  open,
  setOpen,
  refetch,
}: {
  collection: { id: string };
  form: ReturnType<typeof useForm<z.infer<typeof newResearchSchema>>>;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}) {
  async function onSubmit(data: z.infer<typeof newResearchSchema>) {
    setOpen(false);
    toast.promise(
      updateResearchDetails(collection.id, { title: data.title, description: data.description, status: data.status }),
      {
        loading: "Updating research details...",
        success: (err) => {
          if (err) {
            throw err;
          }
          form.reset();
          refetch();
          return "Research details updated successfully!";
        },
        error: (err) => {
          setOpen(true);
          return `Error updating research details: ${err.message}`;
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] flex flex-col p-0 gap-0">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle>Edit Research Details</DialogTitle>
          <DialogDescription>Edit the details of your research collection.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] flex flex-col w-full px-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-1 pt-4 pb-8">
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
              <Controller
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-[300px]">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value === 0 ? "" : String(field.value)}
                    >
                      <SelectTrigger id="status" className="w-[200px] max-w-[200px]">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.key} value={status.key.toString()}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function DeleteCollectionDialog({
  collection,
  open,
  setOpen,
}: {
  collection: { id: string; title: string };
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const removeResearch = () => {
    setOpen(false);
    toast.promise(deleteResearchCollection(collection.id), {
      loading: "Deleting research collection...",
      success: (error) => {
        if (error) {
          throw error;
        }
        router.push("/admin");
        return "Research collection deleted successfully!";
      },
      error: (error) => {
        setOpen(true);
        return `Failed to delete research collection: ${error.message || "Unknown error"}`;
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-sm ring-foreground/10 ring-1 p-4 rounded-xl outline-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {collection.title}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this collection? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="bg-muted/50 -mx-4 -mb-4 rounded-b-xl border-t p-4">
          <AlertDialogCancel onClick={() => setOpen(false)} size="sm" className="rounded-xl">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={removeResearch} size="sm" className="rounded-xl" variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function ResearchDetailPage() {
  const params = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: collection, refetch } = useQuery({
    queryKey: ["collection", params.id],
    queryFn: () => getCollectionById(params.id as string),
    enabled: !!params.id,
  });

  const { data: participantsData, refetch: refetchParticipants } = useQuery({
    queryKey: ["research-participant", params.id],
    queryFn: () => getResearchParticipant(params.id as string),
    enabled: !!params.id,
  });

  const stats = [
    { title: "Participants", value: collection?.participants ?? 0, icon: Users },
    { title: "Images", value: collection?.images?.length ?? 0, icon: ImageIcon },
    { title: "Papers", value: collection?.papers?.length ?? 0, icon: FileText },
    {
      title: "Created",
      value: new Date(collection?.createdAt ?? "").toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      icon: SquarePen,
    },
  ];

  const tabs = [
    {
      label: "Participants",
      value: "participants",
      content: (index: number) => (
        <ParticipantsTab
          key={index}
          participants={participantsData ?? []}
          collectionId={collection?.id ?? ""}
          refetchParticipants={refetchParticipants}
        />
      ),
    },
    {
      label: "Analytics Images",
      value: "images",
      content: (index: number) => (
        <ImagesTab
          key={index}
          images={collection?.images ?? []}
          collectionId={collection?.id ?? ""}
          refetch={refetch}
        />
      ),
    },
    {
      label: "Research Papers",
      value: "papers",
      content: (index: number) => (
        <PapersTab
          key={index}
          papers={collection?.papers ?? []}
          collectionId={collection?.id ?? ""}
          refetch={refetch}
        />
      ),
    },
  ];

  const form = useForm<z.infer<typeof newResearchSchema>>({
    values: {
      title: collection?.title || "",
      description: collection?.description || "",
      status: collection?.status.id || 0,
    },
  });

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spinner />
      </div>
    );
  }

  const openEditModal = () => {
    form.reset();
    setEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{collection.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={collection!.status?.description === "Active" ? "default" : "secondary"}
              className="shrink-0"
            >
              {collection!.status?.description}
            </Badge>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="size-5 rounded-full">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={openEditModal}>
                  <Edit className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setDeleteOpen(true)}>
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-muted-foreground">{collection.description}</p>
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
      <EditCollectionDialog
        form={form}
        collection={collection}
        open={editOpen}
        setOpen={setEditOpen}
        refetch={refetch}
      />
      <DeleteCollectionDialog collection={collection} open={deleteOpen} setOpen={setDeleteOpen} />
    </div>
  );
}
