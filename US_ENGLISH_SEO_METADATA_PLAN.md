# US-English SEO Metadata and Keyword-Structure Plan

**Author:** Manus AI
**Scope:** `https://www.aquira1978.com/en/` and its English archive, contact, and privacy pages
**Status:** Implemented and release-ready

## Executive position

The strongest US-English SEO position for Aquira1978 is not a broad attempt to rank for generic terms such as “archive,” “artist,” or the unrelated spelling “Akira.” The domain should instead establish a precise, verifiable entity association: **Aquira is an official name, origin, and archive record**, with works and artist information directed to `aquira.art` and public-practice material to `aquira.org`. This preserves distinct domain roles, protects the brand from irrelevant-intent traffic, and gives Google consistent evidence across the visible page title, H1, description, canonical URL, localized alternates, and JSON-LD.

Google advises concise, descriptive, page-specific titles that accurately reflect visible primary content; it may use titles, headings, page text, structured data, and external references to form title links. [1] It similarly recommends unique, useful meta descriptions rather than lists of terms. [2] Therefore, this release **does not use a `meta keywords` tag**: Google explicitly ignores it for web-ranking purposes. [3]

## Keyword and entity structure

| Priority | Search concept | Intended location | Implementation rule |
| --- | --- | --- | --- |
| Primary entity | **Aquira** | Beginning of the US-English home title; H1; descriptions; Organization schema | Use exact brand spelling consistently and naturally. |
| Primary topic | **Official Aquira archive** | Home title/H1, About title/H1, archive copy | Establishes a focused source for origin and record-related intent. |
| Primary topic | **Aquira name origin** | Home title, summary, structured page relationship | Addresses the domain’s stated archival purpose without asserting an unsupported etymology. |
| Supporting intent | **Official Aquira name record** | Home lead and About description | Communicates verification and source-led archival standards. |
| Conversion intent | **Official forms / name use / publication** | Contact title, description, contact-page copy | Directs legitimate enquiries without promising permission. |
| Deliberately excluded | Generic “Akira” meanings, anime, ransomware, baby-name and unsourced origin terms | Nowhere | These attract unrelated US search intent and would weaken topical precision. |

> **Editorial boundary:** Do not add claims about the name’s linguistic etymology, artist biography, exhibitions, collections, ownership, or licensing unless a primary source is ready to be cited on the relevant page. People-first, source-led pages are more durable than high-volume, generic pages. [4]

## Implemented metadata changes

| URL | Implemented title | Purpose-specific meta description | Visible H1 |
| --- | --- | --- | --- |
| `/en/` | `Aquira Official Archive & Name Origin \| Aquira1978` | `Official English-language archive for Aquira: the name's origin, verified record, and enquiries about official forms and use.` | `The official Aquira archive and name record.` |
| `/en/about/` | `About the Official Aquira Archive \| Aquira1978` | `How Aquira1978 verifies, preserves, and updates the official Aquira name and archive record.` | `About the official Aquira archive.` |
| `/en/contact/` | `Contact the Official Aquira Archive \| Aquira1978` | `Contact Aquira1978 about archive corrections, official forms of the Aquira name, publication, or proposed use.` | `Contact the official Aquira archive.` |
| `/en/privacy/` | `Privacy & Analytics \| Aquira1978` | Existing specific description retained | `Privacy & Analytics` |

Each English title is distinct, concise, and aligned with the page’s visible H1. Each description is unique and explains the actual page function. These are **snippet and comprehension controls**, not guaranteed ranking controls: Google may choose other on-page text when it better serves a particular query. [2]

## Technical meta and structured-data changes

The release retains self-referencing canonicals, `en-US` / `ja-JP` reciprocal `hreflang` links, an English `x-default`, indexable robots directives, and a complete XML sitemap. The new implementation adds `og:locale:alternate` to every localized page, so link previews identify the equivalent locale as well as the current locale. It retains the restrained `Organization`, `WebSite`, and page-type JSON-LD already present on the English homepage. No invisible keyword lists, fabricated facts, or misleading structured-data fields were added.

The site generator and validator now impose two safeguards: generated pages must contain the correct alternate Open Graph locale, and a `meta keywords` tag is prohibited. This makes the strategy code-enforced rather than dependent on manual editing.

## Next content decision rule

The next growth step should occur only when Aquira holds an original source, date, and context suitable for public record. At that point, create a focused English archive page with a unique canonical URL, factual title/H1, one clear question it answers, a visible source note, and a corresponding Japanese version. Suggested future page themes are a dated timeline of the name’s documented use, a methodology page explaining record criteria, and a corrections policy. They should not be created as generic content inventory; Google’s guidance favors useful, reliable information created for people rather than pages made primarily to attract search traffic. [4]

## Validation and publication checklist

| Check | Result |
| --- | --- |
| Eight-page build and metadata validation | Passed locally with `npm run test` |
| JavaScript syntax validation | Passed |
| Diff whitespace validation | Passed |
| Generated HTML has `meta keywords` | Confirmed absent |
| US-English title/H1/descriptions | Confirmed updated in generated pages |
| GitHub Pages deployment | Pending dispatch for this metadata-only commit |
| Search Console sitemap | Already accepted successfully with eight detected pages |

## References

[1]: https://developers.google.com/search/docs/appearance/title-link "Influencing your title links in Google Search"
[2]: https://developers.google.com/search/docs/appearance/snippet "Control your snippets in Google Search"
[3]: https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag "Google does not use the keywords meta tag in web ranking"
[4]: https://developers.google.com/search/docs/fundamentals/creating-helpful-content "Creating helpful, reliable, people-first content"
