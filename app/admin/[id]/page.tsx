"use client";

import StatCard from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCollectionById } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";
import { Calendar, FileText, ImageIcon, Users } from "lucide-react";
import { ImagesTab } from "./images";
import { PapersTab } from "./papers";
import { ParticipantsTab } from "./participants";

export default function ResearchDetailPage() {
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
