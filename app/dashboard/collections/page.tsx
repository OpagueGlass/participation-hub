"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Database, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { getUserCollections } from "@/lib/query";

export default function CollectionsPage() {
  const { session } = useAuth();

  const { data: collectionsData } = useQuery({
    queryKey: ["collections", session?.user.id],
    queryFn: () => getUserCollections(session!.user.id),
    enabled: !!session?.user?.id,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Database className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
          <p className="text-sm text-muted-foreground">Research datasets you've contributed to</p>
        </div>
      </div>

      <div className="space-y-6">
        {collectionsData?.map((collection) => (
          <Link href={`/dashboard/collections/${collection.id}`} key={collection.id} className="block">
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
                <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    <span>Created {collection.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    <span>{collection.participants} participants</span>
                  </div>
                </div>
                <div className="flex">
                  <Button className="pointer-events-none" variant="default">
                    View Details
                  </Button>
                  {/* <Button variant="outline">View Analytics</Button> */}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
