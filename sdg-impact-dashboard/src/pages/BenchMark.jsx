import { Card, CardHeader, Paper, Typography, CardContent } from "@mui/material"
import { BarChart } from "@mui/x-charts"
import institutionalData from "../data/unis.json"

export default function Benchmark() {
    const universities = institutionalData.institutionalData;
    
    const colors = [
        '#1976d2', '#dc004e', '#4caf50', '#ff9800', '#9c27b0',
        '#00bcd4', '#795548', '#607d8b', '#e91e63', '#3f51b5'
    ];

    const series = universities.map((uni, index) => ({
        data: [uni.impactScore],
        label: uni.university,
        color: colors[index % colors.length],
    }));

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
                A display of benchmark data and analytics of daystar University against other 
                universities in various SDG initiatives.
            </Typography>

            <BarChart
                height={400}
                width={800}
                series={series}
                xAxis={[
                    {
                        scaleType: 'band',
                        data: ['Impact Score'],
                    },
                ]}
                yAxis={[
                    {
                        label: 'Impact Score',
                    },
                ]}
                slotProps={{
                    legend: {
                        direction: 'row',
                        position: { vertical: 'bottom', horizontal: 'middle' },
                        padding: 0,
                    },
                }}
            />
            
        </Paper>
        </>
    )
}