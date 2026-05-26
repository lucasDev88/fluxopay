import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";
import { authService } from "../_services/api";

// Mock window.location
const mockLocation = { href: "" };
Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

describe("Auth Service", () => {
  beforeEach(() => {
    localStorage.clear();
    mockLocation.href = "";
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("logout", () => {
    it("removes access token from localStorage", () => {
      localStorage.setItem("access", "test-token");
      localStorage.setItem("refresh", "refresh-token");
      
      authService.logout();
      
      expect(localStorage.getItem("access")).toBeNull();
    });

    it("removes refresh token from localStorage", () => {
      localStorage.setItem("access", "test-token");
      localStorage.setItem("refresh", "refresh-token");
      
      authService.logout();
      
      expect(localStorage.getItem("refresh")).toBeNull();
    });

    it("redirects to login page", () => {
      localStorage.setItem("access", "test-token");
      
      authService.logout();
      
      expect(mockLocation.href).toBe("/login");
    });
  });

  describe("isAuthenticated", () => {
    it("returns true when access token exists", () => {
      localStorage.setItem("access", "valid-token");
      
      expect(authService.isAuthenticated()).toBe(true);
    });

    it("returns false when access token does not exist", () => {
      localStorage.removeItem("access");
      
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe("getToken", () => {
    it("returns the access token", () => {
      localStorage.setItem("access", "my-token");
      
      expect(authService.getToken()).toBe("my-token");
    });

    it("returns null when no token exists", () => {
      localStorage.removeItem("access");
      
      expect(authService.getToken()).toBeNull();
    });
  });
});

describe("Auth Context", () => {
  it("should be structured for authentication management", () => {
    // Test structure validation
    expect(authService).toBeDefined();
    expect(typeof authService.logout).toBe("function");
    expect(typeof authService.isAuthenticated).toBe("function");
    expect(typeof authService.getToken).toBe("function");
  });
});
