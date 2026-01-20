import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Toolbar, Typography, Stack } from "@mui/material";


export default function TopNavigation({ onMenuClick }) {
    return (
        <Box 
        height="64px" 
        sx={(theme) => ({
            zIndex: theme.zIndex.drawer + 1,
        })}>
            <AppBar position='sticky' color='transparent' elevation={0}
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
                        sx={{ 
                            width: 48, 
                            height: 48,}}
                        onClick={onMenuClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Stack>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Daystar University
                    </Typography> 
                    <Typography color="grey.500" variant='body2'sx={{
                        flexGrow: 1,
                        fontSize: '0.875rem',
                    }}> SDG Impact Dashboard</Typography>
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
    )
}