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
          // "51ed1464d8bbbaca811153b051d3b09ab42f0bdeb85804ae26ba323d7a66a4ac",
          "67f36b842ae88c238b2332d34630cc325f25ee14e9b50a188d6eca1a2a77816c", // https://replicate.com/philz1337x/clarity-upscaler/versions

        // This is the text prompt that will be submitted by a form on the frontend
        // input: {
        //   input: req.body.input,
        //   background_upsampler: "DiffBIR",
        //   upscaling_model_type: req.body.modelType,
        //   super_resolution_factor: req.body.resolution,
        // },
        input: {
          image: req.body.input,
          prompt:
            "masterpiece, best quality, highres, <lora:more_details:0.5> <lora:SDXLrender_v2.0:1>",
          dynamic: 6,
          sd_model: "juggernaut_reborn.safetensors [338b85bc4f]",
          scheduler: "DPM++ 3M SDE Karras",
          creativity: 0.35,
          lora_links: "",
          downscaling: false,
          resemblance: 0.6,
          scale_factor: req.body.resolution || 2,
          tiling_width: 112,
          tiling_height: 144,
          custom_sd_model: "",
          negative_prompt:
            "(worst quality, low quality, normal quality:2) JuggernautNegative-neg",
          num_inference_steps: 18,
          downscaling_resolution: 768,
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
