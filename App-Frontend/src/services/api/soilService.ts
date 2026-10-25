import axios from "axios";

const API_URL = "https://agrivisionbackend-judy.onrender.com/api/soil";

export const getSoilLabs = async (place: string, language: string) => {
  const response = await axios.post(API_URL, {
    place,
    language,
    lang: language,
  });

  return response.data;
};