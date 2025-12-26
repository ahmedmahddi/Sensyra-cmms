import { PrismaClient, Priority, WorkOrderStatus, AssetStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'sensyra-demo' },
    update: {},
    create: {
      name: 'Sensyra Demo Corp',
      slug: 'sensyra-demo',
      billingEmail: 'demo@sensyra.tn',
    },
  });

  console.log('Created Organization:', org.name);

  // 2. Create Admin User
  const password = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sensyra.tn' },
    update: {},
    create: {
      email: 'admin@sensyra.tn',
      password,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      organizationId: org.id,
    },
  });

  console.log('Created Admin User:', admin.email);

  // 3. Create Locations
  const warehouse = await prisma.location.create({
    data: {
      name: 'Main Warehouse',
      organizationId: org.id,
      address: 'Industrial Zone, Tunis',
    },
  });
  
  console.log('Created Location:', warehouse.name);

  // 4. Create Assets
  const asset1 = await prisma.asset.create({
    data: {
      name: 'CNC Machine X1',
      assetTag: 'AST-001',
      description: 'Main production unit',
      status: AssetStatus.OPERATIONAL,
      organizationId: org.id,
      locationId: warehouse.id,
      category: 'Machinery',
      manufacturer: 'Siemens',
      model: 'CNC-2024',
    },
  });

  console.log('Created Asset:', asset1.name);

  // 5. Create Work Order
  await prisma.workOrder.create({
    data: {
      number: 'WO-2024-001',
      title: 'Routine Maintenance',
      description: 'Check hydraulic fluids and filters.',
      priority: Priority.MEDIUM,
      status: WorkOrderStatus.OPEN,
      organizationId: org.id,
      assetId: asset1.id,
      createdById: admin.id,
      assignedToId: admin.id,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Due 1 week from now
    },
  });

  console.log('Created Initial Work Order');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
