import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const prediction = await replicate.predictions.create({
    // Pinned to a specific version of Stable Diffusion
    // See https://replicate.com/stability-ai/sdxl
    version: "51ed1464d8bbbaca811153b051d3b09ab42f0bdeb85804ae26ba323d7a66a4ac",

    // This is the text prompt that will be submitted by a form on the frontend
    input: { 
      input: req.body.input,
      background_upsampler: "DiffBIR",
      upscaling_model_type: req.body.modelType,
      super_resolution_factor: req.body.resolution
    },
  });

  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
