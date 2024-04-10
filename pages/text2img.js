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
    setError(null)
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
          image:
          prediction.output[0],
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
      const response = await fetch("/api/replacebg/" + removeBgOutputs.id);
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
    <div className="container max-w-2xl p-5 mx-auto">
      <Head>
        <title>SDXL文生图</title>
      </Head>

      <h1 className="py-6 text-2xl font-bold text-center">
        描述你想生成的图片
      </h1>

      <form className="flex w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          className="flex-grow"
          name="prompt"
          placeholder="输入prompt来描述图片"
        />
        <button className="button" type="submit">
          生成
        </button>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <>
          {prediction.output && (
            <div className="mt-5 image-wrapper">
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes="100vw"
              />
            </div>
          )}
          <p className="py-3 text-sm opacity-50">处理状态: {prediction.status}</p>
          <div>
            {prediction.output && (
              <button className="button" onClick={removeBg}>
                自动移除背景
              </button>
            )}
            {removeBgOutputs && (
              <>
                {removeBgOutputs.output && (
                  <div className="mt-5 image-wrapper">
                    <Image
                      fill
                      src={removeBgOutputs.output}
                      alt="output"
                      sizes="100vw"
                    />
                  </div>
                )}
                <p className="py-3 text-sm opacity-50">处理状态: {removeBgOutputs.status}</p>
              </>
            )}
          </div>
        </>
      )}
      
    </div>
  );
}
