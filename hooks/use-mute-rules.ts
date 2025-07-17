import { useState, useEffect, useCallback } from 'react';

export type MuteRule = {
  id: string;
  contactIds: string[];
  createdAt: string;
};

const STORAGE_KEY = 'sedna-mute-rules';

export function useMuteRules() {
  const [muteRules, setMuteRules] = useState<MuteRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMuteRules(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading mute rules from localStorage:', error);
        setMuteRules([]);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(muteRules));
    }
  }, [muteRules, isLoading]);

  const addMuteRule = useCallback((contactIds: string[]) => {
    const sortedIds = [...contactIds].sort();
    const newRule: MuteRule = {
      id: sortedIds.join('-'),
      contactIds: sortedIds,
      createdAt: new Date().toISOString(),
    };
    setMuteRules(prev => [...prev, newRule]);
  }, []);

  const removeMuteRule = useCallback((ruleId: string) => {
    setMuteRules(prev => prev.filter(rule => rule.id !== ruleId));
  }, []);

  return {
    muteRules,
    isLoading,
    addMuteRule,
    removeMuteRule,
  };
} 