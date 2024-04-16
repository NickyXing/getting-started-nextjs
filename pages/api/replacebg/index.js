import Replicate from "replicate";
import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  let token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new Error(
        "invalid user"
      );
    }
    console.log(decoded);
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error(
        "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
      );
    }

    // 验证用户点数
    const users = await sql`SELECT * FROM fancy_user WHERE id = ${decoded.userId}`;
    console.log(users);
    if(users.rows[0] && users.rows[0].credits >= 5) {
      const prediction = await replicate.predictions.create({
        // Pinned to a specific version of remove bg
        // See https://replicate.com/cjwbw/rembg
        version:
          "95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
  
        // This is the text prompt that will be submitted by a form on the frontend
        input: req.body.input,
      });
  
      if (prediction?.error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: prediction.error }));
        return;
      }
  
      res.statusCode = 200;
      // 扣除一点点数
      const updateRes = await sql`UPDATE fancy_user SET credits = credits - 5 WHERE id = ${decoded.userId}`;
      console.log(updateRes);
      res.end(JSON.stringify(prediction));
    } else {
      res.status(401).json({ error: "No enough credits" });
    }
  } catch (err) {
    res.status(401).json({ error: err });
  }
}
