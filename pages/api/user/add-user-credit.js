import { sql } from "@vercel/postgres";
import jwt from 'jsonwebtoken';
export default async function handler(req, res) {
  try {
    let token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 2. 查询用户信息
    const user = await sql`SELECT * FROM fancy_user WHERE email = ${decoded.email}`;
    console.log(user.rows);
    if (user.rows.length === 0) {
      return res.status(201).json({ error: 'no users' });
    }
    return res.status(200).json({ user: user.rows[0] });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    return res.end(JSON.stringify(error));
  }
}
