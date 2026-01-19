import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { addRecord } from '../data/store.js'
import { buildRecordDetail, buildSummary } from '../lib/reportService.js'
import { parseRecordPayload } from '../lib/validators.js'

const router = Router()

router.get('/:recordId', (request, response) => {
  const detail = buildRecordDetail(request.params.recordId)
  if (!detail) {
    response.status(404).json({ message: 'Record not found.' })
    return
  }

  response.json(detail)
})

router.post('/', (request, response, next) => {
  try {
    const parsed = parseRecordPayload(request.body || {})
    const record = addRecord({
      ...parsed,
      id: randomUUID(),
    })

    const detail = buildRecordDetail(record.id)
    const summary = buildSummary()

    response.status(201).json({ record: detail, summary })
  } catch (error) {
    next(error)
  }
})

export default router
