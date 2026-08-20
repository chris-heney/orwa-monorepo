/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      /**
       * Sign in through the API and seed the cookies the app reads, rather
       * than driving the login form. Keeps a role's spec focused on what that
       * role can see instead of re-testing the login page in every test.
       */
      loginAs(email: string, password: string): Chainable<void>;
      /** Open a hash route and wait for react-admin to settle. */
      visitRoute(hash: string): Chainable<void>;
      /** Fail if react-admin's error boundary is showing. */
      expectNoErrorBoundary(): Chainable<void>;
    }
  }
}

const API = Cypress.env('apiUrl') || 'http://localhost:13370';

interface CachedSession {
  email: string;
  jwt: string;
  roleName: string;
  userEmail: string;
  userId: string;
}

/**
 * One authentication per spec run, reused across tests.
 *
 * Strapi rate-limits `POST /auth/local`, so signing in per test makes a spec
 * of any size fail with 429s that look like the app is broken. The support
 * file is evaluated once per spec, so this cache lives exactly as long as it
 * should — cookies are still cleared between tests, and re-seeded from here.
 */
let cachedSession: CachedSession | null = null;

const seedCookies = (session: CachedSession) => {
  cy.setCookie('token', session.jwt);
  cy.setCookie('role', session.roleName);
  cy.setCookie('email', session.userEmail);
  cy.setCookie('id', session.userId);
};

Cypress.Commands.add('loginAs', (email: string, password: string) => {
  if (cachedSession?.email === email) {
    seedCookies(cachedSession);
    return;
  }

  cy.request('POST', `${API}/api/auth/local`, {
    identifier: email,
    password,
  }).then((auth) => {
    const jwt = auth.body.jwt;
    cy.request({
      url: `${API}/api/users/me?populate=role`,
      headers: { Authorization: `Bearer ${jwt}` },
    }).then((me) => {
      cachedSession = {
        email,
        jwt,
        roleName: me.body.role.name,
        userEmail: auth.body.user.email,
        userId: String(auth.body.user.id),
      };
      seedCookies(cachedSession);
    });
  });
});

Cypress.Commands.add('visitRoute', (hash: string) => {
  cy.visit(`/#${hash}`);
  // react-admin renders the shell before data arrives; the nav is the first
  // thing that proves the app booted rather than white-screened.
  cy.get('nav', { timeout: 20000 }).should('exist');
});

Cypress.Commands.add('expectNoErrorBoundary', () => {
  cy.contains('Something went wrong').should('not.exist');
  cy.contains('A client error occurred').should('not.exist');
});

export {};
