import { Paper, Typography } from "@mui/material"

export default function ImpactMap() {
    return (
        <>
        <Paper
        sx ={{ 
            padding: 2, 
            margin: 2 }}
        position="absolute">
            <Typography variant="h4" component="h1" gutterBottom>
                Impact Map
            </Typography>
            <Typography variant="body1">
                This is the Impact Map page where you can visualize the geographical impact of various projects related to Sustainable Development Goals (SDGs).
            </Typography>
        </Paper>
        </>
    )
}