import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [error, setError] = useState(null);
  const [removeBgOutputs, setRemoveBgOutputs] = useState(null);
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
            "https://img2.baidu.com/it/u=1124591381,1037079365&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=753",
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

//   upload image
const handleUpload = async (e) => {
    let file = e.target.files[0]
    const formData = new FormData();
    formData.append("file", file);
    fetch("https://pic.anytools.me/upload", { method: "POST", body: formData })
    .then((response) => response.json())
    .then((data) => {
        if (data && data.error) {
        throw new Error(data.error);
        }
        const src = window.location.origin + data[0].src;
        uploadStatus.innerHTML = `
        <div class="alert alert-success text-center">Successful 🥳</div>
        <div class="input-group" style="margin-bottom: 10px">
        <input type="text" class="form-control" id="imageUrl" value="${src}">
        <div class="input-group-append">
            <button class="btn btn-outline-secondary copy-btn" type="button">Copy</button>
        </div>
        </div>
        ${
        file.type.startsWith("video")
            ? `<video src="${src}" class="img-fluid mb-3" controls></video>`
            : `<img src="${src}" class="img-fluid mb-3" alt="Uploaded Image">`
        }
        `;
        document
        .querySelector(".copy-btn")
        .addEventListener("click", onFileUrlCopy);
    })
    .catch((error) => {
        console.error(error);
    })
    .finally(() => {
        
    });
  }
  return (
    <div className="container max-w-2xl p-5 mx-auto">
      <Head>
        <title>Replicate + Next.js</title>
      </Head>

      <h1 className="py-6 text-2xl font-bold text-center">
        remove background by AI
      </h1>
      <div>
        <input type="file" name="file" accept="image/*" onChange={handleUpload}/>
        <button className="button" onClick={removeBg}>
          removebg
        </button>

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
            <p className="py-3 text-sm opacity-50">status: {removeBgOutputs.status}</p>
          </>
        )}

        {error && <div>{error}</div>}
      </div>
    </div>
  );
}
