# Instagram AI Content Automation API

Base URL: `http://localhost:3000`

---

## Categories

Manage content categories used for topic generation.

### Create Category
```
POST /instagram/categories
```
**Body:**
```json
{
  "name": "Fantasy Adventure",
  "description": "Epic fantasy worlds, magical landscapes, adventure and exploration themes",
  "isActive": true
}
```

### Get All Categories
```
GET /instagram/categories
```

### Get Active Categories
```
GET /instagram/categories/active
```

### Get Category by ID
```
GET /instagram/categories/:id
```

### Update Category
```
PUT /instagram/categories/:id
```
**Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "isActive": false
}
```

### Delete Category
```
DELETE /instagram/categories/:id
```

---

## Topics

Manage AI-generated topics based on categories.

### Generate Topics (Manual Trigger)
Generates 1 topic per active category using Gemini AI.
```
POST /instagram/topics/generate
```

### Get All Topics
```
GET /instagram/topics
```

### Get Unused Topics
```
GET /instagram/topics/unused
```

### Delete Topic
```
DELETE /instagram/topics/:id
```

---

## Contents

Manage AI-generated content (caption + image) for Instagram posts.

### Generate Content (Manual Trigger)
Picks a random unused topic, generates caption and anime-style image, uploads to Cloudinary.
```
POST /instagram/contents/generate
```

**Response:**
```json
{
  "_id": "...",
  "topic": "...",
  "caption": "...",
  "imageUrl": "https://res.cloudinary.com/...",
  "status": "pending",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Get All Contents
```
GET /instagram/contents
```

### Get Pending Contents
Returns all contents waiting for audit.
```
GET /instagram/contents/pending
```

### Get Contents by Status
```
GET /instagram/contents/status?value={status}
```
**Status values:** `pending` `approved` `rejected` `published`

### Get Content by ID
```
GET /instagram/contents/:id
```

### Approve Content
```
PUT /instagram/contents/:id/approve
```

### Reject Content
```
PUT /instagram/contents/:id/reject
```
**Body:**
```json
{
  "rejectionReason": "Image not relevant to topic"
}
```

### Publish Content to Instagram
Content must be approved before publishing.
```
PUT /instagram/contents/:id/publish
```

**Response:**
```json
{
  "_id": "...",
  "topic": "...",
  "caption": "...",
  "imageUrl": "https://res.cloudinary.com/...",
  "status": "published",
  "instagramPostId": "...",
  "instagramPostUrl": "https://www.instagram.com/p/...",
  "publishedAt": "..."
}
```

### Update Content Status
```
PUT /instagram/contents/:id/status
```
**Body:**
```json
{
  "status": "pending"
}
```

### Delete Content
```
DELETE /instagram/contents/:id
```

---

## Scheduler

All schedulers run automatically. Manual triggers are available for testing.

| Time | Action |
|------|--------|
| 07:00 | Generate 1 topic per active category |
| 08:00 | Generate content #1 (caption + anime-style image) |
| 08:30 | Generate content #2 (caption + anime-style image) |
| 09:00 | Generate content #3 (caption + anime-style image) |
| 10:00 | Publish 1 approved content to Instagram |
| 17:00 | Publish 1 approved content to Instagram |

> **Note:** Contents must be manually audited (approved/rejected) between generation and publishing.