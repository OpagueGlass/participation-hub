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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { addImageToCollection, CollectionImage, deleteImageFromCollection, updateImageInCollection } from "@/lib/query";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { StorageError } from "@supabase/storage-js";
import { PostgrestError } from "@supabase/supabase-js";
import {
  Edit,
  ImageIcon,
  ImagePlus,
  MoreVertical,
  Trash2,
  Upload,
  UploadIcon,
  X
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const uploadImageSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type UploadImageFormData = z.infer<typeof uploadImageSchema>;

const imageDialogMode = [
  {
    title: "Upload Analytics Image",
    description: "Add a new visualization to the collection",
    buttonText: "Upload Image",
    toastText: {
      loading: "Uploading image...",
      success: "Image uploaded successfully!",
      error: ({ message }: { message: string }) => `Failed to upload image: ${message || "Unknown error"}`,
    },
  },
  {
    title: "Edit Analytics Image",
    description: "Update the visualization details",
    buttonText: "Update Image",
    toastText: {
      loading: "Updating image...",
      success: "Image updated successfully!",
      error: ({ message }: { message: string }) => `Failed to update image: ${message || "Unknown error"}`,
    },
  },
] as const;

function ImageDialog({
  open,
  setOpen,
  preview,
  setPreview,
  refetch,
  imagePromise,
  image,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  preview: string | null;
  setPreview: (preview: string | null) => void;
  refetch: () => void;
  imagePromise: (data: UploadImageFormData, selectedFile: File) => Promise<StorageError | PostgrestError | null>;
  image?: CollectionImage;
}) {
  const mode = imageDialogMode[image ? 1 : 0];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<UploadImageFormData>({
    resolver: zodResolver(uploadImageSchema),
    values: {
      title: image?.title || "",
      description: image?.description || "",
    },
  });

  const onSubmit = (data: UploadImageFormData) => {
    if ((!selectedFile && !image) || preview === null) {
      setFileError("Please select an image file");
      return;
    }
    setOpen(false);
    toast.promise(imagePromise(data, selectedFile!), {
      loading: mode.toastText.loading,
      success: (error) => {
        if (error) {
          throw error;
        }
        form.reset();
        setSelectedFile(null);
        setPreview(null);
        refetch();
        return mode.toastText.success;
      },
      error: (error) => {
        setOpen(true);
        return mode.toastText.error(error);
      },
    });
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setFileError(null);
      } else {
        setFileError("Please upload an image file");
      }
    }
  };

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
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e.target.files);

  const removeSelectedFile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreview(null);
  };

  const onOpenChange = () => {
    setFileError(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] flex flex-col p-0 gap-0">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle>{mode.title}</DialogTitle>
          <DialogDescription>{mode.description}</DialogDescription>
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
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        className="absolute top-1 right-1 size-6"
                        onClick={removeSelectedFile}
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
                {fileError && <FieldError errors={[{ message: fileError }]} />}
              </Field>

              <Field>
                <Button type="submit" className="w-full">
                  <UploadIcon className="mr-2" /> {mode.buttonText}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AddImageDialog({
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
  const [preview, setPreview] = useState<string | null>(null);

  const addImagePromise = (data: UploadImageFormData, selectedFile: File) =>
    addImageToCollection(collectionId, {
      title: data.title,
      description: data.description,
      imageFile: selectedFile,
    });

  return (
    <ImageDialog
      open={open}
      setOpen={setOpen}
      preview={preview}
      setPreview={setPreview}
      refetch={refetch}
      imagePromise={addImagePromise}
    />
  );
}

function EditImageDialog({
  open,
  setOpen,
  preview,
  setPreview,
  refetch,
  image,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  preview: string | null;
  setPreview: (preview: string | null) => void;
  refetch: () => void;
  image: CollectionImage | null;
}) {
  if (!image) {
    return null;
  }

  const editImagePromise = (data: UploadImageFormData, selectedFile: File) =>
    updateImageInCollection(image, {
      title: data.title,
      description: data.description,
      imageFile: selectedFile || undefined,
    });

  return (
    <ImageDialog
      open={open}
      setOpen={setOpen}
      refetch={refetch}
      preview={preview}
      setPreview={setPreview}
      imagePromise={editImagePromise}
      image={image}
    />
  );
}

function DeleteImageDialog({
  image,
  open,
  setOpen,
  refetch,
}: {
  image: CollectionImage | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}) {
  if (!image) {
    return null;
  }

  const removeImage = () => {
    setOpen(false);
    toast.promise(deleteImageFromCollection(image), {
      loading: "Deleting image...",
      success: (error) => {
        if (error) {
          throw error;
        }
        refetch();
        return "Image deleted successfully!";
      },
      error: (error) => {
        setOpen(true);
        return `Failed to delete image: ${error.message || "Unknown error"}`;
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-sm ring-foreground/10 ring-1 p-4 rounded-xl outline-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {image.title}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this image? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="bg-muted/50 -mx-4 -mb-4 rounded-b-xl border-t p-4">
          <AlertDialogCancel onClick={() => setOpen(false)} size="sm" className="rounded-xl">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={removeImage} size="sm" className="rounded-xl" variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ImagesTab({
  images,
  collectionId,
  refetch,
}: {
  images: CollectionImage[];
  collectionId: string;
  refetch: () => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<CollectionImage | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);

  const openAddModal = () => {
    setSelectedImage(null);
    setAddOpen(true);
  };

  const openEditModal = (image: CollectionImage) => (e: Event) => {
    e.preventDefault();
    setSelectedImage(image);
    setEditPreview(image.url);
    setEditOpen(true);
  };

  const openDeleteModal = (image: CollectionImage) => (e: Event) => {
    e.preventDefault();
    setSelectedImage(image);
    setDeleteOpen(true);
  };

  return (
    <TabsContent value="images" className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Analytics Images</CardTitle>
              <CardDescription>Upload and manage analytics visualizations for participants.</CardDescription>
            </div>
            <Button onClick={openAddModal}>
              <ImagePlus className="mr-2 size-4" />
              Upload Image
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {images.length > 0 ?
          (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <Card key={image.id} className="py-0 gap-0">
                  {/* <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center"> */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/30 bg-muted/10 max-h-[500px]">
                    {/* <ImageIcon className="size-12 text-muted-foreground" /> */}
                    <ImageZoom className="h-full" zoomMargin={48}>
                      <div className="absolute w-full h-full">
                        <Image src={image.url} alt={image.title} fill priority unoptimized />
                      </div>
                    </ImageZoom>
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{image.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{image.description}</p>
                      </div>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="size-5 rounded-full">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={openEditModal(image)}>
                            <Edit className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={openDeleteModal(image)}>
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {/* <p className="text-xs text-muted-foreground mt-2">Uploaded: {image.uploadedAt}</p> */}
                  </CardContent>
                </Card>
              ))}
            </div>)
             : (
              <Empty className="border border-border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ImageIcon className="size-8 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>No Visualisations</EmptyTitle>
                  <EmptyDescription>
                    Visualisations using data from this study will appear here once available.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )
          }
        </CardContent>
      </Card>
      <AddImageDialog collectionId={collectionId} open={addOpen} setOpen={setAddOpen} refetch={refetch} />
      <EditImageDialog
        open={editOpen}
        setOpen={setEditOpen}
        image={selectedImage}
        preview={editPreview}
        setPreview={setEditPreview}
        refetch={refetch}
      />
      <DeleteImageDialog image={selectedImage} open={deleteOpen} setOpen={setDeleteOpen} refetch={refetch} />
    </TabsContent>
  );
}
