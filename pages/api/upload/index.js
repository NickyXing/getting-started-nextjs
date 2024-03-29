import axios from "axios";
export default async function handler(req, res) {
  console.log(req);
  axios.post("https://upload-api.anytools.me/upload", req, {
  }).then((response) => {
    res.status(200).json(response.data);
  })
}
