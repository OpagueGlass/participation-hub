import { Badge } from "@/components/ui/badge";
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
import { InputTags } from "@/components/ui/input-tags";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { inviteParticipantsToCollection } from "@/lib/query";
import { Mail, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { FunctionsHttpError } from "@supabase/supabase-js";

function ParticipantsDialog({ collectionId }: { collectionId: string }) {
  const [emails, setEmails] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] flex flex-col p-0 gap-0 px-6 py-6">
        <DialogHeader className="pb-4">
          <DialogTitle>Invite Participants</DialogTitle>
          <DialogDescription>Add email addresses to send invitations to new participants</DialogDescription>
        </DialogHeader>
        <InputTags
          value={emails}
          onChange={setEmails}
          schema={z.email({ message: "Invalid email address" })}
          description="Enter one or more email addresses, separated by commas"
        />
        <div className="flex items-center justify-between gap-4 mt-4">
          <Button variant="outline" onClick={() => setEmails([])}>
            <X className="mr-2 size-4" />
            Reset
          </Button>
          <Button
            className="flex-10"
            disabled={emails.length === 0}
            onClick={() => {
              setOpen(false);
              toast.promise(inviteParticipantsToCollection(collectionId, emails), {
                loading: "Sending invitations...",
                success: (res) => {
                  if (res.error) {
                    throw res;
                  }
                  setEmails([]);
                  return `Invitations sent to ${res.data.count} participant${res.data.count !== 1 ? "s" : ""}.`;
                },
                error: async (res) => {
                  setOpen(true);
                  if (res.error instanceof FunctionsHttpError) {
                    const error = await res.error.context.json();
                    return `Error sending invitations: ${error.message || "Unknown error"}`;
                  } else {
                    return `Error sending invitations: ${res.error?.message || "Unknown error"}`;
                  }
                },
              });
            }}
          >
            <Mail className="mr-2 size-4" />
            Send Invitations ({emails.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ParticipantsTab({
  participants,
  collectionId,
}: {
  participants: { id: number; email: string; consent: boolean; joinedAt: Date }[];
  collectionId: string;
}) {
  return (
    <TabsContent value="participants" className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Manage Participants</CardTitle>
              <CardDescription>View and invite participants to your research study</CardDescription>
            </div>

            <ParticipantsDialog collectionId={collectionId} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md">
            <Table className="space-y-3">
              <TableHeader>
                <TableRow className="hover:bg-muted/40">
                  <TableHead className="font-semibold py-3">Email</TableHead>
                  <TableHead className="font-semibold py-3">Consent</TableHead>
                  <TableHead className="font-semibold py-3">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant, index) => (
                  <TableRow
                    key={participant.id}
                    className={`${index % 2 === 1 && "bg-muted/40"} hover:bg-muted/60 transition-colors`}
                  >
                    <TableCell className="font-medium py-3">{participant.email}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant={participant.consent ? "default" : "outline"}>
                        {participant.consent ? "Agreed" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-3">
                      {participant.joinedAt.toLocaleDateString("en-GB")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
