# Golf Oversell Incident — Email Drafts (2026-09-07, rev. 3)

Final numbers (active registrations only, matching the stakeholder report):
maximum **36** golfer slots · **59** active golfers registered · cap reached **Aug 25, 2026 11:30 AM CDT** (reg 16780/D6Labs straddles the line — its first golfer is slot 36, its other two are the first over)

Overage: **7 registrations / 23 golfers / $3,075**
— **Card Refunds: $1,600** (3 registrations, 12 golfers; Authorize.net txn ids in the report)
— **Invoice Adjustments: $1,475** (4 registrations, 11 golfers; #1015/#1028/#1029 unpaid → void/correct; reg 16780/D6Labs has no invoice record → reconcile in accounting)
— **Total Cancelled/Refunded: $3,075**

Refunds/voids are NOT yet processed — awaiting approval. Full call sheet: golf-overage-report canvas,
light PDF, and `tmp/golf-overage-2026-fall/`.

Separate billing correction (not part of the overage): reg 16672 (RWSD #1 Choctaw) still bills $300
including a $150 golfer fee for Charles Motes, whose golfer entry was moved to Team UTS (reg 16699)
by staff on Aug 7 — the Choctaw invoice needs the $150 golf line removed.

---

## 1. To ORWA — apology and incident explanation

**Subject: Golf Tournament Registration Overage — What Happened and What We're Doing About It**

Dear [ORWA CONTACT NAME],

I'm writing to inform you of a defect in the conference registration software, to apologize for it, and to walk you through exactly what happened and what has already been done to make it right.

**What happened.** The conference settings correctly specified a maximum of 36 golf tournament slots. Due to a software defect, the registration application did not check that limit when accepting registrations, and golf slots continued to sell after the maximum was reached on August 25. We oversold by 23 slots across 7 registrations, totaling $3,075 in golf fees — $1,600 paid by card (3 registrations, to be refunded for the golf portion) and $1,475 on invoices (4 registrations, unpaid, which will be corrected or voided).

**What has been done.** The defect was fixed and deployed the same day it was identified — golf registration is now closed and the limit is enforced both in the registration form and on the server, so this class of error cannot recur even under simultaneous registrations. Every affected registrant has been identified, and each is being personally informed; card payments are being refunded for the golf portion and outstanding invoices corrected. A complete incident report, including a list of affected registrations, accompanies this message.

**Why this happened.** New software of this scope carries risk in its first live season, and I want to be transparent about a decision I made that contributed here. Exhaustively testing this system would have meant scripting end-to-end tests for every feature added this year — attendee, vendor, and contestant-only registration, booth purchases with per-checkout limits, meal and extras RSVPs, sponsorships, invoice and card payment paths, kiosk and admin modes — and for each one, running every scenario against a clean database, resetting, and running the next. Realistically that is on the order of [60–90] additional billable hours. Instead, I chose to lean on the substantially higher baseline quality we've seen from AI-assisted development, watch incoming registrations vigilantly, and rely on the fact that when something does slip through, the correction now takes hours rather than the weeks a traditional fix-and-retest cycle would. That trade-off saved ORWA meaningful cost across the season, and the monitoring did catch this — but not before 23 extra golf slots sold, and I own that outcome.

**Going forward.** Beyond the fix itself, capacity limits are now enforced at the database write level for all ticket types, not just golf, and the boundary conditions have been added to the standing test checklist for future changes.

I apologize for the inconvenience this causes the association and the affected registrants. I'm glad to discuss any of this by phone at your convenience.

Respectfully,
[YOUR NAME]

---

## 2. To affected participants who paid by card

Recipients / golf-portion refund amounts (personalize each):

| Reg | Organization | Golf refund | Golfers | Note |
|---|---|---|---|---|
| 16781 | Oklahoma DEQ | $600 | 4 | |
| 16792 | Guthrie Excavation LLC | $500 | 4 | |
| 16817 | Okmulgee County RWD #4 | $500 | 4 | registered email has typo (yyahoo.com) — call first |

**Subject: ORWA Golf Tournament — Registration Refund Notice**

Dear [FIRST NAME],

Thank you for registering for the golf tournament at the Fall Conference. Unfortunately, we're writing with disappointing news.

Due to a software error in our registration system, the tournament's capacity limit was not applied when your registration was accepted, and the available slots had already been filled. We are unable to honor golf registrations received after the maximum was reached, and yours was among them.

**A refund of [$AMOUNT], covering the golf portion of your registration, will be issued to the card you used**, and you'll see it within 3–5 business days of the refund being processed. No action is needed on your part. If your registration included anything beyond the golf tournament (conference attendance, meals, or other events), those portions remain valid — only the golf portion is affected.

A member of our team will also be reaching out to you by phone to apologize personally and answer any questions.

We are very sorry for the mix-up and the disappointment. The error has been corrected so it cannot happen again, and we hope to see you on the course next year.

Sincerely,
[NAME]
Oklahoma Rural Water Association
[PHONE] · [EMAIL]

---

## 3. To affected participants paying by invoice

Recipients / invoice corrections (personalize each):

| Reg | Organization | Golf amount | Golfers over | Invoice |
|---|---|---|---|---|
| 16780 | D6Labs | $250 | 2 of 3 (Steve Montgomery keeps his slot; Hunt Hawkins & Hunter Montgomery are over) | no invoice record — reconcile in accounting first |
| 16787 | smith roberts baldischwiler | $125 | 1 | #1015 unpaid — remove golf line |
| 16797 | otoe water plant | $550 | 4 | #1028 unpaid — void |
| 16798 | otoe water plant | $550 | 4 | #1029 unpaid — void |

(otoe water plant holds two registrations — likely one contact, one call. For D6Labs, use the partial variant paragraph below.)

**Subject: ORWA Golf Tournament — Registration Cancellation and Invoice Correction**

Dear [FIRST NAME],

Thank you for registering for the golf tournament at the Fall Conference. Unfortunately, we're writing with disappointing news.

Due to a software error in our registration system, the tournament's capacity limit was not applied when your registration was accepted, and the available slots had already been filled. We are unable to honor golf registrations received after the maximum was reached, and registration [REG #] was among them.

**The golf tournament charge of [$AMOUNT] on invoice [INVOICE #] will be removed — please do not pay the golf portion.** If your registration included anything beyond the golf tournament, we will send a corrected invoice for those portions only; if golf was the only item, the invoice will simply be voided.

*Partial variant (D6Labs):* Due to a software error in our registration system, the tournament's capacity limit was not applied when your registration was accepted. Your first golfer, [NAME], secured the final available slot and **remains registered to play**. Unfortunately we are unable to honor the remaining [N] golfer registrations, and the corresponding charge of [$AMOUNT] will be removed from your balance.

A member of our team will also be reaching out by phone to apologize personally and answer any questions.

We are very sorry for the mix-up and the disappointment. The error has been corrected so it cannot happen again, and we hope to see you on the course next year.

Sincerely,
[NAME]
Oklahoma Rural Water Association
[PHONE] · [EMAIL]
