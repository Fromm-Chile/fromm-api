import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceHistoryService } from '../invoiceHistory.service';
import { InvoiceHistoryRepository } from '../../repositories/invoiceHistory.repository';
import { CreateInvoiceHistoryDto } from '../../dto/create-invoiceHistory.dto';
import { InvoiceEventHistory } from '@prisma/client';

const mockInvoiceHistoryRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
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

describe('InvoiceHistoryService', () => {
  let service: InvoiceHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceHistoryService,
        {
          provide: InvoiceHistoryRepository,
          useValue: mockInvoiceHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<InvoiceHistoryService>(InvoiceHistoryService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new invoice event history record', async () => {
      const createDto: CreateInvoiceHistoryDto = {
        invoiceId: 100,
        adminUserId: 10,
        status: 'approved',
        comment: 'Invoice approved by admin',
      };

      mockInvoiceHistoryRepository.create.mockResolvedValue(
        mockInvoiceEventHistory,
      );

      const result = await service.create(createDto);

      expect(result).toEqual(mockInvoiceEventHistory);
      expect(mockInvoiceHistoryRepository.create).toHaveBeenCalledWith(
        createDto,
      );
      expect(mockInvoiceHistoryRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of invoice event histories', async () => {
      mockInvoiceHistoryRepository.findAll.mockResolvedValue(
        mockInvoiceEventHistoryArray,
      );

      const result = await service.findAll();

      expect(result).toEqual(mockInvoiceEventHistoryArray);
      expect(result).toHaveLength(3);
      expect(mockInvoiceHistoryRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single invoice event history by id', async () => {
      mockInvoiceHistoryRepository.findOne.mockResolvedValue(
        mockInvoiceEventHistory,
      );

      const result = await service.findOne(1);

      expect(result).toEqual(mockInvoiceEventHistory);
      expect(mockInvoiceHistoryRepository.findOne).toHaveBeenCalledWith(1);
      expect(mockInvoiceHistoryRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove an invoice event history by id', async () => {
      mockInvoiceHistoryRepository.remove.mockResolvedValue(
        mockInvoiceEventHistory,
      );

      const result = await service.remove(1);

      expect(result).toEqual(mockInvoiceEventHistory);
      expect(mockInvoiceHistoryRepository.remove).toHaveBeenCalledWith(1);
      expect(mockInvoiceHistoryRepository.remove).toHaveBeenCalledTimes(1);
    });
  });
});
