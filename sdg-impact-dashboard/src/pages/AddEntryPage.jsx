import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Divider,
} from '@mui/material'
import { createRecord, fetchMetadata } from '../services/apiClient'

const currentYear = new Date().getFullYear()

const initialFormState = {
  title: '',
  description: '',
  sdgIds: [],
  departmentId: '',
  researcherIds: [],
  type: 'project',
  year: currentYear,
}

const AddEntryPage = () => {
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverMessage, setServerMessage] = useState(null)
  const [metadata, setMetadata] = useState({ sdgs: [], departments: [], researchers: [] })
  const [loadingMetadata, setLoadingMetadata] = useState(true)

  useEffect(() => {
    const loadMetadata = async () => {
      setLoadingMetadata(true)
      try {
        const data = await fetchMetadata()
        setMetadata(data)
      } catch (error) {
        setServerMessage(error.message)
      } finally {
        setLoadingMetadata(false)
      }
    }

    loadMetadata()
  }, [])

  const sdgLookup = useMemo(() => new Map(metadata.sdgs.map((sdg) => [sdg.id, sdg])), [metadata.sdgs])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({
      ...previous,
      [name]: name === 'year' ? Number(value) : value,
    }))
  }

  const toggleSelection = (field, value) => {
    const numericValue = typeof value === 'number' ? value : Number(value)
    setForm((previous) => {
      const collection = new Set(previous[field])
      if (collection.has(numericValue)) {
        collection.delete(numericValue)
      } else {
        collection.add(numericValue)
      }
      return { ...previous, [field]: Array.from(collection) }
    })
  }

  const toggleStringSelection = (field, value) => {
    setForm((previous) => {
      const collection = new Set(previous[field])
      if (collection.has(value)) {
        collection.delete(value)
      } else {
        collection.add(value)
      }
      return { ...previous, [field]: Array.from(collection) }
    })
  }

  const validate = () => {
    const validationErrors = {}
    if (!form.title.trim()) validationErrors.title = 'Title is required.'
    if (!form.description.trim()) validationErrors.description = 'Description or abstract is required.'
    if (!form.departmentId) validationErrors.departmentId = 'Select a department.'
    if (!form.sdgIds.length) validationErrors.sdgIds = 'Select at least one SDG.'
    if (!form.researcherIds.length) validationErrors.researcherIds = 'Select one or more researchers or authors.'
    if (!Number.isInteger(form.year) || form.year < 1970 || form.year > currentYear + 1) {
      validationErrors.year = `Enter a valid year between 1970 and ${currentYear + 1}.`
    }
    if (!['project', 'publication'].includes(form.type)) validationErrors.type = 'Choose a valid type.'
    return validationErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerMessage(null)
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length) return

    setStatus('submitting')
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        sdgIds: form.sdgIds,
        departmentId: form.departmentId,
        researcherIds: form.researcherIds,
        type: form.type,
        year: Number(form.year),
      }

      await createRecord(payload)
      setStatus('success')
      setServerMessage('Entry saved successfully. Reports and visualisations will include the new record.')
      setErrors({})
      setForm({ ...initialFormState })
    } catch (error) {
      setStatus('error')
      setServerMessage(error.message || 'Unable to save the record. Please try again.')
    }
  }

  const selectedSdgs = form.sdgIds.map((id) => sdgLookup.get(Number(id))).filter(Boolean)

  return (
    <Paper sx={{ 
      p: 3,
      m: 3,
       }}>
      <Typography variant="h4" sx={{
        color: (theme) => theme.palette.primary.main,
      }}fontWeight="bold" gutterBottom>
        Add Project or Publication
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Capture new scholarship outputs and automatically link them to SDGs, departments, and researchers. Validations
        run on both the client and the API to protect data quality.
      </Typography>

      {serverMessage && (
        <Alert severity={status === 'success' ? 'success' : 'error'} sx={{ mb: 2 }}>
          {serverMessage}
        </Alert>
      )}

      {loadingMetadata ? (
        <Typography color="text.secondary">Loading metadata (SDGs, departments, researchers)...</Typography>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  id="title"
                  name="title"
                  label="Title"
                  value={form.title}
                  onChange={handleInputChange}
                  error={Boolean(errors.title)}
                  helperText={errors.title}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl fullWidth required error={Boolean(errors.type)}>
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    value={form.type}
                    label="Type"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="project">Project</MenuItem>
                    <MenuItem value="publication">Publication</MenuItem>
                  </Select>
                  {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  required
                  id="year"
                  name="year"
                  label="Year"
                  type="number"
                  inputProps={{ min: 1970, max: currentYear + 1 }}
                  value={form.year}
                  onChange={handleInputChange}
                  error={Boolean(errors.year)}
                  helperText={errors.year}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={Boolean(errors.departmentId)}>
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    id="departmentId"
                    name="departmentId"
                    value={form.departmentId}
                    label="Department"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">
                      <em>Select department</em>
                    </MenuItem>
                    {metadata.departments.map((department) => (
                      <MenuItem key={department.id} value={department.id}>
                        {department.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.departmentId && <FormHelperText>{errors.departmentId}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              required
              multiline
              minRows={3}
              id="description"
              name="description"
              label="Description / Abstract"
              value={form.description}
              onChange={handleInputChange}
              error={Boolean(errors.description)}
              helperText={errors.description}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                SDG(s) <span style={{ color: '#d32f2f' }}>*</span>
              </Typography>
              <ToggleButtonGroup value={form.sdgIds} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                {metadata.sdgs.map((sdg) => (
                  <ToggleButton
                    key={sdg.id}
                    value={Number(sdg.id)}
                    selected={form.sdgIds.includes(Number(sdg.id))}
                    onClick={() => toggleSelection('sdgIds', sdg.id)}
                    size="small"
                  >
                    {sdg.code}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              {errors.sdgIds && (
                <FormHelperText error sx={{ mt: 0.5 }}>
                  {errors.sdgIds}
                </FormHelperText>
              )}
              {selectedSdgs.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Selected: {selectedSdgs.map((sdg) => sdg.title).join(', ')}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Researchers / Authors <span style={{ color: '#d32f2f' }}>*</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {metadata.researchers.map((person) => (
                  <Chip
                    key={person.id}
                    label={person.name}
                    clickable
                    color={form.researcherIds.includes(person.id) ? 'primary' : 'default'}
                    variant={form.researcherIds.includes(person.id) ? 'filled' : 'outlined'}
                    onClick={() => toggleStringSelection('researcherIds', person.id)}
                  />
                ))}
              </Box>
              {errors.researcherIds && (
                <FormHelperText error sx={{ mt: 0.5 }}>
                  {errors.researcherIds}
                </FormHelperText>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Saving...' : 'Save Entry'}
              </Button>
            </Box>
          </Stack>
        </Box>
      )}
    </Paper>
  )
}

export default AddEntryPage
