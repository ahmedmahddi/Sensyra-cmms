# Backend API Test Plan (Postman)

Use this guide to test the backend API endpoints using Postman or a similar tool.

## **1. Authentication**

### **1.1 Register Organization & User**
- **Endpoint:** `POST {{baseUrl}}/auth/register`
- **Description:** Creates a new organization and an initial admin user.
- **Input (JSON):**
  ```json
  {
    "organization": {
      "name": "Tunisian Manufacturing Co.",
      "slug": "tunisian-mfg"
    },
    "user": {
      "firstName": "Ahmed",
      "lastName": "Ben Ali",
      "email": "admin@tunisian-mfg.com",
      "password": "SecurePassword123!",
      "phone": "+216 20 123 456",
      "language": "fr"
    }
  }
  ```
- **Expected Result:** `201 Created`
- **Actual Result:** :  201
Created {
    "user": {
        "id": "f89f184c-5e75-4d42-b146-2a24ea8cf6ea",
        "email": "admin@tunisian-mfg.com",
        "role": "ADMIN",
        "organizationId": "c9630384-d7a9-4bb8-bd7b-b3142a14516c"
    },
    "tokens": {
        "accessToken": "...",
        "refreshToken": "...",
        "expiresIn": 900
    }
}

### **1.2 Login**
- **Endpoint:** `POST {{baseUrl}}/auth/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Input (JSON):**
  ```json
  {
    "email": "admin@tunisian-mfg.com",
    "password": "SecurePassword123!"
  }
  ```
- **Expected Result:** `201 Created` (Returns `{ "accessToken": "..." }`)
- **Actual Result:** : 201 Created

### **1.3 Logout**
- **Endpoint:** `POST {{baseUrl}}/auth/logout`
- **Description:** Invalidates the current session (client-side only for stateless JWT, but endpoint exists).
- **Headers:** `Authorization: Bearer {{accessToken}}`
- **Input:** `None`
- **Expected Result:** `201 Created`
- **Actual Result:** : 201 Created

---

## **2. User Management**

### **2.1 Create User**
- **Endpoint:** `POST {{baseUrl}}/users`
- **Expected Result:** `201 Created`
- **Actual Result:**: 201 Created

### **2.2 Get All Users**
- **Endpoint:** `GET {{baseUrl}}/users`
- **Expected Result:** `200 OK`
- **Actual Result:** : 200 OK

### **2.3 Get User Profile**
- **Endpoint:** `GET {{baseUrl}}/users/{{userId}}`
- **Expected Result:** `200 OK`
- **Actual Result:** : 200 OK

### **2.4 Update User**
- **Endpoint:** `PATCH {{baseUrl}}/users/{{userId}}`
- **Input (JSON):**
  ```json
  { "firstName": "NewName" }
  ```
- **Expected Result:** `200 OK`
- **Status:** ✅ Implemented

### **2.5 Delete User (Soft Delete)**
- **Endpoint:** `DELETE {{baseUrl}}/users/{{userId}}`
- **Expected Result:** `200 OK` (Sets `deletedAt` and `isActive: false`)
- **Status:** ✅ Implemented

---

## **3. Locations**

### **3.1 Create Location**
- **Endpoint:** `POST {{baseUrl}}/locations`
- **Expected Result:** `201 Created`
- **Actual Result:** : 201 Created

### **3.2 Get All Locations**
- **Endpoint:** `GET {{baseUrl}}/locations`
- **Expected Result:** `200 OK`
- **Actual Result:** : 200 OK

### **3.3 Update Location**
- **Endpoint:** `PATCH {{baseUrl}}/locations/{{locationId}}`
- **Input (JSON):**
  ```json
  { "name": "New Floor Plan" }
  ```
- **Expected Result:** `200 OK`
- **Status:** ✅ Implemented

### **3.4 Delete Location (Soft Delete)**
- **Endpoint:** `DELETE {{baseUrl}}/locations/{{locationId}}`
- **Expected Result:** `200 OK` (Checks for dependencies first)
- **Status:** ✅ Implemented

---

## **4. Assets**

### **4.1 Create Asset**
- **Endpoint:** `POST {{baseUrl}}/assets`
- **Expected Result:** `201 Created`
- **Actual Result:** : 201 Created

### **4.2 Update Asset**
- **Endpoint:** `PATCH {{baseUrl}}/assets/{{assetId}}`
- **Expected Result:** `200 OK`
- **Actual Result:** : 200 OK

### **4.3 Delete Asset (Soft Delete)**
- **Endpoint:** `DELETE {{baseUrl}}/assets/{{assetId}}`
- **Expected Result:** `200 OK` (Sets `deletedAt`)
- **Status:** ✅ Implemented

---

## **5. Work Orders**

### **5.1 Create Work Order**
- **Endpoint:** `POST {{baseUrl}}/work-orders`
- **Expected Result:** `201 Created`
- **Actual Result:** : 201 Created

### **5.2 Get Work Orders**
- **Endpoint:** `GET {{baseUrl}}/work-orders`
- **Expected Result:** `200 OK`
- **Actual Result:** : 200 OK

### **5.3 Update Work Order**
- **Endpoint:** `PATCH {{baseUrl}}/work-orders/{{workOrderId}}`
- **Input (JSON):**
  ```json
  { "status": "IN_PROGRESS" }
  ```
- **Expected Result:** `200 OK`
- **Status:** ✅ Implemented

### **5.4 Delete Work Order (Soft Delete)**
- **Endpoint:** `DELETE {{baseUrl}}/work-orders/{{workOrderId}}`
- **Expected Result:** `200 OK` (Sets `deletedAt` and logs to history)
- **Status:** ✅ Implemented (Requires DB Migration)

---

## **6. Inventory (Parts)**

### **6.1 Create Part**
- **Endpoint:** `POST {{baseUrl}}/inventory`
- **Expected Result:** `201 Created`
- **Actual Result:** : 201 Created

### **6.2 Adjust Stock**
- **Endpoint:** `POST {{baseUrl}}/inventory/{{partId}}/adjust`
- **Expected Result:** `201 Created`
- **Actual Result:** : 201 Created

### **6.3 Update Part**
- **Endpoint:** `PATCH {{baseUrl}}/inventory/{{partId}}`
- **Input (JSON):**
  ```json
  { "name": "Updated Part Name" }
  ```
- **Expected Result:** `200 OK`
- **Status:** ✅ Implemented

### **6.4 Delete Part (Soft Delete)**
- **Endpoint:** `DELETE {{baseUrl}}/inventory/{{partId}}`
- **Expected Result:** `200 OK` (Sets `deletedAt`)
- **Status:** ✅ Implemented (Requires DB Migration)

---

## **7. PM Schedules**

### **7.1 Create PM Schedule**
- **Endpoint:** `POST {{baseUrl}}/pm-schedules`
- **Expected Result:** `201 Created`
- **Actual Result:** : 201 Created

### **7.2 Update PM Schedule**
- **Endpoint:** `PATCH {{baseUrl}}/pm-schedules/{{pmScheduleId}}`
- **Input (JSON):**
  ```json
  { "isActive": false }
  ```
- **Expected Result:** `200 OK`
- **Status:** ✅ Implemented

### **7.3 Delete PM Schedule**
- **Endpoint:** `DELETE {{baseUrl}}/pm-schedules/{{pmScheduleId}}`
- **Expected Result:** `200 OK`
- **Status:** ✅ Implemented as Soft Delete

---

## **8. Organization Settings**

### **8.1 Update Organization**
- **Endpoint:** `PATCH {{baseUrl}}/organizations/my`
- **Expected Result:** `200 OK`
- **Actual Result:** : 200 OK
