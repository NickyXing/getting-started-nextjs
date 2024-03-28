import { sql } from "@vercel/postgres";

/**
 * 使用SQL创建一个名为users的表，如果该表不存在的话。
 * 用户表包含以下字段：id、email、password、name和created_at。
 * - `request` 参数是Next.js提供的请求对象，此处未直接使用，但遵循Next.js API路由的约定。
 * - 函数返回一个包含操作结果的JSON对象，正常情况下返回200状态码，出错时返回500状态码。
 */
export default async function handler(req, res) {
  try {
    const result = await sql`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
    res.statusCode = 201;
    return res.end(JSON.stringify(result));
  } catch (error) {
    res.statusCode = 500;
    return res.end(JSON.stringify(result));
  }
}
