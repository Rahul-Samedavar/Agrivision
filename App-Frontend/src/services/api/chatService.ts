import axios from 'axios';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/api/chat`;

export const sendChatMessage = async (query: string, language: string) => {
  try {
    console.log('[Chat] API:', API_URL);
    const response = await axios.post(API_URL, {
      query,
      language,
    });

    return response.data;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
};

export const generateSpeech = async (text: string, language: string) => {
  try {
    const response = await axios.post(`${API_URL}/speech`, {
      text,
      language,
    });

    return response.data?.audioUrl || null;
  } catch (error) {
    console.error('Speech API error:', error);
    throw error;
  }
};