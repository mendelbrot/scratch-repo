const { Pool } = require("pg");

const pool = new Pool({
  user: "dint",
  database: "dint",
  password: "password",
  port: 5432,
  host: "localhost",
});

module.exports = { pool };
