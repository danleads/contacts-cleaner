import { useState, useEffect } from 'react';
import { Contact } from '@/lib/types';
import { sampleContacts } from '@/lib/sample-data';

const STORAGE_KEY = 'sedna-contacts-cleaner';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load contacts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects and ensure recentConnections exists
        const contactsWithDates = parsed.map((contact: any) => ({
          ...contact,
          lastActivity: contact.lastActivity ? new Date(contact.lastActivity) : undefined,
          recentConnections: contact.recentConnections || []
        }));
        setContacts(contactsWithDates);
      } catch (error) {
        console.error('Error loading contacts from localStorage:', error);
        setContacts(sampleContacts);
      }
    } else {
      // Initialize with sample data on first load
      setContacts(sampleContacts);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever contacts change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    }
  }, [contacts, isLoading]);

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(contact =>
      contact.id === id ? { ...contact, ...updates } : contact
    ));
  };

  const deleteContacts = (ids: string[]) => {
    setContacts(prev => {
      const deletedIds = new Set(ids);

      // First, update the related contacts that are NOT being deleted
      const updatedContacts = prev.map(contact => {
        if (deletedIds.has(contact.id)) {
          return contact; // Keep it for now, will filter later
        }

        if (contact.problem?.type === 'Duplicate' && contact.problem.relatedContactIds) {
          const newRelatedIds = contact.problem.relatedContactIds.filter(
            relatedId => !deletedIds.has(relatedId)
          );

          // If the contact no longer has any related duplicates, it's not a problem anymore.
          if (newRelatedIds.length === 0) {
            const { problem, ...rest } = contact;
            return { ...rest, problem: undefined };
          }
          
          // If the list of related IDs has changed, update it.
          if (newRelatedIds.length < contact.problem.relatedContactIds.length) {
            return {
              ...contact,
              problem: { ...contact.problem, relatedContactIds: newRelatedIds },
            };
          }
        }
        
        return contact;
      });

      // Finally, remove the deleted contacts from the list
      return updatedContacts.filter(contact => !deletedIds.has(contact.id));
    });
  };

  const mergeContacts = (primaryId: string, mergedIds: string[], mergedData: Partial<Contact>) => {
    setContacts(prev => {
      // Update the primary contact with merged data
      const updated = prev.map(contact => {
        if (contact.id === primaryId) {
          // Combine all distribution lists from merged contacts
          const allDistributionLists = new Set(contact.distributionLists);
          mergedIds.forEach(id => {
            const mergedContact = prev.find(c => c.id === id);
            if (mergedContact) {
              mergedContact.distributionLists.forEach(list => allDistributionLists.add(list));
            }
          });
          
          return {
            ...contact,
            ...mergedData,
            distributionLists: Array.from(allDistributionLists),
            problem: undefined // Clear the problem since it's resolved
          };
        }
        return contact;
      });
      
      // Remove the merged contacts
      return updated.filter(contact => !mergedIds.includes(contact.id));
    });
  };

  const clearProblems = (ids: string[]) => {
    setContacts(prev => prev.map(contact =>
      ids.includes(contact.id) ? { ...contact, problem: undefined } : contact
    ));
  };

  const resetToSampleData = () => {
    setContacts(sampleContacts);
  };

  const getProblematicContacts = () => {
    return contacts.filter(contact => contact.problem);
  };

  const getCleanContacts = () => {
    return contacts.filter(contact => !contact.problem);
  };

  return {
    contacts,
    problematicContacts: getProblematicContacts(),
    cleanContacts: getCleanContacts(),
    isLoading,
    updateContact,
    deleteContacts,
    mergeContacts,
    clearProblems,
    resetToSampleData
  };
} 