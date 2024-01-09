import axios from "axios";

export const Axios = axios.create({
  baseURL: "http://localhost/flight-api/",
  // baseURL: "https://apis.foureflights.com/",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
});

export default Axios;
