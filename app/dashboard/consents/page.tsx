import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Shield, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ConsentsPage() {
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
          <h1 className="text-2xl font-bold text-foreground">Manage My Consents</h1>
          <p className="text-sm text-muted-foreground">Control your data permissions for each research study</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Alert className="mb-6">
          <Shield className="size-4" />
          <AlertTitle>Your Data, Your Control</AlertTitle>
          <AlertDescription>
            You can update, revoke, or reinstate your consent at any time. Changes take effect immediately.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Mental Health and Well-being Study</CardTitle>
                  <CardDescription className="mt-1">
                    Consent to use your data for mental health research analysis
                  </CardDescription>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="consent-1" className="text-base">
                    Data Usage Consent
                  </Label>
                  <p className="text-sm text-muted-foreground">Allow researchers to analyze your anonymised data</p>
                </div>
                <Switch id="consent-1" defaultChecked />
              </div>
              <div className="flex gap-3">
                <Button variant="outline">View Details</Button>
                <Button variant="destructive">Revoke Consent</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Sleep Patterns Research</CardTitle>
                  <CardDescription className="mt-1">
                    Consent to use your data for sleep and academic performance research
                  </CardDescription>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="consent-2" className="text-base">
                    Data Usage Consent
                  </Label>
                  <p className="text-sm text-muted-foreground">Allow researchers to analyze your anonymised data</p>
                </div>
                <Switch id="consent-2" defaultChecked />
              </div>
              <div className="flex gap-3">
                <Button variant="outline">View Details</Button>
                <Button variant="destructive">Revoke Consent</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Digital Wellbeing Survey</CardTitle>
                  <CardDescription className="mt-1">Consent revoked on October 15, 2023</CardDescription>
                </div>
                <Badge variant="secondary">Revoked</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>
                  Your consent for this study has been revoked. You can reinstate it at any time.
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="consent-3" className="text-base">
                    Data Usage Consent
                  </Label>
                  <p className="text-sm text-muted-foreground">Allow researchers to analyze your anonymised data</p>
                </div>
                <Switch id="consent-3" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline">View Details</Button>
                <Button>Reinstate Consent</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
