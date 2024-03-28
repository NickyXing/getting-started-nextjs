// pages/api/upload.js
const formidable = require("formidable");
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (files.file) {
      const filePath = await saveFile(files.file[0], req);
      res.json({ message: 'File uploaded successfully', filePath });
    } else {
      res.status(400).json({ error: 'No file uploaded' });
    }
  });
};

const saveFile = async (file, req) => {
  const data = fs.readFileSync(file.filepath);

  // 构造文件路径
  const filePath = `${req.headers.host}/uploads/${file.originalFilename}`;

  fs.writeFileSync(`./public/uploads/${file.originalFilename}`, data);
  await fs.unlinkSync(file.filepath);
  return filePath; // 返回文件路径
};
