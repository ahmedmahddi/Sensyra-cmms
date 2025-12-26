# GEMINI AI Rules for Tunisian CMMS

## 🎯 Project Context

You are building a CMMS (Computerized Maintenance Management System) for the Tunisian market. This system competes with MaintainX by offering localization, affordable pricing, and local payment methods.

**Tech Stack:**
- Backend: Node.js + NestJS + Prisma + PostgreSQL
- Frontend: Next.js + React + TypeScript + Tailwind CSS
- Mobile: PWA (Progressive Web App) initially
- Infrastructure: Docker + Redis + RabbitMQ

**Target Market:** Tunisian SMBs (manufacturing, hospitality, healthcare)
**Timeline:** 1-month MVP
**Role:** Solo developer

---

## 🏗️ Architecture Guidelines

### 1. Backend Structure (NestJS)

```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── work-orders/
│   ├── assets/
│   ├── locations/
│   ├── inventory/
│   ├── pm-schedules/
│   └── notifications/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── filters/
├── config/
└── main.ts
```

**When creating modules:**
- Use NestJS CLI: `nest g module work-orders`
- Include controller, service, module, entities, and DTOs
- Apply proper dependency injection
- Use guards for authorization
- Implement validation pipes

### 2. Database (Prisma)

**Schema location:** `prisma/schema.prisma`

**When creating models:**
- Always include: `id`, `createdAt`, `updatedAt`, `deletedAt?`
- Use proper relations with `@relation`
- Add indexes for frequently queried fields
- Include `organizationId` for multi-tenancy
- Use enums for status/type fields

**Migration commands:**
```bash
npx prisma migrate dev --name feature_name
npx prisma generate
npx prisma studio  # For GUI
```

### 3. Frontend Structure (Next.js)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── work-orders/
│   │   ├── assets/
│   │   └── settings/
│   └── api/  # API routes if needed
├── components/
│   ├── ui/         # shadcn components
│   ├── work-orders/
│   ├── assets/
│   └── layouts/
├── lib/
│   ├── api-client.ts
│   ├── utils.ts
│   └── validations.ts
├── hooks/
└── types/
```

**When creating pages:**
- Use TypeScript with proper interfaces
- Implement proper loading/error states
- Use React Query for data fetching
- Apply proper SEO with metadata
- Ensure responsive design (mobile-first)

---

## 📝 Code Style & Best Practices

### TypeScript

```typescript
// ✅ GOOD: Explicit types, clear naming
interface CreateWorkOrderDto {
  title: string;
  description?: string;
  priority: Priority;
  assignedToId?: string;
  assetId?: string;
  dueDate?: Date;
}

async function createWorkOrder(
  dto: CreateWorkOrderDto,
  userId: string
): Promise<WorkOrder> {
  // Implementation
}

// ❌ BAD: Any types, unclear naming
async function create(data: any): Promise<any> {
  // Implementation
}
```

### NestJS Controllers

```typescript
// ✅ GOOD: Proper decorators, validation, authorization
@Controller('work-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(
    @Body() createDto: CreateWorkOrderDto,
    @CurrentUser() user: User,
  ): Promise<WorkOrder> {
    return this.workOrdersService.create(createDto, user.organizationId);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'ENGINEER', 'TECHNICIAN')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<WorkOrder> {
    return this.workOrdersService.findOne(id, user.organizationId);
  }
}
```

### NestJS Services

```typescript
// ✅ GOOD: Proper error handling, organization isolation
@Injectable()
export class WorkOrdersService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
  ) {}

  async create(
    dto: CreateWorkOrderDto,
    organizationId: string,
  ): Promise<WorkOrder> {
    // Validate asset exists and belongs to organization
    if (dto.assetId) {
      const asset = await this.prisma.asset.findFirst({
        where: { id: dto.assetId, organizationId },
      });
      if (!asset) {
        throw new NotFoundException('Asset not found');
      }
    }

    // Generate work order number
    const number = await this.generateWorkOrderNumber(organizationId);

    // Create work order
    const workOrder = await this.prisma.workOrder.create({
      data: {
        ...dto,
        number,
        organizationId,
      },
      include: {
        assignedTo: true,
        asset: true,
      },
    });

    // Emit event for notifications
    await this.eventsService.emit('work_order.created', {
      workOrderId: workOrder.id,
      organizationId,
    });

    return workOrder;
  }

  async findOne(id: string, organizationId: string): Promise<WorkOrder> {
    const workOrder = await this.prisma.workOrder.findFirst({
      where: { id, organizationId, deletedAt: null },
      include: {
        assignedTo: true,
        asset: true,
        location: true,
        tasks: true,
        parts: { include: { part: true } },
      },
    });

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    return workOrder;
  }
}
```

### React Components

```typescript
// ✅ GOOD: Typed props, hooks, error handling
interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onComplete: (id: string) => void;
}

export function WorkOrderCard({ workOrder, onComplete }: WorkOrderCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await onComplete(workOrder.id);
      toast.success('أمر العمل مكتمل');
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{workOrder.title}</CardTitle>
        <Badge variant={getPriorityVariant(workOrder.priority)}>
          {workOrder.priority}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {workOrder.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleComplete} disabled={isLoading}>
          {isLoading ? <Spinner /> : 'إكمال'}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

---

## 🔒 Security Rules

### 1. Authentication
- Always use JWT with 15-minute access tokens
- Implement refresh tokens (7 days)
- Hash passwords with bcrypt (12 rounds minimum)
- Validate tokens in guards

### 2. Authorization
- Use role-based access control (RBAC)
- Always check organization ownership
- Implement resource-level permissions

```typescript
// ✅ GOOD: Check organization ownership
async findOne(id: string, organizationId: string) {
  return this.prisma.workOrder.findFirst({
    where: { id, organizationId }, // Critical!
  });
}

// ❌ BAD: Missing organization check
async findOne(id: string) {
  return this.prisma.workOrder.findUnique({
    where: { id }, // Vulnerable!
  });
}
```

### 3. Input Validation
- Use class-validator decorators
- Sanitize all user inputs
- Validate file uploads

```typescript
// ✅ GOOD: Proper validation
export class CreateWorkOrderDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
```

---

## 🌍 Internationalization (i18n)

### Backend Messages

```typescript
// Use i18n service for error messages
throw new BadRequestException(
  this.i18n.t('errors.WORK_ORDER_NOT_FOUND', {
    lang: user.language.toLowerCase(),
  })
);
```

### Frontend i18n

```typescript
// Use next-intl or react-i18next
import { useTranslation } from 'next-intl';

export function WorkOrderList() {
  const t = useTranslation('work-orders');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <Button>{t('create')}</Button>
    </div>
  );
}
```

**Translation files:**
```
locales/
├── ar/
│   ├── common.json
│   ├── work-orders.json
│   └── assets.json
├── fr/
└── en/
```

---

## 📱 Mobile-First Development

### Responsive Design
```typescript
// ✅ GOOD: Mobile-first Tailwind classes
<div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">
  <Card className="w-full md:w-1/2 lg:w-1/3">
    {/* Content */}
  </Card>
</div>
```

### PWA Configuration
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // Next.js config
});
```

---

## 🧪 Testing Guidelines

### Unit Tests (Jest)

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
          useValue: {
            workOrder: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<WorkOrdersService>(WorkOrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create work order', async () => {
    const dto = { title: 'Test', priority: 'MEDIUM' };
    const orgId = 'org_123';
    
    jest.spyOn(prisma.workOrder, 'create').mockResolvedValue({
      id: 'wo_123',
      ...dto,
    } as any);

    const result = await service.create(dto, orgId);
    
    expect(result.id).toBe('wo_123');
    expect(prisma.workOrder.create).toHaveBeenCalled();
  });
});
```

---

## 🚀 Performance Optimization

### Database Queries

```typescript
// ✅ GOOD: Efficient query with indexes
const workOrders = await prisma.workOrder.findMany({
  where: {
    organizationId,
    status: 'OPEN',
    deletedAt: null,
  },
  include: {
    assignedTo: {
      select: { id: true, firstName: true, lastName: true },
    },
    asset: {
      select: { id: true, name: true, assetTag: true },
    },
  },
  orderBy: { createdAt: 'desc' },
  take: 20,
  skip: (page - 1) * 20,
});

// ❌ BAD: N+1 query problem
const workOrders = await prisma.workOrder.findMany();
for (const wo of workOrders) {
  wo.assignedTo = await prisma.user.findUnique({ where: { id: wo.assignedToId } });
}
```

### React Query Caching

```typescript
// ✅ GOOD: Proper caching strategy
export function useWorkOrders(filters: WorkOrderFilters) {
  return useQuery({
    queryKey: ['work-orders', filters],
    queryFn: () => api.workOrders.list(filters),
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
  });
}
```

---

## 📦 Package Management

### When to install packages:
```bash
# Backend dependencies
npm install --save @nestjs/jwt bcrypt class-validator

# Frontend dependencies  
npm install --save react-query date-fns

# Dev dependencies
npm install --save-dev @types/node prisma
```

### When to create new files:
- Controllers: Business logic endpoints
- Services: Core business logic
- DTOs: Data transfer objects for validation
- Entities: Database models (Prisma)
- Components: Reusable UI pieces
- Hooks: Reusable React logic

---

## ⚡ Common Commands

```bash
# Backend
npm run start:dev          # Start with hot reload
npm run build             # Build for production
npx prisma studio         # Open database GUI
npx prisma migrate dev    # Create migration

# Frontend
npm run dev               # Development server
npm run build             # Production build
npm run lint              # Lint code

# Database
npx prisma db push        # Quick schema sync (dev only)
npx prisma migrate reset  # Reset database
npx prisma db seed        # Run seed data
```

---

## 🎨 UI/UX Guidelines

### Use shadcn/ui components:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

### Color scheme (Tunisia theme):
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#E30613', // Tunisia red
        secondary: '#00A651', // Tunisia green
      },
    },
  },
};
```

---

## 🐛 Error Handling

### Backend
```typescript
// Custom exception filter
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      error: {
        code: exception.name,
        message: exception.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
```

### Frontend
```typescript
// Error boundary
'use client';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">حدث خطأ</h2>
      <button onClick={reset}>حاول مرة أخرى</button>
    </div>
  );
}
```

---

## 📚 Documentation

Always include:
- JSDoc comments for complex functions
- README.md in each major folder
- API endpoint documentation
- Environment variables documentation

```typescript
/**
 * Creates a new work order and sends notifications
 * 
 * @param dto - Work order creation data
 * @param organizationId - Organization ID for multi-tenancy
 * @returns Created work order with relations
 * @throws NotFoundException if asset/user not found
 * @throws BadRequestException if validation fails
 */
async create(dto: CreateWorkOrderDto, organizationId: string): Promise<WorkOrder>
```

---

## 🎯 Priority Rules for MVP (Month 1)

**MUST IMPLEMENT:**
1. Authentication & user management
2. Work order CRUD
3. Asset tracking
4. Basic PM scheduling
5. Mobile PWA
6. Arabic/French UI

**CAN WAIT:**
1. Advanced analytics
2. Purchase orders
3. Vendor management
4. AI features
5. Native mobile apps

---

## ⚠️ Common Mistakes to Avoid

1. ❌ Forgetting organization isolation in queries
2. ❌ Not validating DTOs
3. ❌ Missing error handling
4. ❌ Hardcoding strings (use i18n)
5. ❌ Not testing authentication/authorization
6. ❌ Ignoring mobile responsiveness
7. ❌ Not using TypeScript properly
8. ❌ Missing database indexes
9. ❌ Not implementing soft deletes
10. ❌ Forgetting to add loading states

---

## 🤖 When to Ask for Help

Ask me to:
- Create new modules/features
- Debug complex issues
- Optimize database queries
- Review security concerns
- Design UI components
- Write complex business logic

Provide:
- Clear description of what you need
- Relevant code snippets
- Error messages if applicable
- Expected vs actual behavior