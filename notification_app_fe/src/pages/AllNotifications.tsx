import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Chip, Box, Badge, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">All Notifications</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter Type</InputLabel>
          <Select
            value={filter}
            label="Filter Type"
            onChange={(e) => setFilter(e.target.value as string)}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {notifications.map((notif) => {
        const isNew = !readIds.has(notif.ID);
        return (
          <Badge 
            key={notif.ID} 
            color="error" 
            variant="dot" 
            invisible={!isNew}
            sx={{ width: '100%', mb: 2, display: 'block' }}
          >
            <Card 
              variant="outlined" 
              onClick={() => markAsRead(notif.ID)}
              sx={{ 
                cursor: 'pointer',
                bgcolor: isNew ? '#f8faff' : 'background.paper',
                borderLeft: isNew ? '4px solid #1976d2' : '1px solid #e0e0e0',
                transition: 'background-color 0.2s'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: isNew ? 'bold' : 'normal' }}>
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
        );
      })}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button variant="outlined" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Previous Page
        </Button>
        <Button variant="outlined" onClick={() => setPage(p => p + 1)}>
          Next Page
        </Button>
      </Box>
    </Container>
  );
}
