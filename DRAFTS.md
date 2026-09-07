# Golf Oversell Incident — Email Drafts (2026-09-07)

Final numbers (reconciled against production binlog audit):
maximum **36** golfer slots · **56** slots sold · counter **−20** · cap breached **Aug 25, 2026 11:30 AM CDT**
Overage: **5 registrations / 20 slots / $2,700** — Card **$1,600** (3 regs), Invoice **$1,100** (2 regs, both UNPAID → void, not refund)

Refunds/voids are NOT yet processed — awaiting approval. Transaction IDs and the full
call sheet are in the golf-overage-report canvas and `tmp/golf-overage-2026-fall/`.

---

## 1. To ORWA — apology and incident explanation

**Subject: Golf Tournament Registration Overage — What Happened and What We're Doing About It**

Dear [ORWA CONTACT NAME],

I'm writing to inform you of a defect in the conference registration software, to apologize for it, and to walk you through exactly what happened and what has already been done to make it right.

**What happened.** The conference settings correctly specified a maximum of 36 golf tournament slots. Due to a software defect, the registration application did not check that limit when accepting registrations, and golf slots continued to sell after the maximum was reached on August 25. We oversold by 20 slots across 5 registrations, totaling $2,700 — $1,600 paid by card (3 registrations, to be refunded in full) and $1,100 on invoices (2 registrations, both unpaid, which will simply be voided).

**What has been done.** The defect was fixed and deployed the same day it was identified — golf registration is now closed and the limit is enforced both in the registration form and on the server, so this class of error cannot recur even under simultaneous registrations. Every affected registrant has been identified, and each is being personally informed; card payments are being fully refunded and outstanding invoices voided. A complete incident report, including a list of affected registrations, accompanies this message.

**Why this happened.** New software of this scope carries risk in its first live season, and I want to be transparent about a decision I made that contributed here. Exhaustively testing this system would have meant scripting end-to-end tests for every feature added this year — attendee, vendor, and contestant-only registration, booth purchases with per-checkout limits, meal and extras RSVPs, sponsorships, invoice and card payment paths, kiosk and admin modes — and for each one, running every scenario against a clean database, resetting, and running the next. Realistically that is on the order of [60–90] additional billable hours. Instead, I chose to lean on the substantially higher baseline quality we've seen from AI-assisted development, watch incoming registrations vigilantly, and rely on the fact that when something does slip through, the correction now takes hours rather than the weeks a traditional fix-and-retest cycle would. That trade-off saved ORWA meaningful cost across the season, and the monitoring did catch this — but not before 20 extra golf slots sold, and I own that outcome.

**Going forward.** Beyond the fix itself, capacity limits are now enforced at the database write level for all ticket types, not just golf, and the boundary conditions have been added to the standing test checklist for future changes.

I apologize for the inconvenience this causes the association and the affected registrants. I'm glad to discuss any of this by phone at your convenience.

Respectfully,
[YOUR NAME]

---

## 2. To affected participants who paid by card

Recipients / amounts (personalize each):

| Reg | Organization | Amount | Golfers |
|---|---|---|---|
| 16781 | Oklahoma DEQ | $600 | 4 |
| 16792 | Guthrie Excavation LLC | $500 | 4 |
| 16817 | Okmulgee County RWD #4 | $500 | 4 |

**Subject: ORWA Golf Tournament — Registration Refund Notice**

Dear [FIRST NAME],

Thank you for registering for the golf tournament at the Fall Conference. Unfortunately, we're writing with disappointing news.

Due to a software error in our registration system, the tournament's capacity limit was not applied when your registration was accepted, and the available slots had already been filled. We are unable to honor golf registrations received after the maximum was reached, and yours was among them.

**A full refund of [$AMOUNT] will be issued to the card you used**, and you'll see it within 3–5 business days of the refund being processed. No action is needed on your part. If your registration included anything beyond the golf tournament (conference attendance, meals, or other events), those portions remain valid — only the golf portion is affected.

A member of our team will also be reaching out to you by phone to apologize personally and answer any questions.

We are very sorry for the mix-up and the disappointment. The error has been corrected so it cannot happen again, and we hope to see you on the course next year.

Sincerely,
[NAME]
Oklahoma Rural Water Association
[PHONE] · [EMAIL]

---

## 3. To affected participants paying by invoice

Both invoice registrations are **otoe water plant** (regs 16797 & 16798, invoices #1028 & #1029, $550 each, both unpaid) — likely one contact, one call.

**Subject: ORWA Golf Tournament — Registration Cancellation and Invoice Correction**

Dear [FIRST NAME],

Thank you for registering for the golf tournament at the Fall Conference. Unfortunately, we're writing with disappointing news.

Due to a software error in our registration system, the tournament's capacity limit was not applied when your registrations were accepted, and the available slots had already been filled. We are unable to honor golf registrations received after the maximum was reached, and registrations #16797 and #16798 were among them.

**Invoices #1028 and #1029 ($550 each) will be voided — please do not pay them.** If your registration included anything beyond the golf tournament, we will send corrected invoices for those portions only.

A member of our team will also be reaching out by phone to apologize personally and answer any questions.

We are very sorry for the mix-up and the disappointment. The error has been corrected so it cannot happen again, and we hope to see you on the course next year.

Sincerely,
[NAME]
Oklahoma Rural Water Association
[PHONE] · [EMAIL]
