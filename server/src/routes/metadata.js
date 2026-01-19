import { Router } from 'express'
import { getDepartments, getResearchers, getSdgs } from '../data/store.js'

const router = Router()

router.get('/', (_request, response) => {
  response.json({
    sdgs: getSdgs(),
    departments: getDepartments(),
    researchers: getResearchers(),
  })
})

export default router
