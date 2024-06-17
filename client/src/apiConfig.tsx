import axios from "axios";

const SERVER_BASE_URL = new URL(
  "https://generate-social-posts-vercel.vercel.app/"
);

const apiConfig = {
  PAGE_LIMIT: 1,
  INDEX_ID: process.env.REACT_APP_INDEX_ID,
  SERVER: axios.create({
    baseURL: SERVER_BASE_URL.toString(),
  }),
  INDEXES_URL: "/indexes",
  TASKS_URL: "/tasks",
  INDEX_VIDEO_URL: new URL("/index", SERVER_BASE_URL),
};
console.log("🚀 > apiConfig. INDEX_ID=", apiConfig. INDEX_ID)
console.log("process.env.REACT_APP_INDEX_ID", process.env.REACT_APP_INDEX_ID)

export default apiConfig;
