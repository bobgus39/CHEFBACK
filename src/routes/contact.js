import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import pool from '../db/connection.js'

const router = Router()

router.post('/', [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('message').trim().notEmpty(),
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const { name, email, message } = req.body
    await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES (?,?,?)',
      [name, email, message]
    )
    res.status(201).json({ message: 'Message sent' })
  } catch (err) {
    next(err)
  }
})

export default router
