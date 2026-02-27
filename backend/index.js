const express = require('express')
const cors = require('cors')
const path = require('path')
const pool = require('./db')
const createStudentRouter = require('./student')
const createInstructorRouter = require('./instructor')

const app = express()
const PORT = 5006

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'data')))

app.use('/api', createInstructorRouter({ pool, dataRoot: path.join(__dirname, 'data') }))
app.use('/api', createStudentRouter({ pool }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
