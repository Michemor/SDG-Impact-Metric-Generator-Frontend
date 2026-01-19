import express from 'express'
import cors from 'cors'
import metadataRouter from './routes/metadata.js'
import reportsRouter from './routes/reports.js'
import recordsRouter from './routes/records.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (request, response) => {
  response.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/metadata', metadataRouter)
app.use('/api/reports', reportsRouter)
app.use('/api/records', recordsRouter)

// Centralised error handler keeps API responses consistent
// eslint-disable-next-line no-unused-vars
app.use((error, request, response, _next) => {
  console.error('[API Error]', error)
  const status = error.statusCode || 500
  response.status(status).json({
    message: error.message || 'Unexpected server error.',
    details: error.details || null,
  })
})

export default app
