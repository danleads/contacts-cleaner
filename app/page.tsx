"use client";

import { useState, useMemo } from 'react';
import { useContacts } from '@/hooks/use-contacts';
import { useMuteRules } from '@/hooks/use-mute-rules';
import { ContactsList } from '@/components/contacts-list';
import { MergeDialog } from '@/components/merge-dialog';
import { EditContactDialog } from '@/components/edit-contact-dialog';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Contact } from '@/lib/types';
import { RefreshCw, CheckCircle2, Bell } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const {
    problematicContacts: allProblematicContacts,
    isLoading,
    updateContact,
    deleteContacts,
    mergeContacts,
    clearProblems,
    resetToSampleData,
  } = useContacts();
  const { muteRules, addMuteRule } = useMuteRules();

  const { toast } = useToast();
  
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showIgnoreConfirm, setShowIgnoreConfirm] = useState(false);

  const problematicContacts = useMemo(() => {
    const mutedContactIds = new Set(muteRules.flatMap(rule => rule.contactIds));
    return allProblematicContacts.filter(contact => !mutedContactIds.has(contact.id));
  }, [allProblematicContacts, muteRules]);

  const handleMerge = (contactIds: string[]) => {
    const contactsToMerge = problematicContacts.filter(c => contactIds.includes(c.id));
    setSelectedContactIds(contactIds);
    setShowMergeDialog(true);
  };

  const handleMergeConfirm = (primaryId: string, mergedIds: string[], mergedData: Partial<Contact>, excludedIds: string[]) => {
    mergeContacts(primaryId, mergedIds, mergedData);
    
    // Remove excluded contacts from the problems list
    if (excludedIds.length > 0) {
      clearProblems(excludedIds);
    }
    
    toast({
      title: "Contacts merged successfully",
      description: `${mergedIds.length + 1} contacts have been merged into one.${excludedIds.length > 0 ? ` ${excludedIds.length} contact(s) marked as reviewed.` : ''}`,
    });
    setShowMergeDialog(false);
    setSelectedContactIds([]);
  };

  const handleDelete = (contactIds: string[]) => {
    setSelectedContactIds(contactIds);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    deleteContacts(selectedContactIds);
    toast({
      title: "Contacts deleted",
      description: `${selectedContactIds.length} contact(s) have been removed.`,
    });
    setShowDeleteConfirm(false);
    setSelectedContactIds([]);
  };

  const handleIgnore = (contactIds: string[]) => {
    setSelectedContactIds(contactIds);
    setShowIgnoreConfirm(true);
  };

  const handleIgnoreConfirm = () => {
    addMuteRule(selectedContactIds);
    toast({
      title: "Alert muted",
      description: "A rule has been created to prevent future duplicate alerts for these contacts.",
    });
    setShowIgnoreConfirm(false);
    setSelectedContactIds([]);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleEditSave = (id: string, updates: Partial<Contact>) => {
    updateContact(id, updates);
    toast({
      title: "Contact updated",
      description: "The email address has been fixed successfully.",
    });
    setEditingContact(null);
  };

  const handleReset = () => {
    resetToSampleData();
    toast({
      title: "Data reset",
      description: "Sample data has been restored.",
    });
  };

  const selectedContactsToMerge = problematicContacts.filter(c => selectedContactIds.includes(c.id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Contacts Cleaner</h1>
              <p className="text-muted-foreground mt-2">
                Maintain a single source of truth for your contacts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/muted">
                  <Bell className="w-4 h-4 mr-2" />
                  View Muted Alerts
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Sample Data
              </Button>
            </div>
          </div>
          
          {problematicContacts.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <h2 className="text-lg font-semibold text-green-900">All Clean!</h2>
                  <p className="text-green-700 mt-1">
                    Your address book is in perfect shape. No duplicates or invalid emails found.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-amber-800">
                  <strong>{problematicContacts.length} contacts</strong> require your attention. 
                  Review and resolve the issues below to maintain a clean address book.
                </p>
              </div>
              
              <ContactsList
                contacts={problematicContacts}
                onMerge={handleMerge}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onIgnore={handleIgnore}
              />
            </>
          )}
        </div>
      </div>

      {/* Merge Dialog */}
      <MergeDialog
        open={showMergeDialog}
        onOpenChange={setShowMergeDialog}
        contacts={selectedContactsToMerge}
        onMerge={handleMergeConfirm}
      />

      {/* Edit Dialog */}
      <EditContactDialog
        open={!!editingContact}
        onOpenChange={(open) => !open && setEditingContact(null)}
        contact={editingContact}
        onSave={handleEditSave}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedContactIds.length} contact(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected contact(s) will be permanently removed 
              from your address book.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showIgnoreConfirm} onOpenChange={setShowIgnoreConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mute this duplicate alert?</AlertDialogTitle>
            <AlertDialogDescription>
              This will prevent these {selectedContactIds.length} contact(s) from being flagged as duplicates of each other in the future. You can reverse this action at any time from the 'Muted Alerts' page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleIgnoreConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </main>
  );
}
