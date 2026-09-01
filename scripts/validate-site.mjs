import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://www.aquira1978.com";
const measurementId = "G-ZHRCFRBR5F";
const pages = [
  ["/", "index.html", "ja-JP", "WebPage"],
  ["/about/", "about/index.html", "ja-JP", "AboutPage"],
  ["/contact/", "contact/index.html", "ja-JP", "ContactPage"],
  ["/privacy/", "privacy/index.html", "ja-JP", "WebPage"],
  ["/name-record/", "name-record/index.html", "ja-JP", "WebPage"],
  ["/archive-methodology/", "archive-methodology/index.html", "ja-JP", "WebPage"],
  ["/documented-timeline/", "documented-timeline/index.html", "ja-JP", "WebPage"],
  ["/official-use-corrections/", "official-use-corrections/index.html", "ja-JP", "WebPage"],
  ["/en/", "en/index.html", "en-US", "WebPage"],
  ["/en/about/", "en/about/index.html", "en-US", "AboutPage"],
  ["/en/contact/", "en/contact/index.html", "en-US", "ContactPage"],
  ["/en/privacy/", "en/privacy/index.html", "en-US", "WebPage"],
  ["/en/name-record/", "en/name-record/index.html", "en-US", "WebPage"],
  ["/en/archive-methodology/", "en/archive-methodology/index.html", "en-US", "WebPage"],
  ["/en/documented-timeline/", "en/documented-timeline/index.html", "en-US", "WebPage"],
  ["/en/official-use-corrections/", "en/official-use-corrections/index.html", "en-US", "WebPage"],
];
const heroAlt = {
  ja: "梁のある室内、カウンター、花、吊り下げ照明、右側に立つ人物を写したモノクロ写真",
  en: "Black-and-white photograph of an interior with exposed beams, a counter, flowers, pendant lights, and a person standing at the right.",
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function pair(pathname) {
  const japanese = pathname === "/en/" ? "/" : pathname.replace(/^\/en/, "");
  return [japanese, japanese === "/" ? "/en/" : `/en${japanese}`];
}

for (const [pathname, file, language, type] of pages) {
  const html = await readFile(path.join(root, file), "utf8");
  const [japanese, english] = pair(pathname);
  assert(html.includes(`<html lang="${language}"`), `${file}: incorrect HTML language`);
  assert(html.includes(`data-ga-measurement-id="${measurementId}"`), `${file}: GA4 measurement ID missing`);
  assert(html.includes('<script src="/analytics.js?v=20260831c" defer></script>'), `${file}: consent-aware analytics loader missing`);
  assert(!html.includes('<meta name="keywords"'), `${file}: obsolete keywords meta tag must not be added`);
  assert(html.includes(`<meta property="og:locale:alternate" content="${language === "en-US" ? "ja_JP" : "en_US"}" />`), `${file}: Open Graph alternate locale missing`);
  assert(html.includes(`<link rel="canonical" href="${origin}${pathname}" />`), `${file}: canonical must self-reference`);
  assert(html.includes(`href="${origin}${japanese}" hreflang="ja-JP"`), `${file}: Japanese alternate missing`);
  assert(html.includes(`href="${origin}${english}" hreflang="en-US"`), `${file}: US English alternate missing`);
  assert(html.includes(`href="${origin}${japanese}" hreflang="x-default"`), `${file}: Japanese x-default missing`);
  assert((html.match(/<h1\b/g) ?? []).length === 1, `${file}: exactly one H1 is required`);
  assert(html.includes('data-analytics-banner'), `${file}: analytics consent banner missing`);
  const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert(schema, `${file}: JSON-LD missing`);
  const graph = JSON.parse(schema)["@graph"] ?? [];
  assert(graph.some((item) => item["@type"] === type), `${file}: ${type} schema missing`);
  assert(graph.some((item) => item["@type"] === "WebSite"), `${file}: WebSite schema missing`);
  if (pathname === "/") {
    const organization = graph.find((item) => item["@type"] === "Organization");
    assert(organization, `${file}: Organization schema missing`);
    assert(organization.name === "Aquira", `${file}: Organization schema must use Aquira as the entity name`);
  }
  if (pathname.includes("name-record") || pathname.includes("archive-methodology") || pathname.includes("documented-timeline") || pathname.includes("official-use-corrections")) {
    assert(graph.some((item) => item["@type"] === "BreadcrumbList"), `${file}: archive breadcrumb schema missing`);
    assert(html.includes(language === "en-US" ? 'href="/en/name-record/"' : 'href="/name-record/"'), `${file}: archive navigation entry missing`);
    assert(html.includes('class="breadcrumb"'), `${file}: visible breadcrumb navigation missing`);
  }
  if (language === "en-US") {
    assert(html.includes(`class="language-link" href="${japanese}"`), `${file}: Japanese switch link missing`);
    for (const leaked of ["主要ナビゲーション", "お問い合わせ", "最終更新", "記録について"]) assert(!html.includes(leaked), `${file}: untranslated UI string ${leaked}`);
  } else {
    assert(html.includes(`class="language-link" href="${english}"`), `${file}: English switch link missing`);
  }
}

const japaneseHome = await readFile(path.join(root, "index.html"), "utf8");
const englishHome = await readFile(path.join(root, "en/index.html"), "utf8");
assert(japaneseHome.includes(`alt="${heroAlt.ja}"`), "Japanese hero alt missing");
assert(englishHome.includes(`alt="${heroAlt.en}"`), "English hero alt missing");
assert(japaneseHome.includes("Aquira公式アーカイブ｜起点・来歴・記録"), "Japanese homepage title is not specific enough");
assert(japaneseHome.includes("Aquiraの起点と、歩みの記録。"), "Japanese homepage H1 does not express the Aquira entity");
assert(englishHome.includes("Aquira Official Archive &amp; Name Origin"), "US English title is not specific enough");
assert(englishHome.includes("The official Aquira archive and name record."), "US English H1 does not express the page entity");
assert((englishHome.match(/<meta name="description"/g) ?? []).length === 1, "US English page must have exactly one meta description");
assert(englishHome.includes('aquira-archive-interior-1440.webp') && englishHome.includes('imagesrcset=') && englishHome.includes('fetchpriority="high"'), "English responsive hero preload missing");
const englishTimeline = await readFile(path.join(root, "en/documented-timeline/index.html"), "utf8");
assert(englishTimeline.includes("No dated entries are published at present."), "Timeline evidence-led empty state missing");
assert(!englishTimeline.includes("1978 is"), "Timeline must not infer a date meaning from the name");
const englishUse = await readFile(path.join(root, "en/official-use-corrections/index.html"), "utf8");
assert(englishUse.includes("An enquiry alone does not grant permission for use."), "Use-enquiry permission boundary missing");
await access(path.join(root, "analytics.js"));
await access(path.join(root, "content/archive-pages.js"));
await access(path.join(root, "media/aquira-archive-interior.webp"));
await access(path.join(root, "media/aquira-archive-interior-1440.webp"));
await access(path.join(root, "media/aquira-archive-interior-mobile.webp"));

const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
assert(sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'), "sitemap hreflang namespace missing");
for (const [pathname] of pages) assert(sitemap.includes(`<loc>${origin}${pathname}</loc>`), `sitemap missing ${pathname}`);
assert((sitemap.match(/hreflang="en-US"/g) ?? []).length === pages.length, "sitemap US English alternates missing");
const robots = await readFile(path.join(root, "robots.txt"), "utf8");
assert(robots.includes("Sitemap: https://www.aquira1978.com/sitemap.xml"), "robots sitemap missing");
const production = JSON.parse(await readFile(path.join(root, "ops/production.json"), "utf8"));
assert(production.production_origin === "https://www.aquira1978.com/", "production origin is incorrect");
assert(production.canonical_host === "www.aquira1978.com", "canonical host is incorrect");
assert(production.analytics_measurement_id === measurementId, "production GA4 ID is incorrect");
console.log(`Validation passed: ${pages.length} bilingual pages, reciprocal US-English alternates, consent-aware GA4, schema, assets, sitemap, and robots.`);
