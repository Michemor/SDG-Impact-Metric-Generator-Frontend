import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


export default function TopNavigation() {
    return (
        <Box height="64px" sx={{ flexGrow: 1 }}>
            <AppBar position='absolute' color='transparent' elevation={0}
            sx={{
                backgroundColor: '#ffffff',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                borderBottom: '2px solid #e0e0e0',
            }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography color="#000000ff" variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        SDG Impact Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}