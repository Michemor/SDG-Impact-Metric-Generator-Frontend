import { Box, Paper, Typography, Divider, Tab, Tabs, TextField, InputAdornment } from "@mui/material"
import ProjectsTable from "../components/ProjectsTable";
import PublicationsTable from "../components/PublicationsTable";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

export default function Projects() {
    const [tabValue, setTabValue] = useState(0); // 0 for Projects, 1 for Publications
    const [projectQuery, setProjectQuery] = useState("");
    const [publicationQuery, setPublicationQuery] = useState("");
    const handleTabChange = (event, newValue) => {
        // Handle tab change logic here
        setTabValue(newValue);
    }
    return (
        <>
        <Paper
        sx ={{ 
            padding: 2, 
            margin: 2 }}
        position="absolute">
            <Typography variant="h4" component="h1" gutterBottom>
                Projects and Publications
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ 
                p: 2,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                boxShadow: 1

                 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                       View and manage all projects and publications related to your SDG initiatives. Use the tabs below to switch between project and publication views.
                    </Typography>

                    {/** Creating a stepper */}
                    <Box justifyContent="center" sx={{ width: '100%' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mt: 3 }}>
                            <Tab label="Projects" />
                            <Tab label="Publications" />
                        </Tabs>
                    </Box>
                    <Divider sx={{ my: 2 }} />

                    <Box value={0} hidden={tabValue !== 0}>
                            <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                                Projects
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Search projects by name, type, status, department, SDGs or date"
                                value={projectQuery}
                                onChange={(e) => setProjectQuery(e.target.value)}
                                size="small"
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <ProjectsTable filterText={projectQuery} />
                        </Box>

                        <Box sx={{ mt: 4 }} value={1} hidden={tabValue !== 1}>
                            <Typography variant="h6" sx={{ color: 'text.primary', my: 1 }}>
                                Publications
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Search publications by title, type, status, department, SDGs or date"
                                value={publicationQuery}
                                onChange={(e) => setPublicationQuery(e.target.value)}
                                size="small"
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <PublicationsTable filterText={publicationQuery} />
                        </Box>
                    </Box>

        </Paper>
        </>
    )
}