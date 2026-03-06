import axios from "axios";

export const api = axios.create({
  baseURL: process.env.SERVER_URL || "http://localhost:8181",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
