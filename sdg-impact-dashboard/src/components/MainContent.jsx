import { Paper, Typography, Grid, Stack, Box, Divider, useTheme, List, Container, ListItem, ListItemAvatar } from "@mui/material"
import RecentProjectsTable from "./RecentProjectsTable";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AdjustIcon from '@mui/icons-material/Adjust';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { LineChart } from "@mui/x-charts";


export default function MainContent() {
    const theme = useTheme();

    const numberOfProjects = [
        {x: '2015', y: 30},
        {x: '2016', y: 45},
        {x: '2017', y: 28},
        {x: '2018', y: 60},
        {x: '2019', y: 75},
        {x: '2020', y: 50},
        {x: '2021', y: 90},
        {x: '2022', y: 100},
        {x: '2023', y: 120},
        {x: '2024', y: 140},
        {x: '2025', y: 160},
    ]

    const titleStyle = {
        fontSize: '0.95rem',
        fontWeight: 500,
        color: 'text.primary'
    };

    const valueStyle = {
        fontSize: '2rem',
        fontWeight: 'bold',
        mt: 2,
        mb: 0.5
    };

    const subtitleStyle = {
        fontSize: '0.85rem',
        color: 'text.secondary'
    };

    const iconStyle = {
        color: 'text.secondary',
        fontSize: '1.5rem'
    };

    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
        <Paper
        sx={{ 
            padding: 3, 
            margin: 'auto' 
        }}>
            <Typography variant="h4" component="h1" gutterBottom
            sx={{
                color: 'primary.main',
                fontWeight: 600,
                mb: 3
            }}>
                Welcome to the SDG Impact Dashboard
            </Typography>
            <Typography variant="body1">
                This is the main content area where you can view and manage your projects related to Sustainable Development Goals (SDGs).
            </Typography>
            <Grid container rowSpacing={2} sx={{ marginTop: 2, justifyContent: 'center' }} columnSpacing={{ xs: 2, sm: 4, md: 6 }}>
                {/* Total Activities */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ width: '100%', padding: 3, borderRadius: 2, backgroundColor: '#f8f9fa', boxShadow: '2', border: '1px solid #e0e0e0' }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography sx={titleStyle}>Total Projects </Typography>
                            <TrendingUpIcon sx={iconStyle} />
                        </Stack>
                        <Typography sx={valueStyle}>16</Typography>
                        <Typography sx={{ ...subtitleStyle, color: 'success.main' }}>12 currently active</Typography>
                    </Box>
                </Grid>

                {/* Research Publications */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ width: '100%', padding: 3, borderRadius: 2, backgroundColor: '#f8f9fa', boxShadow: '2', border: '1px solid #e0e0e0' }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography sx={titleStyle}>Research Publications</Typography>
                            <ArticleIcon sx={iconStyle} />
                        </Stack>
                        <Typography sx={valueStyle}>10</Typography>
                        <Typography sx={{ ...subtitleStyle, color: 'info.main' }}>SDG-aligned publications</Typography>
                    </Box>
                </Grid>

                {/* Impact Score */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ width: '100%', padding: 3, borderRadius: 2, backgroundColor: '#f8f9fa', boxShadow: '2', border: '1px solid #e0e0e0' }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography sx={titleStyle}>Impact Score</Typography>
                            <TrendingUpOutlinedIcon sx={iconStyle} />
                        </Stack>
                        <Typography sx={valueStyle}>7.8/10</Typography>
                        <Typography sx={{ ...subtitleStyle, color: 'warning.main' }}>Average impact rating</Typography>
                    </Box>
                </Grid>

                {/* Community Reach */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ width: '100%', padding: 3, borderRadius: 2, backgroundColor: '#f8f9fa', boxShadow: '2', border: '1px solid #e0e0e0' }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography sx={titleStyle}>Community Reach</Typography>
                            <PeopleAltIcon sx={iconStyle} />
                        </Stack>
                        <Typography sx={valueStyle}>1,575</Typography>
                        <Typography sx={{ ...subtitleStyle, color: 'text.secondary' }}>Total participants engaged</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ m: 2 }} />

             <Divider sx={{ m: 2 }}/>

            <Grid container spacing={3} sx={{ marginTop: 2,
             }} alignItems="stretch">
                <Grid item xs={12} lg={8}>
            {/** Graphical Representations */}
           
            <Box 
                sx={{ 
                    width: '500px', 
                    maxWidth: '100%',
                    p: 3, 
                    borderRadius: 3, 
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
                    boxShadow: '0 4px 20px primary.dark',
                    border: '1px solid primary.light'
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <TrendingUpIcon sx={{ color: 'primary.dark', fontSize: '1.8rem' }} />
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 600, 
                            color: 'primary.main',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Project Growth Trajectory
                    </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'primary.dark', mb: 2 }}>
                    Tracking SDG project expansion from 2015 to 2025
                </Typography>
                <Box sx={{ 
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                    borderRadius: 2, p: 1 }}>
                    <LineChart
                        xAxis={[{ 
                            data: numberOfProjects.map((d) => d.x),
                            scaleType: 'point',
                            tickLabelStyle: { fontSize: 12, fill: theme.palette.primary.dark }
                        }]}
                        yAxis={[{
                            tickLabelStyle: { fontSize: 12, fill: theme.palette.primary.dark }
                        }]}
                        series={[{ 
                            data: numberOfProjects.map((d) => d.y), 
                            label: 'Projects',
                            color: theme.palette.primary.main,
                            curve: 'catmullRom',
                            showMark: true,
                            area: true
                        }]}
                        height={320}
                        margin={{ left: 50, right: 30, top: 40, bottom: 40 }}
                        grid={{ vertical: false, horizontal: true }}
                        slotProps={{
                            legend: {
                                direction: 'row',
                                position: { vertical: 'top', horizontal: 'right' },
                                labelStyle: { fontSize: 13, fill: theme.palette.primary.dark }
                            }
                        }}
                        sx={{ 
                            width: '100%',
                            '.MuiLineElement-root': {
                                strokeWidth: 3,
                            },
                            '.MuiMarkElement-root': {
                                stroke: theme.palette.primary.main,
                                fill: '#fff',
                                strokeWidth: 2,
                            },
                            '.MuiAreaElement-root': {
                                fill: 'url(#themeGradient)',
                                fillOpacity: 0.3,
                            },
                        }}
                    >
                        <defs>
                            <linearGradient id="themeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={theme.palette.primary.light} stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                    </LineChart>
                </Box>
            </Box>
            </Grid>
            
                <Grid item xs={12} lg={4}>
                    <Box sx={{ 
                        width: '500px', 
                        maxWidth: '100%', 
                        padding: 3, 
                        borderRadius: 2, 
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
                        boxShadow: '2', 
                        border: '1px solid #e0e0e0'
                    }}>
                        <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                            Top SDGs
                        </Typography>
                        
                        {/* SDG List */}
                        <Stack spacing={1.5}>
                            {/* #1 Quality Education */}
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', minWidth: '24px' }}>#1</Typography>
                                <Box sx={{ 
                                    backgroundColor: '#22c55e', 
                                    color: '#fff', 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                }}>
                                    4
                                </Box>
                                <Typography sx={{ color: 'text.primary', flexGrow: 1, fontSize: '0.9rem' }}>
                                    Quality Education
                                </Typography>
                                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}>95%</Typography>
                            </Stack>

                            {/* #2 Partnerships */}
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', minWidth: '24px' }}>#2</Typography>
                                <Box sx={{ 
                                    backgroundColor: '#1e3a5f', 
                                    color: '#fff', 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                }}>
                                    17
                                </Box>
                                <Typography sx={{ color: 'text.primary', flexGrow: 1, fontSize: '0.9rem' }}>
                                    Partnerships
                                </Typography>
                                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}>88%</Typography>
                            </Stack>

                            {/* #3 Good Health */}
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', minWidth: '24px' }}>#3</Typography>
                                <Box sx={{ 
                                    backgroundColor: '#22c55e', 
                                    color: '#fff', 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                }}>
                                    3
                                </Box>
                                <Typography sx={{ color: 'text.primary', flexGrow: 1, fontSize: '0.9rem' }}>
                                    Good Health
                                </Typography>
                                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}>85%</Typography>
                            </Stack>

                            {/* #4 Innovation */}
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', minWidth: '24px' }}>#4</Typography>
                                <Box sx={{ 
                                    backgroundColor: '#f97316', 
                                    color: '#fff', 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                }}>
                                    9
                                </Box>
                                <Typography sx={{ color: 'text.primary', flexGrow: 1, fontSize: '0.9rem' }}>
                                    Innovation
                                </Typography>
                                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}>82%</Typography>
                            </Stack>

                            {/* #5 Peace & Justice */}
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', minWidth: '24px' }}>#5</Typography>
                                <Box sx={{ 
                                    backgroundColor: '#0369a1', 
                                    color: '#fff', 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                }}>
                                    16
                                </Box>
                                <Typography sx={{ color: 'text.primary', flexGrow: 1, fontSize: '0.9rem' }}>
                                    Peace & Justice
                                </Typography>
                                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}>80%</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', minWidth: '24px' }}>#5</Typography>
                                <Box sx={{ 
                                    backgroundColor: '#c20000', 
                                    color: '#fff', 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                }}>
                                    16
                                </Box>
                                <Typography sx={{ color: 'text.primary', flexGrow: 1, fontSize: '0.9rem' }}>
                                    Peace & Justice
                                </Typography>
                                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}>80%</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', minWidth: '24px' }}>#5</Typography>
                                <Box sx={{ 
                                    backgroundColor: '#8e03a1', 
                                    color: '#fff', 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                }}>
                                    16
                                </Box>
                                <Typography sx={{ color: 'text.primary', flexGrow: 1, fontSize: '0.9rem' }}>
                                    Peace & Justice
                                </Typography>
                                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}>80%</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', minWidth: '24px' }}>#5</Typography>
                                <Box sx={{ 
                                    backgroundColor: '#ff5709', 
                                    color: '#fff', 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                }}>
                                    16
                                </Box>
                                <Typography sx={{ color: 'text.primary', flexGrow: 1, fontSize: '0.9rem' }}>
                                    Peace & Justice
                                </Typography>
                                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}>80%</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Grid>

            </Grid>
              
            {/* Recent Projects Section */}
            <Grid container sx={{ mt: 1 }}>
                <Grid item xs={12}>
                    <Box sx={{
                        width: '100%',
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e0e0e0'
                    }}>
                        <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                            Recent Projects
                        </Typography>
                        <RecentProjectsTable />
                    </Box>
                </Grid>
            </Grid>    
        </Paper>
    </Container>
    )
}