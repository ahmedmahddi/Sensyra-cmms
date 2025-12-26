import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    organization: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an organization by id', async () => {
      const mockOrg = { id: 'org-1', name: 'Test Org', slug: 'test-org' };
      mockPrismaService.organization.findUnique.mockResolvedValue(mockOrg);

      const result = await service.findOne('org-1');
      expect(result).toEqual(mockOrg);
    });

    it('should throw NotFoundException if organization not found', async () => {
      mockPrismaService.organization.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an organization', async () => {
      mockPrismaService.organization.findUnique.mockResolvedValue({ id: 'org-1' });
      mockPrismaService.organization.update.mockResolvedValue({
        id: 'org-1',
        name: 'Updated Org',
      });

      const result = await service.update('org-1', { name: 'Updated Org' });
      expect(result.name).toEqual('Updated Org');
    });
  });

  describe('findAll', () => {
    it('should return all organizations', async () => {
      const mockOrgs = [
        { id: 'org-1', name: 'Org 1' },
        { id: 'org-2', name: 'Org 2' },
      ];
      mockPrismaService.organization.findMany.mockResolvedValue(mockOrgs);

      const result = await service.findAll();
      expect(result).toEqual(mockOrgs);
    });
  });
});
