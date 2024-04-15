import { sql } from "@vercel/postgres";
import jwt from 'jsonwebtoken';
export default async function handler(req, res) {
  try {
    let token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 查询email用户下的remove_list
    const result = await sql`SELECT * FROM upscale_list WHERE email = ${decoded.email};`;
    res.statusCode = 200;
    return res.end(JSON.stringify({ message: 'query upscale_list success', result: result.rows }));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    return res.end(JSON.stringify(error));
  }
}
