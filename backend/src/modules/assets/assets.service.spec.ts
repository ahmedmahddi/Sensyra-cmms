import { Test, TestingModule } from '@nestjs/testing';
import { AssetsService } from './assets.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('AssetsService', () => {
  let service: AssetsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    asset: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<AssetsService>(AssetsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      name: 'CNC Machine',
      assetTag: 'AST-001',
      description: 'Main production unit',
    };
    const organizationId = 'org-1';

    it('should create an asset successfully', async () => {
      mockPrismaService.asset.findUnique.mockResolvedValue(null);
      mockPrismaService.asset.create.mockResolvedValue({
        id: 'asset-1',
        ...createDto,
        organizationId,
      });

      const result = await service.create(createDto, organizationId);
      expect(result.id).toEqual('asset-1');
      expect(mockPrismaService.asset.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if asset tag exists', async () => {
      mockPrismaService.asset.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(service.create(createDto, organizationId)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all assets for organization', async () => {
      const mockAssets = [
        { id: 'asset-1', name: 'Asset 1' },
        { id: 'asset-2', name: 'Asset 2' },
      ];
      mockPrismaService.asset.findMany.mockResolvedValue(mockAssets);

      const result = await service.findAll('org-1');
      expect(result).toEqual(mockAssets);
      expect(mockPrismaService.asset.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org-1', deletedAt: null },
        include: { location: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return an asset by id', async () => {
      const mockAsset = { id: 'asset-1', name: 'Test Asset' };
      mockPrismaService.asset.findFirst.mockResolvedValue(mockAsset);

      const result = await service.findOne('asset-1', 'org-1');
      expect(result).toEqual(mockAsset);
    });

    it('should throw NotFoundException if asset not found', async () => {
      mockPrismaService.asset.findFirst.mockResolvedValue(null);

      await expect(service.findOne('nonexistent', 'org-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an asset', async () => {
      mockPrismaService.asset.findFirst.mockResolvedValue({ id: 'asset-1' });
      mockPrismaService.asset.update.mockResolvedValue({ id: 'asset-1', name: 'Updated' });

      const result = await service.update('asset-1', { name: 'Updated' }, 'org-1');
      expect(result.name).toEqual('Updated');
    });
  });

  describe('remove', () => {
    it('should soft delete an asset', async () => {
      mockPrismaService.asset.findFirst.mockResolvedValue({ id: 'asset-1' });
      mockPrismaService.asset.update.mockResolvedValue({ id: 'asset-1', deletedAt: new Date() });

      const result = await service.remove('asset-1', 'org-1');
      expect(result.deletedAt).toBeDefined();
    });
  });
});
