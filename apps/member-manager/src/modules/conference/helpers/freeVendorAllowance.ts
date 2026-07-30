/**
 * Booth-bundled complimentary Vendor tickets (matches conference-registration).
 * 1 booth → 2 free; 2+ booths → 3 free; otherwise none.
 */
export const freeVendorAllowance = (boothCount: number): number => {
  if (boothCount === 1) return 2;
  if (boothCount >= 2) return 3;
  return 0;
};

export const isVendorTicket = (ticket?: {
  name?: string | null;
  context?: string | null;
} | null): boolean => {
  if (!ticket) return false;
  if (ticket.context === "Vendor") return true;
  return (
    typeof ticket.name === "string" &&
    ticket.name.localeCompare("Vendor", undefined, { sensitivity: "accent" }) ===
      0
  );
};
