# Aquira1978 US-English SEO Implementation

## Purpose and scope

This release makes `https://www.aquira1978.com/en/` the technically explicit **US-English entry point** for the official Aquira origin-and-archive record. It strengthens search-engine interpretation and measurement without claiming rankings, creating unsupported biographical assertions, or diluting the distinct roles of `aquira.art`, `aquira1978.com`, and `aquira.org`.

## Implemented search architecture

| Area | Implementation | Expected effect |
| --- | --- | --- |
| Canonical URLs | Every page self-canonicalizes to `https://www.aquira1978.com`. | Consolidates the preferred public URL for indexing. |
| US-English targeting | English pages use `lang="en-US"`, `hreflang="en-US"`, and an English `x-default`; Japanese equivalents use `ja-JP`. | Makes the intended English audience explicit while preserving Japanese-language discovery. |
| Reciprocal localization | Every localized URL lists itself and its Japanese/English counterpart in both HTML and XML sitemap. | Meets Google’s reciprocal localization pattern. [1] |
| Index discovery | The root XML sitemap lists all eight indexable bilingual pages and is declared in `robots.txt`. | Gives crawlers a current, canonical inventory. [2] |
| Entity clarity | The US-English homepage includes restrained `Organization`, `WebSite`, and `WebPage` JSON-LD using only official URLs and the published contact address. | Helps disambiguate the official site and its network. [3] |
| Snippet quality | US-English title, description, Open Graph, image-alt, and hero copy explicitly identify the official Aquira origin and archive record. | Aligns page language with brand-intent searches without keyword stuffing. |
| Measurement | Consent-aware GA4 is configured for the US-English property and web stream. | Enables measurement only after a visitor permits analytics. |

## Connected Google services

| Service | State | Configuration |
| --- | --- | --- |
| Google Search Console | Connected and ownership verified | URL-prefix property: `https://www.aquira1978.com/` |
| Google Analytics 4 | Created and wired in release code | Property: `Aquira1978 \| US English`; stream: `Aquira1978 Web`; measurement ID: `G-ZHRCFRBR5F` |
| Google Tag Manager | Intentionally not added | A direct GA4 implementation prevents duplicate page views and reduces operational complexity. |
| Google Ads | Not connected | No paid-media or advertising-audience configuration is required for this SEO release. |

## Analytics and visitor choice

The `analytics.js` loader emits a denied consent default and does not request the Google tag until a visitor selects **Allow analytics**. Advertising storage, ad-user-data storage, and ad-personalization remain denied. Google signals and ad-personalization signals are disabled in the GA4 configuration. The linked bilingual privacy page lets visitors alter that choice later. This limits the implementation to aggregate website measurement and preserves access for visitors who decline analytics.

## Release verification

After GitHub Pages publishes the commit, complete the following checks in the connected Search Console property:

1. Submit `https://www.aquira1978.com/sitemap.xml` in **Sitemaps** and confirm that Google can fetch it. Sitemap submission is a crawl hint rather than an indexing guarantee. [2]
2. Inspect `https://www.aquira1978.com/en/` and request indexing only after the live HTML contains the new canonical, `en-US` alternate, and structured-data markup.
3. Review the **Pages** report weekly for excluded URLs, canonical conflicts, or crawl failures. The baseline at connection time was three indexed pages and ten non-indexed pages.
4. Use the GA4 **Traffic acquisition** report for `Organic Search`, then compare it with Search Console’s query and page reports. Track the English homepage, `/en/about/`, and `/en/contact/` separately.
5. Add pages only when their claims can be supported by the archive. Each significant factual update should refresh the relevant `lastmod` value; Google uses this signal only when it is accurate. [2]

## Editorial priority

The most credible path to greater US-English visibility is not bulk content. It is a small, consistent body of source-backed English archive pages that answer distinct questions about Aquira’s name, record, and official network. New pages should add a unique primary material, date, context, and reference rather than rephrase the homepage. External references should point to the relevant canonical page in this site, while artwork and artist-profile content remains on `aquira.art`.

## Sources

[1] [Google Search Central, “Tell Google about localized versions of your page”](https://developers.google.com/search/docs/specialty/international/localized-versions)

[2] [Google Search Central, “Build and submit a sitemap”](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

[3] [Google Search Central, “Organization structured data”](https://developers.google.com/search/docs/appearance/structured-data/organization)
