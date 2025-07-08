export type ProblemType = 'Duplicate' | 'Invalid Email';

export type Contact = {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  jobTitle?: string;
  lastActivity?: Date;
  activityCount?: number;
  distributionLists: string[];
  recentConnections: {
    userId: string;
    userName: string;
    interactionCount: number;
  }[];
  problem?: {
    type: ProblemType;
    reason: string;
    relatedContactIds?: string[];
  };
};

export type MergeCandidate = {
  contacts: Contact[];
  primaryContactId: string;
};

export type FieldValue = {
  value: string | string[];
  sourceContactId: string;
};

export type MergeFields = {
  name: FieldValue[];
  email: FieldValue[];
  company: FieldValue[];
  phone: FieldValue[];
  jobTitle: FieldValue[];
};

export type SortField = 'name' | 'email' | 'problem' | 'company';
export type SortDirection = 'asc' | 'desc'; 