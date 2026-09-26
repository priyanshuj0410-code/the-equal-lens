---
type: playbook
title: Donation and grant platforms
description: Which donation, crowdfunding, payment and grant-discovery platforms The Equal Lens can use now, which open after 12A and 80G, what each costs and asks for, and the plan for Daan Utsav 2026.
status: draft
updated: 2026-09-26
verified: 2026-09-19
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/c7ac099a-c031-4bcd-9e22-8abedb73c3d2
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/3e4ddd8d-03ff-4afb-8e22-ee6d69fd01f0
---

# Donation and grant platforms

Related: [funder map](funder-map.md#2-donation-and-grant-platforms) · [readiness](readiness.md) · [pipeline](pipeline.md#campaigns) · [budget](budget.md#gift-units)

Two facts decide where we can raise today: 12A and 80G are pending, and we have no FCRA. That leaves three routes open now, four more once 12A and 80G arrive, and anything foreign closed.

## At a glance

| Platform | What it is | Open to us | Fees (as published) | Tax receipts |
|---|---|---|---|---|
| UPI and bank details on /donate | Direct to our bank account | **Now** | No platform fee | Our own acknowledgement. Not tax-deductible until 80G |
| Ketto | Crowdfunding, money | **Now.** 80G and FCRA are "if applicable" | Bronze plan: no platform fee. Silver 5%, Gold 7%. 3% payment gateway on every plan. 18% GST on Ketto's fee and the gateway fee | Only once we have 80G |
| DonateKart | Donors buy products we list; products reach us, not money | **Ask.** NGO criteria not published | Free for donors and NGOs | Donors get an 80G certificate within 24 hours. Ask who issues it |
| Milaap | Crowdfunding, money | After 80G. Its NGO guide expects 80G | 0% platform fee. Gateway and bank charges may apply | Automatic, once we have 80G |
| Give (GiveIndia, give.do) | India's largest giving platform, with corporate payroll giving | After 12A | Confirm at onboarding | Confirm at onboarding |
| Razorpay | Payment gateway for our own donate button | Ask whether activation can proceed while 12A and 80G are pending | Standard gateway pricing | Payment Pages can issue 80G receipts automatically, once we have 80G |
| Danamojo | Donation management: receipts and the yearly donation statement | After 80G | Annual plans from ₹3,499 | Automatic 80G receipts, Form 10BD file, one-click 10BE |

## Open now

### 1. UPI and bank details on /donate

The quickest way to let a willing donor give today. The account must be in the organisation's name, never a founder's.

- **Needs:** the organisation's UPI ID and bank details, and a small site change (a Plane ticket of its own, per `knowledge/design.md`).
- **Say plainly** that gifts are not tax-deductible yet, and ask donors to confirm they are Indian citizens.
- **Record every gift** in the donor records sheet, with PAN and address from the day 80G arrives.

### 2. Ketto

The one money platform that clearly accepts us before 80G.

- **Documents (mandatory):** registration certificate or trust or society deed, PAN, bank details and a cancelled cheque. 80G and FCRA are "if applicable".
- **Review:** Ketto says it replies to NGO applications within two business days.
- **Cost:** the Bronze plan has no platform fee, but every plan pays 3% to the payment gateway, plus 18% GST on it. Budget for about 3.5% of what we raise.
- **Foreign money:** Ketto accepts foreign donations in general. Ask them to switch international donations off for our campaigns, in writing.
- **Best for:** a time-bound campaign with one concrete target, such as Daan Utsav.

### 3. DonateKart

Donors buy specific items we list, and DonateKart delivers the items. It fits session supplies such as stationery.

- **Cost:** free for donors and NGOs.
- **Ask before signing up:** what it needs from NGOs, and who issues donors' 80G certificates. DonateKart Foundation holds 12A and 80G. If it issues the certificates, our pending 80G does not cost donors their deduction.
- **Ask also** that foreign donors are excluded from our campaigns.

## Opens when 12A and 80G arrive

### 4. Milaap

- **Cost:** 0% platform fee. Standard gateway and bank charges may apply.
- **Needs:** its NGO guide expects 80G, and Milaap checks PAN, 80G and FCRA with the authorities. It is unclear whether it lists NGOs without 80G. Ask if Ketto falls through.
- **Foreign money** goes only to an FCRA-registered account, so for us, Indian donors only.

### 5. Give (GiveIndia, give.do)

The largest audience, and the door to corporate payroll-giving programmes.

- **To start:** email membership@give.do confirming we hold a registration certificate or trust deed, a 12A certificate and a PAN card. Give's support page, last updated February 2023, lists only these three. Expect more due diligence: Give runs field audits of listed NGOs.
- **Apply the week 12A arrives.**

### 6. Razorpay

This replaces the UPI stopgap with a proper donate button: cards, UPI and netbanking.

- **KYC for trusts and societies** (Razorpay guide, April 2026): trust deed or society bylaws, 12A and 80G certificates, the organisation's PAN, KYC of the authorised signatory and their declaration, a cancelled cheque, and a GST certificate or a declaration that we are not registered for GST. The guide doesn't say whether activation waits for 12A and 80G, so ask.
- **International payments:** Razorpay says it cannot offer them to NGOs. That suits us until FCRA.
- **Payment Pages** can issue 80G receipts automatically. We may not need custom code in [DonateForm.tsx](../../src/components/DonateForm.tsx): a Payment Page with its button on /donate could be enough.

### 7. Danamojo

Worth it once receipts and the yearly donation statement become real work.

- **Does:** automatic 80G receipts; a Form 10BD file ready to upload, covering online and offline gifts; one-click Form 10BE certificates; recurring donations; PAN verification.
- **Cost:** annual plans from ₹3,499. Ask for a quote.
- **Choose one** of Danamojo or Razorpay Payment Pages as the system of record for donations, not both.

## Finding grants

| Platform | Use | When |
|---|---|---|
| NGOBox | Lists grants, RFPs and EOIs from Indian funders. Use it to fill the [pipeline](pipeline.md) | Now. Check its access terms |
| CSRBOX | CSR partnerships platform. Lists vetted NGOs after screening and an onboarding fee, and may decline an organisation without enough portfolio | After CSR-1 and a track record |
| GuideStar India | Not a giving platform. A transparency certification (Transparency Key, Silver, Gold, Platinum) that companies, PSUs and foundations use to shortlist and to shorten due diligence | Start at the entry level, Transparency Key, once 12A and 80G arrive. Check the current criteria |

## Closed until FCRA

Global giving platforms that pay out from abroad, such as GlobalGiving or a multinational's employee-giving platform run from outside India. Also any platform feature that would take foreign money for us.

## The sign-up pack

Most platforms ask for the same documents. Keep them in the restricted Drive folder from [readiness](readiness.md#3-the-due-diligence-pack).

- Registration certificate, and the trust deed, society bylaws, or Section 8 MoA and AoA
- The organisation's PAN
- A bank account in the organisation's name, and a cancelled cheque
- KYC of the authorised signatory, and the board resolution naming them
- 12A and 80G orders, once granted
- A GST certificate, or a declaration that we are not registered
- For each campaign: the goal amount, what it buys, and evidence the need is real
- Logo, a short description, and images that follow the no-photographs-of-children rule

## Rules for every campaign

- **Targets come from [budget.md](budget.md#gift-units)**, stated as units: "₹X takes one class through Discovery".
- **No photographs of children**, including in campaign galleries and updates. Platforms push for them. Use illustrations, materials and the team at work.
- **Indian donors only**, until FCRA.
- **Be honest about tax.** Until 80G is granted, say gifts are not tax-deductible.
- **Post an update** during the campaign, and report what the money did within two weeks of it closing.
- **Book the gross donation and the platform's fees separately.** Platforms pay out net of fees.

## Giving moments: decisions

**Daan Utsav 2026 (2 to 8 October): skipped.** Decided 26 September 2026. The target depends on costs from [budget.md](budget.md#inputs-needed), which were not in. 80G had not arrived, so no donor would have got a deduction. The site still carries unsourced statistics that donors would have read. Two weeks was not enough lead time. Daan Utsav returns 2 to 8 October 2027, and the lead time to plan for is four weeks, not two.

**GivingTuesday, Tuesday 1 December 2026: the next target.** Working backwards:

| By | What | Waiting on |
|---|---|---|
| Mon 2 November | Three budget numbers in and a target set. Platform chosen: Ketto, or our own page if 80G and the gateway are live | Founders (THEEQ-52) |
| Mon 9 November | Copy and images approved, with no photographs of children. Homepage statistics fixed. /donate able to take money, or a UPI block live | Founders, site ticket |
| Mon 16 November | Campaign page drafted. Platform application submitted, since its review takes two business days. Donor list split between people who get a personal message and people who get a broadcast | |
| Week of 23 November | Quiet asks to the ten closest supporters, so the campaign opens with money already on the board | |
| Tue 1 December | Launch, with one update mid-week | |
| Tue 15 December | Every donor thanked and told what their money will do. All donors recorded in the donor records sheet | |

**If 80G arrives first,** January to March is the larger moment, because old-regime donors can deduct then. In that case the tax-season appeal becomes the main ask and GivingTuesday is the warm-up.

Ketto over Milaap when the time comes, because Ketto accepts NGOs without 80G.

## Sources

Checked 19 September 2026. Fees and criteria change, so confirm each one at sign-up.

- Ketto fees: [plans and pricing](https://www.ketto.org/support/plans-and-pricing.php). NGO documents: [Ketto help](https://customerhappiness.ketto.org/portal/en/kb/articles/how-to-get-started-as-an-ngo-on-ketto-what-documents-are-required-6-8-2021)
- Milaap: [NGO guide](https://pages.milaap.org/2024/07/13/milaap-for-ngos-how-non-profit-organizations-can-leverage-crowdfunding-for-impact/), [pricing](https://milaap.org/crowdfunding/pricing)
- Give: [NGO eligibility](https://support.give.do/support/solutions/articles/1000312342-what-is-the-eligibility-criteria-for-an-ngo-to-be-listed-on-give-fundraisers-)
- DonateKart: [FAQ](https://www.donatekart.com/faqs)
- Razorpay: [KYC guide, April 2026](https://razorpay.com/blog/payment-gateway-kyc-onboarding-india/), [international payments FAQ](https://razorpay.com/docs/payments/international-payments/faqs/), [80G receipts on Payment Pages](https://razorpay.com/blog/automated-80g-receipts-ngo/)
- Danamojo: [pricing](https://danamojo.org/pricing/)
- CSRBOX: [FAQ](https://www.csrbox.org/FAQ). NGOBox: [RFPs and EOIs](https://ngobox.org/rfp_eoi_listing.php). GuideStar India: [certification](https://resources.guidestarindia.org/)
