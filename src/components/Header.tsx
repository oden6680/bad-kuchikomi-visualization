import { AppBar, Toolbar, Typography, Container, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Toolbar>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Link component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
            <Typography variant="h5" component="h1">
              大学BAD口コミVisualization
            </Typography>
          </Link>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
