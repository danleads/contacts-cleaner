"use client";

import { useState, useMemo } from 'react';
import { Contact, SortField, SortDirection, ProblemType } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronUp, ChevronDown, Trash2, Merge, Edit, CheckCheck, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ContactsListProps {
  contacts: Contact[];
  onMerge: (contactIds: string[]) => void;
  onDelete: (contactIds: string[]) => void;
  onEdit: (contact: Contact) => void;
  onIgnore: (contactIds: string[]) => void;
}

export function ContactsList({
  contacts,
  onMerge,
  onDelete,
  onEdit,
  onIgnore,
}: ContactsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [problemFilter, setProblemFilter] = useState<'all' | ProblemType>('all');
  const [sortField, setSortField] = useState<SortField>('problem');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Group duplicates together and apply sorting
  const groupedAndSortedContacts = useMemo(() => {
    // First, filter contacts
    const filtered = contacts.filter(contact => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProblem = 
        problemFilter === 'all' || contact.problem?.type === problemFilter;
      
      return matchesSearch && matchesProblem;
    });

    // Group duplicates together
    const duplicateGroups = new Map<string, Contact[]>();
    const nonDuplicates: Contact[] = [];
    const processedIds = new Set<string>();

    filtered.forEach(contact => {
      if (processedIds.has(contact.id)) return;

      if (contact.problem?.type === 'Duplicate' && contact.problem.relatedContactIds) {
        const groupKey = [contact.id, ...contact.problem.relatedContactIds].sort().join('-');
        
        if (!duplicateGroups.has(groupKey)) {
          const relatedContacts = [contact];
          contact.problem.relatedContactIds.forEach(relatedId => {
            const related = filtered.find(c => c.id === relatedId);
            if (related && !processedIds.has(related.id)) {
              relatedContacts.push(related);
              processedIds.add(related.id);
            }
          });
          duplicateGroups.set(groupKey, relatedContacts);
          processedIds.add(contact.id);
        }
      } else {
        nonDuplicates.push(contact);
      }
    });

    // Sort within each duplicate group
    duplicateGroups.forEach((group, key) => {
      group.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortField) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'email':
            aValue = a.email;
            bValue = b.email;
            break;
          case 'problem':
            aValue = a.problem?.type || '';
            bValue = b.problem?.type || '';
            break;
          case 'company':
            aValue = a.company || '';
            bValue = b.company || '';
            break;
        }
        
        if (sortDirection === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    });

    // Sort non-duplicates
    nonDuplicates.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'problem':
          aValue = a.problem?.type || '';
          bValue = b.problem?.type || '';
          break;
        case 'company':
          aValue = a.company || '';
          bValue = b.company || '';
          break;
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Combine: duplicates first, then non-duplicates
    const result: Contact[] = [];
    duplicateGroups.forEach(group => {
      result.push(...group);
    });
    result.push(...nonDuplicates);

    return result;
  }, [contacts, searchTerm, problemFilter, sortField, sortDirection]);

  // Identify duplicate groups for visual styling
  const getDuplicateGroupIndex = (contact: Contact): number => {
    if (contact.problem?.type !== 'Duplicate') return -1;
    
    let groupIndex = 0;
    let found = false;
    const processedGroups = new Set<string>();

    for (const c of groupedAndSortedContacts) {
      if (c.problem?.type === 'Duplicate' && c.problem.relatedContactIds) {
        const groupKey = [c.id, ...c.problem.relatedContactIds].sort().join('-');
        
        if (!processedGroups.has(groupKey)) {
          processedGroups.add(groupKey);
          if (c.id === contact.id || c.problem.relatedContactIds.includes(contact.id)) {
            found = true;
            break;
          }
          groupIndex++;
        }
      }
      if (found) break;
    }
    
    return found ? groupIndex : -1;
  };

  // Paginate contacts
  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return groupedAndSortedContacts.slice(startIndex, endIndex);
  }, [groupedAndSortedContacts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(groupedAndSortedContacts.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-3 h-3" /> : 
      <ChevronDown className="w-3 h-3" />;
  };

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Great job! All contacts have been cleaned. Your address book is now in perfect shape.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="relative">
        {/* Sticky Header with Filters */}
        <div className="sticky top-0 z-10 bg-background pb-4 border-b">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select value={problemFilter} onValueChange={(value: any) => setProblemFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by problem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Problems</SelectItem>
                <SelectItem value="Duplicate">Duplicates</SelectItem>
                <SelectItem value="Invalid Email">Invalid Emails</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Contact Name
                    <SortIcon field="name" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-1">
                    Email Address
                    <SortIcon field="email" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('problem')}
                >
                  <div className="flex items-center gap-1">
                    Problem
                    <SortIcon field="problem" />
                  </div>
                </TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Connections</TableHead>
                <TableHead>Distribution Lists</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContacts.map((contact, index) => {
                const duplicateGroupIndex = getDuplicateGroupIndex(contact);
                const isDuplicate = duplicateGroupIndex >= 0;
                const isFirstInGroup = index === 0 || getDuplicateGroupIndex(paginatedContacts[index - 1]) !== duplicateGroupIndex;
                const isLastInGroup = index === paginatedContacts.length - 1 || getDuplicateGroupIndex(paginatedContacts[index + 1]) !== duplicateGroupIndex;
                
                return (
                  <TableRow 
                    key={contact.id}
                    className={cn(
                      isDuplicate && "bg-muted/30",
                      isFirstInGroup && isDuplicate && "border-t-2 border-primary/20",
                      isLastInGroup && isDuplicate && "border-b-2 border-primary/20"
                    )}
                  >
                    <TableCell className="font-medium">
                      {contact.name}
                      {contact.company && (
                        <div className="text-sm text-muted-foreground">{contact.company}</div>
                      )}
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>
                      {contact.problem && (
                        <Badge 
                          variant={contact.problem.type === 'Duplicate' ? 'secondary' : 'destructive'}
                        >
                          {contact.problem.type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-muted-foreground whitespace-normal">
                        {contact.problem?.reason}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {contact.recentConnections?.slice(0, 3).map((conn, i) => (
                          <div key={i} className="truncate">
                            {conn.userName} ({conn.interactionCount})
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {contact.distributionLists.slice(0, 2).map((list, i) => (
                          <div key={i} className="truncate">{list}</div>
                        ))}
                        {contact.distributionLists.length > 2 && (
                          <div className="text-muted-foreground">
                            +{contact.distributionLists.length - 2} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {contact.problem?.type === 'Invalid Email' && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEdit(contact)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Contact</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDelete([contact.id])}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Contact</p>
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )}
                        {contact.problem?.type === 'Duplicate' && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // Get all contacts in this duplicate group
                                    const groupIds = [contact.id];
                                    if (contact.problem?.relatedContactIds) {
                                      groupIds.push(...contact.problem.relatedContactIds);
                                    }
                                    onMerge(groupIds);
                                  }}
                                >
                                  <Merge className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Merge Duplicates</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // Get all contacts in this duplicate group
                                    const groupIds = [contact.id];
                                    if (contact.problem?.relatedContactIds) {
                                      groupIds.push(...contact.problem.relatedContactIds);
                                    }
                                    onIgnore(groupIds);
                                  }}
                                >
                                  <BellOff className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mute Alert</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDelete([contact.id])}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Contact</p>
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, groupedAndSortedContacts.length)} of {groupedAndSortedContacts.length} contacts
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'w-8',
                        page === currentPage && 'pointer-events-none'
                      )}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
} 