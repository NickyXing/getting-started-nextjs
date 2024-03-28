import axios from "axios";
export default async function handler(req, res) {
  return axios.post("https://telegra.ph/upload", req, {
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}
