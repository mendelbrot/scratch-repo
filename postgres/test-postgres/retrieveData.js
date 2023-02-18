const { pool } = require("./db");

async function retrieveData() {
  try {
    const res = await pool.query("SELECT * FROM sharks");
    console.log(res.rows);
  } catch (error) {
    console.error(error);
  }
}

retrieveData()
