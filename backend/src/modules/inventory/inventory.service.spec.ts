import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MovementType } from '@prisma/client';

describe('InventoryService', () => {
  let service: InventoryService;
  let prisma: PrismaService;

  const mockTransaction = jest.fn();

  const mockPrismaService = {
    part: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    stockMovement: {
      create: jest.fn(),
    },
    $transaction: mockTransaction,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      name: 'Filter',
      sku: 'FLT-001',
      quantity: 10,
      unit: 'pcs',
    };
    const organizationId = 'org-1';

    it('should create a part successfully', async () => {
      mockPrismaService.part.findFirst.mockResolvedValue(null);
      mockPrismaService.part.create.mockResolvedValue({
        id: 'part-1',
        ...createDto,
        organizationId,
      });

      const result = await service.create(createDto, organizationId);
      expect(result.id).toEqual('part-1');
    });

    it('should throw BadRequestException if barcode exists', async () => {
      const dtoWithBarcode = { ...createDto, barcode: 'BC-001' };
      mockPrismaService.part.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(service.create(dtoWithBarcode, organizationId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all parts for organization', async () => {
      const mockParts = [
        { id: 'part-1', name: 'Part 1' },
        { id: 'part-2', name: 'Part 2' },
      ];
      mockPrismaService.part.findMany.mockResolvedValue(mockParts);

      const result = await service.findAll('org-1');
      expect(result).toEqual(mockParts);
    });
  });

  describe('findOne', () => {
    it('should return a part by id', async () => {
      const mockPart = { id: 'part-1', name: 'Test Part', quantity: 10 };
      mockPrismaService.part.findFirst.mockResolvedValue(mockPart);

      const result = await service.findOne('part-1', 'org-1');
      expect(result).toEqual(mockPart);
    });

    it('should throw NotFoundException if part not found', async () => {
      mockPrismaService.part.findFirst.mockResolvedValue(null);

      await expect(service.findOne('nonexistent', 'org-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('adjustStock', () => {
    it('should increase stock for IN movement', async () => {
      const mockPart = { id: 'part-1', quantity: 10 };
      mockPrismaService.part.findFirst.mockResolvedValue(mockPart);

      mockTransaction.mockImplementation(async (callback) => {
        const tx = {
          stockMovement: { create: jest.fn() },
          part: { update: jest.fn().mockResolvedValue({ ...mockPart, quantity: 15 }) },
        };
        return callback(tx);
      });

      const result = await service.adjustStock(
        'part-1',
        {
          type: MovementType.IN,
          quantity: 5,
        },
        'org-1',
      );

      expect(result.quantity).toEqual(15);
    });

    it('should throw BadRequestException for insufficient stock on OUT', async () => {
      const mockPart = { id: 'part-1', quantity: 5 };
      mockPrismaService.part.findFirst.mockResolvedValue(mockPart);

      await expect(
        service.adjustStock(
          'part-1',
          {
            type: MovementType.OUT,
            quantity: 10,
          },
          'org-1',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
