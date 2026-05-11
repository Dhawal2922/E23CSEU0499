import { useState, useEffect } from 'react';
import { Log } from 'logger-middleware';

export function useReadStatus() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('readNotifications');
    if (stored) {
      setReadIds(new Set(JSON.parse(stored)));
    }
  }, []);

  const markAsRead = (id: string) => {
    if (readIds.has(id)) return;
    
    Log('frontend', 'info', 'state', `Notification ${id} marked as read`);
    
    const newSet = new Set(readIds);
    newSet.add(id);
    setReadIds(newSet);
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(newSet)));
  };

  const markAllAsRead = (ids: string[]) => {
    const newSet = new Set(readIds);
    ids.forEach(id => newSet.add(id));
    setReadIds(newSet);
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(newSet)));
    Log('frontend', 'info', 'state', `Multiple notifications marked as read`);
  };

  return { readIds, markAsRead, markAllAsRead };
}
