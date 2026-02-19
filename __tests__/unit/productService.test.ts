import { getProducts, getProductById } from "@/services/productService";

// Mock fetch
global.fetch = jest.fn();

describe("ProductService - Unit Tests", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    process.env.API_URL = "https://node-eemi.vercel.app/api";
  });

  describe("getProducts", () => {
    it("should fetch products successfully", async () => {
      const mockProducts = {
        items: [
          { id: "1", name: "Burger 1", price: 10 },
          { id: "2", name: "Burger 2", price: 12 },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const result = await getProducts();

      expect(result).toEqual(mockProducts);
      expect(fetch).toHaveBeenCalledWith(`${process.env.API_URL}/products`);
    });

    it("should throw error when fetch fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getProducts()).rejects.toThrow(
        "Erreur lors du chargement des produits",
      );
    });
  });

  describe("getProductById", () => {
    it("should fetch a product by id successfully", async () => {
      const mockProduct = { id: "1", name: "Burger 1", price: 10 };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const result = await getProductById("1");

      expect(result).toEqual(mockProduct);
      expect(fetch).toHaveBeenCalledWith(`${process.env.API_URL}/products/1`);
    });

    it("should throw error when product not found", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getProductById("999")).rejects.toThrow(
        "Erreur lors du chargement du produit",
      );
    });
  });
});
