import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, MessageCircle, LogOut, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const collections = [
    {
      id: 1,
      title: "Mental Health and Well-being Study",
      description: "Longitudinal study examining factors affecting mental health in university students.",
      // dateCreated: "January 2023",
      dateCreated: new Date("2023-01-15"),
      status: "Active",
      participants: 245,
    },
    {
      id: 2,
      title: "Sleep Patterns Research",
      description: "Investigation of sleep quality and its correlation with academic performance.",
      dateCreated: new Date("2023-03-22"),
      status: "Active",
      participants: 189,
    },
    {
      id: 3,
      title: "Digital Wellbeing Survey",
      description: "Study exploring the impact of social media usage on overall wellbeing.",
      dateCreated: new Date("2023-06-10"),
      status: "Completed",
      participants: 412,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Participation Hub</h1>
            <p className="text-sm text-muted-foreground">Welcome back, Participant</p>
          </div>
          <Button variant="outline" size="sm">
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your research participation and explore your data contributions
          </p>
        </div>

        <div className="mb-8">
          <Card className="border border-primary/20">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Studies</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Studies</p>
                  <p className="text-2xl font-bold text-foreground">156</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-2xl font-bold text-foreground">2023</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-foreground">My Collections</h3>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/collections">View All</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Link href={`/dashboard/collections/${collection.id}`} key={collection.id} className="block">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg leading-tight">{collection.title}</CardTitle>
                      <Badge variant={collection.status === "Active" ? "default" : "secondary"}>
                        {collection.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{collection.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Contributions</span>
                        <span className="font-semibold">{collection.contributions}</span>
                      </div> */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Created</span>
                        </div>
                        <span className="font-semibold">{collection.dateCreated.toLocaleDateString()}</span>
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
      </main>
    </div>
  );
}
