import { sql } from "@vercel/postgres";

/**
 * 使用SQL创建一个名为users的表，如果该表不存在的话。
 * 用户表包含以下字段：id、email、password、name和created_at。
 * - `request` 参数是Next.js提供的请求对象，此处未直接使用，但遵循Next.js API路由的约定。
 * - 函数返回一个包含操作结果的JSON对象，正常情况下返回200状态码，出错时返回500状态码。
 */
export default async function handler(req, res) {
  try {
    await sql`DROP TABLE fancy_user;`
    const result = await sql`
    CREATE TABLE IF NOT EXISTS fancy_user (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      nickname VARCHAR(50) NOT NULL,
      is_paid_user BOOLEAN DEFAULT FALSE,
      credits INT DEFAULT 0,
      avatar VARCHAR(255),
      bio TEXT,
      social_links TEXT,
      provider VARCHAR(50) DEFAULT 'email',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      mailcode VARCHAR(6)
    )
  `;

  // const result = await sql`
  // CREATE TABLE IF NOT EXISTS check_mail (
  //     id SERIAL PRIMARY KEY,
  //     email VARCHAR(255) NOT NULL,
  //     mailcode VARCHAR(6),
  //     created_at TIMESTAMP DEFAULT NOW(),
  //     expires_at TIMESTAMP DEFAULT NOW(),
  //     used BOOLEAN DEFAULT FALSE
  //     )`;
    res.statusCode = 201;
    return res.end(JSON.stringify(result));
  } catch (error) {
    res.statusCode = 500;
    return res.end(JSON.stringify(error));
  }
}
