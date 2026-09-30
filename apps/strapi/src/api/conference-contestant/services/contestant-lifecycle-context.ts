import { AsyncLocalStorage } from "node:async_hooks";

type ContestantLifecycleContext = {
  allowLifecycleTransition?: boolean;
  /** Ticket swaps are only legal from `updateContestant`, which settles golf capacity. */
  allowTicketChange?: boolean;
  allowHardDelete?: boolean;
  allowRestCreate?: boolean;
};

const storage = new AsyncLocalStorage<ContestantLifecycleContext>();

const withContext = <T>(context: ContestantLifecycleContext, callback: () => T): T =>
  storage.run({ ...(storage.getStore() ?? {}), ...context }, callback);

export const withContestantLifecycleTransition = <T>(callback: () => T): T =>
  withContext({ allowLifecycleTransition: true }, callback);

export const withContestantHardDelete = <T>(callback: () => T): T =>
  withContext({ allowHardDelete: true }, callback);

export const withContestantRestCreate = <T>(callback: () => T): T =>
  withContext({ allowRestCreate: true }, callback);

export const withContestantTicketChange = <T>(callback: () => T): T =>
  withContext({ allowTicketChange: true }, callback);

export const contestantLifecycleContext = (): ContestantLifecycleContext =>
  storage.getStore() ?? {};
