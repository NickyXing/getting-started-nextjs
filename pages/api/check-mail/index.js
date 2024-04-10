import { sql } from "@vercel/postgres";
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// 配置自有域名邮箱服务
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 587,
  secure: false,
  auth: {
    user: 'fancyimg@fancyimg.com',
    pass: process.env.MAIL_PASSWORD
  }
});
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
        return res.status(405).json({
          message: "Method not allowed",
        });
    }
    const email = req.body.email;

    // const users = await sql`SELECT * FROM fancy_user;`;
    // console.log(users);
    // for (let i = 0; i < users.rows.length; i++) {
    //   if (users.rows[i].email === email) {
    //     return res.status(200).json({
    //       message: "Email already exists",
    //     });
    //   }
    // }

    const result = await sql`
        SELECT COUNT(*) 
        FROM fancy_user
        WHERE email = ${email}
        `;
        console.log('resultresultresult: '+ JSON.stringify(result));
        if (result.rows[0].count > 0) {
        return res.status(200).json({
            message: "Email already exists",
        });
    }

    // 生成 6 位数字验证码
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    
    // 判断是否存在记录
    const existingRecord = await sql`
        SELECT COUNT(*) FROM check_mail WHERE email = ${email}
    `;

    if (existingRecord.rows[0].count > 0) {
        // 更新现有记录
        await sql`
            UPDATE check_mail 
            SET mailcode = ${verificationCode}
            WHERE email = ${email}
        `;
    } else {
        // 插入新记录
        await sql`
            INSERT INTO check_mail (email, mailcode)
            VALUES (${email}, ${verificationCode})
        `;
    }
    // 发送验证码邮件
    await transporter.sendMail({
        from: 'fancyimg@fancyimg.com',
        to: email,
        subject: 'Verification Code',
        text: `Your verification code is: ${verificationCode}`
    });
    res.statusCode = 201;
    return res.end(JSON.stringify({status: "mail code send success"}));
  } catch (error) {
    res.statusCode = 500;
    return res.end(JSON.stringify(error));
  }
}

function hashPassword(password) {
  // 使用加密算法对密码进行哈希处理
  return crypto.createHash('sha256').update(password).digest('hex');/* 加密后的密码 */;
}
