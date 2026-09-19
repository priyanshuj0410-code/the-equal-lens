---
type: checklist
title: Fundraising readiness
description: The registrations, documents, policies and website fixes funders check in due diligence, what each unlocks, and where The Equal Lens stands on each.
status: draft
updated: 2026-09-19
verified: 2026-09-19
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/cf3d8d9f-4410-4aa6-a46f-8e5b9c69706b
---

# Fundraising readiness

Related: [funder map](funder-map.md) · [case for support](case-for-support.md)

Most funding is decided in due diligence, not in the pitch. This is the list funders work through, with our status on each.

## 1. Registrations

The Income-tax Act 2025 replaced the 1961 Act on 1 April 2026. Funders, platforms and the CSR Rules still say "12A" and "80G", so we use those names too, with the new sections alongside.

| Registration | What it unlocks | Status | Next step |
|---|---|---|---|
| Legal entity (Trust, Society or Section 8 company) | Everything | Registered. Record type, number and date here | |
| Organisation PAN and bank account | Receiving money. Payment gateway checks | Confirm and record | |
| 12A, now RNPO registration (s.332) | Our income is tax-exempt. Required for CSR and most foundations | Applied | New organisations usually get provisional registration first, valid three years. Put the conversion deadline in the calendar with our CA |
| 80G, donors now deduct under s.133 | Old-regime donors can deduct 50% of a gift. Required for CSR and most platforms | Applied | As above |
| NGO Darpan ID (NITI Aayog) | Government schemes. Many funders ask for it | Not started | **Register now.** Needs the organisation's PAN, registration certificate, and PAN and Aadhaar of three office-bearers |
| CSR-1 (Ministry of Corporate Affairs) | Listing as a CSR implementing agency | Not started | File once 12A and 80G are granted |
| FCRA (Ministry of Home Affairs) | Any money from a foreign source | Not eligible | Needs three years' existence and ₹15 lakh spent on core activities over the last three financial years |

## 2. Rules for handling donations once 80G arrives

- **Collect PAN (or Aadhaar) and address** for every donation we will report. The current [donate form](../../src/components/DonateForm.tsx) collects only amount, name and email.
- **File the yearly statement of donations and issue donor certificates by 31 May** after each financial year. These were Forms 10BD and 10BE under the old Act. Confirm the new form numbers with our CA. If we miss the date, donors lose their deduction and we pay late fees.
- **Cash over ₹2,000 does not qualify** for the deduction. Steer donors to UPI, card or bank transfer.
- **No foreign money.** Turn off international cards on the gateway and ask each donor to confirm they are an Indian citizen.
- **Record every donor's identity.** Anonymous donations above a small limit are taxed. Confirm the limit under the new Act with our CA.
- **Donor data is personal data under the DPDP Act 2023.** Collect only what receipts need, say why, and keep it out of this repo.

## 3. The due-diligence pack

Keep current copies in one restricted Drive folder. Most funders ask for the same list.

| Document | Status |
|---|---|
| Registration certificate | Have |
| Trust deed, or society MoA and bylaws, or Section 8 MoA and AoA | Have |
| Organisation PAN card | Confirm |
| 12A (RNPO) and 80G orders | Awaited |
| NGO Darpan ID | To do |
| CSR-1 registration number | Later |
| Bank details and cancelled cheque | Confirm |
| Audited accounts and income-tax returns, every year since registration | Confirm what exists |
| Annual report (two pages is fine in year one) | To do |
| Board or trustee list with short bios. Key team CVs | To do |
| Budget and cost per child | In progress: [budget.md](budget.md) |
| Programme overview and measurement plan | Draft: [case-for-support.md](case-for-support.md) |
| Policies (section 4) | To do |
| Two or three partner references, starting with Sant Ghar Ishwar Foundation | To ask |

The first two rows are marked Have because 12A and 80G cannot be applied for without them.

## 4. Policies funders ask for

| Policy | Must cover |
|---|---|
| **Child protection and safeguarding** | Asked for first by any funder of work with children. Reporting under POCSO ss.19 to 21: the duty is personal to the adult who heard it, and an employer cannot overrule it. Periodic police verification, background checks and training for everyone we employ or contract to work with children (POCSO Rules 2020, Rule 3). The no-photographs rule. Visitor rules and closed sessions. The disclosure protocol. The local referral map |
| **Data protection** | DPDP Act 2023. Verifiable guardian consent before processing any under-18's data (s.9). No tracking or behavioural monitoring of children. Donor data |
| **Financial management and procurement** | Approvals, cash handling, who signs what |
| **Conflict of interest** | Declarations by founders and board, especially where donors or vendors are connected to them |
| **Complaints and whistleblowing** | How anyone, including a child or parent, raises a concern, and who handles it |
| **POSH** | An Internal Committee is mandatory at 10 or more employees. Below that, the district Local Committee covers us. Many CSR teams ask regardless |

## 5. What funders see on our website

Funders read the site before they reply. Fix these before the first outreach.

- **Unsourced homepage statistics.** "70% of stereotypes absorbed before age 12", "85% of mixed classrooms improve empathy" and "92% representation shapes aspiration" have no source. Source them or replace them with sourced figures, such as those in the [case for support](case-for-support.md#the-problem). The live copy may come from Sanity, which overrides `knowledge/pages/home.json`.
- **A measurement overclaim.** The programmes page says pre/post check-ins "show exactly how attitudes and behaviours shift". Single-group pre/post cannot show behaviour change. Drop "exactly" and "and behaviours" (`knowledge/pages/programs.json`, and Sanity if it overrides).
- **No registration details anywhere.** Once 12A and 80G are granted, add the registration number, PAN and 80G details to the footer and /donate.
- **A donate page that takes nothing.** Either open the gateway (Indian payments only, collecting PAN and address) or, until then, show a UPI ID and bank details with a way to request a receipt.

## Sources

Checked 19 September 2026. Re-check before relying on any of these in a filing or a funder document.

- RNPO registration under s.332 and the transition from the 1961 Act: [Patron Accounting](https://www.patronaccounting.com/blog/charitable-trust-ngo-registration-2026)
- Donations under s.133, cash limit and new regime: [Indian Kanoon, s.133](https://indiankanoon.org/doc/36734448/), [eztax.in](https://eztax.in/donations-under-section-80g)
- NGO Darpan requirements: [ngodarpan.gov.in](https://ngodarpan.gov.in), [NGO Consultancy](https://ngoconsultancy.org/consultancy-services/registration-in-ngo-darpan/information-required-for-ngo-darpan/)
- FCRA thresholds: [India TV News on the MHA rules](https://www.indiatvnews.com/news/india/ngos-foreign-funding-rules-fcra-modi-government-mha-664493)
- POCSO and DPDP obligations: the `child-safe-content` skill's legal references
