# Development Guidelines

## 🚀 Getting Started

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd tunisian-cmms

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Setup database
npx prisma migrate dev
npx prisma db seed

# Start development servers
npm run dev:backend   # Backend on http://localhost:3001
npm run dev:frontend  # Frontend on http://localhost:3000
```

### Environment Variables

```env
# .env.example

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cmms_dev"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Redis
REDIS_URL="redis://localhost:6379"

# RabbitMQ
RABBITMQ_URL="amqp://localhost:5672"

# File Storage (MinIO/S3)
STORAGE_ENDPOINT="localhost:9000"
STORAGE_ACCESS_KEY="minioadmin"
STORAGE_SECRET_KEY="minioadmin"
STORAGE_BUCKET="cmms-uploads"
STORAGE_USE_SSL=false

# Email (SendGrid)
SENDGRID_API_KEY="your-sendgrid-api-key"
EMAIL_FROM="noreply@your-cmms.tn"

# SMS (Tunisia)
SMS_PROVIDER="sms.tn"
SMS_API_KEY="your-sms-api-key"
SMS_FROM="CMMS"

# WhatsApp Business API
WHATSAPP_API_KEY="your-whatsapp-api-key"
WHATSAPP_PHONE_ID="your-phone-number-id"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001/v1"
NEXT_PUBLIC_WS_URL="ws://localhost:3001"

# Monitoring (Optional)
SENTRY_DSN="your-sentry-dsn"

# Feature Flags
ENABLE_WHATSAPP=false
ENABLE_AI_FEATURES=false
```

---

## 📁 Project Structure

```
tunisian-cmms/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── dto/
│   │   │   │   ├── strategies/
│   │   │   │   └── guards/
│   │   │   ├── users/
│   │   │   ├── work-orders/
│   │   │   ├── assets/
│   │   │   ├── locations/
│   │   │   ├── inventory/
│   │   │   ├── pm-schedules/
│   │   │   └── notifications/
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── pipes/
│   │   │   └── filters/
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   ├── jwt.config.ts
│   │   │   └── app.config.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── main.ts
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── work-orders/
│   │   │   │   ├── assets/
│   │   │   │   ├── inventory/
│   │   │   │   ├── locations/
│   │   │   │   ├── pm-schedules/
│   │   │   │   └── settings/
│   │   │   └── api/            # Optional API routes
│   │   ├── components/
│   │   │   ├── ui/             # shadcn components
│   │   │   ├── work-orders/
│   │   │   ├── assets/
│   │   │   └── layouts/
│   │   ├── lib/
│   │   │   ├── api-client.ts
│   │   │   ├── utils.ts
│   │   │   └── validations.ts
│   │   ├── hooks/
│   │   │   ├── useWorkOrders.ts
│   │   │   ├── useAssets.ts
│   │   │   └── useAuth.ts
│   │   ├── stores/             # Zustand
│   │   │   ├── auth.store.ts
│   │   │   └── ui.store.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── locales/
│   │       ├── ar/
│   │       ├── fr/
│   │       └── en/
│   ├── public/
│   │   ├── manifest.json
│   │   ├── sw.js
│   │   └── icons/
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.ts
│
├── mobile/                     # React Native (Future)
├── docs/                       # Documentation
│   ├── 00-PROJECT_OVERVIEW.md
│   ├── 01-TECHNICAL_ARCHITECTURE.md
│   └── ...
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── scripts/
│   ├── deploy.sh
│   └── backup.sh
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── .gitignore
├── .env.example
└── README.md
```

---

## 🔧 Development Workflow

### 1. Feature Development Process

```bash
# 1. Create feature branch
git checkout -b feature/work-order-status-update

# 2. Make changes
# - Update Prisma schema if needed
# - Create/update migrations
# - Write backend logic
# - Create frontend components
# - Add tests

# 3. Test locally
npm run test
npm run test:e2e

# 4. Commit with conventional commits
git commit -m "feat(work-orders): add status update endpoint"

# 5. Push and create PR
git push origin feature/work-order-status-update
```

### 2. Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <description>

# Types:
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation changes
style:    # Code style changes (formatting, etc)
refactor: # Code refactoring
test:     # Adding or updating tests
chore:    # Maintenance tasks

# Examples:
feat(auth): add 2FA authentication
fix(work-orders): resolve date formatting issue
docs(api): update endpoint documentation
refactor(assets): optimize query performance
test(users): add unit tests for user service
chore(deps): update dependencies
```

### 3. Branch Naming Convention

```bash
feature/short-description    # New features
bugfix/issue-description     # Bug fixes
hotfix/critical-issue        # Production hotfixes
refactor/component-name      # Code refactoring
docs/documentation-update    # Documentation
```

---

## 🧪 Testing Strategy

### Backend Testing (Jest + Supertest)

**Unit Tests:**
```typescript
// work-orders.service.spec.ts
describe('WorkOrdersService', () => {
  let service: WorkOrdersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WorkOrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get(WorkOrdersService);
    prisma = module.get(PrismaService);
  });

  describe('create', () => {
    it('should create work order successfully', async () => {
      const dto = { title: 'Test WO', priority: 'MEDIUM' };
      const orgId = 'org_123';

      const result = await service.create(dto, orgId);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(dto.title);
    });

    it('should throw error if asset not found', async () => {
      const dto = { 
        title: 'Test', 
        assetId: 'invalid_id',
        priority: 'MEDIUM' 
      };

      await expect(service.create(dto, 'org_123'))
        .rejects.toThrow(NotFoundException);
    });
  });
});
```

**Integration Tests:**
```typescript
// work-orders.controller.spec.ts (e2e)
describe('WorkOrders (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login to get token
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'password' });
    
    token = response.body.tokens.accessToken;
  });

  it('/work-orders (POST)', () => {
    return request(app.getHttpServer())
      .post('/work-orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Work Order',
        priority: 'MEDIUM',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Work Order');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

**Run Tests:**
```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Frontend Testing (Jest + React Testing Library)

```typescript
// WorkOrderCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkOrderCard } from './WorkOrderCard';

describe('WorkOrderCard', () => {
  const mockWorkOrder = {
    id: 'wo_123',
    title: 'Test Work Order',
    priority: 'HIGH',
    status: 'OPEN',
  };

  it('renders work order details', () => {
    render(<WorkOrderCard workOrder={mockWorkOrder} />);
    
    expect(screen.getByText('Test Work Order')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('calls onComplete when button clicked', () => {
    const onComplete = jest.fn();
    render(
      <WorkOrderCard workOrder={mockWorkOrder} onComplete={onComplete} />
    );
    
    fireEvent.click(screen.getByText('Complete'));
    
    expect(onComplete).toHaveBeenCalledWith(mockWorkOrder.id);
  });
});
```

---

## 📊 Database Management

### Migration Workflow

```bash
# Create migration
npx prisma migrate dev --name add_work_order_status

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset

# View migrations
npx prisma migrate status
```

### Seeding Data

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create demo organization
  const org = await prisma.organization.create({
    data: {
      name: 'Demo Company',
      slug: 'demo-company',
      plan: 'PROFESSIONAL',
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@demo.tn',
      password: hashedPassword,
      firstName: 'Ahmed',
      lastName: 'Admin',
      role: 'ADMIN',
      organizationId: org.id,
    },
  });

  // Create locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Building A',
        organizationId: org.id,
      },
    }),
    prisma.location.create({
      data: {
        name: 'Building B',
        organizationId: org.id,
      },
    }),
  ]);

  // Create assets
  const assets = await Promise.all([
    prisma.asset.create({
      data: {
        name: 'HVAC Unit 1',
        assetTag: 'HVAC-001',
        category: 'HVAC',
        status: 'OPERATIONAL',
        locationId: locations[0].id,
        organizationId: org.id,
      },
    }),
    prisma.asset.create({
      data: {
        name: 'Generator 1',
        assetTag: 'GEN-001',
        category: 'Generator',
        status: 'OPERATIONAL',
        locationId: locations[0].id,
        organizationId: org.id,
      },
    }),
  ]);

  // Create work orders
  await Promise.all([
    prisma.workOrder.create({
      data: {
        number: 'WO-2025-0001',
        title: 'HVAC Filter Replacement',
        priority: 'MEDIUM',
        status: 'OPEN',
        category: 'HVAC',
        assetId: assets[0].id,
        organizationId: org.id,
        createdById: admin.id,
        dueDate: new Date('2025-12-31'),
      },
    }),
  ]);

  console.log('✅ Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run seed:**
```bash
npx prisma db seed
```

---

## 🐳 Docker Development

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: cmms_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"  # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"  # Console
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data

  mailhog:  # Email testing
    image: mailhog/mailhog:latest
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:
  minio_data:
```

**Usage:**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Reset everything
docker-compose down -v  # Removes volumes
```

---

## 🔍 Code Quality Tools

### ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Husky Pre-commit Hooks

```bash
# Install Husky
npm install --save-dev husky lint-staged

# Setup
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

## 📈 Performance Monitoring

### Backend Logging

```typescript
// logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.json(),
      transports: [
        new winston.transports.File({ 
          filename: 'error.log', 
          level: 'error' 
        }),
        new winston.transports.File({ 
          filename: 'combined.log' 
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple(),
      }));
    }
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, { trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }
}
```

### Request Logging Interceptor

```typescript
// logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        
        console.log(
          `${method} ${url} ${response.statusCode} - ${delay}ms`
        );
      }),
    );
  }
}
```

---

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run start
```

### Environment Checklist

Before deploying:
- [ ] Update all environment variables
- [ ] Change JWT secrets
- [ ] Configure production database
- [ ] Setup SSL certificates
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup monitoring (Sentry)
- [ ] Configure backups
- [ ] Test all integrations
- [ ] Enable 2FA for admin

---

## 📚 Additional Resources

### Useful Commands

```bash
# Generate Prisma client
npx prisma generate

# View database in browser
npx prisma studio

# Format Prisma schema
npx prisma format

# Validate Prisma schema
npx prisma validate

# Create NestJS resource (CRUD)
nest g resource users

# Create Next.js component
npx shadcn-ui@latest add button
```

### Debug Configuration (VSCode)

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeArgs": ["--nolazy", "-r", "ts-node/register"],
      "args": ["src/main.ts"],
      "cwd": "${workspaceFolder}/backend",
      "protocol": "inspector"
    }
  ]
}
```

---

## ⚠️ Troubleshooting

### Common Issues

**Prisma Client Out of Sync:**
```bash
npx prisma generate
```

**Port Already in Use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Database Connection Failed:**
```bash
# Check Docker containers
docker ps

# Restart database
docker-compose restart postgres
```

**Module Not Found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Getting Help

- **Documentation:** Check `docs/` folder
- **API Docs:** http://localhost:3001/api
- **Database GUI:** http://localhost:5555 (Prisma Studio)
- **Email Testing:** http://localhost:8025 (MailHog)

---

**Last Updated:** December 24, 2025