# ProPath

Career guidance for young people and career changers, built first for French-speaking Africa.

- **Assessment.** 36 interest items (Holland/RIASEC model), 8 skill self-ratings and context questions (education, goal, training time, preferred settings).
- **Career matching.** Scores are calculated, not generated. `src/career/engine.ts` correlates the person's interest profile with each occupation's Holland code in `src/career/occupations.ts`, combines that with skills and setting fit, and adjusts for training length and prerequisites. Every match comes with plain-language reasons.
- **Roadmap.** ProPath AI turns each match into a roadmap for the person's country: actions, free learning resources, certifications and earnings estimates. It cannot change the scores. Without AI, a roadmap built from the catalogue is used.
- **Accounts and progress.** Visitors can take the assessment and see their matches without an account. Courses, the tutor, purchases and projects need an account (email and password). Every account gets a document in the Firestore `users` collection. Progress saves automatically: on the device on the Free plan, and in the cloud across devices with Basic or Pro.
- **Courses.** ProPath Learning School courses with a tutor; custom courses generated on request.
- **Project Manager (Pro).** Turns an idea into phases and tasks, drafts documents (business plan, budget, pitch, funding application…) and coaches the user task by task.

## Plans

| Plan | Price (default) | Includes |
|---|---|---|
| Free | $0 | Assessment, matches, roadmap, ProPath AI courses, free tutor chapters. Progress saved on the device. |
| Basic | $2 / month | Progress saved across devices; course, journey and roadmap tracking. |
| Pro | $5 / month | Basic, plus Project Manager, portfolio and job opportunities. |

ProPath AI course exams and certificates are paid individually ($2 by default). Prices are set per country on the Admin page.

## Run locally

Requires Node.js 20+.

1. `npm install`
2. Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY`. For plans, payments and the Project Manager, also set the Firebase service account. Without CinetPay keys, local development simulates payments.
3. `npm run dev`, then open http://localhost:3000

## Hosting on Netlify

The website and the API both run on Netlify (`netlify.toml`):

- `netlify/functions/api.ts` runs the Express API as a function; `/api/*` is routed to it.
- Netlify functions must answer within about 10 seconds, but ProPath AI requests take 15–90 seconds. Those requests (career report, learning plan, courses, tutor, project tools) are queued in Firestore (`jobs`) and run by `netlify/functions/ai-worker-background.ts`, a background function with up to 15 minutes. The app waits for the result automatically (`authedFetch`).

Set these in Netlify under **Site configuration → Environment variables** (Netlify limits function variables to 4 KB in total, so use the two Firebase variables rather than the whole JSON):
`ANTHROPIC_API_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `APP_URL`, and later `CINETPAY_API_KEY`, `CINETPAY_SITE_ID`.

Locally, `npm run dev` runs everything in one server; set `PROPATH_ASYNC_JOBS=true` to try the job flow.

## Firebase setup

In the Firebase console for the project:

1. **Authentication → Sign-in method:** enable **Email/Password**. ProPath doesn't use Google or Anonymous sign-in.
2. **Firestore rules:** deploy `firestore.rules`.
3. **Service account:** Project settings → Service accounts → Generate new private key. Put the JSON (on one line) in `FIREBASE_SERVICE_ACCOUNT`.

## Payments (CinetPay)

1. Create a CinetPay merchant account and get the API key and site ID.
2. Set `CINETPAY_API_KEY`, `CINETPAY_SITE_ID` and `APP_URL` (your public URL).
3. CinetPay sends payment notifications to `APP_URL/api/pay/notify`. The server never trusts the notification itself: it asks CinetPay for the transaction status, checks the amount and currency against its own record, and only then grants access, once per payment.

Admins can also grant a plan by email on the Admin page, for scholarships or partners.

## Admins

There's no admin password. In the Firebase console, open Firestore (database `ai-studio-740c2bf7-…`), the `users` collection, find the person's document (their user ID; the `email` field shows who it is) and add the field `role` = `admin`. They then see **Admin** in the footer, or can open `/#admin`. Users can never set `role` themselves (see `firestore.rules`).

## Tutor marketplace

Trainers, schools, institutes and universities apply under **Teach on ProPath** (footer). ProPath approves each tutor, then reviews each course before it is published; editing a published course sends it back to review, and learners who bought it keep access.

- Every course has at least 2 free chapters. Tutors charge per chapter or for the whole course, minimum $1, in USD.
- Learners need an account to read any chapter. Chapter content is served only by the server, and paid chapters only to buyers.
- Each sale records the tutor's 80% in `tutor_earnings`. On the Admin page, pay a tutor's balance by mobile money yourself and record the reference, or, with `CINETPAY_TRANSFER_PASSWORD` and `CINETPAY_PAYOUT_CURRENCY` set, send it through CinetPay transfers. Earnings are locked to a payout so they can't be paid twice; a failed transfer returns them to the balance.

## Matching data

Occupation Holland codes follow O*NET interest profiles for the closest occupation; training times and entry routes are typical for DR Congo. Have a career counsellor review `src/career/occupations.ts` for each market you launch in.
