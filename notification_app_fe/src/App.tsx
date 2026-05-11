import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Campus Notifications
            </Typography>
            <Button color="inherit" component={Link} to="/priority">
              Priority Inbox
            </Button>
            <Button color="inherit" component={Link} to="/">
              All Notifications
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<AllNotifications />} />
          <Route path="/priority" element={<PriorityInbox />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
