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
      const offset = paginationService.offset(1000, 10, true);
      expect(typeof offset).toBe("number");
      expect(offset).toBe(190);
    });

    it("should return real maxPage", () => {
      const offset = paginationService.offset(1000, 10);
      expect(typeof offset).toBe("number");
      expect(offset).toBe(9990);
    });

    it("should return maxPerPage 100", () => {
      const offset = paginationService.offset(10, 1000, true);
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

    it("should return page 50", () => {
      const result = paginationService.page(50);
      expect(typeof result).toBe("number");
      expect(result).toBe(50);
    });

    it("should return maxPage 20 when receive then maxPage", () => {
      const result = paginationService.page(21, true);
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

  describe("order", () => {
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

  describe("totalPage", () => {
    it("should return totalPage 5", () => {
      const result = paginationService.totalPage(100, 20);
      expect(typeof result).toBe("number");
      expect(result).toBe(5);
    });

    it("should return page 1 when data below perPage", () => {
      const result = paginationService.totalPage(10, 20);
      expect(typeof result).toBe("number");
      expect(result).toBe(1);
    });

    it("should return maxPage when page greater than maxPage", () => {
      const result = paginationService.totalPage(1000, 20, true);
      expect(typeof result).toBe("number");
      expect(result).toBe(20);
    });
    it("should return real page when page greater than maxPage", () => {
      const result = paginationService.totalPage(1000, 20);
      expect(typeof result).toBe("number");
      expect(result).toBe(50);
    });
  });

  describe("filterIn", () => {
    it("should return filter in", async () => {
      const result = paginationService.filterIn("name", ["name_a", "name_b"]);
      expect(result).toEqual({ name: { $in: ["name_a", "name_b"] } });
    });
  });

  describe("filterEqual", () => {
    it("should return object equal", async () => {
      const result = paginationService.filterEqual("name", ["name_a", "name_b"]);
      expect(result).toEqual({ name: ["name_a", "name_b"] });
    });
  });

  describe("filterContain", () => {
    it("should return a filter object for a partial match on the field", () => {
      expect(paginationService.filterContain("title", "John")).toEqual({
        title: {
          $regex: new RegExp("John"),
          $options: "i",
        },
      });
    });
  });

  describe("filterContainFullMatch", () => {
    it("should return a filter object for a full match on the field", () => {
      expect(paginationService.filterContainFullMatch("title", "John")).toEqual({
        title: {
          $regex: new RegExp("\\bJohn\\b"),
          $options: "i",
        },
      });
    });
  });

  describe("multiQueryOperator", () => {
    it("should return object multi query operator", async () => {
      const q = [
        { field: "totalCores", operator: "=", value: "24" },
        { field: "tdp", operator: ">", value: "200" },
        { field: "tdp", operator: "<", value: "210" },
      ];
      const result = paginationService.multiQueryOperator(q);
      expect(result).toEqual({ totalCores: { $eq: "24" }, tdp: { $gt: "200", $lt: "210" } });
    });
  });
});
