import { Drawer, IconButton, ListItemButton, ListItemIcon, Typography, Box, Stack} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import MapIcon from '@mui/icons-material/Map';
import CompareIcon from '@mui/icons-material/Compare';
import AssessmentIcon from '@mui/icons-material/Assessment';
import List from "@mui/material/List";
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;
const closedDrawerWidth = 72;

export default function SideMenu({ open, onClose }) {
    const theme = useTheme();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/'},
        { text: 'Projects and Initiatives', icon: <WorkIcon />, path: '/projects' },
        { text: 'Benchmark', icon: <CompareIcon />,path: '/benchmark' },
        { text: 'Reports', icon: <ReceiptIcon />, path: '/reports' },
        {text: 'Add Entry', icon: <AddCircleOutlineOutlinedIcon />, path: '/add-entry' },
    ];

    return (
        <Box 
        
        sx={{ 
            width: open ? drawerWidth : closedDrawerWidth, 
            flexShrink: 0 ,
            "& .MuiDrawer-paper": {
                position: "fixed",
                top: 64,
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
        open={open}
        onclose={onClose} >

            <List>
            {  menuItems.map((item, index) => {
                const isSelected = selectedIndex === index;

                return (
                <ListItemButton 
                key={index} 
                selected={isSelected}
                onClick={() => {
                    setSelectedIndex(index);
                    navigate(item.path);
                    item.onClick?.();
                }}
                sx={{
                    justifyContent: open ? 'flex-start' : 'center',
                    px: 2.5,
                    '&:hover': {
                        backgroundColor: 'lightblue',
                        color: 'black',
                        '& .MuiListItemIcon-root, & .MuiTypography-root': {
                            color: 'black',},
                        },
                    ...(isSelected && {
                        backgroundColor: 'primary.dark',
                        color: 'primary.dark',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        },
                        '& .MuiListItemIcon-root, & .MuiTypography-root': {
                            color: 'primary.dark',
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
                    {open && (
                        <Typography sx={{ color: 'inherit' }}>{item.text} </Typography>
                    )}
                </ListItemButton>
                );
                })}
            </List>
        </Drawer>
        </Box>
    );
}