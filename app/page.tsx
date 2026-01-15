import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, BarChart3, Users, MessageCircle, Lock, FileText } from "lucide-react";
import Image from "next/image";
import blackIconUrl from "@/public/black.svg";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        {/* <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Participation Hub</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={blackIconUrl} alt="Logo" className="size-12" />
            <span className="font-semibold text-xl">Participation Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Your Data, Your Control
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              A transparent platform for research participants to view, manage, and understand their data contributions
              in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Join as Participant</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">Why Participation Hub?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We believe in transparent research where participants have full visibility and control over their
                contributions.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="mb-2 p-2 rounded-lg bg-primary/10 w-fit">
                    <BarChart3 className="size-6 text-primary" />
                  </div>
                  <CardTitle>Real-Time Analytics</CardTitle>
                  <CardDescription>
                    View how your data contributes to research findings with interactive visualizations and insights.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 p-2 rounded-lg bg-primary/10 w-fit">
                    <Lock className="size-6 text-primary" />
                  </div>
                  <CardTitle>Consent Management</CardTitle>
                  <CardDescription>
                    Full control over your data permissions. Modify or revoke consent at any time with granular control.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 p-2 rounded-lg bg-primary/10 w-fit">
                    <Shield className="size-6 text-primary" />
                  </div>
                  <CardTitle>Data Security</CardTitle>
                  <CardDescription>
                    Your data is encrypted and stored securely with industry-leading security standards and protocols.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 p-2 rounded-lg bg-primary/10 w-fit">
                    <Users className="size-6 text-primary" />
                  </div>
                  <CardTitle>Transparent Research</CardTitle>
                  <CardDescription>
                    See exactly who is accessing your data and for what purpose with full audit trails.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 p-2 rounded-lg bg-primary/10 w-fit">
                    <MessageCircle className="size-6 text-primary" />
                  </div>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Ask questions about your data and get instant answers from our intelligent chatbot assistant.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 p-2 rounded-lg bg-primary/10 w-fit">
                    <FileText className="size-6 text-primary" />
                  </div>
                  <CardTitle>Research Impact</CardTitle>
                  <CardDescription>
                    View published research papers that used your data and understand your contribution to science.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Ready to Get Started?</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Join thousands of participants who trust us with their research data.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/signup">Create Your Account</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="size-5 text-primary" />
                <span className="font-bold text-foreground">Participation Hub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering research participants with transparency and control.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Data Protection
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2026 Participation Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
