import { registerUser, loginUser, me } from "@/services/authService";

// Mock fetch
global.fetch = jest.fn();

describe("AuthService - Unit Tests", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    process.env.API_URL = "https://node-eemi.vercel.app/api";
  });

  describe("registerUser", () => {
    it("should register a user successfully", async () => {
      const mockResponse = {
        token: "test-token",
        user: { id: "1", name: "Test User", email: "test@example.com" },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "application/json",
        },
        json: async () => mockResponse,
      });

      const result = await registerUser(
        "Test User",
        "test@example.com",
        "password123",
      );

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
          }),
        },
      );
    });

    it("should throw error when registration fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        headers: {
          get: () => "application/json",
        },
        json: async () => ({ message: "Email already exists" }),
      });

      await expect(
        registerUser("Test", "test@example.com", "pass"),
      ).rejects.toThrow("Email already exists");
    });
  });

  describe("loginUser", () => {
    it("should login a user successfully", async () => {
      const mockResponse = {
        token: "test-token",
        user: { id: "1", name: "Test User", email: "test@example.com" },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "application/json",
        },
        json: async () => mockResponse,
      });

      const result = await loginUser("test@example.com", "password123");

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(`${process.env.API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });
    });
  });

  describe("me", () => {
    it("should get current user successfully", async () => {
      const mockResponse = {
        user: { id: "1", name: "Test User", email: "test@example.com" },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "application/json",
        },
        json: async () => mockResponse,
      });

      const result = await me("test-token");

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(`${process.env.API_URL}/auth/me`, {
        method: "GET",
        headers: { Authorization: "Bearer test-token" },
      });
    });
  });
});
