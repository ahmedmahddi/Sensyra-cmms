import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrdersService } from './work-orders.service';
import { PrismaService } from '../database/prisma.service';
import { WorkOrderStatus, Priority } from '@prisma/client';

describe('WorkOrdersService', () => {
  let service: WorkOrdersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    workOrder: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn().mockResolvedValue(0),
    },
    asset: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkOrdersService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<WorkOrdersService>(WorkOrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a work order', async () => {
      const createDto = {
        title: 'Fix AC',
        priority: Priority.HIGH,
        assetId: 'asset-1',
      };
      const organizationId = 'org-1';
      const userId = 'user-1';

      mockPrismaService.asset.findFirst.mockResolvedValue({ id: 'asset-1', organizationId });
      mockPrismaService.workOrder.create.mockResolvedValue({
        id: 'wo-1',
        ...createDto,
        organizationId,
        createdById: userId,
        status: WorkOrderStatus.OPEN,
        number: 'WO-2024-0001',
      });

      const result = await service.create(createDto, userId, organizationId);
      expect(result).toBeDefined();
      expect(result.id).toEqual('wo-1');
    });
  });
});
