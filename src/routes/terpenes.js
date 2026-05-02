import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM terpenes ORDER BY name')
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM terpenes WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

export default router
