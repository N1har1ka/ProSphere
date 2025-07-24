const { default: axios } = require("axios");

const prod = true;

const BASE_URL = prod
  ? "https://prosphere.onrender.com"
  : "http://localhost:8080";

const clientServer = axios.create({
  baseURL: BASE_URL,
});

export { clientServer, BASE_URL };
