import axios from "axios";

const API_URL = "https://agrivisionbackend-judy.onrender.com/api/disease";

export const detectDisease = async (
  base64Image: string,
  language: string
) => {
  const response = await axios.post(API_URL, {
    image: base64Image,
    query: "Analyze this crop and suggest treatment",
    language,
  });

  return response.data;
};