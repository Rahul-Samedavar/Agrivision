# Agrivision

Agrivision is a farmer-focused mobile assistant that brings practical agricultural information and AI-powered tools together in one place. The app is designed to help farmers make faster, better-informed decisions about crop health, soil testing, local agricultural updates, government support, and everyday farming questions.

The project contains:

- A cross-platform Expo/React Native mobile application in [`FarmerApp`](./FarmerApp).
- An Express backend in [`backend`](./backend) that securely coordinates AI, news, soil-lab, disease-detection, speech, and voice-transcription services.

## Why Agrivision?

Farmers often need to consult several sources for a single decision: identify a crop problem, find a nearby testing facility, understand a government scheme, or get current local news. Agrivision brings these workflows into a simple, multilingual interface so that useful guidance is available from a phone and is easier to understand in the farmer's preferred language.

## Features

### Multilingual onboarding

The app starts with a language-selection screen and supports:

- English (`en`)
- Hindi (`hi`)
- Marathi (`mr`)
- Kannada (`kn`)

The selected language is used throughout the app and is also passed to backend and AI services where localized responses are supported.

### Crop disease detection

Farmers can:

1. Take a crop or leaf photograph with the device camera.
2. Select an existing image from the gallery.
3. Send the image for AI analysis.
4. View the diagnosis, recommendations, and treatment guidance on the result screen.

The scanner includes image-quality tips and displays loading and error states so farmers know when an analysis is in progress.

### Soil-testing laboratory finder

Farmers can search by place to find nearby soil-testing laboratories. Results can include:

- Government and private laboratory sections.
- Address and phone number.
- Rating and rating count.
- Website links.
- Map markers and a detailed laboratory view.

### Local agricultural news

Farmers can search for news by location and read localized results containing the source, date, summary, image, and an external “Read more” link.

### Government schemes

The app provides quick access to official portals for common farmer-support schemes, including:

- PM-KISAN
- Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)
- Soil Health Card
- Pradhan Mantri Fasal Bima Yojana (PMFBY)

The links open the official government websites so farmers can review details and apply through the appropriate portal.

### AI farming assistant

The assistant accepts farming questions and returns an AI-generated response. It also supports speech generation so responses can be played as audio, which is useful when reading long answers is inconvenient.

### Voice input

The backend accepts an uploaded audio recording, sends it for transcription, and returns the recognized text. This creates a foundation for hands-free, voice-first interaction for farmers.

## Farmer journey

```text
Choose language
      |
      v
Open farmer dashboard
      |
      +--> Scan a crop image ------> Disease result and guidance
      |
      +--> Find soil labs ----------> Map, contact details, and websites
      |
      +--> Search local news -------> Location-specific agricultural updates
      |
      +--> View schemes ------------> Official government application portals
      |
      +--> Ask the assistant -------> Text answer and optional audio response
```

## Technology

### Mobile app

- Expo SDK 54
- React Native 0.81
- TypeScript
- React Navigation native stack
- `expo-image-picker` for camera and gallery access
- `expo-location` and WebView-based Leaflet maps
- `expo-speech` and audio support
- `i18next` and `react-i18next` for localization
- NativeWind/Tailwind tooling

### Backend

- Node.js with Express
- Axios for upstream API requests
- CORS and JSON request handling
- Multer for audio uploads
- Sarvam services for voice transcription and speech generation
- Environment-based configuration with `dotenv`

## Project structure

```text
Agrithon/
├── FarmerApp/
│   ├── src/
│   │   ├── components/       # Reusable UI, chat, and map components
│   │   ├── constants/        # Shared app constants
│   │   ├── context/          # Language context
│   │   ├── i18n/             # English, Hindi, Marathi, and Kannada strings
│   │   ├── navigation/       # App stack and navigation
│   │   ├── screens/          # Onboarding and farmer-facing screens
│   │   └── services/         # API, location, and voice clients
│   ├── App.tsx
│   ├── app.json
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/           # HTTP API routes
│   │   ├── services/         # AI, audio, and voice integrations
│   │   └── server.js
│   └── package.json
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js 18 or newer
- npm
- Expo CLI through the project scripts
- Expo Go on a physical Android/iOS device, or an Android emulator/iOS simulator
- A valid API key for the configured speech/AI providers when running the backend locally

For camera, microphone, and location functionality, a physical device is recommended. Some permissions and native capabilities are limited in a browser.

## Installation

Clone the repository and install dependencies separately for the app and backend:

```bash
cd FarmerApp
npm install

cd ../backend
npm install
```

## Configuration

### Backend environment variables

Create `backend/.env` locally and never commit real credentials:

```env
PORT=5000
AI_API_TOKEN=your_ai_provider_token
SARVAM_API_KEY=your_sarvam_api_key
```

`AI_API_TOKEN` is used by the news integration. `SARVAM_API_KEY` is used by the audio and voice services. Other upstream AI integrations may require provider credentials according to their deployment configuration.

### Mobile API URL

The mobile service clients currently use the deployed backend URL:

```text
https://agrivisionbackend-judy.onrender.com
```

For local backend development, update the API base URL used by the clients in:

- `FarmerApp/src/services/api/chatService.ts`
- `FarmerApp/src/services/api/diseaseService.ts`
- `FarmerApp/src/services/api/newsService.ts`
- `FarmerApp/src/services/api/soilService.ts`
- `FarmerApp/src/services/voiceService.ts`

Use the correct address for the runtime:

```text
Android emulator: http://10.0.2.2:5000
iOS simulator:    http://127.0.0.1:5000
Physical device:  http://<your-computer-lan-ip>:5000
```

The phone and computer must be on the same network when using a LAN IP.

## Running the project

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

For a normal backend start without file watching:

```bash
npm start
```

Start the Expo app in a second terminal:

```bash
cd FarmerApp
npm start
```

Then use the Expo CLI to open the app:

```bash
npm run android
npm run ios
npm run web
```

The `ios` command requires macOS with Xcode. Android development requires an emulator or a connected Android device.

## Backend API

All backend endpoints are mounted under `/api`.

| Method | Endpoint | Purpose | Request body |
| --- | --- | --- | --- |
| `POST` | `/api/chat` | Generate a farming answer and speech audio | `{ "query": "...", "language": "en" }` |
| `POST` | `/api/chat/speech` | Convert an existing answer to speech | `{ "text": "...", "language": "en" }` |
| `POST` | `/api/voice-to-text` | Transcribe an uploaded recording | Multipart form: `audio`, optional `language` |
| `POST` | `/api/disease` | Analyze a crop image | `{ "image": "<base64>", "query": "...", "language": "en" }` |
| `POST` | `/api/soil` | Find soil-testing laboratories | `{ "place": "...", "language": "en" }` |
| `POST` | `/api/news` | Fetch location-specific agricultural news | `{ "place": "...", "language": "en" }` |

The backend accepts JSON payloads up to 10 MB to support base64 crop images. Voice uploads are limited to 10 MB and are removed after transcription processing.

## Permissions

The mobile app may request:

- Camera access for crop scanning.
- Photo-library access for selecting crop images.
- Microphone/audio access when voice input is used.
- Network access for the backend, maps, and official external links.

If a feature does not work, check that the relevant device permission is enabled and that the backend is reachable from the device.

## Troubleshooting

### The app cannot reach the backend

1. Confirm the backend is running and listening on port `5000` (or the configured `PORT`).
2. Confirm the mobile API URLs point to the correct host for the emulator or physical device.
3. Do not use `localhost` from a physical device; use the computer's LAN IP.
4. Confirm Windows Firewall or another network policy is not blocking the port.

### AI or speech requests fail

1. Confirm `AI_API_TOKEN` and `SARVAM_API_KEY` are present in `backend/.env`.
2. Restart the backend after changing `.env`.
3. Check the backend terminal for upstream provider errors or rate limits.

### Disease scanning does not return a result

Use a clear, well-lit crop or leaf image. Make sure the image picker returned an image with base64 data and that the device has an active network connection.

### Soil labs do not appear

Enter a location before searching. Results depend on the upstream soil-lab service and may be empty for locations where no facilities are returned.

## Development notes

- Keep API keys in environment variables and out of source control.
- Preserve the language code when adding a new backend or AI request.
- Add translation keys to all four locale files when introducing new user-visible text.
- Keep farmer guidance clear and actionable; AI output should be treated as assistance rather than a replacement for a qualified agricultural expert.
- Use official government links for scheme information and verify portal availability before release.

## Current limitations

- The mobile API base URL is currently defined in individual service files rather than one environment-driven configuration.
- Scheme data is currently maintained as a static list in the mobile app.
- AI, news, maps, and speech features depend on network connectivity and third-party service availability.
- The repository does not currently include automated application or backend tests.

## Future improvements

- Move all mobile service URLs to an environment-based Expo configuration.
- Add offline caching for translations, previously viewed news, and essential scheme information.
- Add farmer profiles for crop, location, and season-specific recommendations.
- Add notifications for weather, disease alerts, scheme deadlines, and local market updates.
- Add request validation, rate limiting, authentication, and observability before production deployment.
- Expand language coverage and provide more voice-first workflows.

