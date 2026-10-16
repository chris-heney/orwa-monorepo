import { describe, expect, it } from 'vitest';
import type { PageCtx } from './manifest';
import {
  PRINT_DEFAULT_ACTION_KEY,
  printPacketAction,
  printRecordAction,
  printSelectedAction,
  type PrintPacketAdapter,
} from './PrintPacketAction';
import { visibleActions } from './TitleBar';

const adapter: PrintPacketAdapter<{ id: string }> = {
  noun: 'scholarship application',
  mergedFilenamePrefix: 'ORWEF-Scholarships',
  fetchRecords: async (ids) => ids.map((id) => ({ id: String(id) })),
  buildPacket: async () => ({ bytes: new Uint8Array(), filename: 'x.pdf' }),
  packetYearLabel: () => '2027-2028',
};

const ctx = (overrides: Partial<PageCtx>): PageCtx => ({
  moduleId: 'scholarships' as PageCtx['moduleId'],
  pageId: 'scholarships.dashboard',
  tabKey: 'applications',
  selectedIds: ['a', 'b'],
  can: () => true,
  store: (_key, fallback) => fallback,
  params: {},
  isSmall: false,
  ...overrides,
});

describe('printSelectedAction manifest', () => {
  it('is a selection-scoped, find-gated list action with the shared icon and label', () => {
    const action = printSelectedAction('scholarship-applications', adapter);
    expect(action.id).toBe('print-selected-scholarship-applications');
    expect(action.label).toBe('Print Selected');
    expect(action.scope).toBe('selection');
    expect(action.requiresList).toBe(true);
    expect(action.can).toEqual(['find', 'scholarship-applications']);
    expect(action.order).toBe(75);
    expect(typeof action.component).toBe('function');
    expect(printPacketAction('scholarship-applications', adapter, 'selection').id).toBe(action.id);
  });

  it('is shown by the title bar only with a selection AND the find permission', () => {
    const action = printSelectedAction('scholarship-applications', adapter);
    expect(visibleActions([action], ctx({}), true)).toHaveLength(1);
    expect(visibleActions([action], ctx({ selectedIds: [] }), true)).toHaveLength(0);
    expect(
      visibleActions(
        [action],
        ctx({ can: (crud, resource) => !(crud === 'find' && resource === 'scholarship-applications') }),
        true
      )
    ).toHaveLength(0);
    // Tabs without a list never render it (needs the ListContext).
    expect(visibleActions([action], ctx({}), false)).toHaveLength(0);
  });
});

describe('printRecordAction manifest', () => {
  it('is a record-scoped, find-gated action at the front of the bar', () => {
    const action = printRecordAction('award-nominations', adapter as never);
    expect(action.id).toBe('print-award-nominations');
    expect(action.label).toBe('Print');
    expect(action.scope).toBe('record');
    expect(action.can).toEqual(['find', 'award-nominations']);
    expect(action.order).toBe(5);
    expect(printPacketAction('award-nominations', adapter as never, 'record').id).toBe(action.id);
  });

  it('is shown only on record pages for roles that may read the resource', () => {
    const action = printRecordAction('award-nominations', adapter as never);
    const onRecord = ctx({
      selectedIds: [],
      focus: { kind: 'record', resource: 'award-nominations', record: { id: 'x' } } as PageCtx['focus'],
    });
    expect(visibleActions([action], onRecord, false)).toHaveLength(1);
    expect(visibleActions([action], ctx({ selectedIds: [] }), true)).toHaveLength(0);
    expect(
      visibleActions([action], { ...onRecord, can: () => false }, false)
    ).toHaveLength(0);
  });

  it('shares the same icon between the two flavours', () => {
    expect(printRecordAction('r', adapter as never).icon).toBe(
      printSelectedAction('r', adapter as never).icon
    );
    expect(PRINT_DEFAULT_ACTION_KEY).toBe('print.packetDefaultAction');
  });
});
