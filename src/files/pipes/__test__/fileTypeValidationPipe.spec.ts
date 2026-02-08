import { BadRequestException } from '@nestjs/common';
import { FileTypeValidationPipe } from '../fileTypeValidationPipe';

describe('FileTypeValidationPipe', () => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  let pipe: FileTypeValidationPipe;

  beforeEach(() => {
    pipe = new FileTypeValidationPipe(allowedImageTypes);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should pass files with allowed JPEG type', () => {
      const jpegFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.jpeg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('fake-jpeg-data'),
        destination: '',
        filename: 'test.jpeg',
        path: '',
        stream: null,
      };

      const result = pipe.transform(jpegFile);

      expect(result).toBe(jpegFile);
    });

    it('should pass files with allowed PNG type', () => {
      const pngFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024,
        buffer: Buffer.from('fake-png-data'),
        destination: '',
        filename: 'test.png',
        path: '',
        stream: null,
      };

      const result = pipe.transform(pngFile);

      expect(result).toBe(pngFile);
    });

    it('should pass files with allowed JPG type', () => {
      const jpgFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpg',
        size: 1024,
        buffer: Buffer.from('fake-jpg-data'),
        destination: '',
        filename: 'test.jpg',
        path: '',
        stream: null,
      };

      const result = pipe.transform(jpgFile);

      expect(result).toBe(jpgFile);
    });

    it('should throw BadRequestException for non-allowed file types', () => {
      const pdfFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'document.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('fake-pdf-data'),
        destination: '',
        filename: 'document.pdf',
        path: '',
        stream: null,
      };

      expect(() => {
        pipe.transform(pdfFile);
      }).toThrow(BadRequestException);

      expect(() => {
        pipe.transform(pdfFile);
      }).toThrow(
        'Formato de archivo no permitido. Tipos permitidos: image/jpeg, image/png, image/jpg',
      );
    });

    it('should throw BadRequestException for text files', () => {
      const textFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'readme.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 512,
        buffer: Buffer.from('some text'),
        destination: '',
        filename: 'readme.txt',
        path: '',
        stream: null,
      };

      expect(() => {
        pipe.transform(textFile);
      }).toThrow(
        new BadRequestException(
          'Formato de archivo no permitido. Tipos permitidos: image/jpeg, image/png, image/jpg',
        ),
      );
    });

    it('should pass null or undefined values', () => {
      const nullResult = pipe.transform(null);
      const undefinedResult = pipe.transform(undefined);

      expect(nullResult).toBeNull();
      expect(undefinedResult).toBeUndefined();
    });

    it('should work with different allowed types configuration', () => {
      const documentPipe = new FileTypeValidationPipe([
        'application/pdf',
        'text/plain',
      ]);

      const pdfFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'document.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('fake-pdf-data'),
        destination: '',
        filename: 'document.pdf',
        path: '',
        stream: null,
      };

      const result = documentPipe.transform(pdfFile);

      expect(result).toBe(pdfFile);
    });

    it('should throw error with correct allowed types message for custom configuration', () => {
      const videoPipe = new FileTypeValidationPipe(['video/mp4', 'video/avi']);

      const imageFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('fake-image-data'),
        destination: '',
        filename: 'image.jpg',
        path: '',
        stream: null,
      };

      expect(() => {
        videoPipe.transform(imageFile);
      }).toThrow(
        'Formato de archivo no permitido. Tipos permitidos: video/mp4, video/avi',
      );
    });

    it('should handle case-sensitive mime types correctly', () => {
      const uppercaseFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.JPG',
        encoding: '7bit',
        mimetype: 'IMAGE/JPEG', // Uppercase - should not match
        size: 1024,
        buffer: Buffer.from('fake-image-data'),
        destination: '',
        filename: 'test.JPG',
        path: '',
        stream: null,
      };

      expect(() => {
        pipe.transform(uppercaseFile);
      }).toThrow(BadRequestException);
    });

    it('should handle empty allowed types array', () => {
      const emptyPipe = new FileTypeValidationPipe([]);

      const anyFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('fake-image-data'),
        destination: '',
        filename: 'test.jpg',
        path: '',
        stream: null,
      };

      expect(() => {
        emptyPipe.transform(anyFile);
      }).toThrow('Formato de archivo no permitido. Tipos permitidos: ');
    });
  });
});
