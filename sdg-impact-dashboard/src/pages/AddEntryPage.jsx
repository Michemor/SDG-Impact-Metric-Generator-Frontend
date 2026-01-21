import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Plus, X } from 'lucide-react'
import { createRecord, createResearcher, fetchMetadata } from '../services/apiClient'

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

export default function AddEntryPage() {
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverMessage, setServerMessage] = useState(null)
  const [metadata, setMetadata] = useState({ sdgs: [], departments: [], researchers: [] })
  const [loadingMetadata, setLoadingMetadata] = useState(true)
  
  // New researcher modal state
  const [showAddResearcher, setShowAddResearcher] = useState(false)
  const [newResearcher, setNewResearcher] = useState({ name: '', departmentId: '' })
  const [addingResearcher, setAddingResearcher] = useState(false)
  const [researcherError, setResearcherError] = useState('')

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

  const sdgLookup = useMemo(
    () => new Map(metadata.sdgs.map((sdg) => [sdg.id, sdg])),
    [metadata.sdgs]
  )

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

  const handleAddResearcher = async () => {
    if (!newResearcher.name.trim()) {
      setResearcherError('Researcher name is required.')
      return
    }
    if (!newResearcher.departmentId) {
      setResearcherError('Please select a department.')
      return
    }

    setAddingResearcher(true)
    setResearcherError('')

    try {
      const { researcher } = await createResearcher(newResearcher)
      setMetadata((prev) => ({
        ...prev,
        researchers: [...prev.researchers, researcher],
      }))
      // Auto-select the new researcher
      setForm((prev) => ({
        ...prev,
        researcherIds: [...prev.researcherIds, researcher.id],
      }))
      setNewResearcher({ name: '', departmentId: '' })
      setShowAddResearcher(false)
    } catch (error) {
      setResearcherError(error.message || 'Failed to add researcher.')
    } finally {
      setAddingResearcher(false)
    }
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
    {/** Send data to backend */}
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
      setErrors({})
      setForm({ ...initialFormState })
      setServerMessage('Entry added successfully!')
    } catch (error) {
      setStatus('error')
      setServerMessage(error.message || 'Unable to save the record. Please try again.')
    }
  }

  const selectedSdgs = form.sdgIds.map((id) => sdgLookup.get(Number(id))).filter(Boolean)

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          Add Project or Publication
        </h1>
        <hr className="my-4 border-gray-200" />
        <p className="text-gray-600 text-sm mb-6">
          Capture new publications and projects and automatically link them to SDGs, departments, and researchers. 
        </p>

        {/* Error Messages Only - Success handled by dialog */}
        {serverMessage && status === 'error' && (
          <div className="flex items-center gap-3 p-4 rounded-lg mb-6 bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{serverMessage}</p>
          </div>
        )}

        {loadingMetadata ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading metadata (SDGs, departments, researchers)...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title, Type, Year Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="project">Project</option>
                  <option value="publication">Publication</option>
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  min={1970}
                  max={currentYear + 1}
                  value={form.year}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.year ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
              </div>
            </div>

            {/* Department */}
            <div className="sm:w-1/2">
              <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                id="departmentId"
                name="departmentId"
                value={form.departmentId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.departmentId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select department</option>
                {metadata.departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && <p className="mt-1 text-sm text-red-600">{errors.departmentId}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description / Abstract <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* SDGs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SDG(s) <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {metadata.sdgs.map((sdg) => (
                  <button
                    key={sdg.id}
                    type="button"
                    onClick={() => toggleSelection('sdgIds', sdg.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      form.sdgIds.includes(Number(sdg.id))
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {sdg.code}
                  </button>
                ))}
              </div>
              {errors.sdgIds && <p className="mt-1 text-sm text-red-600">{errors.sdgIds}</p>}
              {selectedSdgs.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {selectedSdgs.map((sdg) => sdg.title).join(', ')}
                </p>
              )}
            </div>

            {/* Researchers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Researchers / Authors <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {metadata.researchers.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => toggleStringSelection('researcherIds', person.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      form.researcherIds.includes(person.id)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {person.name}
                  </button>
                ))}
                {/* Add New Researcher Button */}
                <button
                  type="button"
                  onClick={() => setShowAddResearcher(true)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium border border-dashed border-gray-400 text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-all flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              </div>
              {errors.researcherIds && <p className="mt-1 text-sm text-red-600">{errors.researcherIds}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {status === 'submitting' ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </span>
                ) : (
                  'Save Entry'
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Add New Researcher Modal */}
      {showAddResearcher && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-10 flex items-center justify-center z-50 animation-fade-in">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Add New Researcher</h2>
              <button
                type="button"
                onClick={() => {
                  setShowAddResearcher(false)
                  setNewResearcher({ name: '', departmentId: '' })
                  setResearcherError('')
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {researcherError && (
              <div className="flex items-center gap-2 p-3 rounded-lg mb-4 bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{researcherError}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="researcherName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="researcherName"
                  value={newResearcher.name}
                  onChange={(e) => setNewResearcher((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Dr. Jane Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="researcherDepartment" className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="researcherDepartment"
                  value={newResearcher.departmentId}
                  onChange={(e) => setNewResearcher((prev) => ({ ...prev, departmentId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Select department</option>
                  {metadata.departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAddResearcher(false)
                  setNewResearcher({ name: '', departmentId: '' })
                  setResearcherError('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddResearcher}
                disabled={addingResearcher}
                className="flex-1 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {addingResearcher ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </span>
                ) : (
                  'Add Researcher'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
