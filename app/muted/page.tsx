"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BellOff, Trash2 } from 'lucide-react';
import { useMuteRules } from '@/hooks/use-mute-rules';
import { useContacts } from '@/hooks/use-contacts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MutedAlertsPage() {
  const { muteRules, removeMuteRule, isLoading: isLoadingRules } = useMuteRules();
  const { contacts, isLoading: isLoadingContacts } = useContacts();

  const getContactById = (id: string) => {
    return contacts.find(contact => contact.id === id);
  };

  const isLoading = isLoadingRules || isLoadingContacts;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Muted Alerts</h1>
            <p className="text-muted-foreground mt-2">
              Review and manage the duplicate alerts you have muted.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Contacts
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Loading muted alerts...</p>
          </div>
        ) : muteRules.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
            <BellOff className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">No Muted Alerts</h2>
            <p>You haven't muted any duplicate alerts yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {muteRules.map(rule => (
              <Card key={rule.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Muted Group</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => removeMuteRule(rule.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Un-mute
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {rule.contactIds.map(contactId => {
                    const contact = getContactById(contactId);
                    return contact ? (
                      <div key={contactId} className="text-sm p-2 rounded-md bg-muted/50">
                        <p className="font-semibold">{contact.name}</p>
                        <p className="text-muted-foreground">{contact.email}</p>
                      </div>
                    ) : null;
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </main>
  );
} 