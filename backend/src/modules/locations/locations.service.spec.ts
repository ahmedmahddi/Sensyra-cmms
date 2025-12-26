import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('LocationsService', () => {
  let service: LocationsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    location: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    asset: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = { name: 'Warehouse A', address: '123 Main St' };
    const organizationId = 'org-1';

    it('should create a location successfully', async () => {
      mockPrismaService.location.findFirst.mockResolvedValue(null);
      mockPrismaService.location.create.mockResolvedValue({
        id: 'loc-1',
        ...createDto,
        organizationId,
      });

      const result = await service.create(createDto, organizationId);
      expect(result.id).toEqual('loc-1');
    });
  });

  describe('findAll', () => {
    it('should return all locations for organization', async () => {
      const mockLocations = [
        { id: 'loc-1', name: 'Location 1' },
        { id: 'loc-2', name: 'Location 2' },
      ];
      mockPrismaService.location.findMany.mockResolvedValue(mockLocations);

      const result = await service.findAll('org-1');
      expect(result).toEqual(mockLocations);
    });
  });

  describe('findOne', () => {
    it('should return a location by id', async () => {
      const mockLocation = { id: 'loc-1', name: 'Test Location' };
      mockPrismaService.location.findFirst.mockResolvedValue(mockLocation);

      const result = await service.findOne('loc-1', 'org-1');
      expect(result).toEqual(mockLocation);
    });

    it('should throw NotFoundException if location not found', async () => {
      mockPrismaService.location.findFirst.mockResolvedValue(null);

      await expect(service.findOne('nonexistent', 'org-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a location with no dependencies', async () => {
      mockPrismaService.location.findFirst.mockResolvedValue({ id: 'loc-1' });
      mockPrismaService.location.count.mockResolvedValue(0);
      mockPrismaService.asset.count.mockResolvedValue(0);
      mockPrismaService.location.delete.mockResolvedValue({ id: 'loc-1' });

      const result = await service.remove('loc-1', 'org-1');
      expect(result.id).toEqual('loc-1');
    });

    it('should throw ConflictException if location has dependencies', async () => {
      mockPrismaService.location.findFirst.mockResolvedValue({ id: 'loc-1' });
      mockPrismaService.location.count.mockResolvedValue(2); // Has children
      mockPrismaService.asset.count.mockResolvedValue(0);

      await expect(service.remove('loc-1', 'org-1')).rejects.toThrow(ConflictException);
    });
  });
});
