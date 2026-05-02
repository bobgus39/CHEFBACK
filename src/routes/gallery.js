import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery ORDER BY display_order, id')
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

export default router
