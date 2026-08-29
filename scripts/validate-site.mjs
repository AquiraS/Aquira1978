import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pages = [
  ["index.html", "https://www.aquira1978.com/", "WebPage"],
  ["about/index.html", "https://www.aquira1978.com/about/", "AboutPage"],
  ["contact/index.html", "https://www.aquira1978.com/contact/", "ContactPage"],
];
const officialNetworkLinks = [
  { step: "01", chapter: "作品と出会う", label: "作品・表現", href: "https://www.aquira.art/" },
  { step: "02", chapter: "起点をたどる", label: "起点・記録", href: "https://www.aquira1978.com/" },
  { step: "03", chapter: "対話へひらく", label: "公共的実践", href: "https://www.aquira.org/" },
];
const currentJourneyStep = "02";
const newsLink = '<a href="https://note.com/aquira" target="_blank" rel="external noopener noreferrer" aria-label="Newsを新しいタブで開く">News</a>';

function attribute(attributes, name) {
  return attributes.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateJourneyRail(file, html) {
  const rails = [...html.matchAll(/<nav class="journey-rail"[\s\S]*?<\/nav>/g)];
  assert(rails.length === 1, `${file}: expected exactly one journey rail, found ${rails.length}`);
  assert(/<\/header>\s*<nav class="journey-rail"[\s\S]*?<\/nav>\s*<main id="main-content">/.test(html), `${file}: journey rail must be immediately after the site header and before main`);

  const rail = rails[0][0];
  assert(rail.includes('<nav class="journey-rail" aria-label="AQUIRAをめぐる3章">'), `${file}: journey rail label is incorrect`);
  assert(rail.includes('<p class="journey-rail__eyebrow">AQUIRA JOURNEY <span>3つの公式サイトをめぐる</span></p>'), `${file}: journey rail eyebrow is incorrect`);
  const items = [...rail.matchAll(/<li class="journey-rail__item[^\"]*"><a\b([^>]*)>([\s\S]*?)<\/a><\/li>/g)];
  assert(items.length === officialNetworkLinks.length, `${file}: journey rail must contain exactly three items`);

  const currentLinks = [...rail.matchAll(/aria-current="step"/g)];
  assert(currentLinks.length === 1, `${file}: journey rail must have exactly one current step`);
  for (const [index, expected] of officialNetworkLinks.entries()) {
    const [, attributes, children] = items[index];
    assert(attribute(attributes, "href") === expected.href, `${file}: journey rail item ${index + 1} has an incorrect canonical href`);
    assert(attribute(attributes, "aria-label")?.includes(expected.chapter) && attribute(attributes, "aria-label")?.includes(expected.label), `${file}: journey rail item ${index + 1} needs a complete aria-label`);
    assert(children.includes(`<span class="journey-rail__number" aria-hidden="true">${expected.step}</span>`), `${file}: journey rail item ${index + 1} has an incorrect number`);
    assert(children.includes(`<span class="journey-rail__chapter">${expected.chapter}</span>`), `${file}: journey rail item ${index + 1} has an incorrect chapter`);
    assert(children.includes(`<span class="journey-rail__destination">${expected.label}</span>`), `${file}: journey rail item ${index + 1} has an incorrect destination label`);
    const isCurrent = expected.step === currentJourneyStep;
    assert(attribute(attributes, "aria-current") === (isCurrent ? "step" : undefined), `${file}: only chapter ${currentJourneyStep} may be the current journey step`);
    assert(children.includes('<span class="journey-rail__current">現在地</span>') === isCurrent, `${file}: current journey text is incorrect`);
  }
}

for (const [file, canonical, type] of pages) {
  const html = await readFile(path.join(root, file), "utf8");
  assert(html.includes('<html lang="ja">'), `${file}: missing Japanese language metadata`);
  assert(html.includes(`<link rel="canonical" href="${canonical}" />`), `${file}: missing canonical`);
  assert(html.includes('<body data-journey-stage="origin">'), `${file}: missing origin journey stage`);
  assert(html.includes('<script src="/journey.js" defer></script>'), `${file}: journey.js must be loaded with defer`);
  validateJourneyRail(file, html);
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(match, `${file}: missing JSON-LD`);
  const graph = JSON.parse(match[1])["@graph"];
  assert(graph.some((item) => item["@type"] === type), `${file}: missing ${type} schema`);
  const footer = html.match(/<nav aria-label="Aquira公式ネットワーク">[\s\S]*?<\/nav>/)?.[0];
  assert(footer, `${file}: official ecosystem footer is missing`);
  const footerLinks = [...footer.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)]
    .map((linkMatch) => ({ href: linkMatch[1], label: linkMatch[2] }));
  for (const { label, href } of officialNetworkLinks) {
    assert(footerLinks.some((link) => link.label === label && link.href === href), `${file}: footer must map ${label} to ${href}`);
  }
  assert(footer.split(newsLink).length - 1 === 1 && html.split(newsLink).length - 1 === 1, `${file}: footer must contain exactly one canonical News link`);
}

for (const file of ["index.html", "about/index.html"]) {
  const html = await readFile(path.join(root, file), "utf8");
  const cards = [...html.matchAll(/<a class="network-card__link" href="([^"]+)"[^>]*>[\s\S]*?<h3>([^<]+)<\/h3>[\s\S]*?<\/a>/g)]
    .map((match) => ({ href: match[1], label: match[2] }));
  assert(cards.length === officialNetworkLinks.length, `${file}: expected ${officialNetworkLinks.length} official ecosystem cards, found ${cards.length}`);
  for (const expected of officialNetworkLinks) {
    assert(cards.some((card) => card.label === expected.label && card.href === expected.href), `${file}: full card must map ${expected.label} to ${expected.href}`);
  }
}

const home = await readFile(path.join(root, "index.html"), "utf8");
const homeChapterCards = [...home.matchAll(/<article class="network-card[^\"]*" data-chapter-card data-journey-step="(\d{2})">([\s\S]*?)<\/article>/g)];
assert(homeChapterCards.length === officialNetworkLinks.length, `index.html: expected exactly ${officialNetworkLinks.length} chapter cards`);
for (const [index, expected] of officialNetworkLinks.entries()) {
  const [, step, card] = homeChapterCards[index];
  assert(step === expected.step, `index.html: chapter card ${index + 1} has an incorrect journey step`);
  assert(card.includes(`CHAPTER ${expected.step} · ${expected.chapter}`), `index.html: chapter card ${index + 1} has an incorrect visible chapter line`);
  assert(card.includes('network-card__current">現在地</span>') === (expected.step === currentJourneyStep), `index.html: current chapter card indicator is incorrect`);
}
for (const file of ["about/index.html", "contact/index.html"]) {
  const html = await readFile(path.join(root, file), "utf8");
  assert(!html.includes("data-chapter-card"), `${file}: non-home informational cards must not become chapter cards`);
}

const css = await readFile(path.join(root, "styles.css"), "utf8");
assert(css.includes(".journey-rail"), "styles.css: missing journey rail styles");
assert(/@media \(max-width: 700px\)[\s\S]*?journey-rail__list/.test(css), "styles.css: missing mobile journey rail rule");
assert(css.includes("@media (prefers-reduced-motion: reduce)"), "styles.css: missing reduced-motion rule");
assert(css.includes(".a11y-reduce-motion"), "styles.css: missing site reduced-motion override");
assert(css.includes("@media (forced-colors: active)"), "styles.css: missing forced-colors rule");
await access(path.join(root, "journey.js"));

const robots = await readFile(path.join(root, "robots.txt"), "utf8");
const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
for (const [, canonical] of pages) assert(sitemap.includes(`<loc>${canonical}</loc>`), `sitemap missing ${canonical}`);
assert(robots.includes("Sitemap: https://www.aquira1978.com/sitemap.xml"), "robots sitemap missing");
const production = JSON.parse(await readFile(path.join(root, "ops/production.json"), "utf8"));
assert(production.production_origin === "https://www.aquira1978.com/", "production.json: production origin is incorrect");
assert(production.canonical_host === "www.aquira1978.com", "production.json: canonical host is incorrect");
assert(production.deployment_mode === "manual workflow dispatch", "production.json: unexpected deployment mode");
console.log(`Validation passed: ${pages.length} pages, canonical URLs, JSON-LD, exact ecosystem mappings, and the origin journey rail.`);
