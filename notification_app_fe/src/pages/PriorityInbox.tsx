import { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Slider } from '@mui/material';
import { type Notification, fetchNotificationsAPI } from '../services/api';
import { useReadStatus } from '../hooks/useReadStatus';
import { Log } from 'logger-middleware';

export default function PriorityInbox() {
  const [priorityNotifications, setPriorityNotifications] = useState<Notification[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const { readIds, markAsRead } = useReadStatus();

  useEffect(() => {
    Log('frontend', 'info', 'page', 'Priority Inbox mounted');
    loadPriorityData();
  }, [limit]);

  const loadPriorityData = async () => {
    const allNotifs = await fetchNotificationsAPI(1, 100); 
    const weights: Record<string, number> = { 'Placement': 3, 'Result': 2, 'Event': 1 };
    
    const unread = allNotifs.filter(n => !readIds.has(n.ID));

    const sorted = unread.sort((a, b) => {
      const weightA = weights[a.Type] || 0;
      const weightB = weights[b.Type] || 0;
      if (weightA !== weightB) return weightB - weightA;
      
      const timeA = new Date(a.Timestamp.replace(' ', 'T')).getTime();
      const timeB = new Date(b.Timestamp.replace(' ', 'T')).getTime();
      return timeB - timeA;
    });

    setPriorityNotifications(sorted.slice(0, limit));
  };

  const getAvatarProps = (type: string) => {
    switch (type) {
      case 'Placement': return { sx: { bgcolor: '#1b5e20' }, children: 'P' };
      case 'Result': return { sx: { bgcolor: '#0d47a1' }, children: 'R' };
      case 'Event': return { sx: { bgcolor: '#e65100' }, children: 'E' };
      default: return { sx: { bgcolor: '#424242' }, children: 'N' };
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Channel Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e2e2e2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}># priority-inbox</Typography>
          <Typography variant="caption" color="text.secondary">
            Showing top {limit} unread notifications based on priority rules.
          </Typography>
        </Box>
        
        <Box sx={{ width: 150 }}>
          <Slider
            value={limit}
            onChange={(_, val) => setLimit(val as number)}
            step={5}
            marks
            min={5}
            max={20}
            size="small"
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 0, pb: 4 }}>
        {priorityNotifications.length === 0 ? (
          <Typography color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
            You're all caught up! No high-priority unread notifications.
          </Typography>
        ) : (
          priorityNotifications.map((notif) => {
            return (
              <Box 
                key={notif.ID}
                onClick={() => {
                  markAsRead(notif.ID);
                  setPriorityNotifications(prev => prev.filter(n => n.ID !== notif.ID));
                }}
                sx={{ 
                  display: 'flex', 
                  py: 1.5, 
                  px: 3,
                  cursor: 'pointer',
                  bgcolor: '#fffbf0', // Slight yellow tint for priority
                  '&:hover': { bgcolor: '#fcf6e3' }
                }}
              >
                <Avatar {...getAvatarProps(notif.Type)} variant="rounded" sx={{ width: 36, height: 36, mt: 0.5, ...getAvatarProps(notif.Type).sx }} />
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 15, mr: 1, color: '#1d1c1d' }}>
                      {notif.Type} Bot <Typography component="span" sx={{ fontSize: 11, ml: 0.5, bgcolor: '#e01e5a', color: '#fff', px: 0.6, py: 0.2, borderRadius: 1 }}>URGENT</Typography>
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#616061' }}>
                      {new Date(notif.Timestamp.replace(' ', 'T')).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 15, color: '#1d1c1d', mt: 0.3 }}>
                    {notif.Message}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
