import { useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [error, setError] = useState(null);
  const [removeBgOutputs, setRemoveBgOutputs] = useState(null);
  const [filePath, setFilePath] = useState(null);

  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload({
        target: {
          files: e.dataTransfer.files,
        },
      });
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
          image: filePath,
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
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    console.log(result);
    if (result.success && result.data.success) {
      setFilePath(result.data.url);
    } else {
      setError(result);
    }
  };
  return (
    <div>
      <Header></Header>
      <div className="container p-5 mx-auto">
        <Head>
          <title>Remove Background from Image</title>
        </Head>
        <div className="h-16"></div>
        <h1 className="py-6 text-4xl font-bold text-center">
          Remove Background from Image
        </h1>
        <div>
          <div className="flex justify-center w-full item-center">
            {!filePath && (
              <div
                className="flex items-center justify-center w-1/2 px-6 py-10 mt-2 border border-dashed rounded-lg cursor-pointer h-96 border-gray-900/25"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
              >
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                  <div className="flex mt-4 text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file"
                      className="relative font-semibold text-indigo-600 bg-white rounded-md cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        ref={fileInputRef}
                        className="sr-only"
                        id="file"
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={handleUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                </div>
              </div>
            )}

            {!removeBgOutputs && filePath && (
              <div className="w-1/2">
                {/* <Image fill src={filePath} alt="output" /> */}
                <img src={filePath} alt="" width="100%" />
              </div>
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
                <p className="py-3 text-sm opacity-50">
                  status: {removeBgOutputs.status}
                </p>
              </>
            )}

            {error && <div>{error}</div>}
          </div>
          <button
            className="inline-block px-6 py-3 text-sm font-medium text-white transition bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400"
            onClick={removeBg}
          >
            Remove Background
          </button>
        </div>
      </div>
    </div>
  );
}
