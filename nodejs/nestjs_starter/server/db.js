// this file is for accessing the database via terminal for manual setup tasks.
require('dotenv').config()
const { Pool } = require('pg')
const argon2 = require('argon2')

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

async function handleUserInput() {
  try {
    // $ node db.js <action> <param1> <param2>
    // console.log({ userInputs: process.argv.slice(2) })
    const [action, param1, param2, param3] = process.argv.slice(2)

    switch (action) {
      case 'user-create':
        // $ node db.js user-create
        // $ node db.js user-create <name> <password>
        await userCreate(param1, param2, param3)
        break
      case 'users':
        // $ node db.js users
        await usersList()
        break
      case 'workspaces':
        // $ node db.js workspaces
        await workspacesList()
        break
      case 'workspace-memberships':
        // $ node db.js workspaces
        await workspaceMembershipsList()
        break
      default:
        console.log(`The action "${action}" was not identified`)
    }
  } catch (error) {
    console.error(error.message)
  }

  pool.end()
}

async function userCreate(
  name = process.env.DEV_APP_USER,
  password = process.env.DEV_APP_PW,
  role = process.env.DEV_APP_ROLE,
) {
  const hash = await argon2.hash(password)
  const now = new Date().toISOString()
  const res = await pool.query(
    'INSERT INTO users (name, hash, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)',
    [name, hash, role, now],
  )
  // console.log(`Created user with the name ${name}`)
  console.log(res)
}

async function usersList() {
  const res = await pool.query('SELECT * FROM users')
  console.log(res.rows)
}

async function workspacesList() {
  const res = await pool.query('SELECT * FROM workspaces')
  console.log(res.rows)
}

async function workspaceMembershipsList() {
  const res = await pool.query('SELECT * FROM workspace-memberships')
  console.log(res.rows)
}

handleUserInput()
