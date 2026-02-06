"use client";
import StatCard from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { getQuickStats, getUserCollections } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";
import {
  BookCheck,
  BookText,
  CircleUser,
  MessageCircle,
  Shield,
  SquarePen,
  Users
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { session } = useAuth();

  const { data: collectionsData } = useQuery({
    queryKey: ["collections", session?.user.id],
    queryFn: () => getUserCollections(session!.user.id, 3),
    enabled: !!session?.user?.id,
  });

  const { data: quickStats } = useQuery({
    queryKey: ["quick-stats", session?.user.id],
    queryFn: () => getQuickStats(session!.user.id),
    enabled: !!session?.user?.id,
  });

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage your research participation and explore your data contributions</p>
      </div>

      <div>
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr]">
          <StatCard title="Active Studies" value={quickStats?.activeCollections || 0} icon={BookText} />
          <StatCard title="Total Studies" value={quickStats?.totalCollections || 0} icon={BookCheck} />
          <StatCard
            title="Member Since"
            value={new Date(session!.user.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
            icon={CircleUser}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">My Collections</h2>
          <Button variant="outline" asChild>
            <Link href="/dashboard/collections">View All</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collectionsData?.map((collection) => (
            <Link href={`/dashboard/collections/${collection.id}`} key={collection.id} className="block h-full">
              <Card className="hover:shadow-lg hover:bg-muted/50 transition-shadow h-full flex flex-col">
                <CardHeader className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg leading-tight">{collection.title}</CardTitle>
                    <Badge variant={collection.status.description === "Active" ? "default" : "secondary"}>
                      {collection.status.description}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{collection.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col flex-1 justify-end">
                  <div className="space-y-4">
                    {/* <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Contributions</span>
                        <span className="font-semibold">{collection.contributions}</span>
                      </div> */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <SquarePen className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Created</span>
                      </div>
                      <span className="font-semibold">{collection.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Participants</span>
                      </div>
                      <span className="font-semibold">{collection.participants}</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                          <Users className="size-4" />
                          <span>{collection.participants} participants</span>
                        </div> */}
                    <Button className="w-full pointer-events-none">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/consents">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="size-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">Manage Consents</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Control your data permissions</p>
                <Button className="w-full bg-transparent pointer-events-none" variant="outline">
                  Manage
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/feedback">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MessageCircle className="size-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">Feedback</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Share your thoughts</p>
                <Button className="w-full bg-transparent pointer-events-none" variant="outline">
                  Submit
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
