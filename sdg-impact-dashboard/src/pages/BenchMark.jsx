import { Paper, Typography } from "@mui/material"

export default function Benchmark() {
    return (
        <>
        <Paper
        sx ={{ 
            padding: 2, 
            margin: 2 }}
        position="absolute">
            <Typography variant="h4" component="h1" gutterBottom>
                    BenchMark
            </Typography>
            <Typography variant="body1">
                A display of benchmark data and analytics of daystar University against other universities in various SDG initiatives.
            </Typography>
            
        </Paper>
        </>
    )
}