const { default: axios } = require("axios");

const clientServer = axios.create({
  baseURL: "http://localhost:8080",
});

const BASE_URL = "http://localhost:8080";
export { clientServer, BASE_URL };
