import { BadRequestException } from '@nestjs/common';
import { FileSizeValidationPipe } from '../fileSizeValidationPipe';

describe('FileSizeValidationPipe', () => {
  let pipe: FileSizeValidationPipe;
  const maxSize = 4 * 1024 * 1024;

  beforeEach(() => {
    pipe = new FileSizeValidationPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should pass files within size limit', () => {
      const validFile = {
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024 * 1024,
        buffer: Buffer.from('test'),
      };

      const result = pipe.transform(validFile, {
        type: 'custom',
        metatype: undefined,
        data: undefined,
      });

      expect(result).toBe(validFile);
    });

    it('should pass files exactly at size limit', () => {
      const validFile = {
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: maxSize, // Exactly 4MB
        buffer: Buffer.from('test'),
      };

      const result = pipe.transform(validFile, {
        type: 'custom',
        metatype: undefined,
        data: undefined,
      });

      expect(result).toBe(validFile);
    });

    it('should throw BadRequestException for files exceeding size limit', () => {
      const oversizedFile = {
        originalname: 'large-file.jpg',
        mimetype: 'image/jpeg',
        size: maxSize + 1, // 4MB + 1 byte
        buffer: Buffer.from('test'),
      };

      expect(() => {
        pipe.transform(oversizedFile, {
          type: 'custom',
          metatype: undefined,
          data: undefined,
        });
      }).toThrow(BadRequestException);

      expect(() => {
        pipe.transform(oversizedFile, {
          type: 'custom',
          metatype: undefined,
          data: undefined,
        });
      }).toThrow('File size should not exceed 4 MB');
    });

    it('should throw BadRequestException with correct message for very large files', () => {
      const veryLargeFile = {
        originalname: 'huge-file.jpg',
        mimetype: 'image/jpeg',
        size: 10 * 1024 * 1024, // 10MB
        buffer: Buffer.from('test'),
      };

      expect(() => {
        pipe.transform(veryLargeFile, {
          type: 'custom',
          metatype: undefined,
          data: undefined,
        });
      }).toThrow(new BadRequestException('File size should not exceed 4 MB'));
    });

    it('should pass null or undefined values', () => {
      const nullResult = pipe.transform(null, {
        type: 'custom',
        metatype: undefined,
        data: undefined,
      });

      const undefinedResult = pipe.transform(undefined, {
        type: 'custom',
        metatype: undefined,
        data: undefined,
      });

      expect(nullResult).toBeNull();
      expect(undefinedResult).toBeUndefined();
    });

    it('should pass files without size property', () => {
      const fileWithoutSize = {
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
      };

      const result = pipe.transform(fileWithoutSize, {
        type: 'custom',
        metatype: undefined,
        data: undefined,
      });

      expect(result).toBe(fileWithoutSize);
    });

    it('should handle edge case with zero size file', () => {
      const zeroSizeFile = {
        originalname: 'empty.txt',
        mimetype: 'text/plain',
        size: 0,
        buffer: Buffer.from(''),
      };

      const result = pipe.transform(zeroSizeFile, {
        type: 'custom',
        metatype: undefined,
        data: undefined,
      });

      expect(result).toBe(zeroSizeFile);
    });

    it('should handle files with size property as string', () => {
      const fileWithStringSize = {
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: '1024', // String instead of number
        buffer: Buffer.from('test'),
      };

      const result = pipe.transform(fileWithStringSize, {
        type: 'custom',
        metatype: undefined,
        data: undefined,
      });

      expect(result).toBe(fileWithStringSize);
    });
  });
});
