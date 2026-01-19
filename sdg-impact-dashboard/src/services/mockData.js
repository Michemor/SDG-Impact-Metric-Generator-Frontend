const sdgs = [
  { id: 1, code: 'SDG 1', title: 'No Poverty' },
  { id: 2, code: 'SDG 2', title: 'Zero Hunger' },
  { id: 3, code: 'SDG 3', title: 'Good Health and Well-being' },
  { id: 4, code: 'SDG 4', title: 'Quality Education' },
  { id: 5, code: 'SDG 5', title: 'Gender Equality' },
  { id: 6, code: 'SDG 6', title: 'Clean Water and Sanitation' },
  { id: 7, code: 'SDG 7', title: 'Affordable and Clean Energy' },
  { id: 8, code: 'SDG 8', title: 'Decent Work and Economic Growth' },
  { id: 9, code: 'SDG 9', title: 'Industry, Innovation and Infrastructure' },
  { id: 10, code: 'SDG 10', title: 'Reduced Inequalities' },
  { id: 11, code: 'SDG 11', title: 'Sustainable Cities and Communities' },
  { id: 12, code: 'SDG 12', title: 'Responsible Consumption and Production' },
  { id: 13, code: 'SDG 13', title: 'Climate Action' },
  { id: 14, code: 'SDG 14', title: 'Life Below Water' },
  { id: 15, code: 'SDG 15', title: 'Life on Land' },
  { id: 16, code: 'SDG 16', title: 'Peace, Justice and Strong Institutions' },
  { id: 17, code: 'SDG 17', title: 'Partnerships for the Goals' },
]

const departments = [
  { id: 'dept-1', name: 'School of Business and Economics' },
  { id: 'dept-2', name: 'School of Applied Human Sciences' },
  { id: 'dept-3', name: 'School of Science, Engineering and Health' },
  { id: 'dept-4', name: 'School of Communication, Language and Performing Arts' },
]

const researchers = [
  { id: 'res-1', name: 'Dr. Amina Owino', departmentId: 'dept-1' },
  { id: 'res-2', name: 'Prof. Daniel Mwangi', departmentId: 'dept-3' },
  { id: 'res-3', name: 'Dr. Faith Wambui', departmentId: 'dept-2' },
  { id: 'res-4', name: 'Dr. John Muriuki', departmentId: 'dept-3' },
  { id: 'res-5', name: 'Prof. Sheila Njeri', departmentId: 'dept-4' },
]

let records = [
  {
    id: 'proj-1',
    type: 'project',
    title: 'Community Microfinance Accelerator',
    description:
      'A field implementation project that expands access to microfinance for women-led businesses in rural counties.',
    year: 2024,
    departmentId: 'dept-1',
    researcherIds: ['res-1', 'res-2'],
    sdgIds: [1, 5, 8],
  },
  {
    id: 'pub-1',
    type: 'publication',
    title: 'Clean Energy Adoption Models for Universities',
    description:
      'Peer-reviewed article evaluating cost-saving models for large institutions transitioning to solar microgrids.',
    year: 2023,
    departmentId: 'dept-3',
    researcherIds: ['res-2', 'res-4'],
    sdgIds: [7, 9, 13],
  },
  {
    id: 'proj-2',
    type: 'project',
    title: 'Inclusive Education Technology Initiative',
    description:
      'Pilot program introducing assistive digital tools in low-resource schools to support learners with disabilities.',
    year: 2025,
    departmentId: 'dept-2',
    researcherIds: ['res-3', 'res-5'],
    sdgIds: [4, 10],
  },
]

const clone = (value) => JSON.parse(JSON.stringify(value))

const resolveRecord = (record) => {
  const department = departments.find((dept) => dept.id === record.departmentId)
  const linkedResearchers = record.researcherIds
    .map((id) => researchers.find((person) => person.id === id))
    .filter(Boolean)
  const linkedSdgs = record.sdgIds.map((id) => sdgs.find((goal) => goal.id === id)).filter(Boolean)

  return {
    ...record,
    department: department ? clone(department) : null,
    researchers: clone(linkedResearchers),
    sdgs: clone(linkedSdgs),
  }
}

export const getMockMetadata = () => ({
  sdgs: clone(sdgs),
  departments: clone(departments),
  researchers: clone(researchers),
})

export const getMockSummary = () => {
  const sdgSummaries = sdgs.map((sdg) => {
    const linkedRecords = records.filter((record) => record.sdgIds.includes(sdg.id))
    const projects = linkedRecords.filter((record) => record.type === 'project')
    const publications = linkedRecords.filter((record) => record.type === 'publication')
    const departmentsSet = new Set(linkedRecords.map((record) => record.departmentId))
    const researchersSet = new Set(linkedRecords.flatMap((record) => record.researcherIds))

    return {
      id: sdg.id,
      code: sdg.code,
      title: sdg.title,
      projectCount: projects.length,
      publicationCount: publications.length,
      departmentCount: departmentsSet.size,
      researcherCount: researchersSet.size,
    }
  })

  const allResearchers = new Set(records.flatMap((record) => record.researcherIds))
  const allDepartments = new Set(records.map((record) => record.departmentId))

  return {
    generatedAt: new Date().toISOString(),
    sdgs: sdgSummaries.filter((summary) => summary.projectCount + summary.publicationCount > 0),
    totals: {
      projects: records.filter((record) => record.type === 'project').length,
      publications: records.filter((record) => record.type === 'publication').length,
      researchers: allResearchers.size,
      departments: allDepartments.size,
    },
  }
}

export const getMockSdgDetail = (sdgId) => {
  const numericId = Number(sdgId)
  const sdg = sdgs.find((goal) => goal.id === numericId)
  if (!sdg) {
    return null
  }

  const linked = records.filter((record) => record.sdgIds.includes(numericId)).map(resolveRecord)
  const projects = linked.filter((record) => record.type === 'project')
  const publications = linked.filter((record) => record.type === 'publication')
  const departmentsSet = new Map()
  const researchersSet = new Map()

  linked.forEach((record) => {
    if (record.department) {
      departmentsSet.set(record.department.id, record.department)
    }
    record.researchers.forEach((person) => {
      researchersSet.set(person.id, person)
    })
  })

  return {
    sdg: clone(sdg),
    stats: {
      projects: projects.length,
      publications: publications.length,
      departments: departmentsSet.size,
      researchers: researchersSet.size,
    },
    projects,
    publications,
    departments: Array.from(departmentsSet.values()),
    researchers: Array.from(researchersSet.values()),
  }
}

export const getMockRecordDetail = (recordId) => {
  const record = records.find((item) => item.id === recordId)
  return record ? resolveRecord(record) : null
}

export const addMockRecord = (payload) => {
  const newRecord = {
    ...payload,
    id: `mock-${Date.now()}`,
    sdgIds: payload.sdgIds.map(Number),
  }
  records = [...records, newRecord]
  return resolveRecord(newRecord)
}