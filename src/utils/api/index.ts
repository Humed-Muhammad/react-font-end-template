import axios, { type AxiosRequestConfig } from "axios";
import { apiPath } from "@/constant";
import { db } from "../pockatbase";

// axios.interceptors.request.use(async (config) => {
//   const token = await authInstance?.currentUser?.getIdToken()
//   config.headers!['Authorization'] = `Bearer ${token}`
//   config.headers!['Content-Type'] = 'application/json'
//   return config
// })

export const request = async (config: AxiosRequestConfig) => {
  const token = await db?.authStore?.token;

  return axios({
    baseURL: `${apiPath}/api`,
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...config.headers,
    },
  })
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
};
