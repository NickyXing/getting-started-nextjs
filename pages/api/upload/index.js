import axios from "axios";
export default async function handler(req, res) {
  return axios.post("https://upload-api.anytools.me/upload", req, {
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}
