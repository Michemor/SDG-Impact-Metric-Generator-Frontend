import { z } from 'zod'
import { getDepartments, getResearchers, getSdgs } from '../data/store.js'

const recordSchema = z
  .object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters long.').max(220),
    description: z
      .string()
      .trim()
      .min(20, 'Description should be 20 characters or longer to provide context.')
      .max(4000, 'Description cannot exceed 4000 characters.'),
    type: z.enum(['project', 'publication'], 'Type must be either project or publication.'),
    sdgIds: z.array(z.number().int()).min(1, 'Select at least one SDG goal.'),
    departmentId: z.string().min(1, 'Department is required.'),
    researcherIds: z.array(z.string().min(1)).min(1, 'Select one or more researchers.'),
    year: z
      .number()
      .int()
      .min(1970, 'Year cannot be earlier than 1970.')
      .max(new Date().getFullYear() + 1, 'Year cannot be far in the future.'),
  })
  .strict()

const normalisePayload = (payload) => ({
  ...payload,
  title: typeof payload.title === 'string' ? payload.title.trim() : payload.title,
  description: typeof payload.description === 'string' ? payload.description.trim() : payload.description,
  year: Number(payload.year),
  sdgIds: Array.isArray(payload.sdgIds) ? payload.sdgIds.map((value) => Number(value)) : [],
  researcherIds: Array.isArray(payload.researcherIds) ? payload.researcherIds.map(String) : [],
})

const buildValidationError = (issues) => {
  const error = new Error('Validation failed.')
  error.statusCode = 400
  error.details = issues
  return error
}

export const parseRecordPayload = (payload) => {
  const normalised = normalisePayload(payload)
  const result = recordSchema.safeParse(normalised)

  if (!result.success) {
    throw buildValidationError(result.error.flatten().fieldErrors)
  }

  const sdgSet = new Set(getSdgs().map((sdg) => sdg.id))
  const departmentSet = new Set(getDepartments().map((department) => department.id))
  const researcherSet = new Set(getResearchers().map((researcher) => researcher.id))

  const invalidSdgs = result.data.sdgIds.filter((id) => !sdgSet.has(id))
  if (invalidSdgs.length) {
    throw buildValidationError({ sdgIds: [`Unknown SDG ids: ${invalidSdgs.join(', ')}`] })
  }

  if (!departmentSet.has(result.data.departmentId)) {
    throw buildValidationError({ departmentId: ['Department does not exist.'] })
  }

  const invalidResearchers = result.data.researcherIds.filter((id) => !researcherSet.has(id))
  if (invalidResearchers.length) {
    throw buildValidationError({ researcherIds: [`Unknown researcher ids: ${invalidResearchers.join(', ')}`] })
  }

  return result.data
}
