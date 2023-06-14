import { Test, TestingModule } from "@nestjs/testing";
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "src/common/pagination/constants/pagination.enum.constant";
import { PaginationService } from "src/common/pagination/services/pagination.service";

describe("pagination service", () => {
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginationService],
    }).compile();

    paginationService = module.get<PaginationService>(PaginationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("offset", () => {
    it("should return 36 when 10 page and 4 perPage", () => {
      const offset = paginationService.offset(10, 4);
      expect(typeof offset).toBe("number");
      expect(offset).toBe(36);
    });

    it("should return maxPage 20", () => {
      const offset = paginationService.offset(1000, 10);
      expect(typeof offset).toBe("number");
      expect(offset).toBe(190);
    });

    it("should return maxPerPage 100", () => {
      const offset = paginationService.offset(10, 1000);
      expect(typeof offset).toBe("number");
      expect(offset).toBe(900);
    });
  });
  describe("page", () => {
    it("should return page default equal 1", () => {
      const result = paginationService.page();
      expect(typeof result).toBe("number");
    });

    it("should return page 19", () => {
      const result = paginationService.page(19);
      expect(typeof result).toBe("number");
      expect(result).toBe(19);
    });

    it("should return maxPage 20 when receive then maxPage", () => {
      const result = paginationService.page(21);
      expect(typeof result).toBe("number");
      expect(result).toBe(20);
    });
  });

  describe("perPage", () => {
    it("should return 20 perPage by default", () => {
      const result = paginationService.perPage();
      expect(typeof result).toBe("number");
      expect(result).toBe(20);
    });

    it("should return 100 maxPerPage when receive then maxPerPage", () => {
      const result = paginationService.perPage(101);
      expect(typeof result).toBe("number");
      expect(result).toBe(100);
    });

    it("should return 99 perPage", () => {
      const result = paginationService.perPage(99);
      expect(typeof result).toBe("number");
      expect(result).toBe(99);
    });
  });

  describe("search", () => {
    it("should return undefined when empty valueSearch", () => {
      const availableSearch: string[] = ["a", "b"];
      const result = paginationService.search("", availableSearch);
      expect(result).toBeUndefined();
    });

    it("should return valid property regex object search", () => {
      const availableSearch: string[] = ["a", "b"];
      const result = paginationService.search("abc", availableSearch);
      expect(result).toHaveProperty("$or");
      expect(result.$or).toHaveLength(2);
    });
  });

  describe.only("order", () => {
    it("should return createdAt by default and asc", () => {
      const result = paginationService.order();
      expect(result).toHaveProperty("createdAt", "asc");
    });
    it("should return createdAt when orderbyValue not include in available", () => {
      const result = paginationService.order("name");
      expect(result).toHaveProperty("createdAt", "asc");
    });
    it("should return name and desc when include in available", () => {
      const result = paginationService.order("name", ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC, [
        "name",
      ]);
      expect(result).toHaveProperty("name", "desc");
    });
  });
});
