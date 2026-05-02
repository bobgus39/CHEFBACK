import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initDB } from './db/init.js'

import menuRouter from './routes/menu.js'
import terpenesRouter from './routes/terpenes.js'
import galleryRouter from './routes/gallery.js'
import reservationsRouter from './routes/reservations.js'
import contactRouter from './routes/contact.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    'http://localhost:5173',
  ],
  credentials: true,
}))

app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ status: 'ok', project: 'BISTROCALI' }))

app.use('/api/menu', menuRouter)
app.use('/api/terpenes', terpenesRouter)
app.use('/api/gallery', galleryRouter)
app.use('/api/reservations', reservationsRouter)
app.use('/api/contact', contactRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error', detail: err.message, code: err.code })
})

app.listen(PORT, async () => {
  console.log(`BISTROCALI server running on port ${PORT}`)
  try {
    await initDB()
  } catch (err) {
    console.error('DB init failed:', err.message)
  }
})
