"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ArrowLeft,
  BookMarked,
  Calendar,
  CheckCircle,
  ImageIcon,
  Shield,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

interface AnalyticsImage {
  id: number;
  title: string;
  url: string;
  description: string;
}

interface ResearchPaper {
  id: number;
  title: string;
  authors: string;
  journal: string;
  description: string;
  publicationDate: Date;
  link: string;
}

/**
 * Creates a statistic card
 */
function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle>{title}</CardTitle>
          </div>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="space-y-2 pt-4 pb-2">
          <div className="text-2xl font-semibold tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function AnalyticsTab({
  analyticsImages,
  researchPapers,
}: {
  analyticsImages: AnalyticsImage[];
  researchPapers: ResearchPaper[];
}) {
  return (
    <TabsContent value="analytics" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Visualizations</CardTitle>
          <CardDescription>Uploaded charts and graphs showing your participation data</CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsImages.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {analyticsImages.map((image) => (
                  <CarouselItem key={image.id}>
                    <div className="space-y-3 lg:px-16">
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/30 bg-muted/10 max-h-[500px]">
                        <ImageZoom className="h-full" zoomMargin={48}>
                          <Image src={image.url} alt={image.title} fill objectFit="contain" priority unoptimized />
                        </ImageZoom>
                      </div>
                    </div>
                    <div className="space-y-1 mt-4">
                      <h4 className="font-semibold">{image.title}</h4>
                      <p className="text-sm text-muted-foreground">{image.description}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <Empty className="border border-border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageIcon />
                </EmptyMedia>
                <EmptyTitle>No Analytics Available</EmptyTitle>
                <EmptyDescription>
                  Analytics visualizations will appear here once the research team uploads them.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Published Research</CardTitle>
          <CardDescription>Academic publications using data from this study</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            {researchPapers.length > 0 ? (
              researchPapers.map((paper) => (
                <Link
                  key={paper.id}
                  href={paper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <div className="flex flex-row items-center mb-1 gap-2 justify-between align-top">
                    <h4 className="font-semibold">{paper.title}</h4>
                    <Badge variant="secondary" className="text-xs align-top">
                      {paper.publicationDate.toLocaleDateString([], {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-0.5 font-semibold">{paper.authors}</p>
                  <p className="text-xs text-muted-foreground mb-2 italic">{paper.journal}</p>
                  <p className="text-sm text-muted-foreground mb-3">{paper.description}</p>

                  <Button size="sm" className="pointer-events-none">
                    Read Full Paper
                  </Button>
                </Link>
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

      {/* 
      <Card>
        <CardHeader>
          <CardTitle>Participation Analytics</CardTitle>
          <CardDescription>Visualizations and insights from your contributions to this study</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-semibold">87%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "87%" }} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Survey Responses</p>
              <p className="text-3xl font-bold">42</p>
              <p className="text-xs text-muted-foreground">Out of 48 scheduled</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Data Points Collected</p>
              <p className="text-3xl font-bold">1,247</p>
              <p className="text-xs text-muted-foreground">Across all responses</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Key Insights</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Your response rate is above the study average (78%)</li>
              <li>• Most active participation period: March 2024</li>
              <li>• Consistent engagement over the past 6 months</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anonymized Study Results</CardTitle>
          <CardDescription>Aggregated findings from all participants in this study</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold mb-2">Preliminary Findings</h4>
              <p className="text-sm text-muted-foreground">
                Early analysis suggests a strong correlation between sleep quality and reported well-being scores. Full
                results will be published upon study completion.
              </p>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              View Full Report (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </TabsContent>
  );
}

function ConsentTab() {
  return (
    <TabsContent value="consent" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Consent Status</CardTitle>
          <CardDescription>Manage your data sharing permissions for this collection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="size-5 text-green-600" />
              <div>
                <p className="font-semibold">Data Collection Consent</p>
                <p className="text-sm text-muted-foreground">Active since January 15, 2023</p>
              </div>
            </div>
            <Badge variant="default">Active</Badge>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Consent Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 shrink-0" />
                <p>Permission to collect survey responses</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 shrink-0" />
                <p>Permission to use anonymized data in publications</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 shrink-0" />
                <p>Permission to store data for up to 5 years</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Shield className="mr-2 size-4" />
              View Full Consent Form
            </Button>
            <Button variant="destructive" className="flex-1">
              <XCircle className="mr-2 size-4" />
              Revoke Consent
            </Button>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Note: Revoking consent will stop future data collection but will not delete previously collected data.
              Contact the research team to request data deletion.
            </p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default function CollectionDetailPage() {
  // Mock collection data
  const params = useParams();
  const collection = {
    id: params.id,
    title: "Mental Health and Well-being Study",
    description: "Longitudinal study examining factors affecting mental health in university students.",
    dateCreated: new Date("2023-01-15"),
    status: "Active",
    participants: 245,
    contributions: 52,
    lastActivity: "2 days ago",
  };

  const researchPapers = [
    {
      id: 1,
      title: "Depressive Symptoms and Cognitive Decline",
      authors: "Johar, H., Schaefer, A., Su, T.T.",
      description:
        "Depressive symptoms mediate the longitudinal association between diabetes and subjective cognitive decline.",
      journal: "Preventive Medicine",
      publicationDate: new Date("2023-05-10"),
      link: "https://example.com/depressive-symptoms-cognitive-decline",
    },
    {
      id: 2,
      title: "Multimorbidity in Southeast Asia",
      authors: "Tan, M.M.C., Prina, A.M., Muniz-Terrera, G., Mohan, D., Ismail, R., et. al.",
      description:
        "Prevalence of and factors associated with multimorbidity among 18,101 adults in the South East Asia Community Observatory.",
      journal: "BMJ Open",
      publicationDate: new Date("2022-11-15"),
      link: "https://example.com/multimorbidity-southeast-asia",
    },
    {
      id: 3,
      title: "Mental Distress and Hypertension Care",
      authors: "Ang, C.W., Tan, M.M., Bärnighausen, T., Reininghaus, U., Reidpath, D., Su, T.T.",
      description: "Mental distress along the cascade of care in managing hypertension.",
      journal: "Scientific Reports",
      publicationDate: new Date("2022-08-20"),
      link: "https://example.com/mental-distress-hypertension-care",
    },
    {
      id: 4,
      title: "Hypertension Care in Asia",
      authors: "Geldsetzer, P., Tan, M.M., Dewi, F.ST., Quyen, B.T.T., Juvekar, S., et al.",
      description: "A comparative study of hypertension care across multiple countries.",
      journal: "Bulletin of the World Health Organization",
      publicationDate: new Date("2022-03-30"),
      link: "https://example.com/hypertension-care-asia",
    },
    {
      id: 5,
      title: "Diabetes Treatment and Mental Illness",
      authors:
        "Thangiah, G., Johar, H., Ismail, R., Reininghaus, U., Bärnighausen, T., Thurairajasingam, S., Reidpath, D., Su, T.T.",
      description:
        "Diabetes treatment and mental illness: A call for an integrated health care system in underserved semi-rural Malaysia.",
      journal: "International Journal of Environmental Research and Public Health",
      publicationDate: new Date("2022-01-25"),
      link: "https://example.com/diabetes-treatment-mental-illness",
    },
    {
      id: 6,
      title: "Religiousness and Quality of Life",
      authors: "Tan, M.M., Reidpath, D.D., Ting, R.S-K., Allotey, P., Su, T.T.",
      description:
        "Religiousness and quality of life among older adults of different ethnic groups in Malaysia: A five-year follow-up study.",
      journal: "Journal of Religion and Health",
      publicationDate: new Date("2021-09-10"),
      link: "https://example.com/religiousness-quality-of-life",
    },
    {
      id: 7,
      title: "Income Inequality and Quality of Life",
      authors: "Thangiah, G., Said, M.A., Majid, H.A., Reidpath, D., Su, T.T.",
      description:
        "Income inequality in quality of life among rural communities in Malaysia: A case for immediate policy consideration.",
      journal: "International Journal of Environmental Research and Public Health, 17(23)",
      publicationDate: new Date("2020-12-05"),
      link: "https://example.com/income-inequality-quality-of-life",
    },
  ];

  const analyticsImages = [
    {
      id: 1,
      title: "Response Rate Trends",
      url: "/1.png",
      description: "Your participation trends over the past 6 months",
    },
    {
      id: 2,
      title: "Data Quality Metrics",
      url: "/2.png",
      description: "Quality assessment of your submitted data",
    },
    {
      id: 3,
      title: "Engagement Patterns",
      url: "/3.webp",
      description: "Your most active participation times",
    },
  ];

  const tabs = [
    {
      value: "analytics",
      label: "Analytics",
      content: (index: number) => (
        <AnalyticsTab analyticsImages={analyticsImages} researchPapers={researchPapers} key={index} />
      ),
    },
    { value: "consent", label: "Consent", content: (index: number) => <ConsentTab key={index} /> },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">{collection.title}</h1>
              <p className="text-sm text-muted-foreground">{collection.description}</p>
            </div>
            <Badge variant={collection.status === "Active" ? "default" : "secondary"}>{collection.status}</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-[1.5fr_1fr] mb-8">
          <StatCard title="Total Participants" value={collection.participants} icon={Users} />
          {/* <StatCard title="Your Contributions" value={collection.contributions} icon={Activity} /> */}
          <StatCard
            title="Created"
            value={collection.dateCreated.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            
            icon={Calendar}
          />

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collection.participants}</div>
            </CardContent>
          </Card> */}
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Contributions</CardTitle>
              <Activity className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collection.contributions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created</CardTitle>
              <Calendar className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collection.dateCreated}</div>
            </CardContent>
          </Card> */}
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
      </main>
    </div>
  );
}
