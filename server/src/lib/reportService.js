import { getDepartments, getRecordById, getResearchers, getSdgs, listRecords } from '../data/store.js'

const clone = (value) => JSON.parse(JSON.stringify(value))

const maps = () => {
  const sdgMap = new Map(getSdgs().map((sdg) => [sdg.id, sdg]))
  const departmentMap = new Map(getDepartments().map((department) => [department.id, department]))
  const researcherMap = new Map(getResearchers().map((researcher) => [researcher.id, researcher]))

  return { sdgMap, departmentMap, researcherMap }
}

const resolveRecord = (record) => {
  const { sdgMap, departmentMap, researcherMap } = maps()
  const resolvedSdgs = record.sdgIds.map((id) => sdgMap.get(id)).filter(Boolean)
  const resolvedResearchers = record.researcherIds.map((id) => researcherMap.get(id)).filter(Boolean)
  const resolvedDepartment = departmentMap.get(record.departmentId) || null

  return {
    ...clone(record),
    sdgs: resolvedSdgs.map(clone),
    researchers: resolvedResearchers.map(clone),
    department: resolvedDepartment ? clone(resolvedDepartment) : null,
  }
}

export const buildSummary = () => {
  const { sdgMap } = maps()
  const records = listRecords()
  const sdgSummaries = []

  sdgMap.forEach((sdg) => {
    const linked = records.filter((record) => record.sdgIds.includes(sdg.id))
    if (!linked.length) {
      return
    }

    const projects = linked.filter((record) => record.type === 'project')
    const publications = linked.filter((record) => record.type === 'publication')
    const departmentCount = new Set(linked.map((record) => record.departmentId)).size
    const researcherCount = new Set(linked.flatMap((record) => record.researcherIds)).size

    sdgSummaries.push({
      id: sdg.id,
      code: sdg.code,
      title: sdg.title,
      projectCount: projects.length,
      publicationCount: publications.length,
      departmentCount,
      researcherCount,
    })
  })

  const totals = {
    projects: records.filter((record) => record.type === 'project').length,
    publications: records.filter((record) => record.type === 'publication').length,
    departments: new Set(records.map((record) => record.departmentId)).size,
    researchers: new Set(records.flatMap((record) => record.researcherIds)).size,
  }

  return {
    generatedAt: new Date().toISOString(),
    sdgs: sdgSummaries.sort((a, b) => a.id - b.id),
    totals,
  }
}

export const buildSdgDetail = (sdgId) => {
  const { sdgMap } = maps()
  const numericId = Number(sdgId)
  if (!sdgMap.has(numericId)) {
    return null
  }

  const records = listRecords()
  const linked = records.filter((record) => record.sdgIds.includes(numericId)).map(resolveRecord)
  const projects = linked.filter((record) => record.type === 'project')
  const publications = linked.filter((record) => record.type === 'publication')

  const departmentsSet = new Map()
  const researchersSet = new Map()

  linked.forEach((record) => {
    if (record.department) {
      departmentsSet.set(record.department.id, record.department)
    }
    record.researchers.forEach((researcher) => {
      researchersSet.set(researcher.id, researcher)
    })
  })

  return {
    sdg: clone(sdgMap.get(numericId)),
    stats: {
      projects: projects.length,
      publications: publications.length,
      departments: departmentsSet.size,
      researchers: researchersSet.size,
    },
    projects,
    publications,
    departments: Array.from(departmentsSet.values()).map(clone),
    researchers: Array.from(researchersSet.values()).map(clone),
  }
}

export const buildRecordDetail = (recordId) => {
  const record = getRecordById(recordId)
  if (!record) {
    return null
  }

  return resolveRecord(record)
}
