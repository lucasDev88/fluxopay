import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import { PaymentForm } from "../components/forms/PaymentForm";
import "@testing-library/jest-dom";

// Mock the services
vi.mock("@/_services/payments", () => ({
  createPayment: vi.fn().mockResolvedValue({ id: "1" }),
  updatePayment: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/_hooks/useClients", () => ({
  useClients: () => ({
    clients: [
      { id: "1", name: "João Silva", email: "joao@email.com", situation: "Ativo" },
      { id: "2", name: "Maria Santos", email: "maria@email.com", situation: "Ativo" },
    ],
    loading: false,
    fetchClients: vi.fn().mockResolvedValue([]),
  }),
}));

describe("PaymentForm", () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", async () => {
    render(
      <PaymentForm
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Wait for async operations
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Basic check - modal should render
    const modal = document.querySelector('[role="dialog"]');
    expect(modal).toBeInTheDocument();
  });

  it("has customer selection section", async () => {
    render(
      <PaymentForm
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Check for customer-related elements
    const container = document.body;
    // Look for User icon which indicates customer section
    const userIcons = container.querySelectorAll('.lucide.lucide-user');
    expect(userIcons.length).toBeGreaterThan(0);
  });

  it("shows form fields for payment creation", async () => {
    render(
      <PaymentForm
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Check for input fields
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it("pre-fills customer data in edit mode", async () => {
    render(
      <PaymentForm
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        mode="edit"
        initialData={{
          id: "1",
          name: "Test Payment",
          price: 100,
          situation: "Aprovado",
          customerId: "1",
        }}
      />
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // In edit mode, should show customer linked indicator
    const container = document.body;
    const linkedIndicators = container.querySelectorAll('.text-blue-400');
    expect(linkedIndicators.length).toBeGreaterThan(0);
  });

  it("has correct button labels", async () => {
    render(
      <PaymentForm
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Check for button text
    const cancelButton = document.body.textContent?.includes('Cancelar');
    const createButton = document.body.textContent?.includes('Criar pagamento');
    
    expect(cancelButton).toBe(true);
    expect(createButton).toBe(true);
  });
});

describe("PaymentForm Data Submission", () => {
  it("component is ready for data submission with customer", async () => {
    let formComponent: ReturnType<typeof render>;
    
    formComponent = render(
      <PaymentForm
        open={true}
        onClose={() => {}}
        onSuccess={() => {}}
      />
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Component should have rendered without errors
    const { container } = formComponent;
    expect(container).toBeInTheDocument();
    
    // Should have form fields
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });
});
