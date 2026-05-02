import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import pool from '../db/connection.js'

const router = Router()

const validate = [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('date').isDate().withMessage('Valid date required'),
  body('time').matches(/^\d{2}:\d{2}$/).withMessage('Valid time required (HH:MM)'),
  body('guests').isInt({ min: 1, max: 50 }).withMessage('Guests must be 1-50'),
]

router.post('/', validate, async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const { name, email, phone, date, time, guests, service_type, message } = req.body
    const [result] = await pool.query(
      'INSERT INTO reservations (name, email, phone, date, time, guests, service_type, message) VALUES (?,?,?,?,?,?,?,?)',
      [name, email, phone || null, date, time, guests, service_type || null, message || null]
    )
    res.status(201).json({ id: result.insertId, message: 'Reservation created' })
  } catch (err) {
    next(err)
  }
})

export default router
