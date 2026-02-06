"use client";

import StatCard from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCollectionById, getResearchParticipant } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";
import { FileText, ImageIcon, SquarePen, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { ImagesTab } from "./images";
import { PapersTab } from "./papers";
import { ParticipantsTab } from "./participants";

export default function ResearchDetailPage() {
  const params = useParams();

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
    { title: "Participants", value: participantsData?.length ?? 0, icon: Users },
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
          </div>
          <Badge variant={collection!.status?.description === "Active" ? "default" : "secondary"} className="shrink-0">
            {collection!.status?.description}
          </Badge>
        </div>
        <p className="text-muted-foreground">{collection!.description}</p>
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
