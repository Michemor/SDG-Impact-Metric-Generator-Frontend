import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Chip, LinearProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { publicationsData } from '../data/mockData';

function statusColor(status, theme) {
  switch (status) {
    case 'Published':
      return theme.palette.primary.main;
    case 'In Review':
      return theme.palette.warning.main;
    case 'Draft':
      return theme.palette.grey[600];
    default:
      return theme.palette.grey[500];
  }
}

export default function PublicationsTable({ filterText = '' }) {
  const theme = useTheme();
  const query = filterText.trim().toLowerCase();
  const rows = publicationsData.filter((row) => {
    if (!query) return true;
    const haystack = [
      row.project,
      row.type,
      row.status,
      row.department,
      row.date,
      (row.sdgs || []).join(',')
    ]
      .map((v) => String(v).toLowerCase())
      .join(' ');
    return haystack.includes(query);
  });

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small" aria-label="publications table" sx={{ minWidth: 750 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Project</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>SDGs</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Department</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }} align="right">Impact</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell sx={{ color: 'text.primary', fontWeight: 500 }}>{row.project}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{row.type}</TableCell>
              <TableCell>
                <Chip label={row.status} sx={{ color: '#fff', backgroundColor: statusColor(row.status, theme), height: 24 }} size="small" />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                  {row.sdgs.map((n) => (
                    <Box key={n} sx={{ backgroundColor: '#e3f2fd', color: 'text.primary', borderRadius: 1, px: 1, py: 0.3, fontSize: '0.75rem', fontWeight: 600 }}>
                      {n}
                    </Box>
                  ))}
                </Stack>
              </TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{row.date}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{row.department}</TableCell>
              <TableCell align="right" sx={{ width: 200 }}>
                <Stack spacing={0.5} alignItems="flex-end">
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{row.impact}%</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={row.impact}
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
