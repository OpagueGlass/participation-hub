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
import { Mail, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

function ParticipantsDialog() {
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
              console.log(emails);
              setOpen(false);
              toast.success(`Invitations sent to ${emails.length} participant${emails.length !== 1 ? "s" : ""}.`);
              setEmails([]);
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

export function ParticipantsTab() {
  const participants = [
    { id: "1", email: "john.doe@example.com", consent: true, joinedAt: "Jan 20, 2023" },
    { id: "2", email: "jane.smith@example.com", consent: true, joinedAt: "Jan 22, 2023" },
    { id: "3", email: "mike.wilson@example.com", consent: false, joinedAt: "-" },
    { id: "4", email: "sarah.jones@example.com", consent: true, joinedAt: "Feb 1, 2023" },
  ];

  return (
    <TabsContent value="participants" className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Manage Participants</CardTitle>
              <CardDescription>View and invite participants to your research study</CardDescription>
            </div>

            <ParticipantsDialog />
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
                    <TableCell className="text-muted-foreground py-3">{participant.joinedAt}</TableCell>
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
