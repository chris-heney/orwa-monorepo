/**
 * Karen — Conference Manager, read-only.
 *
 * She has one job in this app: look at conference data. She cannot write
 * anything and cannot see any other module. Module gating is what decides what
 * she is shown, so a mistake there does not fail loudly in CI — it fails in
 * front of her, as an error page or an empty screen, at 8am.
 *
 * Every assertion here is something that would ruin her morning, not an
 * implementation detail. The specifics (which tabs exist, how many records)
 * are deliberately loose so this fails on "her module broke", not on someone
 * renaming a tab.
 *
 * Requires the fixture role + user from
 * `apps/member-manager-e2e/README.md` to exist in the target database.
 */

const KAREN = {
  email: Cypress.env('karenEmail') || 'karen.e2e@orwa.test',
  password: Cypress.env('karenPassword') || 'KarenE2E!2026',
};

/** Where the conference module lives. */
const CONFERENCE_DASHBOARD = '/conference/dashboard';

/** Modules Karen must not be able to reach. `settings` is intentionally
 *  granted to every role, so it is not in this list. */
const FORBIDDEN_ROUTES = [
  '/grant/dashboard',
  '/training/dashboard',
  '/membership-management',
  '/email-management',
  '/human-resources/dashboard',
  '/rbac/dashboard',
];

describe('Karen — read-only Conference Manager', () => {
  beforeEach(() => {
    cy.loginAs(KAREN.email, KAREN.password);
  });

  it('lands somewhere she can actually use, not the admin dashboard', () => {
    // The root route renders the admin dashboard, which loads data from across
    // the app. Karen can read almost none of it, so rendering it for her
    // produced an error page. She must be redirected to her own module.
    cy.visitRoute('/');
    cy.expectNoErrorBoundary();
    cy.hash().should('contain', CONFERENCE_DASHBOARD);
  });

  it('shows her the Conference Manager and nothing she cannot open', () => {
    cy.visitRoute(CONFERENCE_DASHBOARD);
    cy.expectNoErrorBoundary();

    cy.get('nav').within(() => {
      cy.contains('Conference Manager').should('exist');
      cy.contains('Grant Manager').should('not.exist');
      cy.contains('Memberships').should('not.exist');
      cy.contains('Training Manager').should('not.exist');
      cy.contains('RBAC Manager').should('not.exist');
    });
  });

  it('renders every conference tab with data and without an error page', () => {
    cy.visitRoute(CONFERENCE_DASHBOARD);
    cy.get('[role=tab]', { timeout: 20000 }).should(
      'have.length.greaterThan',
      5
    );

    cy.get('[role=tab]').then(($tabs) => {
      const count = $tabs.length;
      for (let i = 0; i < count; i += 1) {
        // Re-query each time: switching tabs re-renders the strip. The strip
        // also scrolls horizontally, so later tabs sit outside the viewport
        // and have to be scrolled to before they can be clicked.
        cy.get('[role=tab]')
          .eq(i)
          .scrollIntoView()
          .click({ force: true });
        cy.expectNoErrorBoundary();
        // A blank panel is as broken as a crash, so require the tab to render
        // something of its own.
        cy.get('main').should('not.be.empty');
      }
    });
  });

  it('offers her no way to change anything', () => {
    cy.visitRoute(CONFERENCE_DASHBOARD);
    cy.expectNoErrorBoundary();

    // The write affordances are hidden for a role without the capability:
    // Add on the list header, Save/Delete on the inline edit toolbars.
    cy.get('main').within(() => {
      cy.contains('button', /^add/i).should('not.exist');
      cy.contains('button', /^save/i).should('not.exist');
      cy.contains('button', /^delete/i).should('not.exist');
    });
  });

  it('sends her back instead of opening an edit page she cannot submit', () => {
    // Reaching an edit route directly — a bookmark, a stale link — must not
    // strand her on a form whose save would 403.
    cy.visitRoute('/conference-attendees/some-attendee-id');
    cy.expectNoErrorBoundary();
    cy.hash().should('contain', CONFERENCE_DASHBOARD);
  });

  FORBIDDEN_ROUTES.forEach((route) => {
    it(`redirects her out of ${route} without an error page`, () => {
      cy.visitRoute(route);
      cy.expectNoErrorBoundary();
      cy.hash().should('contain', CONFERENCE_DASHBOARD);
    });
  });

  it('refuses her writes at the API, not just in the UI', () => {
    // The UI gating is cosmetic; this is the check that actually protects the
    // data. If this ever passes, the role is misconfigured.
    cy.getCookie('token').then((cookie) => {
      const api = Cypress.env('apiUrl') || 'http://localhost:13370';
      cy.request({
        method: 'POST',
        url: `${api}/api/conference-attendees`,
        headers: { Authorization: `Bearer ${cookie?.value}` },
        body: { data: {} },
        failOnStatusCode: false,
      })
        .its('status')
        .should('eq', 403);
    });
  });
});
