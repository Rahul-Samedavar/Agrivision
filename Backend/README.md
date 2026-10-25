---
title: AgriVision API
emoji: 🚜
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
---

# AgriVision API

FastAPI backend for:
- Soil Testing Labs (`/api/soil-test`)
- Disease Detection & Cure (`/api/disease-detect`)
- Chatbot (`/api/chatbot`)
- News Updates (`/api/news`)

## Local Run

```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Hugging Face Spaces (Docker)

This repository includes:
- `Dockerfile`
- `.dockerignore`
- `.github/workflows/deploy-hf-space.yml` (auto deploy)

GitHub Actions pushes code to your Hugging Face Space repo whenever you push to `main`.

Required GitHub secrets:
- `HF_TOKEN`: Hugging Face User Access Token (write access)
- `HF_SPACE_ID`: Space id in format `username/space-name`

Example:
- `HF_SPACE_ID = yourname/agrivision-api`
