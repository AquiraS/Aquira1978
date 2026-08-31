# Aquira1978 — Origin & Archive

This repository contains the **static source of truth** for `aquira1978.com`. The site has one narrow purpose: to publish a verifiable origin, history, archive, and official-name record for the Aquira ecosystem. It intentionally does **not** publish unverified biography, licensing claims, services, prices, retail categories, or template content.

## Update workflow

1. Edit `content/site-content.js` or `content/archive-pages.js`. Only add facts that can be verified and cited in the applicable internal record.
2. Run `node scripts/build-site.mjs`.
3. Run `node scripts/validate-site.mjs`.
4. Review the generated public pages, `robots.txt`, and `sitemap.xml`.
5. Open a pull request; deploy only after the live domain is connected to this static project and visual/SEO review is complete.

## Current site architecture

| Domain | Authoritative role |
|---|---|
| `aquira.art` | Works, official artist profile, collaboration and licensing enquiries |
| `aquira1978.com` | Origin, historical record, archive and official-name record |
| `aquira.org` | Projects, dialogue and social-facing collaboration |

## Public archive routes

| Record | Japanese route | US-English route | Publication rule |
|---|---|---|---|
| Aquira Name Record | `/name-record/` | `/en/name-record/` | Cite only publicly verifiable material with date, reference, and context. |
| Archive Methodology | `/archive-methodology/` | `/en/archive-methodology/` | Explain inclusion, exclusion, and correction standards without inventing history. |
| Documented Timeline | `/documented-timeline/` | `/en/documented-timeline/` | Add entries only when a public primary source, date, provenance, and context are ready. |
| Official Use & Corrections | `/official-use-corrections/` | `/en/official-use-corrections/` | Provide an enquiry route; never present an enquiry as permission, a licence, or legal advice. |

The code does not itself change the live Wix site. Redirects, canonical host preference, site settings, and DNS/hosting remain deployment-level configuration and must be verified after the static site is connected.
