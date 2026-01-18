import { Paper, Typography } from "@mui/material"


export default function Projects() {
    return (
        <>
        <Paper
        sx ={{ 
            padding: 2, 
            margin: 2 }}
        position="absolute">
            <Typography variant="h4" component="h1" gutterBottom>
                Projects Page
            </Typography>
            <Typography variant="body1">
                This is the Projects page where you can manage and view all your projects related to Sustainable Development Goals (SDGs).
            </Typography>
        </Paper>
        </>
    )
}