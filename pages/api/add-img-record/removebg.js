import { sql } from "@vercel/postgres";
import jwt from 'jsonwebtoken';
export default async function handler(req, res) {
  try {
    let token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    // 实现把传来的imgUrl插入remove_list表
    const { imgUrl } = req.body;
    if (!imgUrl) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: 'imgUrl is required' }));
    }
    await sql`INSERT INTO remove_list (email, img_url)
    VALUES (${decoded.email}, ${imgUrl});`;
    res.statusCode = 200;
    return res.end(JSON.stringify({ message: 'add remove_list success' }));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    return res.end(JSON.stringify(error));
  }
}
