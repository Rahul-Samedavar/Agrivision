import axios from "axios";

const API_URL = "https://agrivisionbackend-judy.onrender.com/api/news";

export const getNews = async (place: string, language: string) => {
  const response = await axios.post(API_URL, {
    place,
    language,
  });

  return response.data;
};