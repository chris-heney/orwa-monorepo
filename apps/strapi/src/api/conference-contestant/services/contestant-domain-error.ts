export class ContestantDomainError extends Error {
  constructor(
    public readonly statusCode: 400 | 404 | 409,
    public readonly publicMessage: string
  ) {
    super(publicMessage);
    this.name = "ContestantDomainError";
  }
}

export const badRequest = (message: string) =>
  new ContestantDomainError(400, message);

export const notFound = (message: string) =>
  new ContestantDomainError(404, message);
