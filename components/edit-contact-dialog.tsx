"use client";

import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EditContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onSave: (id: string, updates: Partial<Contact>) => void;
}

export function EditContactDialog({
  open,
  onOpenChange,
  contact,
  onSave,
}: EditContactDialogProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (contact) {
      setEmail(contact.email);
      setEmailError('');
    }
  }, [contact]);

  const validateEmail = (email: string): boolean => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSave = () => {
    if (!contact) return;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    const updates: Partial<Contact> = {
      email: email,
      problem: undefined, // Clear the problem since it's fixed
    };

    onSave(contact.id, updates);
    onOpenChange(false);
  };

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fix Invalid Email</DialogTitle>
          <DialogDescription>
            Update the email address to fix the validation issue.
          </DialogDescription>
        </DialogHeader>

        {contact.problem && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Issue:</strong> {contact.problem.reason}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Contact</Label>
            <p className="text-sm text-muted-foreground">
              {contact.name}
              {contact.company && ` - ${contact.company}`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Enter valid email address"
              className={emailError ? 'border-destructive' : ''}
              autoFocus
            />
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!!emailError || !email}>
            Save Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 