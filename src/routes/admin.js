import { Router } from 'express'
import pool from '../db/connection.js'
import authJWT from '../middleware/authJWT.js'

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

export default router
