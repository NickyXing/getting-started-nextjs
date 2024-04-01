import axios from "axios";
const formidable = require("formidable");
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};
export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }
    console.log(files.file[0]);
    const file = files.file[0];
    let buffer = fs.readFileSync(file.filepath);
    let blob = new Blob([buffer], { type: file.mimetype, name: new Date().getTime() + file.originalFilename });
    const formData = new FormData();
    formData.append("file", blob, new Date().getTime() + file.originalFilename);

    try {
      // 替换为您想要调用的接口地址
      const apiUrl = "https://upload-api.anytools.me/upload";
      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      const responseData = await apiResponse.json();
      console.log("API response:", responseData);

      // 在这里处理来自另一个接口的响应数据
      res.status(200).json({ success: true, data: responseData });
    } catch (error) {
      console.error("Error uploading file to API:", error);
      res.status(500).json({ error: "Error uploading file to API" });
    }
  });
}
