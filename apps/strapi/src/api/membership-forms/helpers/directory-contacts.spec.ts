import { describe, expect, it } from 'vitest';
import { mergeDirectoryContactIds } from './directory-contacts';

describe('mergeDirectoryContactIds — a form submission never removes a contact', () => {
  it('leaves the relation untouched when the renewal carried no contacts', () => {
    // The bug: `contacts: []` on a renewal used to detach everyone.
    expect(mergeDirectoryContactIds([11, 12, 13], [])).toBeNull();
    expect(mergeDirectoryContactIds([11, 12, 13], undefined)).toBeNull();
    expect(mergeDirectoryContactIds([], [])).toBeNull();
  });

  it('adds the submitted contact and keeps everyone already linked', () => {
    // The form does not prefill existing contacts, so one typed name must not
    // cost the system its other two.
    expect(mergeDirectoryContactIds([11, 12], [40])).toEqual([11, 12, 40]);
  });

  it('does not duplicate a contact that is already linked (same email re-submitted)', () => {
    expect(mergeDirectoryContactIds([11, 12], [12])).toBeNull();
    expect(mergeDirectoryContactIds([11, 12], [12, 40, 40])).toEqual([11, 12, 40]);
  });

  it('links the first contacts of a system that had none', () => {
    expect(mergeDirectoryContactIds(null, [7, 8])).toEqual([7, 8]);
  });

  it('accepts populated rows and numeric strings, ignoring junk', () => {
    expect(
      mergeDirectoryContactIds([{ id: 11, first: 'Ada' }, { id: '12' }, null, {}], ['40', 'abc', 41])
    ).toEqual([11, 12, 40, 41]);
  });
});
