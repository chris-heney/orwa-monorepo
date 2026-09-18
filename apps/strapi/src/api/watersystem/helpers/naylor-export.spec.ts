import { describe, expect, it } from 'vitest';
import {
  DIRECTORY_TITLE_PRINT_ORDER,
  NAYLOR_SYSTEM_FIELDS,
  buildNaylorRows,
  directoryTitleRank,
  isMembershipActive,
  membershipExpiration,
  naylorCell,
  naylorColumnLabels,
  toNaylorCsv,
  type NaylorContact,
} from './naylor-export';
import { WATERSYSTEM_DIRECTORY_TITLE_CHOICES } from '../../../../../member-manager/src/modules/human-resources/contacts/constants/watersystemDirectoryTitles';

const NOW = new Date('2026-09-17T12:00:00Z');

const system = (
  contacts: NaylorContact[] = [],
  overrides: Record<string, unknown> = {}
) => ({
  id: 11,
  name: 'Testville RWD',
  county: 'Adair',
  email: 'office@testville.org',
  contacts,
  ...overrides,
});

const FULL_SYSTEM = {
  name: 'Adair Co RWD #2',
  county: 'Adair',
  office_hours: '8:00 - 4:30 Mon-Fri',
  meters: 412,
  url: 'adairrwd2.org',
  board_meeting: '2nd Tuesday 6pm',
  orwaag: true,
  address_physical_line1: '100 Main St',
  address_physical_city: 'Stilwell',
  address_physical_state: 'Oklahoma',
  address_physical_zip: '74960',
  address_mailing_pobox: 'PO Box 9',
  address_mailing_city: 'Stilwell',
  address_mailing_state: 'Oklahoma',
  address_mailing_zip: '74960',
  system_type_dirty: 'Purchased',
  email: 'office@adairrwd2.org',
  phone: '(918) 555-0100',
  fax: '(918) 555-0101',
};

const rowFor = (contacts: NaylorContact[], optedOut: Array<{ email?: unknown }> = []) =>
  buildNaylorRows([system(contacts)], optedOut, NOW)[0];

describe('Naylor export — system columns', () => {
  it('fills every directory column straight from the record', () => {
    const [row] = buildNaylorRows([system([], FULL_SYSTEM)], [], NOW);
    expect(row).toMatchObject({
      'System Name': 'Adair Co RWD #2',
      County: 'Adair',
      'Office Hours': '8:00 - 4:30 Mon-Fri',
      '# Meters': '412',
      Website: 'adairrwd2.org',
      'Board Meeting': '2nd Tuesday 6pm',
      ORWAAG: '+',
      'Physical Address': '100 Main St',
      'Physical City': 'Stilwell',
      'Physical State': 'Oklahoma',
      'Physical Zip': '74960',
      'Mailing Address': 'PO Box 9',
      'Mailing City': 'Stilwell',
      'Mailing State': 'Oklahoma',
      'Mailing Zip': '74960',
      'System Type': 'Purchased',
      Email: 'office@adairrwd2.org',
      Phone: '(918) 555-0100',
      Fax: '(918) 555-0101',
    });
  });

  it('has the contractual header: 19 system columns, then 3 contact slots of title / first / last', () => {
    expect(naylorColumnLabels()).toEqual([
      'System Name', 'County', 'Office Hours', '# Meters', 'Website',
      'Board Meeting', 'ORWAAG', 'Physical Address', 'Physical City',
      'Physical State', 'Physical Zip', 'Mailing Address', 'Mailing City',
      'Mailing State', 'Mailing Zip', 'System Type', 'Email', 'Phone', 'Fax',
      'Contact 1: Title', 'Contact 1: First Name', 'Contact 1: Last Name',
      'Contact 2: Title', 'Contact 2: First Name', 'Contact 2: Last Name',
      'Contact 3: Title', 'Contact 3: First Name', 'Contact 3: Last Name',
    ]);
    expect(NAYLOR_SYSTEM_FIELDS).toHaveLength(19);
  });

  it('emits every column for an empty record, with no per-contact email or phone', () => {
    const [row] = buildNaylorRows([system([], { email: null, county: null })], [], NOW);
    expect(Object.keys(row).sort()).toEqual([...naylorColumnLabels()].sort());
    expect(row['Office Hours']).toBe('');
    expect(row).not.toHaveProperty('Contact 1: Email');
    expect(row).not.toHaveProperty('Contact 1: Phone');
  });

  it('sorts by county, then district number, then name', () => {
    const rows = buildNaylorRows(
      [
        system([], { name: 'Zeta RWD #10', county: 'Adair' }),
        system([], { name: 'Alpha PWA', county: 'Adair' }),
        system([], { name: 'Zeta RWD #2', county: 'Adair' }),
        system([], { name: 'Beta RWD #2', county: 'Adair' }),
        system([], { name: 'Anything', county: 'Atoka' }),
      ],
      [],
      NOW
    );
    expect(rows.map((r) => r['System Name'])).toEqual([
      'Beta RWD #2', 'Zeta RWD #2', 'Zeta RWD #10', 'Alpha PWA', 'Anything',
    ]);
  });

  it('keeps a multi-line cell on one row and prints booleans as the + mark', () => {
    expect(naylorCell('Mon-Thu 8-5\r\n  Fri 8-12\n')).toBe('Mon-Thu 8-5; Fri 8-12');
    expect(naylorCell(true)).toBe('+');
    expect(naylorCell(false)).toBe('');
    expect(naylorCell(0)).toBe('0');
    expect(naylorCell(null)).toBe('');
  });
});

describe('Naylor export — membership star', () => {
  it('stars a system whose membership has not expired, and still lists the rest', () => {
    const rows = buildNaylorRows(
      [
        system([], { name: 'Paid RWD', payment_last_date: '2026-03-01' }),
        system([], { name: 'Lapsed RWD', payment_last_date: '2019-01-01' }),
        system([], { name: 'Never Paid RWD' }),
        system([], { name: 'Paid Yesterday RWD', payment_last_date: '2026-09-16' }),
      ],
      [],
      NOW
    );
    expect(rows.map((r) => r['System Name']).sort()).toEqual([
      '*Paid RWD', '*Paid Yesterday RWD', 'Lapsed RWD', 'Never Paid RWD',
    ]);
  });

  it('stars a member who renewed early, exactly as the grid shows them Active', () => {
    // Last payment 2025-08-01 is more than a year before NOW, but it was made 60
    // days before the previous period ended, so the membership runs to 2026-09-30.
    const earlyRenewal = system([], {
      name: 'Early Renewal RWD',
      payment_previous_date: '2024-09-30',
      payment_last_date: '2025-08-01',
    });
    expect(membershipExpiration('2024-09-30', '2025-08-01')?.format('YYYY-MM-DD')).toBe('2026-09-30');
    expect(buildNaylorRows([earlyRenewal], [], NOW)[0]['System Name']).toBe(
      '*Early Renewal RWD'
    );
    expect(
      buildNaylorRows([earlyRenewal], [], new Date('2026-10-01T12:00:00Z'))[0][
        'System Name'
      ]
    ).toBe('Early Renewal RWD');
  });

  it('extends the period by the overlap when they renewed early', () => {
    // Previous period ended 2025-04-08; they paid 2025-02-10, 57 days early.
    const expiration = membershipExpiration('2024-04-08', '2025-02-10');
    expect(expiration?.format('YYYY-MM-DD')).toBe('2026-04-08');
    expect(isMembershipActive('2024-04-08', '2025-02-10', new Date('2026-03-01'))).toBe(true);
    expect(isMembershipActive('2024-04-08', '2025-02-10', new Date('2026-04-09'))).toBe(false);
  });

  it('falls back to the previous payment, and treats junk as no date', () => {
    expect(membershipExpiration('2026-01-15', null)?.format('YYYY-MM-DD')).toBe('2027-01-15');
    expect(membershipExpiration(null, '')).toBeNull();
    expect(isMembershipActive('not a date', undefined, NOW)).toBe(false);
  });
});

describe('Naylor export — directory contacts', () => {
  it('publishes name and title for contacts who have not opted out', () => {
    const row = rowFor([
      { id: 1, first: 'Ada', last: 'Byron', title: 'Manager', email: 'ada@x.org' },
    ]);
    expect(row['Contact 1: First Name']).toBe('Ada');
    expect(row['Contact 1: Last Name']).toBe('Byron');
    expect(row['Contact 1: Title']).toBe('Manager');
    // Unfilled slots still emit their columns, so the file shape is stable.
    expect(row['Contact 2: First Name']).toBe('');
    expect(row['Contact 3: Title']).toBe('');
    // The contact's email never leaks into any cell.
    expect(Object.values(row)).not.toContain('ada@x.org');
  });

  it('suppresses a contact flagged inline, and re-indexes the survivors', () => {
    const row = rowFor([
      { id: 1, first: 'OptedOut', email: 'no@x.org', directory_opt_out: true },
      { id: 2, first: 'Published', email: 'yes@x.org' },
    ]);
    expect(row['Contact 1: First Name']).toBe('Published');
    expect(row['Contact 2: First Name']).toBe('');
  });

  it('suppresses a contact whose email opted out on a different contact row', () => {
    const row = rowFor(
      [{ id: 9, first: 'Ada', email: 'Ada@X.org ' }],
      [{ email: 'ada@x.org' }]
    );
    expect(row['Contact 1: First Name']).toBe('');
  });

  it('still publishes a contact with no email when nothing flags them', () => {
    // An empty opt-out email must not match every email-less contact.
    const row = rowFor([{ id: 3, first: 'NoEmail', last: 'Person' }], [{ email: '' }, { email: null }]);
    expect(row['Contact 1: First Name']).toBe('NoEmail');
  });

  it('orders the slots by title, after opt-outs are removed', () => {
    const row = rowFor(
      [
        { id: 1, first: 'Opal', title: 'Operator', email: 'opal@x.org' },
        { id: 2, first: 'Bob', title: 'Bookkeeper', email: 'bob@x.org' },
        { id: 3, first: 'Vera', title: 'vice chairman', email: 'vera@x.org' },
        { id: 4, first: 'Cora', title: 'Chairman', email: 'cora@x.org' },
        { id: 5, first: 'Dana', title: 'Director', email: 'dana@x.org' },
      ],
      // Cora opted out on another contact row, so Vera leads the block.
      [{ email: 'cora@x.org' }]
    );
    expect(row['Contact 1: First Name']).toBe('Vera');
    expect(row['Contact 2: First Name']).toBe('Dana');
    expect(row['Contact 3: First Name']).toBe('Opal');
    // Nobody falls off the end: the row grows to fit every published contact.
    expect(row['Contact 4: First Name']).toBe('Bob');
    expect(row).not.toHaveProperty('Contact 5: First Name');
  });

  it('puts every contact on the system row, widening the whole file to the busiest system', () => {
    const five = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, first: `P${i + 1}`, last: 'Five', title: 'Operator' }));
    const rows = buildNaylorRows(
      [system(five, { name: 'Busy RWD' }), system([{ id: 9, first: 'Solo', last: 'One' }], { name: 'Quiet RWD' })],
      [],
      NOW
    );
    const busy = rows.find((r) => r['System Name'] === 'Busy RWD')!;
    const quiet = rows.find((r) => r['System Name'] === 'Quiet RWD')!;
    expect(busy['Contact 5: First Name']).toBe('P5');
    // The quiet system carries the same columns, blank, so every row has the same shape.
    expect(Object.keys(quiet)).toEqual(Object.keys(busy));
    expect(quiet['Contact 5: First Name']).toBe('');
    const header = toNaylorCsv(rows).split('\r\n')[0].split('","');
    expect(header).toHaveLength(NAYLOR_SYSTEM_FIELDS.length + 5 * 3);
    expect(header[header.length - 1]).toBe('Contact 5: Last Name"');
  });

  it('never prints fewer than three contact slots', () => {
    const rows = buildNaylorRows([system([{ id: 1, first: 'Only', last: 'One' }])], [], NOW);
    expect(Object.keys(rows[0]).filter((k) => k.startsWith('Contact '))).toHaveLength(9);
    expect(toNaylorCsv(rows).split('\r\n')[0].split('","')).toHaveLength(28);
  });

  it('keeps link order among contacts that share a rank, untitled last', () => {
    const row = rowFor([
      { id: 1, first: 'Untitled' },
      { id: 2, first: 'FirstDirector', title: 'Director' },
      { id: 3, first: 'SecondDirector', title: 'DIRECTOR' },
    ]);
    expect(row['Contact 1: First Name']).toBe('FirstDirector');
    expect(row['Contact 2: First Name']).toBe('SecondDirector');
    expect(row['Contact 3: First Name']).toBe('Untitled');
    expect(DIRECTORY_TITLE_PRINT_ORDER[0]).toBe('Chairman');
  });

  it('ranks every title the member-manager contact form offers', () => {
    // The picker may be reordered for data entry; the print order is separate.
    // A new picker choice without a rank here would silently print last.
    const unranked = WATERSYSTEM_DIRECTORY_TITLE_CHOICES.filter(
      ({ id }) => id !== '' && directoryTitleRank(id) >= DIRECTORY_TITLE_PRINT_ORDER.length
    );
    expect(unranked).toEqual([]);
    expect(directoryTitleRank('Vice Chairman')).toBe(directoryTitleRank('vice-chairman'));
    expect(directoryTitleRank('Office Manager')).toBe(DIRECTORY_TITLE_PRINT_ORDER.length);
  });

  it('tolerates a system with no contacts relation at all', () => {
    const [row] = buildNaylorRows(
      [{ name: 'Bare', contacts: null }],
      [],
      NOW
    );
    expect(row['Contact 1: First Name']).toBe('');
  });
});

describe('Naylor export — CSV', () => {
  it('quotes every cell, doubles quotes, and keeps commas inside one cell', () => {
    const csv = toNaylorCsv(
      buildNaylorRows(
        [system([], { name: 'Nowata & Rogers Co RWD #1, "Consld"', county: 'Nowata' })],
        [],
        NOW
      )
    );
    const [header, first, trailing] = csv.split('\r\n');
    expect(header.startsWith('"System Name","County","Office Hours"')).toBe(true);
    expect(header.split('","')).toHaveLength(28);
    expect(first.startsWith('"Nowata & Rogers Co RWD #1, ""Consld""","Nowata",')).toBe(true);
    expect(trailing).toBe('');
  });

  it('is one line per system plus the header', () => {
    const csv = toNaylorCsv(
      buildNaylorRows(
        [system([], { office_hours: 'Mon 8-5\nTue 8-5' }), system([], { name: 'Other' })],
        [],
        NOW
      )
    );
    expect(csv.trimEnd().split('\r\n')).toHaveLength(3);
  });
});
