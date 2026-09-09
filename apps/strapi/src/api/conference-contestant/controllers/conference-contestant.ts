/**
 * conference-contestant controller
 */

import { factories } from '@strapi/strapi'

import {
  cancelContestant,
  restoreContestant,
} from "../services/contestant-cancellation";
import {
  createContestant,
  updateContestant,
} from "../services/conference-contestant";
import { ContestantDomainError } from "../services/contestant-domain-error";

type ContestantAction = "cancel" | "restore";

const REQUIRED_REASON_MESSAGE = "reason is required";
const DELETE_DISABLED_MESSAGE =
  "Conference contestants must be cancelled, not deleted.";

const normalizeReason = (ctx: any): string | null => {
  const body = ctx.request?.body ?? {};
  const reason =
    typeof body.reason === "string"
      ? body.reason
      : typeof body.data?.reason === "string"
        ? body.data.reason
        : "";
  const trimmed = reason.trim();

  return trimmed || null;
};

const strongestActor = (ctx: any): string | null => {
  const candidates = [
    ctx.state?.user?.email,
    ctx.state?.user?.username,
    ctx.state?.auth?.credentials?.name,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
};

const mapContestantActionError = (ctx: any, error: unknown) => {
  const message = error instanceof Error ? error.message : "";
  if (error instanceof ContestantDomainError) {
    if (error.statusCode === 404) return ctx.notFound(error.publicMessage);
    if (error.statusCode === 409) return ctx.conflict(error.publicMessage);
    return ctx.badRequest(error.publicMessage);
  }
  if ((error as { name?: string })?.name === "ContestantCapacityError") {
    return ctx.conflict(message);
  }

  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("not found")) {
    return ctx.notFound("Conference contestant not found.");
  }

  if (lowerMessage.includes("sold out") || lowerMessage.includes("capacity")) {
    return ctx.conflict("Conference contestant capacity is unavailable.");
  }

  if (
    lowerMessage.includes("required") ||
    lowerMessage.includes("missing") ||
    lowerMessage.includes("invalid") ||
    lowerMessage.includes("lifecycle") ||
    lowerMessage.includes("cancel and create") ||
    lowerMessage.includes("read-only")
  ) {
    return ctx.badRequest("Unable to update conference contestant.");
  }

  return ctx.internalServerError("Unable to update conference contestant.");
};

const runContestantAction = async (
  ctx: any,
  strapi: any,
  action: ContestantAction,
  controller: any
) => {
  const reason = normalizeReason(ctx);
  if (!reason) {
    return ctx.badRequest(REQUIRED_REASON_MESSAGE);
  }

  const input = {
    documentId: ctx.params?.documentId,
    reason,
    actor: strongestActor(ctx),
  };

  try {
    const entity =
      action === "cancel"
        ? await cancelContestant(strapi, input)
        : await restoreContestant(strapi, input);
    const sanitized = await controller.sanitizeOutput(entity, ctx);
    return controller.transformResponse(sanitized);
  } catch (error) {
    return mapContestantActionError(ctx, error);
  }
};

export default factories.createCoreController(
  'api::conference-contestant.conference-contestant',
  ({ strapi }) => ({
    async cancel(ctx) {
      return runContestantAction(ctx, strapi, "cancel", this);
    },

    async restore(ctx) {
      return runContestantAction(ctx, strapi, "restore", this);
    },

    async create(ctx) {
      try {
        const inputData = ctx.request?.body?.data ?? ctx.request?.body ?? {};
        const sanitizedInput = await this.sanitizeInput(inputData, ctx);
        const entity = await createContestant(strapi, {
          data: sanitizedInput,
        });
        const sanitized = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitized);
      } catch (error) {
        return mapContestantActionError(ctx, error);
      }
    },

    async update(ctx) {
      try {
        const inputData = ctx.request?.body?.data ?? ctx.request?.body ?? {};
        const sanitizedInput = await this.sanitizeInput(inputData, ctx);
        const entity = await updateContestant(strapi, {
          documentId: ctx.params?.documentId ?? ctx.params?.id,
          data: sanitizedInput,
        });
        const sanitized = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitized);
      } catch (error) {
        return mapContestantActionError(ctx, error);
      }
    },

    async delete(ctx) {
      return ctx.methodNotAllowed(DELETE_DISABLED_MESSAGE);
    },
  })
);
