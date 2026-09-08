import { contestantLifecycleContext } from "../../services/contestant-lifecycle-context";

const LIFECYCLE_FIELDS = [
  "status",
  "cancelled_at",
  "cancelled_reason",
  "cancelled_by",
];
const RELATION_FIELDS = ["conference", "conference_ticket"];

const hasOwn = (data: Record<string, unknown>, field: string): boolean =>
  Object.prototype.hasOwnProperty.call(data, field);

const dataFromEvent = (event: { params?: { data?: Record<string, unknown> } }) =>
  event.params?.data ?? {};

const assertNoLifecycleBypass = (
  event: { params?: { data?: Record<string, unknown> } }
) => {
  const data = dataFromEvent(event);
  const context = contestantLifecycleContext();
  const lifecycleAttempted = LIFECYCLE_FIELDS.some((field) => hasOwn(data, field));
  if (lifecycleAttempted && !context.allowLifecycleTransition) {
    throw new Error(
      "Conference contestant lifecycle fields must be changed through cancel/restore actions."
    );
  }
};

const assertNoRelationRepoint = (
  event: { params?: { data?: Record<string, unknown> } }
) => {
  const data = dataFromEvent(event);
  const relationAttempted = RELATION_FIELDS.some((field) => hasOwn(data, field));
  if (relationAttempted) {
    throw new Error("Cancel and create a new contestant to change conference or ticket.");
  }
};

export default {
  async beforeCreate(event: { params?: { data?: Record<string, unknown> } }) {
    assertNoLifecycleBypass(event);
    const data = dataFromEvent(event);
    const context = contestantLifecycleContext();
    const directContestantCreate = RELATION_FIELDS.some((field) => hasOwn(data, field));
    if (directContestantCreate && !context.allowRestCreate) {
      throw new Error(
        "Conference contestants must be created through the guarded Add Contestant flow."
      );
    }
  },

  async beforeUpdate(event: { params?: { data?: Record<string, unknown> } }) {
    assertNoLifecycleBypass(event);
    if (!contestantLifecycleContext().allowLifecycleTransition) {
      assertNoRelationRepoint(event);
    }
  },

  async beforeDelete() {
    if (!contestantLifecycleContext().allowHardDelete) {
      throw new Error("Conference contestants must be cancelled, not deleted.");
    }
  },
};
