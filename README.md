# Aquira1978 — Origin & Archive

This repository contains the **static source of truth** for `aquira1978.com`. The site has one narrow purpose: to publish a verifiable origin, history, archive, and official-name record for the Aquira ecosystem. It intentionally does **not** publish unverified biography, licensing claims, services, prices, retail categories, or template content.

## Update workflow

1. Edit `content/site-content.js`. Only add facts that can be verified and cited in the applicable internal record.
2. Run `node scripts/build-site.mjs`.
3. Run `node scripts/validate-site.mjs`.
4. Review the generated `index.html`, `about/index.html`, `contact/index.html`, `robots.txt`, and `sitemap.xml`.
5. Open a pull request; deploy only after the live domain is connected to this static project and visual/SEO review is complete.

## Current site architecture

| Domain | Authoritative role |
|---|---|
| `aquira.art` | Works, official artist profile, collaboration and licensing enquiries |
| `aquira1978.com` | Origin, historical record, archive and official-name record |
| `aquira.org` | Projects, dialogue and social-facing collaboration |

The code does not itself change the live Wix site. Redirects, canonical host preference, site settings, and DNS/hosting remain deployment-level configuration and must be verified after the static site is connected.
