import  axios from "axios"

const API_BASE_URL = "https://greenvelvet.alwaysdata.net/pfc/"
const API_TOKEN = "64dd00391e8e503995d3ce504aa749a27ab85b01"

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      token: API_TOKEN,
    },
  });
  
  export default api;

