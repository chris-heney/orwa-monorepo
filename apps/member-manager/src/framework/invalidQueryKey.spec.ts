import { describe, expect, it } from 'vitest';
import {
  parseStrapiInvalidQueryKey,
  sortUsesKey,
  stripFilterKey,
} from './invalidQueryKey';

/** The exact body production answered with (2026-09-17, water systems tab). */
const strapiSortError = {
  status: 400,
  message: 'Invalid key dir_contact_1_title',
  body: {
    data: null,
    error: {
      status: 400,
      name: 'ValidationError',
      message: 'Invalid key dir_contact_1_title',
      details: {
        key: 'dir_contact_1_title',
        path: null,
        source: 'query',
        param: 'sort',
      },
    },
  },
};

describe('parseStrapiInvalidQueryKey', () => {
  it('reads the key and the param out of a Strapi 5 sort rejection', () => {
    expect(parseStrapiInvalidQueryKey(strapiSortError)).toEqual({
      key: 'dir_contact_1_title',
      param: 'sort',
      path: null,
    });
  });

  it('reads a filters rejection with its path', () => {
    const error = {
      status: 400,
      body: {
        error: {
          name: 'ValidationError',
          message: 'Invalid key nope',
          details: { key: 'nope', path: 'contacts.nope', source: 'query', param: 'filters' },
        },
      },
    };
    expect(parseStrapiInvalidQueryKey(error)).toEqual({
      key: 'nope',
      param: 'filters',
      path: 'contacts.nope',
    });
  });

  it('falls back to the message when details are missing', () => {
    expect(
      parseStrapiInvalidQueryKey({ status: 400, message: 'Invalid key foo_bar', body: {} })
    ).toEqual({ key: 'foo_bar', param: 'unknown', path: null });
  });

  it('ignores an invalid key in a write body — dropping a sort cannot fix that', () => {
    const error = {
      status: 400,
      body: {
        error: {
          message: 'Invalid key entityId',
          details: { key: 'entityId', source: 'body' },
        },
      },
    };
    expect(parseStrapiInvalidQueryKey(error)).toBeNull();
  });

  it('ignores everything that is not an invalid-key 400', () => {
    expect(parseStrapiInvalidQueryKey(null)).toBeNull();
    expect(parseStrapiInvalidQueryKey(new Error('Failed to fetch'))).toBeNull();
    expect(parseStrapiInvalidQueryKey({ status: 403, message: 'Invalid key x' })).toBeNull();
    expect(
      parseStrapiInvalidQueryKey({ status: 400, message: '2 errors occurred', body: {} })
    ).toBeNull();
  });
});

describe('sortUsesKey', () => {
  it('matches the field itself and a relation traversal through it', () => {
    expect(sortUsesKey('dir_contact_1_title', 'dir_contact_1_title')).toBe(true);
    expect(sortUsesKey('contacts.bogus', 'bogus')).toBe(true);
    expect(sortUsesKey('name', 'dir_contact_1_title')).toBe(false);
    // A substring is not a match.
    expect(sortUsesKey('dir_contact_1_title_x', 'dir_contact_1_title')).toBe(false);
    expect(sortUsesKey(undefined, 'id')).toBe(false);
  });
});

describe('stripFilterKey', () => {
  it('drops a top-level filter and keeps the rest', () => {
    expect(
      stripFilterKey({ county: 'Adair', bogus: 'x' }, { key: 'bogus', path: null })
    ).toEqual({ county: 'Adair' });
  });

  it('drops the top-level entry named by the first path segment', () => {
    expect(
      stripFilterKey(
        { county: 'Adair', contacts: { nope: { $eq: 1 } } },
        { key: 'nope', path: 'contacts.nope' }
      )
    ).toEqual({ county: 'Adair' });
  });

  it('strips a nested occurrence when the top level does not name it', () => {
    expect(
      stripFilterKey(
        { $or: [{ bogus: 1 }, { county: 'Adair' }] },
        { key: 'bogus', path: null }
      )
    ).toEqual({ $or: [{}, { county: 'Adair' }] });
  });

  it('returns null when the key is nowhere in the filter', () => {
    expect(stripFilterKey({ county: 'Adair' }, { key: 'bogus', path: null })).toBeNull();
    expect(stripFilterKey(undefined, { key: 'bogus', path: null })).toBeNull();
  });
});
