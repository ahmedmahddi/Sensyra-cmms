# User Stories

## 👥 User Personas

### 1. **Ahmed** - Facility Manager (Admin)
- **Age**: 42
- **Location**: Tunis
- **Company**: Manufacturing company with 150 employees
- **Tech Savvy**: Medium
- **Language**: French/Arabic
- **Goals**: 
  - Reduce equipment downtime
  - Track maintenance costs
  - Ensure compliance with safety regulations
  - Get visibility into maintenance operations

### 2. **Fatima** - Maintenance Manager
- **Age**: 35
- **Location**: Sfax
- **Company**: Hotel with 200 rooms
- **Tech Savvy**: High
- **Language**: French
- **Goals**:
  - Assign work orders efficiently
  - Track team performance
  - Schedule preventive maintenance
  - Respond quickly to guest complaints

### 3. **Mohamed** - Technician
- **Age**: 28
- **Location**: Sousse
- **Company**: Healthcare facility
- **Tech Savvy**: Medium (uses mobile)
- **Language**: Arabic
- **Goals**:
  - Receive clear work instructions
  - Update work status from mobile
  - Access equipment history
  - Track parts used

### 4. **Salma** - Requester (Nurse/Teacher/Staff)
- **Age**: 30
- **Location**: Various
- **Tech Savvy**: Low
- **Language**: Arabic/French
- **Goals**:
  - Report maintenance issues easily
  - Know status of requests
  - Get timely responses

### 5. **Karim** - Engineer
- **Age**: 33
- **Location**: Tunis
- **Company**: Manufacturing facility
- **Tech Savvy**: High
- **Language**: French/English
- **Goals**:
  - Manage complex equipment
  - Analyze failure patterns
  - Optimize maintenance schedules
  - Document procedures

---

## 🎯 Epic 1: Authentication & User Management

### Story 1.1: User Registration
**As** Ahmed (Admin)  
**I want** to register my organization and create an admin account  
**So that** I can start using the CMMS system

**Acceptance Criteria:**
- [ ] Can enter organization name and slug
- [ ] Can create admin user with email and password
- [ ] Password must be at least 8 characters with uppercase, lowercase, and numbers
- [ ] Receives JWT tokens (access + refresh)
- [ ] Organization is created with FREE plan by default
- [ ] Email is unique across the system

**Technical Notes:**
- Endpoint: POST /auth/register
- Password hashed with bcrypt (12 rounds)
- JWT expires in 15 minutes

---

### Story 1.2: User Login
**As** Mohamed (Technician)  
**I want** to log in with my email and password  
**So that** I can access my assigned work orders

**Acceptance Criteria:**
- [ ] Can log in with valid email/password
- [ ] Receives access and refresh tokens
- [ ] `lastLoginAt` is updated
- [ ] Invalid credentials return clear error message
- [ ] Can choose to "Remember me" (longer session)

---

### Story 1.3: Create Team Members
**As** Fatima (Manager)  
**I want** to invite technicians to the system  
**So that** I can assign them work orders

**Acceptance Criteria:**
- [ ] Can create users with role: TECHNICIAN, ENGINEER, MANAGER
- [ ] Can set name, email, phone, and language preference
- [ ] New user receives email invitation
- [ ] Can set temporary password that must be changed on first login
- [ ] Can only create users in my organization

---

## 🎯 Epic 2: Asset Management

### Story 2.1: Register Equipment
**As** Karim (Engineer)  
**I want** to register all equipment in the facility  
**So that** I can track maintenance history

**Acceptance Criteria:**
- [ ] Can enter asset name, tag, serial number
- [ ] Can specify category (HVAC, Plumbing, Electrical, etc.)
- [ ] Can assign to location
- [ ] Can upload photo of asset
- [ ] Can enter purchase date, price, warranty expiry
- [ ] System generates unique asset ID

---

### Story 2.2: Generate QR Codes
**As** Ahmed (Admin)  
**I want** to generate QR codes for each asset  
**So that** technicians can quickly scan and access asset information

**Acceptance Criteria:**
- [ ] Can generate QR code for each asset
- [ ] QR code is unique and links to asset details
- [ ] Can download QR code as PNG
- [ ] Can print multiple QR codes at once
- [ ] Scanning QR code opens asset page on mobile

---

### Story 2.3: Track Asset Meters
**As** Karim (Engineer)  
**I want** to record equipment operating hours  
**So that** I can schedule maintenance based on usage

**Acceptance Criteria:**
- [ ] Can mark asset as having a meter (hours, kilometers, cycles)
- [ ] Can record meter readings with date and notes
- [ ] System validates new reading > previous reading
- [ ] Can view meter reading history with chart
- [ ] System alerts when meter-based PM is due

---

### Story 2.4: View Asset History
**As** Mohamed (Technician)  
**I want** to see all past work done on an asset  
**So that** I can understand recurring issues

**Acceptance Criteria:**
- [ ] Can see all work orders for an asset
- [ ] Can see all meter readings
- [ ] Can see maintenance costs over time
- [ ] Can see documents (manuals, warranties)
- [ ] Timeline view showing all events

---

## 🎯 Epic 3: Work Order Management

### Story 3.1: Create Work Order
**As** Fatima (Manager)  
**I want** to create a work order for a maintenance task  
**So that** a technician can complete it

**Acceptance Criteria:**
- [ ] Can enter title and description
- [ ] Can set priority (LOW, MEDIUM, HIGH, URGENT)
- [ ] Can assign to user or team
- [ ] Can link to asset and location
- [ ] Can set due date
- [ ] Can estimate hours and costs
- [ ] System auto-generates work order number (WO-2025-0001)

---

### Story 3.2: Receive Work Order Notification
**As** Mohamed (Technician)  
**I want** to receive immediate notification when assigned a work order  
**So that** I can start work promptly

**Acceptance Criteria:**
- [ ] Receive email notification with work order details
- [ ] Receive SMS for URGENT priority (optional)
- [ ] Receive in-app notification
- [ ] Notification includes: title, priority, due date, asset
- [ ] Can click notification to view work order
- [ ] In Arabic or French based on user preference

---

### Story 3.3: Update Work Order Status (Mobile)
**As** Mohamed (Technician)  
**I want** to update work order status from my phone  
**So that** my manager knows I'm working on it

**Acceptance Criteria:**
- [ ] Can change status to IN_PROGRESS when starting
- [ ] Can add notes when changing status
- [ ] Status change is timestamped
- [ ] Manager receives notification of status change
- [ ] Works offline and syncs when online
- [ ] Can see who changed status and when

---

### Story 3.4: Complete Work Order
**As** Mohamed (Technician)  
**I want** to mark work order as complete with details  
**So that** there's a record of what was done

**Acceptance Criteria:**
- [ ] Can add completion notes
- [ ] Can record actual hours spent
- [ ] Can add before/after photos
- [ ] Can record parts used (deducted from inventory)
- [ ] System calculates total cost (labor + parts)
- [ ] Requester receives completion notification
- [ ] If PM work order, PM schedule is updated

---

### Story 3.5: Add Comments
**As** Karim (Engineer)  
**I want** to add comments to work orders  
**So that** I can document important details

**Acceptance Criteria:**
- [ ] Can add text comments
- [ ] Comments are timestamped with author
- [ ] Other users receive notification of new comments
- [ ] Can @mention users
- [ ] Comments appear in chronological order
- [ ] Can edit/delete own comments

---

### Story 3.6: Attach Photos
**As** Mohamed (Technician)  
**I want** to attach photos to work orders  
**So that** I can show the issue or completed work

**Acceptance Criteria:**
- [ ] Can upload photos from mobile camera
- [ ] Can upload up to 10 photos per work order
- [ ] Photos are compressed for mobile data
- [ ] Can add caption to each photo
- [ ] Before/after photo comparison view
- [ ] Can download original resolution

---

### Story 3.7: Search Work Orders
**As** Fatima (Manager)  
**I want** to search and filter work orders  
**So that** I can find specific tasks quickly

**Acceptance Criteria:**
- [ ] Can search by keyword (title, description, number)
- [ ] Can filter by status, priority, assignee
- [ ] Can filter by date range
- [ ] Can filter by asset or location
- [ ] Can sort by date, priority, due date
- [ ] Can export search results to CSV
- [ ] Search works in Arabic and French

---

## 🎯 Epic 4: Preventive Maintenance

### Story 4.1: Create PM Schedule
**As** Karim (Engineer)  
**I want** to set up recurring maintenance schedules  
**So that** equipment is maintained regularly

**Acceptance Criteria:**
- [ ] Can select asset and frequency (daily, weekly, monthly, etc.)
- [ ] Can assign to user or team
- [ ] Can link to procedure/checklist
- [ ] Can set estimated hours
- [ ] Can enable/disable schedule
- [ ] System calculates next due date automatically

---

### Story 4.2: Auto-Generate PM Work Orders
**As** the System  
**I want** to automatically create work orders from PM schedules  
**So that** maintenance is never forgotten

**Acceptance Criteria:**
- [ ] Daily cron job checks for due PM schedules
- [ ] Creates work order when due
- [ ] Assigns to designated user/team
- [ ] Marks work order as isPM: true
- [ ] Sends notification to assignee
- [ ] Updates PM schedule with new nextDueDate
- [ ] Handles meter-based schedules

---

### Story 4.3: View PM Calendar
**As** Fatima (Manager)  
**I want** to see all upcoming preventive maintenance  
**So that** I can plan resources

**Acceptance Criteria:**
- [ ] Calendar view showing PM schedules
- [ ] Can filter by asset, location, assignee
- [ ] Color-coded by status (due, overdue, completed)
- [ ] Can reschedule PM from calendar
- [ ] Shows estimated hours for planning
- [ ] Can export to PDF/CSV

---

## 🎯 Epic 5: Inventory Management

### Story 5.1: Track Parts Inventory
**As** Ahmed (Admin)  
**I want** to track spare parts inventory  
**So that** I know when to reorder

**Acceptance Criteria:**
- [ ] Can add parts with name, part number, quantity
- [ ] Can set min/max stock levels
- [ ] Can set unit cost and unit (pcs, kg, etc.)
- [ ] Can record stock location in warehouse
- [ ] Receives alert when quantity < minQuantity
- [ ] Can see stock movements history

---

### Story 5.2: Use Parts in Work Orders
**As** Mohamed (Technician)  
**I want** to record parts used when completing work  
**So that** inventory is accurate

**Acceptance Criteria:**
- [ ] Can search and select parts
- [ ] Can specify quantity used
- [ ] Inventory is automatically deducted
- [ ] Stock movement is recorded
- [ ] Work order shows parts cost
- [ ] Low stock alert is triggered if needed

---

### Story 5.3: Adjust Inventory
**As** Ahmed (Admin)  
**I want** to adjust inventory quantities  
**So that** I can correct errors or add new stock

**Acceptance Criteria:**
- [ ] Can increase (IN) or decrease (OUT) quantity
- [ ] Can add notes explaining adjustment
- [ ] Stock movement is recorded with before/after quantities
- [ ] Can do bulk adjustments via CSV import
- [ ] Requires approval for large adjustments (optional)

---

## 🎯 Epic 6: Work Requests

### Story 6.1: Submit Work Request
**As** Salma (Requester - Nurse/Staff)  
**I want** to report a maintenance issue  
**So that** it gets fixed

**Acceptance Criteria:**
- [ ] Can submit request with title and description
- [ ] Can select priority
- [ ] Can select location
- [ ] Can attach photo (optional)
- [ ] Simple form that's easy to use
- [ ] Receives confirmation with request number
- [ ] Can submit via mobile or web

---

### Story 6.2: Approve/Reject Requests
**As** Fatima (Manager)  
**I want** to review work requests before creating work orders  
**So that** I can prioritize properly

**Acceptance Criteria:**
- [ ] Can see all pending requests
- [ ] Can approve (converts to work order)
- [ ] Can reject with reason
- [ ] Can edit request before approving
- [ ] Requester is notified of decision
- [ ] Can bulk approve multiple requests

---

### Story 6.3: Track Request Status
**As** Salma (Requester)  
**I want** to see the status of my request  
**So that** I know if it's being handled

**Acceptance Criteria:**
- [ ] Can view all my requests
- [ ] Can see status (PENDING, APPROVED, CONVERTED, REJECTED)
- [ ] If converted, can see work order number
- [ ] Receives notification when status changes
- [ ] Can add comments to request
- [ ] Simple interface in Arabic/French

---

## 🎯 Epic 7: Dashboard & Reporting

### Story 7.1: View Dashboard
**As** Ahmed (Admin)  
**I want** to see an overview of maintenance activities  
**So that** I can monitor operations

**Acceptance Criteria:**
- [ ] Shows work order summary (open, in progress, completed)
- [ ] Shows overdue work orders
- [ ] Shows assets by status
- [ ] Shows PM schedules due this week
- [ ] Shows recent activity
- [ ] Shows low stock parts
- [ ] Updates in real-time

---

### Story 7.2: Generate Reports
**As** Ahmed (Admin)  
**I want** to generate maintenance reports  
**So that** I can analyze performance

**Acceptance Criteria:**
- [ ] Work order completion report
- [ ] Maintenance cost report
- [ ] Asset downtime report
- [ ] Technician performance report
- [ ] Parts usage report
- [ ] Can select date range
- [ ] Can export to PDF or CSV
- [ ] Charts and visualizations

---

## 🎯 Epic 8: Mobile Experience

### Story 8.1: Offline Work Order Access
**As** Mohamed (Technician)  
**I want** to access work orders even without internet  
**So that** I can work in areas with poor connectivity

**Acceptance Criteria:**
- [ ] Work orders are cached locally
- [ ] Can view cached work orders offline
- [ ] Can update status offline (queued)
- [ ] Can take photos offline
- [ ] Changes sync when back online
- [ ] Shows sync status indicator
- [ ] Handles conflicts gracefully

---

### Story 8.2: Scan QR Codes
**As** Mohamed (Technician)  
**I want** to scan asset QR codes  
**So that** I can quickly access asset information

**Acceptance Criteria:**
- [ ] Can open camera to scan QR code
- [ ] Shows asset details after scan
- [ ] Can create work order from scanned asset
- [ ] Can view asset history
- [ ] Works offline (cached assets)
- [ ] Fast scanning experience

---

## 🎯 Epic 9: Notifications & Communication

### Story 9.1: Receive Notifications
**As** Mohamed (Technician)  
**I want** to receive notifications for important events  
**So that** I don't miss anything

**Acceptance Criteria:**
- [ ] Email notifications for work order assignments
- [ ] SMS for urgent work orders
- [ ] In-app notifications for comments
- [ ] Daily digest of pending tasks
- [ ] Can configure notification preferences
- [ ] Notifications in user's language

---

### Story 9.2: Team Communication
**As** Fatima (Manager)  
**I want** to communicate with my team  
**So that** everyone is informed

**Acceptance Criteria:**
- [ ] Can comment on work orders (mentions team)
- [ ] Can send announcements to all users
- [ ] Can message specific users
- [ ] Integration with WhatsApp (future)
- [ ] Notification preferences per user

---

## 🎯 Epic 10: Settings & Administration

### Story 10.1: Manage Organization Settings
**As** Ahmed (Admin)  
**I want** to configure system settings  
**So that** it works for my organization

**Acceptance Criteria:**
- [ ] Can set timezone
- [ ] Can set default language (Arabic/French/English)
- [ ] Can set currency (TND)
- [ ] Can upload organization logo
- [ ] Can set working hours
- [ ] Can configure email templates
- [ ] Can manage custom categories

---

### Story 10.2: Manage User Permissions
**As** Ahmed (Admin)  
**I want** to control what users can do  
**So that** data is secure

**Acceptance Criteria:**
- [ ] Can assign roles (ADMIN, MANAGER, ENGINEER, TECHNICIAN, REQUESTER)
- [ ] Each role has specific permissions
- [ ] Can deactivate users
- [ ] Can view user activity logs
- [ ] Can reset user passwords
- [ ] Can force password change

---

## 📊 Story Point Estimates

### Critical (Week 2-3):
- Work order status updates: **5 points**
- Work order completion: **8 points**
- Notifications system: **13 points**
- Dashboard: **8 points**
- Search & filtering: **5 points**

### Important (Week 4):
- Work requests: **8 points**
- File uploads: **5 points**
- QR codes: **5 points**
- Teams: **5 points**

### Phase 2:
- Procedures: **8 points**
- Reporting: **13 points**
- Mobile offline: **13 points**
- Advanced PM: **8 points**

---

## 🎯 User Journey Map

### Journey 1: New Work Order (Happy Path)
1. Salma reports AC issue via mobile → Work request created
2. Fatima receives notification → Reviews request
3. Fatima approves → Converts to work order → Assigns Mohamed
4. Mohamed receives SMS + email → Opens mobile app
5. Mohamed updates status to IN_PROGRESS
6. Mohamed completes work → Adds photos → Records parts used
7. Salma receives completion notification → Issue resolved!

### Journey 2: Preventive Maintenance
1. System checks PM schedules at 6 AM
2. "Weekly HVAC Inspection" is due → Work order created
3. Mohamed receives notification
4. Mohamed opens work order → Sees checklist from procedure
5. Mohamed completes checklist items
6. Mohamed marks complete → PM schedule updated to next week

---

## 🧪 Testing Scenarios

### Scenario 1: Organization Registration
```
GIVEN I am a new user
WHEN I register with organization name "Demo Co" and email "admin@demo.tn"
THEN organization is created with slug "demo-co"
AND admin user is created
AND I receive JWT tokens
AND I can log in
```

### Scenario 2: Work Order Assignment
```
GIVEN I am a manager
AND there is a technician "Mohamed"
WHEN I create work order "Fix AC" and assign to Mohamed
THEN Mohamed receives email notification
AND work order status is "OPEN"
AND Mohamed can see work order in mobile app
```

### Scenario 3: Offline Completion
```
GIVEN Mohamed is viewing work order in mobile app
AND Mohamed goes offline
WHEN Mohamed changes status to "COMPLETED"
THEN status is queued for sync
AND visual indicator shows "Pending sync"
WHEN Mohamed comes back online
THEN status is synced to server
AND notification is sent
```

---

