import app from './app.js'

const port = Number(process.env.PORT) || 4000

app.listen(port, () => {
  console.log(`Daystar Research Intelligence API listening on http://localhost:${port}`)
})
