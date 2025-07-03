# API Reference

This document describes all public REST endpoints exposed by the application.  
All routes are **serverless** functions powered by **Next-.js App Router** and therefore follow the same deployment model (cold-start friendly, stateless, and scoped to a single request).

> Base URL examples in this document assume the application is running locally on `http://localhost:3000` – adjust to your production domain as needed.

---

## 1. `POST /api/chat`

Interact with the AI chat assistant. Internally this endpoint forwards the request to an `n8n` workflow (see `N8N_WEBHOOK_URL` in your environment).

### Request Body

| Field       | Type     | Required | Description                                              |
|-------------|----------|----------|----------------------------------------------------------|
| `message`   | string   | Yes      | The user's plain-text question / prompt.                 |
| `context`   | object   | No       | Any arbitrary JSON that should be sent to the workflow.  |
| `chat_id`   | string   | No¹      | A stable identifier used to maintain conversation state. |

¹ `useChat()` automatically generates and stores a `chat_id` cookie if one is not supplied.

### Response

`200 OK` – Returns **plain text / HTML** containing the assistant's reply.

`4xx / 5xx` – Returns JSON `{ "error": string }` on failure.

### Example

```bash
curl -X POST http://localhost:3000/api/chat \ 
     -H 'Content-Type: application/json' \ 
     -d '{"message":"List upcoming exams in 3rd year", "chat_id":"abc-123"}'
```

---

## 2. `GET /api/recordings`

Fetch metadata for all **YouTube class recordings** stored in the Google Sheet referenced by `GOOGLE_SHEET_ID`.

### Response – `200 OK`
Returns **JSON array** of objects matching the `Recording` interface (see `OnlineClassRecordingsSection.tsx`).

```ts
interface Recording {
  id: string;
  title: string;
  youtubeVideoId: string;
  year: string;          // "1st Year", "2nd Year", ...
  semester: string;      // "1st Sem" | "2nd Sem"
  courseName?: string;
  teacherName?: string;
  tags?: string[];
}
```

#### Example

```bash
curl http://localhost:3000/api/recordings | jq '.[0]'
```

```json
{
  "id": "rec_01",
  "title": "Control Systems – Lecture 5",
  "youtubeVideoId": "dQw4w9WgXcQ",
  "year": "3rd Year",
  "semester": "2nd Sem",
  "courseName": "Control Systems",
  "teacherName": "Dr. Alam",
  "tags": ["Bode", "Stability"]
}
```

### Error Codes
`500` – Credentials missing / spreadsheet unreachable.

---

## 3. `GET /api/resources`

Retrieve a curated list of academic **drive resources** (PDFs, slides, etc.) managed through the Google Sheet referenced by `GOOGLE_RESOURCES_SHEET_ID`.

### Response – `200 OK`
Returns **JSON array** of objects matching the `Resource` interface.

```ts
interface Resource {
  id: string;
  mimeType: string;
  webViewLink: string;  // Google-Drive preview URL
  year: string;
  semester: string;
  courseName: string;
  courseCode: string;
  category?: string;    // Optional folder in Drive hierarchy
  teacherName: string;
  type: string;         // "PDF" | "PPT" | ...
  tags: string[];
  name: string;         // Human-readable file name
  downloadUrl: string;  // Direct download link
}
```

#### Example

```bash
curl http://localhost:3000/api/resources?year=1st%20Year | jq length
```

### Error Codes
`500` – Credentials missing / spreadsheet unreachable.

---

## Authentication & Rate Limits

All endpoints are **public** (no authentication). If you need to secure them, consider:

* Protecting routes with **middleware** (e.g. JWT, clerk, next-auth)
* Enabling Vercel **Edge Config** rate-limiting or a WAF rule.

---

## Environment Variables Summary

| Variable                    | Used By            | Purpose                                  |
|-----------------------------|--------------------|-------------------------------------------|
| `N8N_WEBHOOK_URL`           | `/api/chat`        | Destination workflow URL.                 |
| `GOOGLE_SHEET_ID`           | `/api/recordings`  | Spreadsheet ID for recordings metadata.   |
| `GOOGLE_RESOURCES_SHEET_ID` | `/api/resources`   | Spreadsheet ID for resource metadata.     |
| `GOOGLE_CLIENT_EMAIL`       | All Sheets routes  | Service-account email.                    |
| `GOOGLE_PRIVATE_KEY`        | All Sheets routes  | Private key (escaped newlines as `\n`).   |

---

> Need more? Open an issue or ping the maintainer 🎉