import { sql } from "@vercel/postgres";
const crypto = require('crypto');
export default async function handler(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const nickname = req.body.nickname || '';
    const avatar = req.body.avatar || '';
    const mailcode = req.body.mailcode

    // const users = await sql`SELECT * FROM fancy_user;`;
    // console.log(users);
    // for (let i = 0; i < users.rows.length; i++) {
    //   if (users.rows[i].email === email) {
    //     return res.status(200).json({
    //       message: "Email already exists",
    //     });
    //   }
    // }
    const check = await sql`SELECT * FROM check_mail WHERE email = ${email}`;
    console.log(check.rows);
    if (check.rows.length === 0) {
      return res.status(200).json({ error: 'no mail code result' });
    }

    if (check.rows[0].mailcode !== mailcode) {
      return res.status(200).json({ error: 'wrong mail verification code' });
    }

    await sql`INSERT INTO fancy_user (email, password, nickname, credits, avatar)
    VALUES (${email}, ${hashPassword(password)},${nickname},${30}, ${avatar});`;
    res.statusCode = 201;
    return res.end(JSON.stringify({status: "success"}));
  } catch (error) {
    res.statusCode = 500;
    return res.end(JSON.stringify(error));
  }
}

function hashPassword(password) {
  // 使用加密算法对密码进行哈希处理
  return crypto.createHash('sha256').update(password).digest('hex');/* 加密后的密码 */;
}
