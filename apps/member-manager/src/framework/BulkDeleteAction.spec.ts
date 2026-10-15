import { describe, expect, it } from 'vitest';
import {
  bulkDeleteAction,
  bulkDeleteConfirmCopy,
  bulkDeleteFailureCopy,
  bulkDeleteSuccessCopy,
  bulkDeleteTitle,
  pluralizeNoun,
} from './BulkDeleteAction';
import type { PageCtx } from './manifest';
import { visibleActions } from './TitleBar';

const scholarship = { noun: 'scholarship application' };
const nomination = { noun: 'award nomination' };

describe('bulk delete copy', () => {
  it('pluralises by count (default +s, explicit plural wins)', () => {
    expect(pluralizeNoun(1, scholarship)).toBe('scholarship application');
    expect(pluralizeNoun(4, scholarship)).toBe('scholarship applications');
    expect(pluralizeNoun(2, { noun: 'entry', nounPlural: 'entries' })).toBe('entries');
  });

  it('states the count and names the module records', () => {
    expect(bulkDeleteConfirmCopy(4, scholarship)).toBe(
      'Delete 4 scholarship applications? This cannot be undone.'
    );
    expect(bulkDeleteConfirmCopy(1, nomination)).toBe(
      'Delete 1 award nomination? This cannot be undone.'
    );
    expect(bulkDeleteTitle(2, nomination)).toBe('Delete 2 selected award nominations');
  });

  it('reports success with the count', () => {
    expect(bulkDeleteSuccessCopy(3, nomination)).toBe('Deleted 3 award nominations.');
  });

  it('reports failure with the server message and a refresh note', () => {
    expect(bulkDeleteFailureCopy(2, scholarship, 'Forbidden')).toBe(
      'Could not delete the 2 selected scholarship applications: Forbidden The list was refreshed — anything still shown was not deleted.'
    );
    expect(bulkDeleteFailureCopy(1, scholarship)).toMatch(
      /^Could not delete the selected scholarship application\./
    );
  });
});

describe('bulkDeleteAction manifest', () => {
  it('is a selection-scoped, delete-gated list action', () => {
    const action = bulkDeleteAction('scholarship-applications', scholarship);
    expect(action.scope).toBe('selection');
    expect(action.requiresList).toBe(true);
    expect(action.can).toEqual(['delete', 'scholarship-applications']);
    expect(action.id).toBe('bulk-delete-scholarship-applications');
    expect(typeof action.component).toBe('function');
  });

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

  it('is shown by the title bar only with a selection AND the delete permission', () => {
    const action = bulkDeleteAction('scholarship-applications', scholarship);
    expect(visibleActions([action], ctx({}), true)).toHaveLength(1);
    expect(visibleActions([action], ctx({ selectedIds: [] }), true)).toHaveLength(0);
    expect(
      visibleActions(
        [action],
        ctx({ can: (crud, resource) => !(crud === 'delete' && resource === 'scholarship-applications') }),
        true
      )
    ).toHaveLength(0);
    // Tabs without a list never render it (needs the ListContext).
    expect(visibleActions([action], ctx({}), false)).toHaveLength(0);
  });
});
