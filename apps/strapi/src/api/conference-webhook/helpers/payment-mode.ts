import { createHash, timingSafeEqual } from "node:crypto";

const PAYMENT_GATEWAY_API = "https://api.authorize.net/xml/v1/request.api";
const PAYMENT_GATEWAY_API_SANDBOX =
  "https://apitest.authorize.net/xml/v1/request.api";

export const normalizeTestEmail = (email: unknown): string =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const md5 = (value: string): string =>
  createHash("md5").update(value, "utf8").digest("hex");

const timingSafeStringEqual = (actual: string, expected: string): boolean => {
  const actualBuffer = Buffer.from(actual, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
};

export const shouldUseAuthorizeNetTestMode = ({
  nodeEnv,
  email,
  test,
}: {
  nodeEnv?: string;
  email?: unknown;
  test?: unknown;
}): boolean => {
  if (nodeEnv === "development") return true;
  if (typeof test !== "string") return false;

  const normalizedEmail = normalizeTestEmail(email);
  if (!normalizedEmail) return false;

  return timingSafeStringEqual(test, md5(normalizedEmail));
};

type AuthorizeNetCredentials = {
  live: { name: string; transactionKey: string };
  sandbox: { name: string; transactionKey: string };
};

const placeholderCredentials: AuthorizeNetCredentials = {
  live: { name: "live", transactionKey: "live" },
  sandbox: { name: "sandbox", transactionKey: "sandbox" },
};

export const authorizeNetMode = (
  testMode: boolean,
  credentials: AuthorizeNetCredentials = placeholderCredentials
) => ({
  endpoint: testMode ? PAYMENT_GATEWAY_API_SANDBOX : PAYMENT_GATEWAY_API,
  credentials: testMode ? credentials.sandbox : credentials.live,
  transactionSettings: testMode
    ? {
        setting: {
          settingName: "testRequest",
          settingValue: "true",
        },
      }
    : undefined,
});
