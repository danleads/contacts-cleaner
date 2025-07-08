"use client";

import { useState } from 'react';
import { useContacts } from '@/hooks/use-contacts';
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
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const {
    problematicContacts,
    isLoading,
    updateContact,
    deleteContacts,
    mergeContacts,
    clearProblems,
    resetToSampleData,
  } = useContacts();

  const { toast } = useToast();
  
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Sample Data
            </Button>
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

      <Toaster />
    </main>
  );
}
