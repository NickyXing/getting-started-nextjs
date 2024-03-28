import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  try {
    const email = req.query.email;
    const password = req.query.password;
    const name = req.query.name;
    await sql`INSERT INTO users (email, password, name)
    VALUES (${email}, ${password},${name});`;
    const users = await sql`SELECT * FROM users;`;
    res.statusCode = 201;
    return res.end(JSON.stringify(users));
  } catch (error) {
    res.statusCode = 500;
    return res.end(JSON.stringify(error));
  }
}
