import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const axiosMain = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_END_POINT_URL_DEV
      : process.env.REACT_APP_END_POINT_URL_PROD,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor to handle common error codes
axiosMain.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const data = error.response.data;
      const previewStatusCode = data.statusCode;
      const status = error.response.status;
      const status1 = error.response;
      console.log(status1, data, previewStatusCode, "abc");

      if (status === 400) {
        console.log("network error");
        // Show toast notification for 400 error
        // toast.error("Bad Request - Something went wrong with your request.", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        // Do not render any component directly, as it might cause errors
      }
      //  else if (status === 404) {
      //   toast.error("No Data Found", {
      //     position: toast.POSITION.TOP_RIGHT,
      //   });
      // }
      else if (status === 500) {
        // Show toast notification for 500 error
        toast.error("500 Internal Server Error", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (status === 200 && previewStatusCode === 204) {
        toast.error("No Data Found", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
    return Promise.reject(error);
  }
);

// Render the toast container for displaying toast notifications

export default axiosMain;
