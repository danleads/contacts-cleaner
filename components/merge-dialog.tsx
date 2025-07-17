"use client";

import { useState, useEffect, useCallback } from 'react';
import { Contact } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Sub-component for single-choice fields
function FieldRadioGroup({
  label,
  options,
  selectedValue,
  onValueChange,
}: {
  label: string;
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">{label}</Label>
      <RadioGroup
        value={selectedValue}
        onValueChange={onValueChange}
        className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2"
      >
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors",
              selectedValue === option ? "bg-primary/10" : "hover:bg-muted/50"
            )}
          >
            <RadioGroupItem value={option} id={`${label}-${option}`} />
            <span className="text-sm truncate">{option}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

// Sub-component for multi-choice fields
function FieldCheckboxGroup({
  label,
  options,
  selectedValues,
  onToggle,
}: {
  label: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">{label}</Label>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors",
              selectedValues.includes(option) ? "bg-primary/10" : "hover:bg-muted/50"
            )}
          >
            <Checkbox
              checked={selectedValues.includes(option)}
              onCheckedChange={() => onToggle(option)}
            />
            <span className="text-sm truncate">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

interface MergeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: Contact[];
  onMerge: (primaryId: string, mergedIds: string[], mergedData: Partial<Contact>, excludedIds: string[]) => void;
}

export function MergeDialog({
  open,
  onOpenChange,
  contacts,
  onMerge,
}: MergeDialogProps) {
  const [includedContacts, setIncludedContacts] = useState<Set<string>>(new Set());
  const [selectedValues, setSelectedValues] = useState<{
    name: string;
    email: string[];
    company: string;
    jobTitle: string;
    phone: string[];
  }>({
    name: '',
    email: [],
    company: '',
    jobTitle: '',
    phone: [],
  });

  const getUniqueValues = useCallback((field: keyof Contact) => {
    const valueSet = new Set<string>();
    contacts.forEach(contact => {
      if (includedContacts.has(contact.id)) {
        const value = contact[field];
        if (value && typeof value === 'string') {
          valueSet.add(value);
        }
      }
    });
    return Array.from(valueSet);
  }, [contacts, includedContacts]);

  // Initialize when dialog opens
  useEffect(() => {
    if (open && contacts.length > 0) {
      const allContactIds = new Set(contacts.map(c => c.id));
      setIncludedContacts(allContactIds);
    }
  }, [open, contacts]);

  // Update choices and default selections when included contacts change
  useEffect(() => {
    if (open) {
      const uniqueNames = getUniqueValues('name');
      const uniqueEmails = getUniqueValues('email');
      const uniqueCompanies = getUniqueValues('company');
      const uniqueJobTitles = getUniqueValues('jobTitle');
      const uniquePhones = getUniqueValues('phone');

      setSelectedValues(prev => ({
        name: uniqueNames.includes(prev.name) ? prev.name : uniqueNames[0] || '',
        email: prev.email.filter(e => uniqueEmails.includes(e)),
        company: uniqueCompanies.includes(prev.company) ? prev.company : uniqueCompanies[0] || '',
        jobTitle: uniqueJobTitles.includes(prev.jobTitle) ? prev.jobTitle : uniqueJobTitles[0] || '',
        phone: prev.phone.filter(p => uniquePhones.includes(p)),
      }));
    }
  }, [includedContacts, open, getUniqueValues]);

  const toggleContactInclusion = (contactId: string) => {
    const newInclusion = new Set(includedContacts);
    if (newInclusion.has(contactId)) {
      // Don't allow excluding if it would leave less than 2 contacts
      if (newInclusion.size > 2) {
        newInclusion.delete(contactId);
      }
    } else {
      newInclusion.add(contactId);
    }
    setIncludedContacts(newInclusion);
  };

  const handleEmailToggle = (email: string) => {
    setSelectedValues(prev => ({
      ...prev,
      email: prev.email.includes(email)
        ? prev.email.filter(e => e !== email)
        : [...prev.email, email]
    }));
  };

  const handlePhoneToggle = (phone: string) => {
    setSelectedValues(prev => ({
      ...prev,
      phone: prev.phone.includes(phone)
        ? prev.phone.filter(p => p !== phone)
        : [...prev.phone, phone]
    }));
  };

  const handleMerge = () => {
    if (includedContacts.size < 2) return;

    const includedContactsList = contacts.filter(c => includedContacts.has(c.id));
    const excludedContactsList = contacts.filter(c => !includedContacts.has(c.id));

    // Use the ID from the most recently active included contact
    const primaryContact = includedContactsList.sort((a, b) => {
      const aTime = a.lastActivity?.getTime() || 0;
      const bTime = b.lastActivity?.getTime() || 0;
      return bTime - aTime;
    })[0];

    const mergedData: Partial<Contact> = {
      name: selectedValues.name,
      email: selectedValues.email.length > 0 ? selectedValues.email[0] : undefined,
      company: selectedValues.company || undefined,
      jobTitle: selectedValues.jobTitle || undefined,
      phone: selectedValues.phone.length > 0 ? selectedValues.phone[0] : undefined,
    };

    const mergedIds = includedContactsList
      .filter(c => c.id !== primaryContact.id)
      .map(c => c.id);

    const excludedIds = excludedContactsList.map(c => c.id);

    onMerge(primaryContact.id, mergedIds, mergedData, excludedIds);
    onOpenChange(false);
  };

  // Get all distribution lists from included contacts
  const allDistributionLists = new Set<string>();
  contacts.forEach(contact => {
    if (includedContacts.has(contact.id)) {
      contact.distributionLists.forEach(list => allDistributionLists.add(list));
    }
  });

  const nameOptions = getUniqueValues('name');
  const emailOptions = getUniqueValues('email');
  const companyOptions = getUniqueValues('company');
  const jobTitleOptions = getUniqueValues('jobTitle');
  const phoneOptions = getUniqueValues('phone');

  if (contacts.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Merge Contacts</DialogTitle>
          <DialogDescription>
            Select which contacts to include and choose the best value for each field.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-[1fr,350px] gap-6">
          {/* Left side - Fields and options */}
          <div className="space-y-4">
            {/* Include in Merge */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Include in Merge</Label>
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2">
                {contacts.map((contact) => (
                  <label
                    key={contact.id}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors",
                      includedContacts.has(contact.id) 
                        ? "bg-primary/10" 
                        : "hover:bg-muted/50"
                    )}
                  >
                    <Checkbox
                      checked={includedContacts.has(contact.id)}
                      onCheckedChange={() => toggleContactInclusion(contact.id)}
                      disabled={includedContacts.has(contact.id) && includedContacts.size === 2}
                    />
                    <span className="text-sm truncate">{contact.name}</span>
                  </label>
                ))}
              </div>
              {includedContacts.size < 2 && (
                <p className="text-xs text-destructive mt-1">At least 2 contacts must be selected</p>
              )}
            </div>

            <Separator />

            {/* Name */}
            <FieldRadioGroup
              label="Name"
              options={nameOptions}
              selectedValue={selectedValues.name}
              onValueChange={(value) => setSelectedValues(prev => ({ ...prev, name: value }))}
            />

            <Separator />

            {/* Email */}
            <FieldCheckboxGroup
              label="Email (select all that apply)"
              options={emailOptions}
              selectedValues={selectedValues.email}
              onToggle={handleEmailToggle}
            />

            <Separator />

            {/* Company */}
            <FieldRadioGroup
              label="Company"
              options={companyOptions}
              selectedValue={selectedValues.company}
              onValueChange={(value) => setSelectedValues(prev => ({ ...prev, company: value }))}
            />

            <Separator />

            {/* Job Title */}
            <FieldRadioGroup
              label="Job Title"
              options={jobTitleOptions}
              selectedValue={selectedValues.jobTitle}
              onValueChange={(value) => setSelectedValues(prev => ({ ...prev, jobTitle: value }))}
            />

            <Separator />

            {/* Phone */}
            <FieldCheckboxGroup
              label="Phone (select all that apply)"
              options={phoneOptions}
              selectedValues={selectedValues.phone}
              onToggle={handlePhoneToggle}
            />
          </div>

          {/* Right side - Preview */}
          <div className="space-y-4">
            <Card className="sticky top-0">
              <CardHeader className="py-4">
                <CardTitle className="text-base">Preview Merged Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <span className="ml-2">{selectedValues.name || '-'}</span>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <span className="ml-2">{selectedValues.email.join(', ') || '-'}</span>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Company:</span>
                  <span className="ml-2">{selectedValues.company || '-'}</span>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Job Title:</span>
                  <span className="ml-2">{selectedValues.jobTitle || '-'}</span>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="ml-2">{selectedValues.phone.join(', ') || '-'}</span>
                </div>
                
                <div className="pt-2">
                  <span className="text-muted-foreground">Distribution Lists:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Array.from(allDistributionLists).map((list) => (
                      <Badge key={list} variant="secondary" className="text-xs">
                        {list}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 text-xs text-muted-foreground">
                  Combined activity from {includedContacts.size} contacts
                </div>
              </CardContent>
            </Card>


          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleMerge}
            disabled={includedContacts.size < 2}
          >
            Merge {includedContacts.size} Contacts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 