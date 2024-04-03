import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import ImgPrepare from '../components/ImgPrepare';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [error, setError] = useState(null);
  const [upscaleOutput, setUpscaleOutput] = useState(null);
  const [filePath, setFilePath] = useState(null);
  // remove bg
  const removeBg = async () => {
    const response = await fetch("/api/upscale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: filePath,
        modelType: 'faces', // faces or general_scenes
        resolution: 2, // 1-4放大倍率
      }),
    });
    let upscaleOutput = await response.json();
    console.log(upscaleOutput);
    if (response.status !== 201) {
      setError(upscaleOutput.detail);
      return;
    }
    setUpscaleOutput(upscaleOutput);

    while (
      upscaleOutput.status !== "succeeded" &&
      upscaleOutput.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/upscale/" + upscaleOutput.id);
      upscaleOutput = await response.json();
      if (response.status !== 200) {
        setError(upscaleOutput.detail);
        return;
      }
      console.log({ upscaleOutput });
      setUpscaleOutput(upscaleOutput);
    }
  };

  //   upload image
  const handleUpload = async (e) => {
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData })
    const result = await response.json();
    console.log(result);
    if (result.success && result.data.success) {
      setFilePath(result.data.url)
    } else {
      setError(result)
    }
  };
  return (
    <div className="container max-w-2xl p-5 mx-auto">
      <Head>
        <title>Upscale images</title>
      </Head>

      <h1 className="py-6 text-2xl font-bold text-center">
        Upscale images by AI
      </h1>
      <div>
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={handleUpload}
        />
        <button className="button" onClick={removeBg}>
          removebg
        </button>

        {upscaleOutput && (
          <>
            {upscaleOutput.output && upscaleOutput.output.length > 0 && (
              <div className="mt-5 image-wrapper">
                <ImgPrepare value={50} step="0.1" height={400}>
                  <div className="first-image">
                  <Image
                    fill
                    src={upscaleOutput.output[upscaleOutput.output.length - 1]}
                    alt="output"
                    sizes="100vw"
                  />
                  </div>
                  <div className="second-image">
                  <Image
                    fill
                    src={filePath}
                    alt="output"
                    sizes="100vw"
                  />
                  </div>
                </ImgPrepare>
                
              </div>
            )}
            <p className="py-3 text-sm opacity-50">
              status: {upscaleOutput.status}
            </p>
          </>
        )}

        {error && <div>{error}</div>}
      </div>
    </div>
  );
}
