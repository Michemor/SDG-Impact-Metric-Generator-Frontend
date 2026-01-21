import { departments, researchers, sdgs } from './reference.js'

let records = [
  {
    id: 'proj-1',
    type: 'project',
    title: 'Community Microfinance Accelerator',
    description:
      'Extends microfinance access to women-led MSMEs across Machakos and Kajiado, combining financial literacy with product innovation.',
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
      'Published in the East African Energy Review, outlining financing, regulatory, and operational considerations for campus microgrids.',
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
      'Deployment of assistive education platforms in rural Kenyan schools, co-designed with the Ministry of Education and NGOs.',
    year: 2025,
    departmentId: 'dept-2',
    researcherIds: ['res-3', 'res-5'],
    sdgIds: [4, 10],
  },
  {
    id: 'pub-2',
    type: 'publication',
    title: 'Climate-resilient Urban Agriculture Framework',
    description:
      'Empirical evidence on rooftop farming adoption and policy incentives to lower food import dependency.',
    year: 2022,
    departmentId: 'dept-5',
    researcherIds: ['res-6'],
    sdgIds: [2, 11, 13],
  },
]

export const getSdgs = () => sdgs
export const getDepartments = () => departments
export const getResearchers = () => researchers

export const listRecords = () => records.map((record) => ({ ...record }))

export const getRecordById = (recordId) => records.find((record) => record.id === recordId) || null

export const addRecord = (record) => {
  records = [...records, record]
  return record
}

export const replaceRecords = (newRecords) => {
  records = [...newRecords]
}
