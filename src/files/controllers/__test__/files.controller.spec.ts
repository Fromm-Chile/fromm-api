import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from '../files.controller';
import { FilesService } from '../../services/files.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../../prisma/prisma.service';
import config from '../../../../config/config';

const mockFilesService = {
  uploadImage: jest.fn(),
};

const mockConfigService = {
  jwtSecret: 'test-secret',
  KEY: 'test-key',
};

const mockFile: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'test-banner.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 1024,
  buffer: Buffer.from('fake-image-data'),
  destination: '',
  filename: 'test-banner.jpg',
  path: '',
  stream: null,
};

describe('FilesController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        JwtService,
        Reflector,
        PrismaService,
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
        {
          provide: config.KEY,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadBannerImage', () => {
    it('should upload banner image successfully', async () => {
      const order = 1;
      const countryId = 1;

      mockFilesService.uploadImage.mockResolvedValue({
        message: 'File uploaded successfully',
        key: 'test-banner.jpg',
        url: 'https://pub-test.r2.dev/test-banner.jpg',
      });

      const result = await controller.uploadBannerImage(
        mockFile,
        order,
        countryId,
      );

      expect(mockFilesService.uploadImage).toHaveBeenCalledWith(mockFile, 1, 1);
      expect(result).toBeUndefined();
    });
  });
});
