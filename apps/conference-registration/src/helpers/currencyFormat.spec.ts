import { describe, expect, it } from "vitest";
import currencyFormatter, {
  formatCurrency,
  formatMoneyOrIncluded,
} from "./currencyFormat";

describe("formatCurrency", () => {
  it("formats valid numbers", () => {
    expect(formatCurrency(50)).toBe(currencyFormatter.format(50));
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("does not render $NaN for undefined/null/NaN", () => {
    expect(formatCurrency(undefined)).toBe("$0.00");
    expect(formatCurrency(null)).toBe("$0.00");
    expect(formatCurrency(Number.NaN)).toBe("$0.00");
  });

  it("parses numeric strings", () => {
    expect(formatCurrency("100")).toBe("$100.00");
    expect(formatCurrency("")).toBe("$0.00");
  });
});

describe("formatMoneyOrIncluded", () => {
  it("returns Included for zero/null/empty", () => {
    expect(formatMoneyOrIncluded(0)).toBe("Included");
    expect(formatMoneyOrIncluded(null)).toBe("Included");
    expect(formatMoneyOrIncluded(undefined)).toBe("Included");
    expect(formatMoneyOrIncluded("")).toBe("Included");
    expect(formatMoneyOrIncluded(Number.NaN)).toBe("Included");
  });

  it("formats non-zero amounts as currency", () => {
    expect(formatMoneyOrIncluded(50)).toBe(currencyFormatter.format(50));
    expect(formatMoneyOrIncluded("100")).toBe("$100.00");
  });
});
