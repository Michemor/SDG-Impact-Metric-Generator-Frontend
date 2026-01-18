import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import SideMenu from "../components/SideMenu"

export default function Dashboard() {
    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div">
                        SDG Impact Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Side Menu Component */}
            
            <Box component="main" sx={{ p: 3, marginLeft: '240px' }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to the SDG Impact Dashboard
                </Typography>
                <Typography variant="body1">
                    This dashboard provides insights and data visualizations related to the Sustainable Development Goals (SDGs). Use the side menu to navigate through different sections and explore various metrics and reports.
                </Typography>
            </Box>
        </Box>
    )
}