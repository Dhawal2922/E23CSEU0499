import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';

// A small wrapper to handle active state
function SidebarItem({ to, label }: { to: string; label: string; }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        component={Link}
        to={to}
        sx={{
          borderRadius: 1,
          mx: 1,
          bgcolor: isActive ? '#1164A3' : 'transparent', // Slack blue for active
          color: isActive ? '#FFFFFF' : '#c8c8c8',
          '&:hover': {
            bgcolor: isActive ? '#1164A3' : 'rgba(255,255,255,0.08)',
          },
        }}
      >
        <Typography sx={{ mr: 1, opacity: 0.7 }}>#</Typography>
        <ListItemText primary={<Typography sx={{ fontWeight: isActive ? 'bold' : 'normal', fontSize: 15 }}>{label}</Typography>} />
      </ListItemButton>
    </ListItem>
  );
}

function Layout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#ffffff' }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: 260, 
        flexShrink: 0, 
        bgcolor: '#3F0E40', // Slack purple
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Workspace Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
            Campus Connect
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Channels */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 2 }}>
          <Typography sx={{ px: 2, mb: 1, fontSize: 12, opacity: 0.7, fontWeight: 'bold', textTransform: 'uppercase' }}>
            Channels
          </Typography>
          <List sx={{ pt: 0 }}>
            <SidebarItem to="/" label="all-notifications" />
            <SidebarItem to="/priority" label="priority-inbox" />
          </List>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<AllNotifications />} />
          <Route path="/priority" element={<PriorityInbox />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
