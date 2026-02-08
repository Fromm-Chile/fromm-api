import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../jwt.strategy';
import config from 'config/config';

const mockConfigService = {
  jwtSecret: 'test-secret',
  KEY: 'test-key',
};

const mockPayload = { role: 1, sub: 123 };

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        JwtStrategy,
        {
          provide: config.KEY,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the payload', () => {
      const result = strategy.validate(mockPayload);
      expect(result).toEqual(mockPayload);
    });
  });
});
