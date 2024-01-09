import axios from "axios";
export const Axios = axios.create({
  baseURL: "http://localhost:8000/",
  // baseURL: 'https://foureflights.com/',
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/xml; charset=utf-8",
  },
});

export default Axios;
