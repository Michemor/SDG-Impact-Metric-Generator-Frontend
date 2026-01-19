import { useEffect, useMemo, useState } from 'react'
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
      return {
        ...previous,
        [field]: Array.from(collection),
      }
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
      return {
        ...previous,
        [field]: Array.from(collection),
      }
    })
  }

  const validate = () => {
    const validationErrors = {}

    if (!form.title.trim()) {
      validationErrors.title = 'Title is required.'
    }

    if (!form.description.trim()) {
      validationErrors.description = 'Description or abstract is required.'
    }

    if (!form.departmentId) {
      validationErrors.departmentId = 'Select a department.'
    }

    if (!form.sdgIds.length) {
      validationErrors.sdgIds = 'Select at least one SDG.'
    }

    if (!form.researcherIds.length) {
      validationErrors.researcherIds = 'Select one or more researchers or authors.'
    }

    if (!Number.isInteger(form.year) || form.year < 1970 || form.year > currentYear + 1) {
      validationErrors.year = `Enter a valid year between 1970 and ${currentYear + 1}.`
    }

    if (!['project', 'publication'].includes(form.type)) {
      validationErrors.type = 'Choose a valid type.'
    }

    return validationErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerMessage(null)
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length) {
      return
    }

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

      const result = await createRecord(payload)
      setStatus('success')
      setServerMessage('Entry saved successfully. Reports and visualisations will include the new record.')
      setErrors({})
      setForm({ ...initialFormState })
      return result
    } catch (error) {
      setStatus('error')
      setServerMessage(error.message || 'Unable to save the record. Please try again.')
    }
  }

  const selectedSdgs = form.sdgIds.map((id) => sdgLookup.get(Number(id))).filter(Boolean)

  return (
    <div className="card">
      <h2>Add Project or Publication</h2>
      <p className="muted" style={{ marginBottom: '1.5rem' }}>
        Capture new scholarship outputs and automatically link them to SDGs, departments, and researchers. Validations
        run on both the client and the API to protect data quality.
      </p>

      {serverMessage ? (
        <div className={status === 'success' ? 'success-banner' : 'error-text'} style={{ marginBottom: '1rem' }}>
          {serverMessage}
        </div>
      ) : null}

      {loadingMetadata ? (
        <div className="muted">Loading metadata (SDGs, departments, researchers)...</div>
      ) : (
        <form onSubmit={handleSubmit} className="vertical-stack">
          <div className="form-grid">
            <div className="field">
              <label htmlFor="title">
                Title<span style={{ color: '#dc2626' }}> *</span>
              </label>
              <input id="title" name="title" value={form.title} onChange={handleInputChange} placeholder="Enter title" />
              {errors.title ? <span className="error-text">{errors.title}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="type">
                Type<span style={{ color: '#dc2626' }}> *</span>
              </label>
              <select id="type" name="type" value={form.type} onChange={handleInputChange}>
                <option value="project">Project</option>
                <option value="publication">Publication</option>
              </select>
              {errors.type ? <span className="error-text">{errors.type}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="year">
                Year<span style={{ color: '#dc2626' }}> *</span>
              </label>
              <input
                id="year"
                name="year"
                type="number"
                min="1970"
                max={currentYear + 1}
                value={form.year}
                onChange={handleInputChange}
              />
              {errors.year ? <span className="error-text">{errors.year}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="departmentId">
                Department<span style={{ color: '#dc2626' }}> *</span>
              </label>
              <select
                id="departmentId"
                name="departmentId"
                value={form.departmentId}
                onChange={handleInputChange}
              >
                <option value="">Select department</option>
                {metadata.departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              {errors.departmentId ? <span className="error-text">{errors.departmentId}</span> : null}
            </div>
          </div>

          <div className="field">
            <label htmlFor="description">
              Description / Abstract<span style={{ color: '#dc2626' }}> *</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Summarise objectives, methodology, or outcomes..."
            />
            {errors.description ? <span className="error-text">{errors.description}</span> : null}
          </div>

          <div className="field">
            <label>
              SDG(s)<span style={{ color: '#dc2626' }}> *</span>
            </label>
            <div className="chip-list">
              {metadata.sdgs.map((sdg) => (
                <button
                  key={sdg.id}
                  type="button"
                  className={`tag-button ${form.sdgIds.includes(Number(sdg.id)) ? 'active' : ''}`}
                  onClick={() => toggleSelection('sdgIds', sdg.id)}
                >
                  {sdg.code}
                </button>
              ))}
            </div>
            {errors.sdgIds ? <span className="error-text">{errors.sdgIds}</span> : null}
            {selectedSdgs.length ? (
              <div className="muted" style={{ marginTop: '0.35rem', fontSize: '0.9rem' }}>
                Selected: {selectedSdgs.map((sdg) => sdg.title).join(', ')}
              </div>
            ) : null}
          </div>

          <div className="field">
            <label>
              Researchers / Authors<span style={{ color: '#dc2626' }}> *</span>
            </label>
            <div className="chip-list">
              {metadata.researchers.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  className={`tag-button ${form.researcherIds.includes(person.id) ? 'active' : ''}`}
                  onClick={() => toggleStringSelection('researcherIds', person.id)}
                >
                  {person.name}
                </button>
              ))}
            </div>
            {errors.researcherIds ? <span className="error-text">{errors.researcherIds}</span> : null}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AddEntryPage
