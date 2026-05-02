/**
 * Run once to create the admin user in Railway MySQL:
 *   node scripts/create-admin.js admin@bistrocali.com yourpassword
 */
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import pool from '../src/db/connection.js'

const [, , email, password] = process.argv
if (!email || !password) {
  console.error('Usage: node scripts/create-admin.js <email> <password>')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 12)
await pool.query('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)', [email, hash])
console.log(`✓ Admin created: ${email}`)
await pool.end()
