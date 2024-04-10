import { sql } from "@vercel/postgres";
const crypto = require('crypto');
import jwt from 'jsonwebtoken';
export default async function handler(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password);
    // 1. 验证输入参数
    if (!email || !password) {
      return res.status(201).json({ error: 'Email and password are required' });
    }

    // 2. 查询用户信息
    const user = await sql`SELECT * FROM fancy_user WHERE email = ${email}`;
    console.log(user.rows);
    if (user.rows.length === 0) {
      return res.status(201).json({ error: 'Invalid email or password' });
    }

    // 3. 验证密码
    if (user.rows[0].password !== hashPassword(password)) {
      return res.status(201).json({ error: 'Invalid email or password' });
    }

    // 4. 生成 JWT 令牌
    const token = generateJWT(user.rows[0]);
    return res.status(200).json({ token: token , user: user.rows[0] });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    return res.end(JSON.stringify(error));
  }
}

function hashPassword(password) {
  // 使用加密算法对密码进行哈希处理
  return crypto.createHash('sha256').update(password).digest('hex');/* 加密后的密码 */;
}

function generateJWT(user) {
  // 使用 jsonwebtoken 库生成 JWT 令牌
  return jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET);
}
