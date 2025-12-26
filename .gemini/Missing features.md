# Missing Features & Implementation Roadmap

## ✅ Implemented Features (Working)

Based on your Postman tests, these are complete:
- ✅ Authentication (register, login, logout)
- ✅ User Management (CRUD)
- ✅ Locations (CRUD)
- ✅ Assets (CRUD)
- ✅ Work Orders (Create, List)
- ✅ Inventory/Parts (Create, Stock Adjustment)
- ✅ PM Schedules (Create)
- ✅ Organization Settings (Update)

---

## 🔴 CRITICAL - MVP Phase 1 (Week 2-3)

These are essential for a functional CMMS and should be implemented IMMEDIATELY:

### 1. Work Orders - Missing Endpoints

#### 1.1 Update Work Order Status
```typescript
// PATCH /work-orders/:id/status
{
  "status": "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "CANCELLED",
  "notes": "Started working on the hydraulic leak"
}
```

**Business Logic:**
- Validate status transitions (OPEN → IN_PROGRESS → COMPLETED)
- Record status history in `WorkOrderStatusHistory`
- Update `completedAt` when status = COMPLETED
- Trigger notifications to assignee and creator

#### 1.2 Complete Work Order
```typescript
// POST /work-orders/:id/complete
{
  "completionNotes": "Replaced hydraulic seal, tested for leaks",
  "actualHours": 3.5,
  "partsUsed": [
    {
      "partId": "part_123",
      "quantity": 2
    }
  ]
}
```

**Business Logic:**
- Set status to COMPLETED
- Update `completedAt` timestamp
- Calculate total cost (labor + parts)
- Deduct parts from inventory
- Create stock movements
- If PM work order, update PM schedule `lastCompletedAt`
- Send completion notification

#### 1.3 Add Comment to Work Order
```typescript
// POST /work-orders/:id/comments
{
  "content": "Found additional wear on the bearing, will need replacement next maintenance cycle"
}
```

#### 1.4 Add Attachments (Photos)
```typescript
// POST /work-orders/:id/attachments
// multipart/form-data with file upload
```

**Business Logic:**
- Upload to MinIO/S3
- Create attachment record
- Support before/after photos
- Generate thumbnails

#### 1.5 Work Order Tasks Management
```typescript
// POST /work-orders/:id/tasks
{
  "title": "Inspect seal integrity",
  "order": 1
}

// PATCH /work-orders/:id/tasks/:taskId
{
  "isCompleted": true
}
```

---

### 2. Assets - Missing Functionality

#### 2.1 QR Code Generation
```typescript
// POST /assets/:id/generate-qr
// Generates unique QR code for asset
// Returns: { qrCode: "QR-AST-001-UUID", qrCodeUrl: "https://..." }
```

**Business Logic:**
- Generate unique QR code
- Store as PNG/SVG in storage
- Update asset record
- Return downloadable URL

#### 2.2 Meter Readings
```typescript
// POST /assets/:id/meter-readings
{
  "reading": 1250.5,
  "unit": "Hours",
  "notes": "Regular monthly reading"
}

// GET /assets/:id/meter-readings
// Returns history of all meter readings
```

**Business Logic:**
- Validate reading > last reading
- Check if PM schedules should trigger based on meter
- Update asset `currentMeter`

#### 2.3 Asset History
```typescript
// GET /assets/:id/history
// Returns:
// - All work orders for this asset
// - All PM schedules
// - Meter reading history
// - Status changes
```

---

### 3. PM Schedules - Critical Missing Logic

#### 3.1 PM Schedule Execution
```typescript
// POST /pm-schedules/:id/execute
// Creates a work order from PM schedule
// Updates nextDueDate based on frequency
```

**Business Logic:**
- Create work order with `isPM: true`
- Link to PM schedule
- Calculate next due date:
  - DAILY: +1 day
  - WEEKLY: +7 days
  - MONTHLY: +1 month
  - QUARTERLY: +3 months
  - etc.
- Copy procedure/checklist to work order
- Assign to designated user/team

#### 3.2 PM Schedule Due Check (Cron Job)
```typescript
// Automated background job
// Runs daily at 6 AM
// Checks all PM schedules where nextDueDate <= today
// Auto-creates work orders
```

**Implementation:**
```typescript
// pm-schedules.cron.ts
@Cron('0 6 * * *') // Every day at 6 AM
async checkDuePMSchedules() {
  const dueSchedules = await this.prisma.pMSchedule.findMany({
    where: {
      isActive: true,
      nextDueDate: {
        lte: new Date(),
      },
    },
  });

  for (const schedule of dueSchedules) {
    await this.pmSchedulesService.execute(schedule.id);
  }
}
```

---

### 4. Notifications System

**CRITICAL:** Without notifications, users won't know about assignments!

#### 4.1 Notification Service
```typescript
// modules/notifications/notifications.service.ts

interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
}

async send(payload: NotificationPayload) {
  // 1. Create notification record
  const notification = await this.prisma.notification.create({
    data: payload,
  });

  // 2. Send email (if user preference)
  if (user.emailNotifications) {
    await this.emailService.send({
      to: user.email,
      subject: payload.title,
      body: payload.message,
    });
  }

  // 3. Send SMS (if urgent and phone exists)
  if (payload.type === 'URGENT' && user.phone) {
    await this.smsService.send({
      to: user.phone,
      message: payload.message,
    });
  }

  // 4. Push notification (WebSocket)
  await this.websocketGateway.sendToUser(userId, notification);
}
```

#### 4.2 Notification Triggers
```typescript
// When work order created/assigned
await this.notificationsService.send({
  userId: workOrder.assignedToId,
  type: 'WORK_ORDER_ASSIGNED',
  title: 'أمر عمل جديد',
  message: `تم تعيينك لأمر العمل: ${workOrder.title}`,
  entityType: 'WorkOrder',
  entityId: workOrder.id,
});

// When work order due soon (1 day before)
type: 'WORK_ORDER_DUE'

// When work order completed
type: 'WORK_ORDER_COMPLETED'

// When part stock low
type: 'PART_LOW_STOCK'
```

#### 4.3 Notification Endpoints
```typescript
// GET /notifications
// GET /notifications/unread-count
// PATCH /notifications/:id/read
// PATCH /notifications/mark-all-read
```

---

### 5. Search & Filtering

#### 5.1 Work Orders Search
```typescript
// GET /work-orders?search=hydraulic&status=OPEN&priority=HIGH
// &assignedToId=user_123&assetId=asset_456
// &dueDateFrom=2025-12-01&dueDateTo=2025-12-31
// &sort=-createdAt&page=1&limit=20
```

**Implementation:**
```typescript
async findAll(filters: WorkOrderFilters, orgId: string) {
  const where: Prisma.WorkOrderWhereInput = {
    organizationId: orgId,
    deletedAt: null,
  };

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { number: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.assignedToId) where.assignedToId = filters.assignedToId;
  if (filters.assetId) where.assetId = filters.assetId;

  if (filters.dueDateFrom || filters.dueDateTo) {
    where.dueDate = {};
    if (filters.dueDateFrom) where.dueDate.gte = new Date(filters.dueDateFrom);
    if (filters.dueDateTo) where.dueDate.lte = new Date(filters.dueDateTo);
  }

  const [data, total] = await Promise.all([
    this.prisma.workOrder.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        asset: { select: { id: true, name: true, assetTag: true } },
      },
      orderBy: this.parseSort(filters.sort),
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
    this.prisma.workOrder.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}
```

#### 5.2 Global Search (Elasticsearch - Future)
```typescript
// GET /search?q=hydraulic&entities=work_orders,assets,parts
```

---

### 6. Dashboard & Analytics

#### 6.1 Dashboard Summary
```typescript
// GET /dashboard/summary

Response:
{
  "workOrders": {
    "total": 45,
    "open": 12,
    "inProgress": 8,
    "completed": 23,
    "overdue": 2
  },
  "assets": {
    "total": 89,
    "operational": 78,
    "down": 3,
    "maintenance": 8
  },
  "pmSchedules": {
    "total": 24,
    "dueToday": 2,
    "dueThisWeek": 5,
    "overdue": 1
  },
  "recentActivity": [
    {
      "type": "work_order_completed",
      "message": "Mohamed completed WO-2025-0001",
      "timestamp": "2025-12-25T10:30:00Z"
    }
  ]
}
```

#### 6.2 Work Order Metrics
```typescript
// GET /reports/work-orders-metrics
// ?startDate=2025-12-01&endDate=2025-12-31

Response:
{
  "completionRate": 75.5,
  "avgCompletionTime": 2.4, // hours
  "totalCompleted": 98,
  "totalCreated": 130,
  "byStatus": {
    "OPEN": 12,
    "IN_PROGRESS": 8,
    "COMPLETED": 98,
    "CANCELLED": 2
  },
  "byPriority": {
    "LOW": 45,
    "MEDIUM": 67,
    "HIGH": 15,
    "URGENT": 3
  },
  "byCategory": [
    { "category": "HVAC", "count": 34 },
    { "category": "Plumbing", "count": 28 }
  ]
}
```

---

## 🟡 IMPORTANT - MVP Phase 1 (Week 4)

### 7. Work Requests (User Submitted)

```typescript
// POST /work-requests
{
  "title": "AC not cooling in Room 301",
  "description": "Temperature is 28°C",
  "priority": "MEDIUM",
  "locationId": "loc_123"
}

// GET /work-requests
// PATCH /work-requests/:id/approve
// PATCH /work-requests/:id/reject
// POST /work-requests/:id/convert-to-work-order
```

**Business Logic:**
- Any user can submit work request
- Manager/Admin can approve/reject
- On approval, convert to work order
- Link work request to created work order

---

### 8. Teams Management

```typescript
// POST /teams
{
  "name": "HVAC Team",
  "description": "Handles all HVAC maintenance"
}

// POST /teams/:id/members
{
  "userId": "user_123",
  "role": "LEAD" | "MEMBER"
}

// Work orders can be assigned to teams
// All team members get notified
```

---

### 9. File Upload Service

```typescript
// POST /uploads
// multipart/form-data

// Handles:
// - Photos (work orders, assets)
// - Documents (manuals, warranties)
// - Max size: 10MB per file
// - Allowed types: jpg, png, pdf, doc, xls

// Upload to MinIO/S3
// Generate thumbnails for images
// Return URL
```

---

### 10. Activity Log (Audit Trail)

```typescript
// Automatically log all important actions:
// - Work order created/updated/completed
// - Asset status changed
// - User created/deleted
// - Settings changed

// GET /activity-logs
// Filter by entity, user, date range
```

---

## 🟢 NICE TO HAVE - Phase 2 (Month 2)

### 11. Procedures & Checklists

```typescript
// POST /procedures
{
  "name": "HVAC Quarterly Maintenance",
  "steps": [
    { "order": 1, "title": "Turn off power", "description": "..." },
    { "order": 2, "title": "Inspect filters", "description": "..." }
  ]
}

// Link procedures to PM schedules
// Copy to work orders as checklists
```

---

### 12. Purchase Orders

```typescript
// POST /purchase-orders
{
  "vendorId": "vendor_123",
  "items": [
    { "partId": "part_123", "quantity": 10, "unitPrice": 45.5 }
  ],
  "status": "PENDING"
}

// Approval workflow
// On approval, update inventory
```

---

### 13. Vendors Management

```typescript
// POST /vendors
{
  "name": "HVAC Supplies Tunisia",
  "contactName": "Mohamed Ali",
  "email": "contact@hvac-supplies.tn",
  "phone": "+216 71 123 456"
}
```

---

### 14. Custom Fields

```typescript
// POST /custom-fields
{
  "name": "warranty_provider",
  "label": "Warranty Provider",
  "fieldType": "TEXT",
  "entityType": "Asset",
  "required": false
}

// Assets/Work Orders can have custom metadata
```

---

### 15. Document Management

```typescript
// POST /assets/:id/documents
{
  "title": "User Manual",
  "type": "MANUAL",
  "file": <upload>
}

// Store manuals, warranties, certificates
// Link to assets
// Track expiry dates
```

---

### 16. Inspection Module

```typescript
// POST /inspections
{
  "name": "Monthly Safety Inspection",
  "assetId": "asset_123",
  "frequency": "MONTHLY",
  "items": [
    {
      "question": "Are all guards in place?",
      "type": "YES_NO",
      "required": true
    }
  ]
}

// Schedule inspections
// Fill out inspection forms
// Track pass/fail results
```

---

### 17. Advanced Reporting

```typescript
// GET /reports/asset-downtime
// GET /reports/maintenance-costs
// GET /reports/mtbf-mttr  // Mean Time Between Failures
// GET /reports/technician-performance
// GET /reports/parts-usage
```

---

### 18. Email Service Integration

```typescript
// modules/email/email.service.ts

async sendWorkOrderAssigned(workOrder, user) {
  await this.sendEmail({
    to: user.email,
    subject: `أمر عمل جديد: ${workOrder.title}`,
    template: 'work-order-assigned',
    data: { workOrder, user },
  });
}

// Templates:
// - work-order-assigned.hbs
// - work-order-completed.hbs
// - pm-due-reminder.hbs
// - weekly-summary.hbs
```

---

### 19. SMS Integration (Tunisia)

```typescript
// modules/sms/sms.service.ts

async sendSMS(to: string, message: string) {
  // Integration with SMS.tn or Tunisian SMS provider
  await axios.post('https://api.sms.tn/send', {
    apiKey: process.env.SMS_API_KEY,
    to: to,
    message: message,
  });
}

// Use for:
// - Urgent work orders
// - Overdue notifications
// - 2FA codes
```

---

### 20. WhatsApp Integration

```typescript
// modules/whatsapp/whatsapp.service.ts

// Use 360dialog or Twilio WhatsApp API
// Send work order notifications
// Allow technicians to update status via WhatsApp
// Share photos of completed work
```

---

## 🔵 ADVANCED - Phase 3 (Month 3-4)

### 21. Multi-Location Support

```typescript
// Organizations can have multiple locations
// Hierarchical structure: Country > City > Building > Floor > Room
// Filter everything by location
// Location-specific users and permissions
```

---

### 22. API Keys & Webhooks

```typescript
// POST /api-keys
{
  "name": "Integration with ERP",
  "scopes": ["read:work_orders", "write:assets"]
}

// POST /webhooks
{
  "url": "https://your-system.com/webhook",
  "events": ["work_order.created", "work_order.completed"]
}
```

---

### 23. SSO / SAML Integration

```typescript
// Enterprise customers can use SSO
// Support Google, Microsoft, custom SAML
```

---

### 24. Advanced PM - Meter-Based

```typescript
// PM schedules based on equipment hours/kilometers
// Auto-trigger when meter reading exceeds threshold
// Example: Oil change every 1000 hours
```

---

### 25. Predictive Maintenance (AI)

```typescript
// Analyze historical data
// Predict equipment failures
// Recommend maintenance before breakdown
// ML model trained on:
// - Work order history
// - Failure patterns
// - Sensor data (future IoT integration)
```

---

## 📋 Priority Implementation Order

### Week 2-3 (CRITICAL):
1. ✅ Work Order status updates & completion
2. ✅ Work Order comments & attachments
3. ✅ Notifications system (email + push)
4. ✅ PM schedule execution
5. ✅ Search & filtering
6. ✅ Dashboard summary

### Week 4 (IMPORTANT):
7. ✅ Work Requests module
8. ✅ Teams management
9. ✅ File upload service
10. ✅ Activity logs
11. ✅ QR code generation

### Month 2 (ENHANCEMENTS):
12. Procedures & checklists
13. SMS integration
14. Email templates
15. Advanced reporting
16. Asset history & tracking

### Month 3+ (ADVANCED):
17. Purchase orders
18. Vendors management
19. Inspections module
20. WhatsApp integration
21. Custom fields
22. API keys & webhooks

---

## 🎯 Next Steps (Immediate Actions)

1. **Start with Work Order Completion Flow** - Most critical for MVP
2. **Implement Notifications** - Users need to know about assignments
3. **Add Search/Filtering** - Usability requirement
4. **Create Dashboard** - First thing users see

Would you like me to:
- Generate the complete implementation code for any of these features?
- Create detailed API specs for specific modules?
- Design the database migrations needed?
- Write the service layer code?

