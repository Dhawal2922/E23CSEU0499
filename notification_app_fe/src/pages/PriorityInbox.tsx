import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Chip, Box, Badge, Slider } from '@mui/material';
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
    // Priority logic mandates fetching all/many then sorting.
    // In a real app, backend would do this. The prompt states backend doesn't, so we sort locally for UI.
    const allNotifs = await fetchNotificationsAPI(1, 100); 

    const weights: Record<string, number> = { 'Placement': 3, 'Result': 2, 'Event': 1 };
    
    // Filter unread implicitly? "displays the top 'n' most important unread notifications first"
    // Prompt: "always displays the top 'n' most important unread notifications first"
    // Let's filter out read notifications first!
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

  const getChipColor = (type: string) => {
    switch (type) {
      case 'Placement': return 'success';
      case 'Result': return 'primary';
      case 'Event': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>Priority Inbox 🌟</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Showing the top {limit} most important UNREAD notifications.
      </Typography>

      <Box sx={{ px: 2, mb: 4 }}>
        <Typography id="limit-slider" gutterBottom>
          Number of notifications to show:
        </Typography>
        <Slider
          value={limit}
          onChange={(_, val) => setLimit(val as number)}
          step={5}
          marks
          min={5}
          max={20}
          valueLabelDisplay="auto"
        />
      </Box>

      {priorityNotifications.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 5 }}>
          You're all caught up! No high-priority unread notifications.
        </Typography>
      ) : priorityNotifications.map((notif, index) => (
        <Badge 
          key={notif.ID} 
          badgeContent={`#${index + 1}`}
          color="error"
          sx={{ width: '100%', mb: 2, display: 'block' }}
        >
          <Card 
            variant="elevation" 
            elevation={3}
            onClick={() => {
              markAsRead(notif.ID);
              // Optimistically remove from priority inbox on read
              setPriorityNotifications(prev => prev.filter(n => n.ID !== notif.ID));
            }}
            sx={{ 
              cursor: 'pointer',
              bgcolor: '#fffbf0',
              borderLeft: '4px solid #ff9800',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {notif.Message}
                </Typography>
                <Chip size="small" label={notif.Type} color={getChipColor(notif.Type) as any} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {new Date(notif.Timestamp.replace(' ', 'T')).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Badge>
      ))}
    </Container>
  );
}
