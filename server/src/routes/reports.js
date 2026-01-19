import { Router } from 'express'
import { buildSdgDetail, buildSummary } from '../lib/reportService.js'

const router = Router()

router.get('/summary', (_request, response) => {
  const payload = buildSummary()
  response.json(payload)
})

router.get('/sdg/:sdgId', (request, response, next) => {
  try {
    const detail = buildSdgDetail(request.params.sdgId)
    if (!detail) {
      response.status(404).json({ message: 'SDG not found.' })
      return
    }
    response.json(detail)
  } catch (error) {
    next(error)
  }
})

export default router
