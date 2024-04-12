import axios from 'axios';

export default async function handler(req, res) {

  const { url } = req.body;

  let file;

  if(url) {
    // 从URL下载图片
    file = await downloadFileFromUrl(url);
  }

  if(!file) {
    return res.status(400).end('No file provided');
  }

  try {

    // 构建FormData
    const formData = new FormData();
    formData.append('file', file, new Date().getTime());

    // 调用上传接口
    const apiUrl = 'https://upload-api.anytools.me/upload';
    const apiResp = await axios.post(apiUrl, formData);

    // 返回结果
    return res.status(200).json({data: apiResp.data, message: 'success'});

  } catch (error) {

    console.error('Upload failed:', error);
    return res.status(500).end('Upload failed');

  }

}

// 从URL下载文件
async function downloadFileFromUrl(url) {

  const response = await fetch(url);
  const blob = await response.blob();

  return blob;

}