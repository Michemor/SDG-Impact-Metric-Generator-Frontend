import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
  alpha,
  Icon,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import {
  FolderOpen as ProjectIcon,
  Article as PublicationIcon,
  Business as DepartmentIcon,
  Groups as ResearcherIcon,
} from '@mui/icons-material'
import ExportButtons from '../components/ExportButtons'
import DrillDownPanel from '../components/DrillDownPanel'
import RecordDetail from '../components/RecordDetail'
import { fetchRecordDetail, fetchReportSummary, fetchSdgDetail } from '../services/apiClient'
import { useTheme } from '@mui/material'

const SummaryPlaceholder = () => (
  <Typography color="text.secondary">
    No SDG-linked records were found. Add a project or publication to begin reporting.
  </Typography>
)

// Styled metric card component for totals
const MetricCard = ({ label, value, color, gradient }) => {
  const theme = useTheme()
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: gradient,
        border: `1px solid ${alpha(color, 0.2)}`,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(color, 0.25)}`,
        },
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          background: alpha(color, 0.15),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ fontSize: 28, color: color }} />
      </Box>
      <Box>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{ color: color, lineHeight: 1.2 }}
        >
          {value?.toLocaleString() ?? '—'}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: alpha(theme.palette.text.primary, 0.7), fontWeight: 500 }}
        >
          {label}
        </Typography>
      </Box>
    </Paper>
  )
}

function ReportsPage() {
  const [summary, setSummary] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(true)
  const [summaryError, setSummaryError] = useState(null)

  const [selectedSdgId, setSelectedSdgId] = useState(null)
  const [sdgDetail, setSdgDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [detailError, setDetailError] = useState(null)

  const [focusedRecord, setFocusedRecord] = useState(null)
  const [recordError, setRecordError] = useState(null)
  const [recordLoading, setRecordLoading] = useState(false)

  useEffect(() => {
    const loadSummary = async () => {
      setLoadingSummary(true)
      setSummaryError(null)
      try {
        const data = await fetchReportSummary()
        setSummary(data)
        if (data?.sdgs?.length && !selectedSdgId) {
          setSelectedSdgId(data.sdgs[0].id)
        }
      } catch (error) {
        setSummaryError(error.message)
      } finally {
        setLoadingSummary(false)
      }
    }

    loadSummary()
  }, [])

  useEffect(() => {
    if (!selectedSdgId) {
      setSdgDetail(null)
      return
    }

    const loadDetail = async () => {
      setLoadingDetail(true)
      setDetailError(null)
      setFocusedRecord(null)
      try {
        const detail = await fetchSdgDetail(selectedSdgId)
        setSdgDetail(detail)
      } catch (error) {
        setDetailError(error.message)
      } finally {
        setLoadingDetail(false)
      }
    }

    loadDetail()
  }, [selectedSdgId])

  const totals = useMemo(() => summary?.totals ?? null, [summary])

  const handleSelectRecord = async (recordId) => {
    setRecordError(null)
    setRecordLoading(true)
    try {
      const detail = await fetchRecordDetail(recordId)
      setFocusedRecord(detail)
    } catch (error) {
      setRecordError(error.message)
      setFocusedRecord(null)
    } finally {
      setRecordLoading(false)
    }
  }

  const theme = useTheme()

  return (
    <Box sx={{ 
      color: theme.palette.background.default,
      p: 2, 
      mb: 3,
      background: 'linear-gradient(135deg, #e8f0fe 0%, #c2def6 50%, #90caf9 100%)',
    }}
      >
        <Paper
        sx={{
            p: 4,
        }}>

        {/** Beginning of reports section */}
        <Typography 
        sx={{ color: theme.palette.primary.main }}
        variant="h4" fontWeight="bold" gutterBottom>
          Reports
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Export institutional SDG impact insights and drill into projects, publications, departments, and researchers.
        </Typography>
        <ExportButtons summary={summary} selectedDetail={sdgDetail} disabled={!summary?.sdgs?.length} />
      
      {/** Summary of various SDGs */}
      <Divider sx={{ 
        m: 3,
        borderColor: theme.palette.divider,
       }} />

      {/* Executive Metrics Dashboard */}
      {totals && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{ mb: 2, color: theme.palette.text.primary }}
          >
            Impact Overview
          </Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                icon={ProjectIcon}
                label="Projects"
                value={totals.projects}
                color="#1565C0"
                gradient="linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                icon={PublicationIcon}
                label="Publications"
                value={totals.publications}
                color="#2E7D32"
                gradient="linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                icon={DepartmentIcon}
                label="Departments"
                value={totals.departments}
                color="#7B1FA2"
                gradient="linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                icon={ResearcherIcon}
                label="Researchers"
                value={totals.researchers}
                color="#E65100"
                gradient="linear-gradient(135deg, #FFF3E0 0%, #FFCCBC 100%)"
              />
            </Grid>
          </Grid>
        </Box>
      )}

      <Paper sx={{ 
        p: 3, mt : 2, 
        height: '100%', 
        justifyContent: 'space-between', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}>
                
                  <Typography 
                    variant="h5" 
                    fontWeight="700"
                    sx={{ 
                      background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    SDG Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Overview of projects and publications aligned with the Sustainable Development Goals (SDGs).
                  </Typography>
              
      <Grid container spacing={3}>
        <Grid item xs={12}>
            {loadingSummary && <Typography color="text.secondary">Loading report summary...</Typography>}
            {summaryError && <Typography color="error">{summaryError}</Typography>}
            {!loadingSummary && !summaryError && !summary?.sdgs?.length && <SummaryPlaceholder />}

            {!loadingSummary && !summaryError && summary?.sdgs?.length > 0 && (
              <Box 
                sx={{ 
                  height: 450, 
                  width: '100%',
                  '& .MuiDataGrid-root': {
                    border: 'none',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    borderBottom: 'none',
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 700,
                    },
                    '& .MuiDataGrid-iconSeparator': {
                      color: 'rgba(255,255,255,0.3)',
                    },
                    '& .MuiDataGrid-sortIcon': {
                      color: '#fff',
                    },
                    '& .MuiDataGrid-menuIconButton': {
                      color: '#fff',
                    },
                  },
                  '& .MuiDataGrid-row': {
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:nth-of-type(even)': {
                      backgroundColor: alpha(theme.palette.action.hover, 0.04),
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      transform: 'scale(1.002)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.16),
                      },
                    },
                  },
                  '& .MuiDataGrid-cell': {
                    borderColor: alpha(theme.palette.divider, 0.2),
                    py: 1,
                    '&:focus': {
                      outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                      outlineOffset: -2,
                    },
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  },
                  '& .projects-cell': {
                    color: '#1565C0',
                    fontWeight: 600,
                  },
                  '& .publications-cell': {
                    color: '#2E7D32',
                    fontWeight: 600,
                  },
                  '& .departments-cell': {
                    color: '#7B1FA2',
                    fontWeight: 600,
                  },
                  '& .researchers-cell': {
                    color: '#E65100',
                    fontWeight: 600,
                  },
                }}
              >
            <DataGrid
              rows={summary.sdgs}
              getRowId={(row) => row.id}
              onRowClick={(params) => setSelectedSdgId(params.row.id)}
              disableSelectionOnClick
              columns={[
                    {
                      field: 'sdg',
                      headerName: 'SDG',
                      flex: 1.5,
                      minWidth: 200,
                      renderCell: (params) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Chip
                            label={params.row.code}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              background: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
                              color: '#fff',
                              minWidth: 60,
                            }}/>
                            <Typography variant="body2" 
                            sx={{ fontWeight: 5}}>
                            {params.row.title}
                          </Typography>
                        </Box>
                      ),
                    },
                    {
                      field: 'projectCount',
                      headerName: 'Projects',
                      flex: 0.5,
                      minWidth: 100,
                      align: 'right',
                      headerAlign: 'right',
                      cellClassName: 'projects-cell',
                    },
                      {
                      field: 'publicationCount',
                      headerName: 'Publications',
                      flex: 0.5,
                      minWidth: 110,
                      align: 'right',
                      headerAlign: 'right',
                      cellClassName: 'publications-cell',
                    },
                    {
                      field: 'departmentCount',
                      headerName: 'Departments',
                      flex: 0.5,
                      minWidth: 110,
                      align: 'right',
                      headerAlign: 'right',
                      cellClassName: 'departments-cell',
                    },
                      {
                      field: 'researcherCount',
                      headerName: 'Researchers',
                      flex: 0.5,
                      minWidth: 110,
                      align: 'right',
                      headerAlign: 'right',
                      cellClassName: 'researchers-cell',
                    },
                  ]}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
                    />
                    </Box>
            )}
        </Grid>
        </Grid>
        </Paper>
      

        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            mt: 3,
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}>
            <DrillDownPanel
              loading={loadingDetail}
              error={detailError}
              detail={sdgDetail}
              onSelectRecord={handleSelectRecord}
            />
          </Paper>
        </Grid>


      <Paper sx={{ 
        p: 3,
        mt: 3,
        borderRadius: 3,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
      }}>
        <Typography 
          variant="subtitle1" 
          fontWeight="700"
          sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: theme.palette.text.primary,
          }}
        >
          📋 Record Metadata
        </Typography>
        {recordLoading && <Typography color="text.secondary">Loading record details...</Typography>}
        {recordError && <Typography color="error">{recordError}</Typography>}
        {!recordLoading && !focusedRecord && (
          <Typography color="text.secondary">Select a project or publication to inspect its metadata.</Typography>
        )}
        {focusedRecord && <RecordDetail record={focusedRecord} />}
      </Paper>
      </Paper>
    </Box>
  )
}

export default ReportsPage
