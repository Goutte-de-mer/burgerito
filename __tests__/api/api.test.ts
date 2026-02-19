import { getProducts, getProductById } from "@/services/productService";
import { registerUser, loginUser, me } from "@/services/authService";

// Mock fetch pour les tests API
global.fetch = jest.fn();

describe("API Tests - Integration", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    process.env.API_URL = "https://node-eemi.vercel.app/api";
  });

  describe("Products API", () => {
    it("should fetch all products from API", async () => {
      const mockResponse = {
        items: [
          { id: "1", name: "Burger Classic", price: 10, imageUrl: "url1" },
          { id: "2", name: "Burger Deluxe", price: 15, imageUrl: "url2" },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getProducts();

      expect(result.items).toHaveLength(2);
      expect(result.items[0].name).toBe("Burger Classic");
      expect(fetch).toHaveBeenCalledWith(
        "https://node-eemi.vercel.app/api/products",
      );
    });

    it("should fetch a single product by ID", async () => {
      const mockProduct = {
        id: "1",
        name: "Burger Classic",
        price: 10,
        imageUrl: "url1",
        description: "A classic burger",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const result = await getProductById("1");

      expect(result.id).toBe("1");
      expect(result.name).toBe("Burger Classic");
      expect(fetch).toHaveBeenCalledWith(
        "https://node-eemi.vercel.app/api/products/1",
      );
    });
  });

  describe("Auth API", () => {
    it("should register a new user via API", async () => {
      const mockResponse = {
        token: "jwt-token-123",
        user: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "application/json",
        },
        json: async () => mockResponse,
      });

      const result = await registerUser(
        "John Doe",
        "john@example.com",
        "password123",
      );

      expect(result.token).toBe("jwt-token-123");
      expect(result.user.email).toBe("john@example.com");
      expect(fetch).toHaveBeenCalledWith(
        "https://node-eemi.vercel.app/api/auth/register",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    it("should login a user via API", async () => {
      const mockResponse = {
        token: "jwt-token-456",
        user: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "application/json",
        },
        json: async () => mockResponse,
      });

      const result = await loginUser("john@example.com", "password123");

      expect(result.token).toBe("jwt-token-456");
      expect(result.user.name).toBe("John Doe");
    });

    it("should get current user info via API", async () => {
      const mockResponse = {
        user: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "application/json",
        },
        json: async () => mockResponse,
      });

      const result = await me("jwt-token-123");

      expect(result.user.id).toBe("1");
      expect(result.user.email).toBe("john@example.com");
      expect(fetch).toHaveBeenCalledWith(
        "https://node-eemi.vercel.app/api/auth/me",
        expect.objectContaining({
          method: "GET",
          headers: { Authorization: "Bearer jwt-token-123" },
        }),
      );
    });
  });

  describe("API Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: {
          get: () => "application/json",
        },
        json: async () => ({ message: "Product not found" }),
      });

      await expect(getProductById("999")).rejects.toThrow();
    });

    it("should handle network errors", async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      await expect(getProducts()).rejects.toThrow("Network error");
    });
  });
});
