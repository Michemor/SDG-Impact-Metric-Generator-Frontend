import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { createRecord, fetchMetadata } from '../services/apiClient'
import SuccessDialog from '../components/SuccessDialog'

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
  const navigate = useNavigate()
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverMessage, setServerMessage] = useState(null)
  const [metadata, setMetadata] = useState({ sdgs: [], departments: [], researchers: [] })
  const [loadingMetadata, setLoadingMetadata] = useState(true)
  
  // Success dialog state
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successDialogConfig, setSuccessDialogConfig] = useState({
    title: 'Success!',
    message: '',
    type: 'success'
  })

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
      setErrors({})
      setForm({ ...initialFormState })
      
      // Show success dialog
      setSuccessDialogConfig({
        title: 'Entry Added Successfully!',
        message: `Your ${form.type} "${form.title}" has been saved. Reports and visualizations will now include this new record.`,
        type: 'success'
      })
      setShowSuccessDialog(true)
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
          Capture new scholarship outputs and automatically link them to SDGs, departments, and researchers. 
          Validations run on both the client and the API to protect data quality.
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
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {person.name}
                  </button>
                ))}
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

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title={successDialogConfig.title}
        message={successDialogConfig.message}
        type={successDialogConfig.type}
        showConfetti={true}
        autoClose={false}
        actionLabel="View Projects"
        onAction={() => navigate('/projects')}
      />
    </div>
  )
}
