import { Drawer, IconButton, ListItemButton, ListItemIcon, Typography, Box, Stack} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import MapIcon from '@mui/icons-material/Map';
import CompareIcon from '@mui/icons-material/Compare';
import AssessmentIcon from '@mui/icons-material/Assessment';
import List from "@mui/material/List";
import Divider from "@mui/material/Divider"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

const drawerWidth = 240;
const closedDrawerWidth = 72;

export default function SideMenu({ open, onClose }) {
    const theme = useTheme();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, onClick: () => {} },
        { text: 'Projects and Initiatives', icon: <WorkIcon />, onClick: () => {} },
        { text: 'Impact Map', icon: <MapIcon />, onClick: () => {} },
        { text: 'Benchmark', icon: <CompareIcon />, onClick: () => {} },
        { text: 'Reports', icon: <AssessmentIcon />, onClick: () => {} },
    ];

    return (
        <Box sx={{ 
            width: open ? drawerWidth : closedDrawerWidth, 
            flexShrink: 0 ,
            "& .MuiDrawer-paper": {
                position: "fixed",
                top: 0,
                left: 0,
                width: open ? drawerWidth : closedDrawerWidth,
                overflowX: 'hidden',
                boxSizing: 'border-box',
                transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
                }),
                } 
    }}>
        <Drawer 
        variant="permanent" 
        anchor="left" 
        open={open} >

            {open && (
                <>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
                 <Typography variant="h6" sx={{ m: 2 }}> Menu </Typography>
                 <IconButton sx={{ ml: 1 }} onClick={onClose}> <CloseRoundedIcon /> </IconButton>
                 </Stack>
                 <Divider />
                 </> )}

                 <List>
            {  menuItems.map((item, index) => {
                const isSelected = selectedIndex === index;

                return (
                <ListItemButton 
                key={index} 
                selected={isSelected}
                onClick={() => {
                    setSelectedIndex(index);
                    item.onClick();
                }}
                sx={{
                    justifyContent: open ? 'flex-start' : 'center',
                    px: 2.5,
                    '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'black',
                        '& .MuiListItemIcon-root, & .MuiTypography-root': {
                            color: 'black',},
                        },
                    ...(isSelected && {
                        backgroundColor: 'primary.dark',
                        color: 'white',
                        '& .MuiListItemIcon-root, & .MuiTypography-root': {
                            color: 'white',
                        },
                    }),
                }}>
                    <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: isSelected ? 'white' : 'primary.main',
                    }}>
                        {item.icon}
                    </ListItemIcon>
                    {open && (item.text)}
                </ListItemButton>
                );
                })}
            </List>
        </Drawer>
        </Box>
    );
}