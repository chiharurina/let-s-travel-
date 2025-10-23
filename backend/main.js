// backend/main.js
import { supabase } from './supabaseAdmin.js'
import bcrypt from 'bcryptjs'

// Count rows
async function sanity() {
  const { count, error } = await supabase
    .from('userdata')
    .select('*', { count: 'exact', head: true })
  if (error) console.error('❌ Count error:', error)
  else console.log('📊 Row count:', count)
}

// Insert a user (username + password hash)
async function addUser(username, plainPassword) {
  const password_hash = await bcrypt.hash(plainPassword, 10)

  const { data, error } = await supabase
    .from('userdata')
    .insert([{ username, password_hash }])
    .select('id, username, created_at') 
  if (error) console.error('❌ Insert error:', error)
  else console.log('✅ Inserted:', data)
}

// Fetch users 
async function fetchUsers() {
  const { data, error } = await supabase
    .from('userdata')
    .select('id, username, created_at')
  if (error) console.error('❌ Select error:', error)
  else console.log('✅ Users:', data)
}

// Simple login check 
async function checkLogin(username, plainPassword) {
  const { data, error } = await supabase
    .from('userdata')
    .select('id, username, password_hash')
    .eq('username', username)
    .single()
  if (error) return console.error('❌ Fetch user error:', error)

  const ok = await bcrypt.compare(plainPassword, data.password_hash)
  console.log(ok ? '🔐 Login OK' : '🔐 Login FAILED')
}

async function main() {
  await sanity()
  await addUser('demo_user', 'SuperSecret123!')
  await fetchUsers()
  await checkLogin('demo_user', 'SuperSecret123!')
}

main()