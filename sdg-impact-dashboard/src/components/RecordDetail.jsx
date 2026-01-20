import { Box, Chip, Stack, Typography } from '@mui/material'

const RecordDetail = ({ record }) => {
  if (!record) {
    return null
  }

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Box>
        <Chip
          label={record.type === 'project' ? 'Project' : 'Publication'}
          sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText', mb: 1 }}
        />
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          {record.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {record.year} • {record.department?.name ?? 'Department N/A'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {record.sdgs.map((sdg) => (
          <Chip key={sdg.id} label={sdg.code} size="small" />
        ))}
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight="bold">
          Researchers / Authors
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {record.researchers.length
            ? record.researchers.map((person) => person.name).join(', ')
            : 'No researchers linked yet.'}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight="bold">
          Description
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {record.description || 'No description provided yet.'}
        </Typography>
      </Box>
    </Stack>
  )
}

export default RecordDetail
