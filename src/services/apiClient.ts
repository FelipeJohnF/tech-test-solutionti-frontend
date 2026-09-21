import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://effective-zebra-qp5x47g9xqp347xq-8080.app.github.dev/api",
  headers: {
    "Content-Type": "application/json",
  },
});