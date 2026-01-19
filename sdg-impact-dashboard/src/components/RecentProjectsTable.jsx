import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, LinearProgress, Stack } from '@mui/material';

const recentProjects = [
  {
    name: 'Community Literacy Program',
    sdg: 4,
    sdgLabel: 'Quality Education',
    status: 'Active',
    start: '2025-09-12',
    progress: 68,
  },
  {
    name: 'Maternal Health Outreach',
    sdg: 3,
    sdgLabel: 'Good Health',
    status: 'Active',
    start: '2025-07-01',
    progress: 54,
  },
  {
    name: 'Green Tech Incubator',
    sdg: 9,
    sdgLabel: 'Industry & Innovation',
    status: 'Planned',
    start: '2026-02-15',
    progress: 12,
  },
  {
    name: 'Justice Awareness Campaign',
    sdg: 16,
    sdgLabel: 'Peace & Justice',
    status: 'Completed',
    start: '2025-03-10',
    progress: 100,
  },
  {
    name: 'Partnership Network Expansion',
    sdg: 17,
    sdgLabel: 'Partnerships',
    status: 'Active',
    start: '2025-11-05',
    progress: 35,
  },
];

function statusColor(status, theme) {
  switch (status) {
    case 'Active':
      return theme.palette.success.main;
    case 'Planned':
      return theme.palette.info.main;
    case 'Completed':
      return theme.palette.primary.main;
    default:
      return theme.palette.grey[500];
  }
}

export default function RecentProjectsTable() {
  const theme = useTheme();

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small" aria-label="recent projects" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Project</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>SDG</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Start</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }} align="right">Progress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recentProjects.map((row) => (
            <TableRow key={`${row.name}-${row.start}`} hover>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>{row.name}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{
                    backgroundColor: '#e0f2f1',
                    color: 'text.primary',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'inline-block',
                  }}>
                    {row.sdg}
                  </Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{row.sdgLabel}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Chip
                  label={row.status}
                  sx={{
                    color: '#fff',
                    backgroundColor: statusColor(row.status, theme),
                    height: 24,
                  }}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{row.start}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{row.owner}</TableCell>
              <TableCell align="right" sx={{ width: 180 }}>
                <Stack spacing={0.5} alignItems="flex-end">
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                    {row.progress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={row.progress}
                    sx={{
                      width: '100%',
                      height: 8,
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                      },
                    }}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
