import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'

const StatsBadge = ({ label, value }) => (
  <Paper
    elevation={0}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      p: 1.5,
      bgcolor: 'primary.50',
      borderRadius: 2,
    }}
  >
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h6" fontWeight="bold">
      {value}
    </Typography>
  </Paper>
)

const RecordList = ({ title, items, onSelect }) => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {items.length} item{items.length === 1 ? '' : 's'}
      </Typography>
    </Box>
    {items.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        No {title.toLowerCase()} linked to this SDG yet.
      </Typography>
    ) : (
      <Stack spacing={1}>
        {items.map((item) => (
          <Button
            key={item.id}
            variant="outlined"
            onClick={() => onSelect(item.id)}
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              textTransform: 'none',
              p: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {item.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.year} • {item.department?.name ?? 'Department N/A'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {item.sdgs.map((goal) => (
                  <Chip key={goal.id} label={goal.code} size="small" />
                ))}
              </Box>
            </Box>
          </Button>
        ))}
      </Stack>
    )}
  </Box>
)

const DrillDownPanel = ({ loading, error, detail, onSelectRecord }) => {
  if (loading) {
    return <Typography color="text.secondary">Loading SDG drill-down...</Typography>
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  if (!detail?.sdg) {
    return (
      <Typography color="text.secondary">
        Select an SDG to explore linked projects and publications.
      </Typography>
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Chip
          label={detail.sdg.code}
          sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', mb: 1 }}
        />
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          {detail.sdg.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click a record to reveal its metadata. Use the export actions to capture this view in PDF or CSV format.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 1.5,
          mb: 2,
        }}
      >
        <StatsBadge label="Projects" value={detail.stats.projects} />
        <StatsBadge label="Publications" value={detail.stats.publications} />
        <StatsBadge label="Departments" value={detail.stats.departments} />
        <StatsBadge label="Researchers" value={detail.stats.researchers} />
      </Box>

      <Stack spacing={3}>
        <RecordList title="Projects" items={detail.projects ?? []} onSelect={onSelectRecord} />
        <RecordList title="Publications" items={detail.publications ?? []} onSelect={onSelectRecord} />
      </Stack>
    </Box>
  )
}

export default DrillDownPanel
