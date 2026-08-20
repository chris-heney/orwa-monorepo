# member-manager e2e

Role-based end-to-end checks for member-manager.

Module gating decides what a role is shown, and a mistake there does not fail
loudly — it fails in front of the person who has that role. These specs pin the
experience of a role that is _not_ an admin, which is the case least likely to
be exercised by hand.

## Running

Both servers must be up, and the fixture user must exist in the database the
API is pointed at.

```bash
npx nx run strapi:develop          # http://localhost:13370
npx nx run member-manager:serve    # http://localhost:4205
npx nx run member-manager-e2e:e2e
```

Override the targets with Cypress env vars if yours differ:
`--env apiUrl=...,karenEmail=...,karenPassword=...`

## Fixture: Karen, read-only Conference Manager

`karen-conference-manager.cy.ts` needs a user whose role grants the
`conference` module and read-only permissions. Create it once per database:

```sql
-- Role: conference module, nothing else. `settings` is granted to every role
-- by the app itself, so it is not listed here.
INSERT INTO up_roles (name, description, type, created_at, updated_at, document_id, published_at)
SELECT 'Conference Manager', 'Read-only access to the Conference Manager module.',
       'conference_manager', NOW(6), NOW(6), 'roleconferencemanager0001', NOW(6)
WHERE NOT EXISTS (SELECT 1 FROM up_roles WHERE type = 'conference_manager');

UPDATE up_roles SET modules = JSON_ARRAY('conference') WHERE type = 'conference_manager';
```

Then grant `find` and `findOne` for every api the conference screens read.
That is wider than the module's declared resources: the screens also resolve
registrant names from `contact`, and read `conference-team`,
`conference-feedback`, `taste-test-contestant` and `watersystem`. Add
`plugin::users-permissions.user.me` — every signed-in role needs it to hold a
session — plus `api::my-preferences.*` and `plugin::upload.content-api.find*`.

Finally add the user (password `KarenE2E!2026`, bcrypt cost 10):

```sql
INSERT INTO up_users (username, email, provider, password, confirmed, blocked,
                      created_at, updated_at, document_id, published_at)
VALUES ('karen.e2e', 'karen.e2e@orwa.test', 'local',
        '<bcrypt hash>', 1, 0, NOW(6), NOW(6), 'userkarene2econfmgr00001', NOW(6));
```

and link it to the role in `up_users_role_lnk`.

## What the specs assert, and why

- **The root route redirects her.** `/` renders the admin dashboard, which
  loads data from across the app. A role without the `dashboard` module cannot
  read most of it and got an error page instead of a usable screen.
- **Every conference tab renders with content.** A blank panel is as broken as
  a crash, so each tab must render something of its own.
- **No Add / Save / Delete anywhere.** Offering a write she cannot perform
  wastes her time and used to report success while the API refused it.
- **A direct edit URL sends her back**, rather than stranding her on a form
  whose save would 403.
- **Other modules redirect, without an error page.**
- **The API refuses her writes.** The UI gating is cosmetic; this is the
  assertion that actually protects the data. If it ever passes, the role is
  misconfigured.
