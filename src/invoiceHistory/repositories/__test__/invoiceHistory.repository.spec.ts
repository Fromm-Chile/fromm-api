import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceHistoryRepository } from '../invoiceHistory.repository';
import { PrismaService } from 'prisma/prisma.service';
import { CreateInvoiceHistoryDto } from '../../dto/create-invoiceHistory.dto';
import { InvoiceEventHistory } from '@prisma/client';

const mockPrismaService = {
  invoiceEventHistory: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

const mockInvoiceEventHistory: InvoiceEventHistory = {
  id: 1,
  invoiceId: 100,
  adminUserId: 10,
  status: 'approved',
  comment: 'Invoice approved by admin',
  createdAt: new Date('2025-01-15T10:30:00Z'),
};

const mockInvoiceEventHistoryArray: InvoiceEventHistory[] = [
  {
    id: 1,
    invoiceId: 100,
    adminUserId: 10,
    status: 'pending',
    comment: 'Invoice created',
    createdAt: new Date('2025-01-15T10:00:00Z'),
  },
  {
    id: 2,
    invoiceId: 100,
    adminUserId: 10,
    status: 'approved',
    comment: 'Invoice approved',
    createdAt: new Date('2025-01-15T10:30:00Z'),
  },
  {
    id: 3,
    invoiceId: 101,
    adminUserId: 11,
    status: 'rejected',
    comment: 'Missing documentation',
    createdAt: new Date('2025-01-15T11:00:00Z'),
  },
];

describe('InvoiceHistoryRepository', () => {
  let repository: InvoiceHistoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceHistoryRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<InvoiceHistoryRepository>(InvoiceHistoryRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new invoice event history record', async () => {
      const createDto: CreateInvoiceHistoryDto = {
        invoiceId: 100,
        adminUserId: 10,
        status: 'approved',
        comment: 'Invoice approved by admin',
      };

      mockPrismaService.invoiceEventHistory.create.mockResolvedValue(
        mockInvoiceEventHistory,
      );

      const result = await repository.create(createDto);

      expect(result).toEqual(mockInvoiceEventHistory);
      expect(mockPrismaService.invoiceEventHistory.create).toHaveBeenCalledWith(
        {
          data: createDto,
        },
      );
      expect(
        mockPrismaService.invoiceEventHistory.create,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of all invoice event histories', async () => {
      mockPrismaService.invoiceEventHistory.findMany.mockResolvedValue(
        mockInvoiceEventHistoryArray,
      );

      const result = await repository.findAll();

      expect(result).toEqual(mockInvoiceEventHistoryArray);
      expect(result).toHaveLength(3);
      expect(
        mockPrismaService.invoiceEventHistory.findMany,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single invoice event history by id', async () => {
      mockPrismaService.invoiceEventHistory.findUnique.mockResolvedValue(
        mockInvoiceEventHistory,
      );

      const result = await repository.findOne(1);

      expect(result).toEqual(mockInvoiceEventHistory);
      expect(
        mockPrismaService.invoiceEventHistory.findUnique,
      ).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(
        mockPrismaService.invoiceEventHistory.findUnique,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete an invoice event history by id', async () => {
      mockPrismaService.invoiceEventHistory.delete.mockResolvedValue(
        mockInvoiceEventHistory,
      );

      const result = await repository.remove(1);

      expect(result).toEqual(mockInvoiceEventHistory);
      expect(mockPrismaService.invoiceEventHistory.delete).toHaveBeenCalledWith(
        {
          where: { id: 1 },
        },
      );
      expect(
        mockPrismaService.invoiceEventHistory.delete,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
