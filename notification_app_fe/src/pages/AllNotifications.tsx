import { useState, useEffect } from 'react';
import { Box, Typography, Avatar, FormControl, Select, MenuItem, Button } from '@mui/material';
import { type Notification, fetchNotificationsAPI } from '../services/api';
import { useReadStatus } from '../hooks/useReadStatus';
import { Log } from 'logger-middleware';

export default function AllNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const { readIds, markAsRead } = useReadStatus();

  useEffect(() => {
    Log('frontend', 'info', 'page', 'All Notifications page mounted');
    loadData();
  }, [page, filter]);

  const loadData = async () => {
    const data = await fetchNotificationsAPI(page, 10, filter || undefined);
    setNotifications(data);
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
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}># all-notifications</Typography>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={filter}
            displayEmpty
            onChange={(e) => {
              setFilter(e.target.value as string);
              setPage(1);
            }}
            sx={{ borderRadius: 2, fontSize: 14, bgcolor: '#f8f8f8' }}
          >
            <MenuItem value=""><em>Filter: All</em></MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Messages Area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 0, pb: 4 }}>
        {notifications.length === 0 ? (
          <Typography color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>No notifications found.</Typography>
        ) : (
          notifications.map((notif) => {
            const isNew = !readIds.has(notif.ID);
            
            return (
              <Box 
                key={notif.ID}
                onClick={() => markAsRead(notif.ID)}
                sx={{ 
                  display: 'flex', 
                  py: 1.5, 
                  px: 3,
                  cursor: 'pointer',
                  bgcolor: isNew ? 'rgba(29, 155, 209, 0.08)' : 'transparent',
                  '&:hover': { bgcolor: isNew ? 'rgba(29, 155, 209, 0.12)' : '#f8f8f8' }
                }}
              >
                <Avatar {...getAvatarProps(notif.Type)} variant="rounded" sx={{ width: 36, height: 36, mt: 0.5, ...getAvatarProps(notif.Type).sx }} />
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 15, mr: 1, color: '#1d1c1d' }}>
                      {notif.Type} Bot
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#616061' }}>
                      {new Date(notif.Timestamp.replace(' ', 'T')).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 15, color: '#1d1c1d', fontWeight: isNew ? 600 : 400, mt: 0.3 }}>
                    {notif.Message}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        
        {/* Pagination Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button variant="outlined" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Older
          </Button>
          <Button variant="outlined" onClick={() => setPage(p => p + 1)}>
            Newer
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
