# Technical Architecture

## 🏛️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│  Web App     │  Mobile PWA  │  iOS App     │  Admin Portal      │
│  (Next.js)   │  (React PWA) │  (Future)    │  (React)           │
└──────┬───────┴──────┬───────┴──────┬───────┴─────┬──────────────┘
       │              │              │              │
       └──────────────┴──────────────┴──────────────┘
                      │
              ┌───────▼────────┐
              │  CDN / Nginx   │
              │  Load Balancer │
              └───────┬────────┘
                      │
       ┌──────────────┴──────────────┐
       │     API GATEWAY             │
       │  - Authentication           │
       │  - Rate Limiting            │
       │  - Request Routing          │
       │  - SSL Termination          │
       └──────────────┬──────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
┌───▼────┐    ┌──────▼──────┐    ┌─────▼─────┐
│ Auth   │    │  GraphQL    │    │  REST     │
│ Service│    │  Gateway    │    │  API      │
└───┬────┘    └──────┬──────┘    └─────┬─────┘
    │                 │                 │
    └─────────────────┴─────────────────┘
                      │
    ┌─────────────────┴─────────────────┐
    │      MICROSERVICES LAYER          │
    ├─────────────────┬─────────────────┤
    │                 │                 │
┌───▼────────┐  ┌────▼────────┐  ┌────▼────────┐
│Work Orders │  │   Assets    │  │  Inventory  │
│  Service   │  │   Service   │  │   Service   │
└───┬────────┘  └────┬────────┘  └────┬────────┘
    │                 │                 │
┌───▼────────┐  ┌────▼────────┐  ┌────▼────────┐
│    PM      │  │    Users    │  │ Inspections │
│  Service   │  │   Service   │  │   Service   │
└───┬────────┘  └────┬────────┘  └────┬────────┘
    │                 │                 │
┌───▼────────┐  ┌────▼────────┐  ┌────▼────────┐
│Notifications│ │  Reports    │  │ Locations   │
│  Service   │  │   Service   │  │   Service   │
└───┬────────┘  └────┬────────┘  └────┬────────┘
    │                 │                 │
    └─────────────────┴─────────────────┘
                      │
         ┌────────────┴────────────┐
         │   MESSAGE BROKER        │
         │  (RabbitMQ / Kafka)     │
         └────────────┬────────────┘
                      │
    ┌─────────────────┴─────────────────┐
    │          DATA LAYER               │
    ├─────────────────┬─────────────────┤
┌───▼──────────┐ ┌───▼──────────┐ ┌────▼───────┐
│ PostgreSQL   │ │    Redis     │ │Elasticsearch│
│ (Primary DB) │ │   (Cache)    │ │  (Search)  │
└──────────────┘ └──────────────┘ └────────────┘
┌──────────────┐ ┌──────────────┐ ┌────────────┐
│ TimescaleDB  │ │    MinIO     │ │  S3 Backup │
│  (Metrics)   │ │  (Storage)   │ │  (Archive) │
└──────────────┘ └──────────────┘ └────────────┘
```

## 🎯 Architecture Principles

### 1. Microservices Architecture
- **Independent Deployment**: Each service can be deployed separately
- **Technology Flexibility**: Use best tool for each job
- **Scalability**: Scale services independently based on load
- **Fault Isolation**: Failure in one service doesn't crash the system

### 2. Event-Driven Design
- **Loose Coupling**: Services communicate via events
- **Real-time Updates**: Push notifications to clients instantly
- **Audit Trail**: Every action creates an event for logging
- **Async Processing**: Heavy tasks don't block user requests

### 3. API-First Approach
- **REST API**: Standard CRUD operations
- **GraphQL**: Complex queries with nested data
- **WebSockets**: Real-time bidirectional communication
- **Webhooks**: External system integration

### 4. Progressive Web App (PWA)
- **Offline-First**: Works without internet connection
- **Service Workers**: Cache assets and API responses
- **Background Sync**: Queue actions when offline
- **Push Notifications**: Native-like notifications

## 🔧 Technology Stack Details

### Backend Services (Node.js + NestJS)

#### Why NestJS?
- **TypeScript Native**: Type safety across the stack
- **Modular Architecture**: Built-in dependency injection
- **Microservices Support**: Native gRPC, TCP, Redis transport
- **OpenAPI Integration**: Auto-generated API docs
- **Testing**: Built-in testing utilities

#### Service Structure
```typescript
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── local.strategy.ts
│   │   └── guards/
│   │       └── roles.guard.ts
│   ├── work-orders/
│   │   ├── work-orders.controller.ts
│   │   ├── work-orders.service.ts
│   │   ├── work-orders.module.ts
│   │   ├── entities/
│   │   │   └── work-order.entity.ts
│   │   └── dto/
│   │       ├── create-work-order.dto.ts
│   │       └── update-work-order.dto.ts
│   └── ... (other modules)
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   └── pipes/
├── config/
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── app.config.ts
└── main.ts
```

### Database Layer (PostgreSQL + Prisma)

#### Why Prisma?
- **Type-Safe Queries**: Auto-generated TypeScript types
- **Migration System**: Version control for database schema
- **Multiple Databases**: Can connect to multiple DBs
- **Performance**: Efficient queries with connection pooling

#### Schema Structure
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Organization {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  users        User[]
  workOrders   WorkOrder[]
  assets       Asset[]
  locations    Location[]
}

model User {
  id             String   @id @default(uuid())
  email          String   @unique
  password       String
  firstName      String
  lastName       String
  role           Role
  organizationId String
  
  organization   Organization @relation(fields: [organizationId], references: [id])
  workOrders     WorkOrder[]
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

enum Role {
  SUPER_ADMIN
  ADMIN
  MANAGER
  ENGINEER
  TECHNICIAN
  REQUESTER
}
```

### Frontend (React + Next.js)

#### Why Next.js?
- **SSR/SSG**: Better SEO and initial load performance
- **File-based Routing**: Intuitive project structure
- **API Routes**: Backend endpoints in same codebase
- **Image Optimization**: Automatic image optimization
- **Internationalization**: Built-in i18n support

#### Project Structure
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── work-orders/
│   │   ├── assets/
│   │   ├── inventory/
│   │   └── settings/
│   └── api/
│       └── [...endpoints]
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── work-orders/
│   ├── assets/
│   └── layout/
├── lib/
│   ├── api-client.ts
│   ├── auth.ts
│   └── utils.ts
├── hooks/
│   ├── useWorkOrders.ts
│   ├── useAssets.ts
│   └── useAuth.ts
├── stores/              # Zustand stores
│   ├── auth.store.ts
│   └── ui.store.ts
└── types/
    └── index.ts
```

### Mobile PWA

#### PWA Configuration
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.your-cmms\.com\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 // 24 hours
        }
      }
    }
  ]
});
```

#### Offline Data Sync Strategy
```typescript
// Service Worker background sync
class OfflineQueueManager {
  private queue: PendingAction[] = [];
  
  async addToQueue(action: PendingAction) {
    this.queue.push(action);
    await this.persistQueue();
  }
  
  async syncWhenOnline() {
    if (!navigator.onLine) return;
    
    for (const action of this.queue) {
      try {
        await this.executeAction(action);
        this.removeFromQueue(action.id);
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  }
}
```

## 🔌 Integration Layer

### External Services

#### SMS Provider (Tunisia)
- **Primary**: SMS.tn
- **Fallback**: Twilio
- **Use Cases**: 
  - Work order assignments
  - Critical alerts
  - 2FA codes

#### WhatsApp Business API
- **Provider**: 360dialog or Twilio
- **Use Cases**:
  - Work order notifications
  - Status updates
  - Rich media sharing (photos of completed work)

#### Email Service
- **Provider**: SendGrid or AWS SES
- **Use Cases**:
  - User invitations
  - Weekly reports
  - System notifications

#### Payment Gateway (Tunisia)
- **Primary**: Flouci API
- **Secondary**: D17 (Tunisian payment platform)
- **Future**: Stripe (for international customers)

### IoT Integration (Future)

```typescript
// IoT sensor data ingestion
interface SensorReading {
  assetId: string;
  sensorType: 'temperature' | 'vibration' | 'pressure' | 'humidity';
  value: number;
  unit: string;
  timestamp: Date;
}

class IoTDataProcessor {
  async processSensorData(reading: SensorReading) {
    // Store in TimescaleDB
    await this.storeReading(reading);
    
    // Check thresholds
    const alert = await this.checkThresholds(reading);
    if (alert) {
      await this.createWorkOrder(alert);
    }
    
    // Predictive maintenance (AI)
    await this.predictiveAnalysis(reading);
  }
}
```

## 📊 Data Flow Examples

### Work Order Creation Flow

```
1. User submits work order via mobile app
   ↓
2. API Gateway receives request
   ↓
3. Auth Service validates JWT token
   ↓
4. Work Orders Service creates record in PostgreSQL
   ↓
5. Event published to RabbitMQ: "work_order.created"
   ↓
6. Multiple consumers react:
   - Notifications Service → Send email/SMS/WhatsApp
   - Analytics Service → Update metrics
   - Search Service → Index in Elasticsearch
   ↓
7. WebSocket pushes update to all connected clients
   ↓
8. Mobile app receives real-time notification
```

### Offline Work Order Completion

```
1. Technician opens work order on mobile (offline)
   ↓
2. PWA loads cached work order data
   ↓
3. Technician completes work, adds photos
   ↓
4. Service Worker stores action in IndexedDB
   ↓
5. Visual indicator shows "pending sync"
   ↓
6. Device comes online
   ↓
7. Service Worker syncs pending actions
   ↓
8. Backend processes completion
   ↓
9. Confirmation synced back to device
```

## 🔒 Security Architecture

### Authentication Flow (JWT)

```typescript
interface JWTPayload {
  userId: string;
  organizationId: string;
  role: Role;
  permissions: string[];
}

// Access token: 15 minutes
// Refresh token: 7 days
class AuthService {
  async login(email: string, password: string) {
    const user = await this.validateCredentials(email, password);
    
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
  }
}
```

### Role-Based Access Control (RBAC)

```typescript
@Controller('work-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkOrdersController {
  
  @Get()
  @Roles('ADMIN', 'MANAGER', 'ENGINEER', 'TECHNICIAN')
  async findAll() {
    // Only authenticated users with specified roles
  }
  
  @Post()
  @Roles('ADMIN', 'MANAGER')
  async create(@Body() dto: CreateWorkOrderDto) {
    // Only admins and managers can create
  }
  
  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    // Only admins can delete
  }
}
```

## 🚀 Deployment Architecture

### Docker Compose (Development)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: cmms_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
  
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/cmms_dev
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
      - rabbitmq
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Kubernetes (Production - Future)

```yaml
# Deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: work-orders-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: work-orders-service
  template:
    metadata:
      labels:
        app: work-orders-service
    spec:
      containers:
      - name: work-orders
        image: your-registry/work-orders:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## 📈 Monitoring & Observability

### Metrics Collection
- **Prometheus**: Time-series metrics
- **Grafana**: Visualization dashboards
- **Key Metrics**:
  - Request latency (p50, p95, p99)
  - Error rates
  - Database connection pool
  - Queue depths
  - Active users
  - Work orders created/completed

### Logging
- **ELK Stack**: Centralized logging
- **Log Levels**: ERROR, WARN, INFO, DEBUG
- **Structured Logging**: JSON format

### Error Tracking
- **Sentry**: Real-time error tracking
- **Alerts**: Slack notifications for critical errors

---

**Next Steps**: See `02-DATABASE_SCHEMA.md` for detailed data models