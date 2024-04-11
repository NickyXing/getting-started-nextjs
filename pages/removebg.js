import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import ImgPrepare from "../components/ImgPrepare";
import { message } from "antd/lib";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const [error, setError] = useState(null);
  const [removeBgOutputs, setRemoveBgOutputs] = useState(null);
  const [filePath, setFilePath] = useState(null);

  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const imgRef = useRef(null);
  const [imgWidth, setImgWidth] = useState(false);
  const [prepareNum, setPrepareNum] = useState(0);

  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const response = await fetch("/api/replacebg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem('token')
      },
      body: JSON.stringify({
        input: {
          image: filePath,
        },
      }),
    });
    let removeBgOutputs = await response.json();
    if (response.status !== 200) {
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
        messageApi.open({
          type: 'error',
          content: removeBgOutputs.error,
        });
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
  const moveNum = () => {};

  const download = async () => {
    try {
      const response = await fetch(removeBgOutputs.output);
      const blob = await response.blob();

      // 创建临时下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // 从 URL 中提取文件名和扩展名
      const urlParts = removeBgOutputs.output.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const fileExtension = fileName.split(".").pop();

      // 设置下载文件名
      link.download = `removed_bg.${fileExtension}`;

      // 将链接添加到 DOM 中并模拟点击
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 释放 Blob 对象占用的内存
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };
  const reset = () => {
    setError(null)
    setRemoveBgOutputs(null)
    setFilePath(null)
    setImgWidth(false)
  };
  return (
    <div>
      {contextHolder}
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
          <div className="relative flex justify-center w-full item-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="rgb(79 70 229)"
              className="relative w-6 h-6 right-2 bottom-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
            {!removeBgOutputs && !filePath && (
              <div
                style={{ height: "28rem" }}
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

            {(!removeBgOutputs ||
              (removeBgOutputs && !removeBgOutputs.output)) &&
              filePath && (
                <div className="w-1/2 text-center">
                  {/* <Image fill src={filePath} alt="output" /> */}
                  <img
                    ref={imgRef}
                    src={filePath}
                    alt=""
                    onLoad={() => {
                      let imgWidth = window
                        .getComputedStyle(imgRef.current, null)
                        .getPropertyValue("width");
                      console.log(imgWidth);
                      setImgWidth(imgWidth);
                    }}
                    className="mx-auto"
                    style={{ height: "28rem" }}
                  />
                </div>
              )}
            {removeBgOutputs && (
              <>
                {removeBgOutputs.output && (
                  <div
                    className="mt-5"
                    style={{ width: imgWidth, height: "28rem" }}
                  >
                    <ImgPrepare value={prepareNum} step="0.1" height="28rem">
                      <div className="first-image">
                        <img
                          src={removeBgOutputs.output}
                          alt=""
                          className="mx-auto"
                          onLoad={() => {
                            setLoading(false);
                          }}
                          style={{ height: "28rem" }}
                        />
                      </div>
                      <div className="second-image">
                        <img
                          src={filePath}
                          alt=""
                          className="mx-auto"
                          onLoad={() => {
                            moveNum();
                          }}
                          style={{ height: "28rem" }}
                        />
                      </div>
                    </ImgPrepare>
                  </div>
                )}
                {/* <p className="py-3 text-sm opacity-50">
                  status: {removeBgOutputs.status}
                </p> */}
              </>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="rgb(79 70 229)"
              className="relative w-6 h-6 left-2 bottom-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
          </div>
          <div className="w-full mt-5 text-center">
            {(!removeBgOutputs ||
              (removeBgOutputs && !removeBgOutputs.output)) && (
              <button
                disabled={loading || !filePath}
                className={
                  "inline-block px-6 py-3 text-sm font-medium text-white transition bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400 " +
                  (loading || !filePath
                    ? "cursor-not-allowed bg-indigo-700 opacity-50"
                    : "cursor-pointer")
                }
                onClick={removeBg}
              >
                {loading && (
                  <div className="flex">
                    <svg
                      className="mr-2 text-gray-300 animate-spin"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                    >
                      <path
                        d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                        stroke="currentColor"
                        stroke-width="5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                        stroke="currentColor"
                        stroke-width="5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="text-gray-900"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                )}
                {!loading && (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="#FFF"
                      className="inline-block w-4 h-4 mr-1"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                      />
                    </svg>
                    Remove Background
                  </div>
                )}
              </button>
            )}

            {removeBgOutputs && removeBgOutputs.output && (
              <>
                <button
                  className={
                    "inline-block px-6 py-3 text-sm font-medium text-white transition bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400 "
                  }
                  onClick={download}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 26"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="inline-block w-4 h-4 mr-1"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Download
                </button>
                <button
                  className={
                    " ml-3 inline-block px-6 py-3 text-sm font-medium border text-indigo-600 border-indigo-600 transition bg-white rounded focus:outline-none focus:ring focus:ring-yellow-400 "
                  }
                  onClick={reset}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="inline-block w-4 h-4 mr-1"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  Try another
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
