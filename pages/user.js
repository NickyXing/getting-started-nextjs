import pool from '../db.mjs';

const createUser = async (email, password, name) => {
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      [email, password, name]
    );
    return rows[0];
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

const getUserByEmail = async (email) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  } catch (err) {
    console.error('Error getting user by email:', err);
    throw err;
  }
}

module.exports = {
  createUser,
  getUserByEmail,
};