import { Router } from 'express'
import pool from '../db/connection.js'
import authJWT from '../middleware/authJWT.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query
    let sql = 'SELECT * FROM menu_items WHERE active = TRUE'
    const params = []
    if (category && category !== 'all') {
      sql += ' AND category = ?'
      params.push(category)
    }
    sql += ' ORDER BY category, id'
    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

router.post('/', authJWT, async (req, res, next) => {
  try {
    const { name_es, name_en, description_es, description_en, terpene_profile, category, price, image_url } = req.body
    const [result] = await pool.query(
      'INSERT INTO menu_items (name_es, name_en, description_es, description_en, terpene_profile, category, price, image_url) VALUES (?,?,?,?,?,?,?,?)',
      [name_es, name_en, description_es, description_en, terpene_profile, category, price, image_url]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', authJWT, async (req, res, next) => {
  try {
    const { name_es, name_en, description_es, description_en, terpene_profile, category, price, image_url, active } = req.body
    await pool.query(
      'UPDATE menu_items SET name_es=?, name_en=?, description_es=?, description_en=?, terpene_profile=?, category=?, price=?, image_url=?, active=? WHERE id=?',
      [name_es, name_en, description_es, description_en, terpene_profile, category, price, image_url, active, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', authJWT, async (req, res, next) => {
  try {
    await pool.query('UPDATE menu_items SET active = FALSE WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default router
