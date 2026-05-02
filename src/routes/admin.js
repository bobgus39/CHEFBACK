import { Router } from 'express'
import pool from '../db/connection.js'
import authJWT from '../middleware/authJWT.js'
import { upload, uploadToCloudinary, cloudinary } from '../middleware/upload.js'

const router = Router()
router.use(authJWT)

router.get('/reservations', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM reservations ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

router.patch('/reservations/:id', async (req, res, next) => {
  try {
    const { status } = req.body
    const allowed = ['pending', 'confirmed', 'cancelled']
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' })

    await pool.query('UPDATE reservations SET status = ? WHERE id = ?', [status, req.params.id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

router.get('/messages', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

router.patch('/messages/:id/read', async (req, res, next) => {
  try {
    await pool.query('UPDATE contact_messages SET read_at = NOW() WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// Gallery
router.get('/gallery', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery ORDER BY display_order, id')
    res.json(rows)
  } catch (err) { next(err) }
})

router.post('/gallery', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' })
    const result = await uploadToCloudinary(req.file.buffer, 'bistrocali/gallery')
    const { title_es = '', title_en = '', category = 'dishes', display_order = 0 } = req.body
    const [r] = await pool.query(
      'INSERT INTO gallery (image_url, title_es, title_en, category, display_order) VALUES (?,?,?,?,?)',
      [result.secure_url, title_es, title_en, category, display_order]
    )
    res.status(201).json({ id: r.insertId, image_url: result.secure_url })
  } catch (err) { next(err) }
})

router.delete('/gallery/:id', async (req, res, next) => {
  try {
    const [[row]] = await pool.query('SELECT image_url FROM gallery WHERE id = ?', [req.params.id])
    if (!row) return res.status(404).json({ error: 'Not found' })
    // Extract public_id from Cloudinary URL and delete
    const publicId = row.image_url.split('/').slice(-2).join('/').replace(/\.[^.]+$/, '')
    await cloudinary.uploader.destroy(publicId).catch(() => {})
    await pool.query('DELETE FROM gallery WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

export default router
