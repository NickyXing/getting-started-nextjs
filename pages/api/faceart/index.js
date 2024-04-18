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
      throw new Error("invalid user");
    }
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error(
        "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
      );
    }

    // 验证用户点数
    const users =
      await sql`SELECT * FROM fancy_user WHERE id = ${decoded.userId}`;
    console.log(users);
    if (users.rows[0] && users.rows[0].credits >= 10) {
      const prediction = await replicate.predictions.create({
        // Pinned to a specific version of Stable Diffusion
        // See https://replicate.com/stability-ai/sdxl
        version:
          "a07f252abbbd832009640b27f063ea52d87d7a23a185ca165bec23b5adc8deaf", // https://replicate.com/fofr/face-to-many/versions
        input: {
          image: req.body.input,
          style: req.body.style,
          prompt: req.body.prompt || "",
          dynamic: 6,
          lora_scale: 1,
          negative_prompt: "",
          prompt_strength: 4.5,
          denoising_strength: 0.65,
          instant_id_strength: 0.8,
          control_depth_strength: 0.8,
        },
      });

      if (prediction?.error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ detail: prediction.error }));
        return;
      }

      res.statusCode = 200;
      // 扣除一点点数
      const updateRes =
        await sql`UPDATE fancy_user SET credits = credits - 10 WHERE id = ${decoded.userId}`;
      console.log(updateRes);
      res.end(JSON.stringify(prediction));
    } else {
      res.status(401).json({ error: "No enough credits" });
    }
  } catch (err) {
    res.status(401).json({ error: err });
  }
}
