import { Router } from 'express'
import { addResearcher, getDepartments, getResearchers, getSdgs } from '../data/store.js'

const router = Router()

router.get('/', (_request, response) => {
  response.json({
    sdgs: getSdgs(),
    departments: getDepartments(),
    researchers: getResearchers(),
  })
})

router.post('/researchers', (request, response) => {
  const { name, departmentId } = request.body

  if (!name || !name.trim()) {
    return response.status(400).json({ message: 'Researcher name is required.' })
  }

  if (!departmentId) {
    return response.status(400).json({ message: 'Department is required.' })
  }

  const id = `res-${Date.now()}`
  const researcher = addResearcher({ id, name: name.trim(), departmentId })
  response.status(201).json({ researcher })
})

export default router
