"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, ImageIcon, Plus, Search, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getResearcherCollections } from "@/lib/query";
import { useQuery
 } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function ResearchListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(statusOptions[0].value);
  const { session } = useAuth();

  const {data: collectionsData} = useQuery({
    queryKey: ['researcher-collections'],
    queryFn: () => getResearcherCollections(session!.user.id),
    enabled: !!session?.user?.id,
  });

  const researchStudies = collectionsData || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Research</h1>
          <p className="text-muted-foreground">Manage your research studies and participants</p>
        </div>
        <Button asChild>
          <Link href="/admin/create">
            <Plus className="mr-2 size-4" />
            Create Research
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search research studies..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select defaultValue={statusOptions[0].value} onValueChange={(value) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {researchStudies
          .filter(
            (collection) =>
              collection.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (statusFilter === statusOptions[0].value ||
                collection.status.description.toLowerCase() === statusFilter),
          )
          .map((collection) => (
            <Link href={`/admin/${collection.id}`} key={collection.id} className="block">
              <Card className="gap-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{collection.title}</CardTitle>
                      <CardDescription className="text-base">{collection.description.split(". ")[0]}</CardDescription>
                    </div>
                    <Badge variant={collection.status.description === "Active" ? "default" : "secondary"}>
                      {collection.status.description}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-6 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="size-4" />
                      <span>{collection.participants} participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="size-4" />
                      <span>{collection.images} images</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="size-4" />
                      <span>{collection.papers} papers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <span>Created {collection.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex">
                    <Button className="pointer-events-none" variant="default">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
