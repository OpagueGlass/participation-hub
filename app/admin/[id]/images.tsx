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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, ImageIcon, Scroll, Trash2, Upload, UploadIcon, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const uploadImageSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type UploadImageFormData = z.infer<typeof uploadImageSchema>;

function ImagesDialog() {
  const [isDragging, setIsDragging] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const form = useForm<UploadImageFormData>({
    resolver: zodResolver(uploadImageSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

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

  const onSubmit = (data: UploadImageFormData) => {
    if (!selectedFile) {
      setFileError("Please select an image file");
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
      <DialogContent className="sm:max-w-[500px] flex flex-col p-0 gap-0">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle>Upload Analytics Image</DialogTitle>
          <DialogDescription>Add a new visualization to share with participants.</DialogDescription>
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
              {fileError && <FieldError errors={[{ message: fileError }]} />}
            </Field>

            <Field>
              <Button type="submit" className="w-full">
                <UploadIcon className="mr-2" /> Upload Image
              </Button>
            </Field>
          </FieldGroup>
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function ImagesTab() {
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
