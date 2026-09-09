export const PAYMENT_RISK_MESSAGE =
  "Your payment may have succeeded, but registration did not complete. Please contact ORWA before trying again to avoid a duplicate charge.";

export const shouldLockRegistrationSubmit = (response: unknown): boolean =>
  Boolean((response as { paymentMayHaveSucceeded?: unknown })?.paymentMayHaveSucceeded);

export const paymentRiskEntryKey = (
  entry: { resource?: unknown; data?: Record<string, unknown> } | null | undefined
): string | null => {
  if (!entry?.data) return null;
  const id =
    entry.data.documentId ??
    entry.data.id ??
    entry.data.application_id ??
    entry.data.organization;
  return id == null ? null : `${entry.resource ?? "entry"}:${String(id)}`;
};
