import pocketbase from "pocketbase";
export const db = new pocketbase(import.meta.env.VITE_POCKETBASE_API_URL);
