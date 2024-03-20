import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [removeBgOutputs, setRemoveBgOutputs] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
  };
  // remove bg
  const removeBg = async () => {
    const response = await fetch("/api/replacebg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          pixel: "512 * 512",
          scale: 3,
          prompt:
            "modern sofa+ in a contemporary living room, filled with stylish decor+;modern, contemporary, sofa, living room, stylish decor",
          image_num: 4,
          image_path:
            "https://replicate.delivery/pbxt/JAIk0rFAOUG00uetuiLOHPz42lBcf7QfX3xWi7TVaxMXXD4n/sofa1.png",
          manual_seed: -1,
          product_size: "0.5 * width",
          guidance_scale: 7.5,
          negative_prompt:
            "illustration, 3d, sepia, painting, cartoons, sketch, (worst quality:2)",
          num_inference_steps: 20,
        },
      }),
    });
    let removeBgOutputs = await response.json();
    if (response.status !== 201) {
      setError(removeBgOutputs.detail);
      return;
    }
    setRemoveBgOutputs(removeBgOutputs);

    while (
      removeBgOutputs.status !== "succeeded" &&
      removeBgOutputs.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/replacebg/" + prediction.id);
      removeBgOutputs = await response.json();
      if (response.status !== 200) {
        setError(removeBgOutputs.detail);
        return;
      }
      console.log({ removeBgOutputs });
      setRemoveBgOutputs(removeBgOutputs);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-5">
      <Head>
        <title>Replicate + Next.js</title>
      </Head>

      <h1 className="py-6 text-center font-bold text-2xl">
        Dream something with{" "}
        <a href="https://replicate.com/stability-ai/sdxl?utm_source=project&utm_project=getting-started">
          SDXL
        </a>
      </h1>

      <form className="w-full flex" onSubmit={handleSubmit}>
        <input
          type="text"
          className="flex-grow"
          name="prompt"
          placeholder="Enter a prompt to display an image"
        />
        <button className="button" type="submit">
          Go!
        </button>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <>
          {prediction.output && (
            <div className="image-wrapper mt-5">
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes="100vw"
              />
            </div>
          )}
          <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
        </>
      )}
      <div>
        <button className="button" onClick={removeBg}>
          removebg
        </button>
      </div>
    </div>
  );
}
