# API Specifications

## 🌐 Base Configuration

```
Base URL: https://api.your-cmms.tn/v1
Authentication: Bearer Token (JWT)
Content-Type: application/json
Accept-Language: ar-TN, fr-FR, en-US
```

## 🔐 Authentication

### POST /auth/register
Register a new organization and admin user.

**Request:**
```json
{
  "organization": {
    "name": "Acme Manufacturing",
    "slug": "acme-mfg"
  },
  "user": {
    "email": "admin@acme.tn",
    "password": "SecurePass123!",
    "firstName": "Ahmed",
    "lastName": "Ben Ali",
    "phone": "+216 20 123 456",
    "language": "FRENCH"
  }
}
```

**Response:** `201 Created`
```json
{
  "organization": {
    "id": "org_abc123",
    "name": "Acme Manufacturing",
    "slug": "acme-mfg",
    "plan": "FREE"
  },
  "user": {
    "id": "usr_xyz789",
    "email": "admin@acme.tn",
    "firstName": "Ahmed",
    "lastName": "Ben Ali",
    "role": "ADMIN"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900
  }
}
```

### POST /auth/login
Authenticate user and get access tokens.

**Request:**
```json
{
  "email": "admin@acme.tn",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "usr_xyz789",
    "email": "admin@acme.tn",
    "firstName": "Ahmed",
    "lastName": "Ben Ali",
    "role": "ADMIN",
    "organizationId": "org_abc123"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900
  }
}
```

### POST /auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGc...",
  "expiresIn": 900
}
```

### POST /auth/logout
Invalidate refresh token.

**Headers:** `Authorization: Bearer {accessToken}`

**Response:** `204 No Content`

---

## 👤 Users

### GET /users
List all users in organization.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `role` (enum: ADMIN, MANAGER, ENGINEER, TECHNICIAN, REQUESTER)
- `isActive` (boolean)
- `search` (string) - Search by name or email

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "usr_xyz789",
      "email": "technician@acme.tn",
      "firstName": "Mohamed",
      "lastName": "Trabelsi",
      "role": "TECHNICIAN",
      "phone": "+216 98 765 432",
      "avatar": "https://storage.../avatar.jpg",
      "isActive": true,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### GET /users/:id
Get single user by ID.

**Response:** `200 OK`
```json
{
  "id": "usr_xyz789",
  "email": "technician@acme.tn",
  "firstName": "Mohamed",
  "lastName": "Trabelsi",
  "role": "TECHNICIAN",
  "phone": "+216 98 765 432",
  "avatar": "https://storage.../avatar.jpg",
  "language": "FRENCH",
  "timezone": "Africa/Tunis",
  "isActive": true,
  "emailVerified": true,
  "lastLoginAt": "2025-12-24T08:15:00Z",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-12-24T08:15:00Z"
}
```

### POST /users
Create new user.

**Request:**
```json
{
  "email": "engineer@acme.tn",
  "firstName": "Fatma",
  "lastName": "Hamdi",
  "role": "ENGINEER",
  "phone": "+216 25 111 222",
  "language": "ARABIC"
}
```

**Response:** `201 Created`

### PATCH /users/:id
Update user.

**Request:**
```json
{
  "firstName": "Fatma",
  "phone": "+216 25 111 333",
  "isActive": true
}
```

**Response:** `200 OK`

### DELETE /users/:id
Soft delete user.

**Response:** `204 No Content`

---

## 📋 Work Orders

### GET /work-orders
List work orders with filtering and pagination.

**Query Parameters:**
- `page`, `limit`
- `status` (enum: OPEN, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED)
- `priority` (enum: LOW, MEDIUM, HIGH, URGENT)
- `assignedToId` (string)
- `assetId` (string)
- `locationId` (string)
- `dueDateFrom` (ISO date)
- `dueDateTo` (ISO date)
- `category` (string)
- `isPM` (boolean)
- `search` (string)
- `expand` (string) - Comma-separated: assignedTo,asset,location,parts
- `sort` (string) - e.g., "-createdAt,priority" (- for descending)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "wo_123abc",
      "number": "WO-2025-0001",
      "title": "Replace HVAC filter",
      "description": "Annual filter replacement for main HVAC unit",
      "priority": "MEDIUM",
      "status": "OPEN",
      "category": "HVAC",
      "assignedToId": "usr_xyz789",
      "assignedTo": {
        "id": "usr_xyz789",
        "firstName": "Mohamed",
        "lastName": "Trabelsi"
      },
      "assetId": "ast_456def",
      "asset": {
        "id": "ast_456def",
        "name": "HVAC Unit 1",
        "assetTag": "HVAC-001"
      },
      "locationId": "loc_789ghi",
      "dueDate": "2025-12-31T12:00:00Z",
      "estimatedHours": 2.5,
      "isPM": true,
      "createdAt": "2025-12-20T09:00:00Z",
      "updatedAt": "2025-12-24T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

### GET /work-orders/:id
Get single work order with full details.

**Query Parameters:**
- `expand` (string) - assignedTo,asset,location,parts,tasks,comments,attachments

**Response:** `200 OK`
```json
{
  "id": "wo_123abc",
  "number": "WO-2025-0001",
  "title": "Replace HVAC filter",
  "description": "Annual filter replacement for main HVAC unit",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS",
  "category": "HVAC",
  "assignedToId": "usr_xyz789",
  "assignedTo": {
    "id": "usr_xyz789",
    "firstName": "Mohamed",
    "lastName": "Trabelsi",
    "phone": "+216 98 765 432"
  },
  "assetId": "ast_456def",
  "asset": {
    "id": "ast_456def",
    "name": "HVAC Unit 1",
    "assetTag": "HVAC-001",
    "location": {
      "id": "loc_789ghi",
      "name": "Building A - Floor 2"
    }
  },
  "dueDate": "2025-12-31T12:00:00Z",
  "scheduledStart": "2025-12-24T08:00:00Z",
  "scheduledEnd": "2025-12-24T10:30:00Z",
  "estimatedHours": 2.5,
  "actualHours": 2.0,
  "laborCost": 50.00,
  "partsCost": 125.50,
  "totalCost": 175.50,
  "isPM": true,
  "pmScheduleId": "pms_111aaa",
  "tasks": [
    {
      "id": "tsk_001",
      "title": "Turn off HVAC system",
      "isCompleted": true,
      "completedAt": "2025-12-24T08:15:00Z"
    },
    {
      "id": "tsk_002",
      "title": "Remove old filter",
      "isCompleted": true,
      "completedAt": "2025-12-24T08:30:00Z"
    },
    {
      "id": "tsk_003",
      "title": "Install new filter",
      "isCompleted": false
    }
  ],
  "parts": [
    {
      "id": "wop_001",
      "partId": "prt_555bbb",
      "part": {
        "name": "HVAC Filter 20x25x1",
        "partNumber": "FLT-2025-1"
      },
      "quantity": 1,
      "unitCost": 125.50
    }
  ],
  "attachments": [
    {
      "id": "att_001",
      "filename": "before_photo.jpg",
      "url": "https://storage.../before_photo.jpg",
      "mimeType": "image/jpeg",
      "size": 245678
    }
  ],
  "createdBy": {
    "id": "usr_admin",
    "firstName": "Ahmed",
    "lastName": "Ben Ali"
  },
  "createdAt": "2025-12-20T09:00:00Z",
  "updatedAt": "2025-12-24T10:30:00Z"
}
```

### POST /work-orders
Create new work order.

**Request:**
```json
{
  "title": "Fix leaking faucet",
  "description": "Bathroom faucet in Room 301 is leaking",
  "priority": "HIGH",
  "category": "Plumbing",
  "assignedToId": "usr_xyz789",
  "assetId": "ast_faucet01",
  "locationId": "loc_room301",
  "dueDate": "2025-12-26T17:00:00Z",
  "estimatedHours": 1.5,
  "tasks": [
    {
      "title": "Inspect faucet",
      "order": 1
    },
    {
      "title": "Replace washer",
      "order": 2
    }
  ]
}
```

**Response:** `201 Created`

### PATCH /work-orders/:id
Update work order.

**Request:**
```json
{
  "status": "IN_PROGRESS",
  "actualHours": 1.75,
  "completionNotes": "Replaced washer and tightened connections"
}
```

**Response:** `200 OK`

### POST /work-orders/:id/complete
Mark work order as completed.

**Request:**
```json
{
  "completionNotes": "All tasks completed successfully",
  "actualHours": 2.0,
  "attachments": ["att_001", "att_002"]
}
```

**Response:** `200 OK`

### DELETE /work-orders/:id
Cancel work order.

**Request:**
```json
{
  "reason": "Duplicate work order"
}
```

**Response:** `204 No Content`

---

## 🏭 Assets

### GET /assets
List assets.

**Query Parameters:**
- `page`, `limit`
- `status` (enum: OPERATIONAL, DOWN, MAINTENANCE, RETIRED)
- `category` (string)
- `locationId` (string)
- `search` (string)
- `hasMeter` (boolean)
- `expand` (string) - location,parts,pmSchedules

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "ast_456def",
      "name": "HVAC Unit 1",
      "assetTag": "HVAC-001",
      "serialNumber": "SN-HVAC-2020-001",
      "qrCode": "QR-HVAC-001",
      "category": "HVAC",
      "manufacturer": "Carrier",
      "model": "50TCQA08",
      "status": "OPERATIONAL",
      "locationId": "loc_789ghi",
      "location": {
        "id": "loc_789ghi",
        "name": "Building A - Floor 2"
      },
      "purchaseDate": "2020-03-15T00:00:00Z",
      "purchasePrice": 15000.00,
      "warrantyExpiry": "2025-03-15T00:00:00Z",
      "hasMeter": true,
      "currentMeter": 12450.5,
      "meterUnit": "Hours",
      "createdAt": "2020-03-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 89,
    "totalPages": 5
  }
}
```

### GET /assets/:id
Get single asset.

**Response:** `200 OK`
```json
{
  "id": "ast_456def",
  "name": "HVAC Unit 1",
  "description": "Main HVAC unit for Building A",
  "assetTag": "HVAC-001",
  "serialNumber": "SN-HVAC-2020-001",
  "qrCode": "QR-HVAC-001",
  "category": "HVAC",
  "manufacturer": "Carrier",
  "model": "50TCQA08",
  "status": "OPERATIONAL",
  "condition": "Good",
  "locationId": "loc_789ghi",
  "location": {
    "id": "loc_789ghi",
    "name": "Building A - Floor 2",
    "path": "/Building A/Floor 2"
  },
  "purchaseDate": "2020-03-15T00:00:00Z",
  "purchasePrice": 15000.00,
  "warrantyExpiry": "2025-03-15T00:00:00Z",
  "lifeExpectancy": 180,
  "hasMeter": true,
  "currentMeter": 12450.5,
  "meterUnit": "Hours",
  "image": "https://storage.../hvac-unit.jpg",
  "manualUrl": "https://storage.../manual.pdf",
  "parts": [
    {
      "partId": "prt_555bbb",
      "part": {
        "name": "HVAC Filter 20x25x1",
        "partNumber": "FLT-2025-1"
      },
      "quantity": 1
    }
  ],
  "pmSchedules": [
    {
      "id": "pms_111aaa",
      "name": "Quarterly HVAC Maintenance",
      "frequency": "QUARTERLY",
      "nextDueDate": "2026-01-15T00:00:00Z"
    }
  ],
  "metadata": {
    "customField1": "value1"
  },
  "createdAt": "2020-03-15T10:00:00Z",
  "updatedAt": "2025-12-20T14:30:00Z"
}
```

### POST /assets
Create new asset.

**Request:**
```json
{
  "name": "Forklift 3",
  "assetTag": "FLT-003",
  "serialNumber": "FLT-2025-003",
  "category": "Vehicle",
  "manufacturer": "Toyota",
  "model": "8FGU25",
  "status": "OPERATIONAL",
  "locationId": "loc_warehouse",
  "purchaseDate": "2025-01-10T00:00:00Z",
  "purchasePrice": 25000.00,
  "warrantyExpiry": "2027-01-10T00:00:00Z",
  "hasMeter": true,
  "currentMeter": 0,
  "meterUnit": "Hours"
}
```

**Response:** `201 Created`

### PATCH /assets/:id
Update asset.

**Response:** `200 OK`

### POST /assets/:id/meter-reading
Record meter reading.

**Request:**
```json
{
  "reading": 12500.5,
  "unit": "Hours",
  "notes": "Monthly reading"
}
```

**Response:** `201 Created`

### DELETE /assets/:id
Soft delete asset.

**Response:** `204 No Content`

---

## 📦 Parts & Inventory

### GET /parts
List parts.

**Query Parameters:**
- `page`, `limit`
- `category` (string)
- `search` (string)
- `lowStock` (boolean) - quantity <= minQuantity

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "prt_555bbb",
      "name": "HVAC Filter 20x25x1",
      "partNumber": "FLT-2025-1",
      "barcode": "BC-FLT-2025-1",
      "category": "Filters",
      "manufacturer": "FilterMax",
      "quantity": 15,
      "unit": "pcs",
      "minQuantity": 5,
      "maxQuantity": 50,
      "unitCost": 125.50,
      "currency": "TND",
      "location": "Warehouse A - Shelf 3"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 234,
    "totalPages": 12
  }
}
```

### POST /parts/:id/adjust-stock
Adjust inventory.

**Request:**
```json
{
  "quantity": 10,
  "type": "IN",
  "notes": "Received new shipment"
}
```

**Response:** `200 OK`

---

## 📍 Locations

### GET /locations
List locations with hierarchy.

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "loc_building_a",
      "name": "Building A",
      "path": "/Building A",
      "children": [
        {
          "id": "loc_floor_2",
          "name": "Floor 2",
          "path": "/Building A/Floor 2",
          "assetCount": 12
        }
      ]
    }
  ]
}
```

---

## 🔄 Preventive Maintenance

### GET /pm-schedules
List PM schedules.

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "pms_111aaa",
      "name": "Quarterly HVAC Maintenance",
      "frequency": "QUARTERLY",
      "interval": 1,
      "assetId": "ast_456def",
      "asset": {
        "name": "HVAC Unit 1",
        "assetTag": "HVAC-001"
      },
      "nextDueDate": "2026-01-15T00:00:00Z",
      "lastCompletedAt": "2025-10-15T14:00:00Z",
      "assignedToId": "usr_xyz789",
      "isActive": true
    }
  ]
}
```

### POST /pm-schedules
Create PM schedule.

**Request:**
```json
{
  "name": "Monthly Generator Check",
  "description": "Monthly inspection and maintenance",
  "assetId": "ast_generator",
  "frequency": "MONTHLY",
  "interval": 1,
  "nextDueDate": "2026-01-01T09:00:00Z",
  "assignedToId": "usr_engineer",
  "estimatedHours": 2,
  "procedureId": "proc_gen_check"
}
```

**Response:** `201 Created`

---

## 📊 Reports & Analytics

### GET /reports/work-orders-summary
Get work order metrics.

**Query Parameters:**
- `startDate` (ISO date)
- `endDate` (ISO date)
- `groupBy` (enum: day, week, month, status, priority, category)

**Response:** `200 OK`
```json
{
  "period": {
    "startDate": "2025-12-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z"
  },
  "summary": {
    "total": 156,
    "completed": 98,
    "inProgress": 32,
    "open": 24,
    "cancelled": 2,
    "completionRate": 62.8,
    "avgCompletionTime": 2.4
  },
  "byPriority": {
    "URGENT": 5,
    "HIGH": 23,
    "MEDIUM": 89,
    "LOW": 39
  },
  "byCategoryy": [
    {"category": "HVAC", "count": 45},
    {"category": "Plumbing", "count": 32},
    {"category": "Electrical", "count": 28}
  ]
}
```

### GET /reports/asset-downtime
Get asset downtime metrics.

**Response:** `200 OK`
```json
{
  "assets": [
    {
      "id": "ast_456def",
      "name": "HVAC Unit 1",
      "totalDowntime": 14.5,
      "downtimeHours": 14.5,
      "incidents": 3,
      "mtbf": 720,
      "mttr": 4.8
    }
  ]
}
```

---

## 🔔 Notifications

### GET /notifications
Get user notifications.

**Query Parameters:**
- `unreadOnly` (boolean)
- `page`, `limit`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "notif_001",
      "type": "WORK_ORDER_ASSIGNED",
      "title": "New work order assigned",
      "message": "WO-2025-0123: Fix leaking faucet",
      "entityType": "WorkOrder",
      "entityId": "wo_123abc",
      "readAt": null,
      "createdAt": "2025-12-24T10:30:00Z"
    }
  ],
  "unreadCount": 5
}
```

### PATCH /notifications/:id/read
Mark as read.

**Response:** `200 OK`

---

## 🔌 Webhooks

### POST /webhooks
Create webhook subscription.

**Request:**
```json
{
  "url": "https://your-app.com/webhooks",
  "events": [
    "work_order.created",
    "work_order.completed",
    "asset.down"
  ],
  "secret": "whsec_abc123"
}
```

**Webhook Payload Example:**
```json
{
  "id": "evt_abc123",
  "type": "work_order.completed",
  "timestamp": "2025-12-24T10:30:00Z",
  "data": {
    "workOrder": {
      "id": "wo_123abc",
      "number": "WO-2025-0001",
      "status": "COMPLETED"
    }
  }
}
```

---

## ⚠️ Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

---

## 📈 Rate Limiting

- **Free Tier**: 100 requests/hour
- **Starter**: 1,000 requests/hour
- **Professional**: 10,000 requests/hour
- **Enterprise**: Unlimited

**Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1703433600
```

---

## 🌍 Internationalization

All text responses support Arabic, French, and English based on `Accept-Language` header.

**Example:**
```
Accept-Language: ar-TN
```

Response:
```json
{
  "message": "تم إنشاء أمر العمل بنجاح"
}
```