import axios from 'axios';
import { API_BASE_URL } from './api/config';

const API_URL = `${API_BASE_URL}/api/voice-to-text`;

export const uploadAudio = async (fileUri: string, language?: string): Promise<string> => {
  try {
    const formData = new FormData();

    formData.append('audio', {
      uri: fileUri,
      name: 'voice.m4a',
      type: 'audio/m4a',
    } as any);

    if (language) {
      formData.append('language', language);
    }

    console.log('[Voice] Uploading to:', API_URL);

    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    const transcript = response.data?.text;
    if (typeof transcript !== 'string' || !transcript.trim()) {
      throw new Error('The speech service returned no transcript.');
    }

    if (
      transcript.includes('Audio uploaded successfully') ||
      transcript.includes('SARVAM_API_KEY')
    ) {
      throw new Error(
        'Speech recognition is not configured on the backend. Deploy the latest backend and set SARVAM_API_KEY.',
      );
    }

    console.log('[Voice] Upload success:', {
      language,
      transcriptLength: transcript.length,
    });
    return transcript.trim();
  } catch (error) {
    console.error('[Voice] Upload failed - URL:', API_URL);

    throw error;
  }
};
