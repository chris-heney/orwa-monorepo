export const PAYMENT_RISK_MESSAGE =
  "Your payment may have succeeded, but registration did not complete. Please contact ORWA before trying again to avoid a duplicate charge.";

export const shouldLockRegistrationSubmit = (response: unknown): boolean =>
  Boolean((response as { paymentMayHaveSucceeded?: unknown })?.paymentMayHaveSucceeded);
