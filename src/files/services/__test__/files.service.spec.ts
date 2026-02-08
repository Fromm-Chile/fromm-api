import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../files.service';
import { BannersService } from '../../../Banners/services/banners.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const mockSend = jest.fn();
const mockS3Client = {
  send: mockSend,
};

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => mockS3Client),
  PutObjectCommand: jest
    .fn()
    .mockImplementation((params) => ({ input: params })),
}));

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      R2_ENDPOINT: 'https://test-endpoint.r2.dev',
      R2_ACCESS_KEY_ID: 'test-access-key',
      R2_SECRET_ACCESS_KEY: 'test-secret-key',
      R2_BUCKET_NAME: 'test-bucket',
      R2_PUBLIC_BUCKET_URL: 'https://pub-test.r2.dev',
    };
    return config[key];
  }),
};

const mockBannersService = {
  createBanner: jest.fn(),
};

const mockFile: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'test-image.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 1024,
  buffer: Buffer.from('fake-image-data'),
  destination: '',
  filename: 'test-image.jpg',
  path: '',
  stream: null,
};

const mockImageFile: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'banner-image.png',
  encoding: '7bit',
  mimetype: 'image/png',
  size: 2048,
  buffer: Buffer.from('fake-banner-data'),
  destination: '',
  filename: 'banner-image.png',
  path: '',
  stream: null,
};

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: BannersService,
          useValue: mockBannersService,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload file successfully for invoice', async () => {
      const invoiceId = 123;
      const expectedKey = `${invoiceId}-${mockFile.originalname}`;
      const expectedUrl = `https://pub-test.r2.dev/${expectedKey}`;

      mockSend.mockResolvedValue({
        $metadata: { httpStatusCode: 200 },
      });

      const result = await service.uploadFile(mockFile, invoiceId);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Bucket: 'test-bucket',
            Key: expectedKey,
            Body: mockFile.buffer,
            ContentType: mockFile.mimetype,
          },
        }),
      );

      expect(result).toBe(expectedUrl);
    });

    it('should throw error when S3 upload fails', async () => {
      const invoiceId = 456;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      mockSend.mockRejectedValue(new Error('S3 Upload Error'));

      await expect(service.uploadFile(mockFile, invoiceId)).rejects.toThrow(
        'Failed to upload file',
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error uploading file:',
        expect.any(Error),
      );
      consoleSpy.mockRestore();
    });

    it('should handle different file types', async () => {
      const pdfFile: Express.Multer.File = {
        ...mockFile,
        originalname: 'document.pdf',
        mimetype: 'application/pdf',
      };

      const invoiceId = 789;
      const expectedKey = `${invoiceId}-document.pdf`;
      const expectedUrl = `https://pub-test.r2.dev/${expectedKey}`;

      mockSend.mockResolvedValue({
        $metadata: { httpStatusCode: 200 },
      });

      const result = await service.uploadFile(pdfFile, invoiceId);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Bucket: 'test-bucket',
            Key: expectedKey,
            Body: pdfFile.buffer,
            ContentType: 'application/pdf',
          },
        }),
      );

      expect(result).toBe(expectedUrl);
    });
  });

  describe('uploadImage', () => {
    it('should upload image and create banner successfully', async () => {
      const order = 1;
      const countryId = 1;
      const expectedUrl = `https://pub-test.r2.dev/${mockImageFile.originalname}`;

      mockSend.mockResolvedValue({
        $metadata: { httpStatusCode: 200 },
      });
      mockBannersService.createBanner.mockResolvedValue({
        id: 1,
        name: mockImageFile.originalname,
        url: expectedUrl,
        order,
        countryId,
      });

      const result = await service.uploadImage(mockImageFile, order, countryId);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Bucket: 'test-bucket',
            Key: mockImageFile.originalname,
            Body: mockImageFile.buffer,
            ContentType: mockImageFile.mimetype,
          },
        }),
      );

      expect(mockBannersService.createBanner).toHaveBeenCalledWith({
        name: mockImageFile.originalname,
        url: expectedUrl,
        order,
        countryId,
      });

      expect(result).toBe(expectedUrl);
    });

    it('should throw error when S3 image upload fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      mockSend.mockRejectedValue(new Error('S3 Image Upload Error'));

      await expect(service.uploadImage(mockImageFile, 1, 1)).rejects.toThrow(
        'Failed to upload file',
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error uploading file:',
        expect.any(Error),
      );
      expect(mockBannersService.createBanner).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle different image formats', async () => {
      const jpegFile: Express.Multer.File = {
        ...mockImageFile,
        originalname: 'test-banner.jpeg',
        mimetype: 'image/jpeg',
      };

      const order = 2;
      const countryId = 2;
      const expectedUrl = 'https://pub-test.r2.dev/test-banner.jpeg';

      mockSend.mockResolvedValue({
        $metadata: { httpStatusCode: 200 },
      });
      mockBannersService.createBanner.mockResolvedValue({});

      const result = await service.uploadImage(jpegFile, order, countryId);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Bucket: 'test-bucket',
            Key: 'test-banner.jpeg',
            Body: jpegFile.buffer,
            ContentType: 'image/jpeg',
          },
        }),
      );

      expect(mockBannersService.createBanner).toHaveBeenCalledWith({
        name: 'test-banner.jpeg',
        url: expectedUrl,
        order,
        countryId,
      });

      expect(result).toBe(expectedUrl);
    });

    it('should use correct file key without prefix for images', async () => {
      const customImageFile: Express.Multer.File = {
        ...mockImageFile,
        originalname: 'custom-banner-name.png',
      };

      mockSend.mockResolvedValue({
        $metadata: { httpStatusCode: 200 },
      });
      mockBannersService.createBanner.mockResolvedValue({});

      await service.uploadImage(customImageFile, 3, 1);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Bucket: 'test-bucket',
            Key: 'custom-banner-name.png',
            Body: customImageFile.buffer,
            ContentType: customImageFile.mimetype,
          },
        }),
      );
    });
  });
});
