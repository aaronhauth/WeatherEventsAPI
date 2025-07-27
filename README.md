# 🌤️ Weather-to-Event Suggestion API

This API suggests activities based on current weather and local venues, using OpenWeatherMap + Google Places.

## 🔗 Endpoints

### `GET /suggestions`

**Query Params:**
- `location` (string, required)
- `date` (optional, ISO string)
- `preferences` (optional: "indoor" | "outdoor")

**Example:**
```bash
GET /suggestions?location=Nashville&preferences=indoor
```