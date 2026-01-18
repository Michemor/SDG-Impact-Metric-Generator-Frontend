import { Paper, Typography } from "@mui/material"

export default function MainContent() {

    return (
        <>
        <Paper
        sx={{ 
            padding: 2, 
            margin: 2 }}
        position="absolute">
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to the SDG Impact Dashboard
            </Typography>
            <Typography variant="body1">
                This is the main content area where you can view and manage your projects related to Sustainable Development Goals (SDGs).
            </Typography>
        </Paper>
    </>
    )
}