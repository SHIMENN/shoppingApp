import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockRepository: any;

  beforeEach(async () => {
    // יצירת מוק (Mock) עבור ה-Repository כדי לא לגשת ל-DB באמת
    mockRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn().mockImplementation(dto => dto),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
        // אם יש שירותים נוספים כמו Cloudinary, צריך להוסיף מוק גם עבורם
        {
          provide: 'CloudinaryService',
          useValue: { uploadImage: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('findAll', () => {
    it('צריך להחזיר מוצרים עם נתוני דפדופ תקינים', async () => {
      // הגדרת נתונים מדומים
      const mockProducts = [
        { product_id: 1, name: 'Phone', price: 500 },
        { product_id: 2, name: 'Laptop', price: 1500 },
      ];
      
      // הגדרת התנהגות המוק: מחזיר מערך של מוצרים וסך הכל (Total)
      mockRepository.findAndCount.mockResolvedValue([mockProducts, 2]);

      const result = await service.findAll(1, 10);

      // בדיקה שהמבנה שהחזרנו תואם לציפיות של ה-Frontend
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });
  });
});