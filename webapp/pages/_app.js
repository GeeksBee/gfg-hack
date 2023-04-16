import { Provider } from "react-redux";
import Layout from "../components/Layout";
import "../styles/globals.css";
import store from "../store";
import "react-dropzone-uploader/dist/styles.css";
import "antd/dist/antd.css";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
console.log(Cookies.get("accessToken"));
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest.isRetry = true;
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/authentication/refresh`,
          {
            withCredentials: true,
          }
        );
        Cookies.set("accessToken", data.accessToken, { path: "" });
        return axios.request(originalRequest);
      } catch (error) {
        Cookies.remove("accessToken", { path: "" });
        Cookies.remove("refreshToken", { path: "" });
        window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`;
      }
    }
    throw error;
  }
);

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  if (router.pathname.startsWith("/login")) {
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
