import { Test, TestingModule } from '@nestjs/testing';
import { PMSchedulesService } from './pm-schedules.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PMSchedulesService', () => {
  let service: PMSchedulesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    pMSchedule: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PMSchedulesService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<PMSchedulesService>(PMSchedulesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      name: 'Monthly Inspection',
      frequency: 'MONTHLY',
      assetId: 'asset-1',
    };
    const organizationId = 'org-1';

    it('should create a PM schedule successfully', async () => {
      mockPrismaService.pMSchedule.create.mockResolvedValue({
        id: 'pm-1',
        ...createDto,
        organizationId,
        nextDueDate: new Date(),
      });

      const result = await service.create(createDto, organizationId);
      expect(result.id).toEqual('pm-1');
    });
  });

  describe('findAll', () => {
    it('should return all PM schedules for organization', async () => {
      const mockSchedules = [
        { id: 'pm-1', name: 'Schedule 1' },
        { id: 'pm-2', name: 'Schedule 2' },
      ];
      mockPrismaService.pMSchedule.findMany.mockResolvedValue(mockSchedules);

      const result = await service.findAll('org-1');
      expect(result).toEqual(mockSchedules);
    });
  });

  describe('findOne', () => {
    it('should return a PM schedule by id', async () => {
      const mockSchedule = { id: 'pm-1', name: 'Test Schedule' };
      mockPrismaService.pMSchedule.findFirst.mockResolvedValue(mockSchedule);

      const result = await service.findOne('pm-1', 'org-1');
      expect(result).toEqual(mockSchedule);
    });

    it('should throw NotFoundException if PM schedule not found', async () => {
      mockPrismaService.pMSchedule.findFirst.mockResolvedValue(null);

      await expect(service.findOne('nonexistent', 'org-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a PM schedule', async () => {
      mockPrismaService.pMSchedule.findFirst.mockResolvedValue({ id: 'pm-1' });
      mockPrismaService.pMSchedule.update.mockResolvedValue({
        id: 'pm-1',
        name: 'Updated Schedule',
      });

      const result = await service.update('pm-1', { name: 'Updated Schedule' }, 'org-1');
      expect(result.name).toEqual('Updated Schedule');
    });
  });

  describe('remove', () => {
    it('should delete a PM schedule', async () => {
      mockPrismaService.pMSchedule.findFirst.mockResolvedValue({ id: 'pm-1' });
      mockPrismaService.pMSchedule.delete.mockResolvedValue({ id: 'pm-1' });

      const result = await service.remove('pm-1', 'org-1');
      expect(result.id).toEqual('pm-1');
    });
  });
});
