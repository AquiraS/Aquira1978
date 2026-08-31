import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentUrl = pathToFileURL(path.join(root, "content", "site-content.js"));
const { default: content } = await import(`${contentUrl.href}?updated=${Date.now()}`);

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");
const jsonForHtml = (value) => JSON.stringify(value, null, 2).replaceAll("<", "\\u003c");
const absoluteUrl = (pathname) => new URL(pathname, `${content.site.origin}/`).href;
const enPath = (jaRoute) => jaRoute === "/" ? "/en/" : `/en${jaRoute}`;
const jaPath = (pathname) => pathname === "/en/" ? "/" : pathname.replace(/^\/en/, "");
const heroAlt = {
  ja: "梁のある室内、カウンター、花、吊り下げ照明、右側に立つ人物を写したモノクロ写真",
  en: "Black-and-white photograph of an interior with exposed beams, a counter, flowers, pendant lights, and a person standing at the right.",
};

const english = {
  siteDescription: "The official English-language record of the Aquira name: its origin, history, archive, and brand-use enquiries.",
  role: {
    eyebrow: "OFFICIAL ORIGIN & ARCHIVE",
    title: "The official record of the Aquira name and archive.",
    lead: "Aquira1978 is the official English-language record of the Aquira name—its origin, history, archive, and brand use. For works and the artist profile, visit aquira.art; for dialogue and collaborative projects, visit aquira.org.",
  },
  purpose: [
    ["Documenting the origin", "We quietly organise records, with verifiable sources, about the background to the name and activities. We do not treat conjecture or unverified information as an official record."],
    ["Preserving the archive", "Where they can be made public, we add dates, context and references, gradually developing an archive that can be consulted later."],
    ["Providing a point of contact for name use", "For enquiries about use of the name Aquira or its official forms, we will direct you to the appropriate contact after confirming the intended use and where it will appear."],
  ],
  archive: [
    ["Standards for the record", "We include only content for which publicly available primary materials, date of creation and references can be verified. Information whose facts are still being verified is not published."],
    ["Approach to updates", "When records are added or corrected, accuracy takes priority. We value records with sources and context over fragmentary information."],
  ],
  contact: {
    title: "Enquiries concerning records and official forms of the name",
    lead: "For enquiries about the origin of the name, corrections to the record, official forms of the name, or publication and use, please include the material concerned, the intended placement or purpose of use, and the intended date. An enquiry alone does not grant permission for use.",
  },
  privacy: {
    title: "Privacy & Analytics",
    lead: "A clear explanation of the optional site analytics used by Aquira1978.",
    analytics: "With your permission, this website uses Google Analytics to understand aggregate use of pages, scroll depth, and outbound links. Analytics are not loaded until you choose to allow them.",
    choice: "You can change this choice at any time below. Declining analytics does not prevent access to this website.",
  },
};

function localizedPaths(pathname) {
  const japanese = jaPath(pathname);
  return { japanese, english: enPath(japanese) };
}

function languageAlternates(pathname) {
  const { japanese, english: englishPath } = localizedPaths(pathname);
  return `<link rel="alternate" href="${absoluteUrl(japanese)}" hreflang="ja-JP" />\n  <link rel="alternate" href="${absoluteUrl(englishPath)}" hreflang="en-US" />\n  <link rel="alternate" href="${absoluteUrl(englishPath)}" hreflang="x-default" />`;
}

function header(pathname, language) {
  const isEnglish = language === "en";
  const aboutHref = isEnglish ? "/en/about/" : "/about/";
  const languageHref = isEnglish ? jaPath(pathname) : enPath(pathname);
  return `<header class="site-header"><a class="wordmark" href="${isEnglish ? "/en/" : "/"}" aria-label="${isEnglish ? "Aquira1978 home" : "Aquira1978 ホーム"}">AQUIRA1978</a><nav aria-label="${isEnglish ? "Primary navigation" : "主要ナビゲーション"}"><a href="${aboutHref}"${pathname === aboutHref ? ' aria-current="page"' : ""}>${isEnglish ? "About the Archive" : "記録について"}</a><a class="language-link" href="${languageHref}" aria-label="${isEnglish ? "Switch to Japanese" : "Switch to English"}">${isEnglish ? "日本語" : "EN"}</a><span class="language-link language-link--current" aria-current="page">${isEnglish ? "EN-US" : "日本語"}</span></nav><a class="header-contact" href="mailto:${content.contact.email}">${isEnglish ? "Contact" : "お問い合わせ"}</a></header>`;
}

function networkCards(language) {
  const isEnglish = language === "en";
  const items = isEnglish
    ? [
      { step: "01", role: "OFFICIAL ARTIST HOME", label: "Works & Expression", text: "Official information concerning works, the artist profile, collaborations and licensing.", href: "https://www.aquira.art/en/" },
      { step: "02", role: "ORIGIN & ARCHIVE", label: "Origin & Archive", text: "Records concerning the origin of the name, its history, archive, and use of the brand.", href: "/en/" },
      { step: "03", role: "PROJECTS & DIALOGUE", label: "Public Practice", text: "A record of, and point of entry to, projects engaging with society, dialogue and collaboration.", href: "https://www.aquira.org/en/" },
    ]
    : content.network;
  return `<div class="network-grid">${items.map((item) => {
    const current = item.href === (isEnglish ? "/en/" : content.site.origin + "/");
    const cta = isEnglish ? (current ? "View this site" : "Visit the official site") : `${current ? "このサイト" : "公式サイト"}を見る`;
    const aria = isEnglish ? `Open the ${item.label} website` : `${item.label}のホームページを開く`;
    return `<article class="network-card"><a class="network-card__link" href="${item.href}"${current ? "" : ' rel="external noopener noreferrer"'} aria-label="${aria}"><p class="index">${item.step}</p><p class="role">${item.role}</p><h3>${item.label}</h3><p>${item.text}</p><span class="network-card__cta">${cta} <span aria-hidden="true">→</span></span></a></article>`;
  }).join("")}</div>`;
}

function footer(language) {
  const isEnglish = language === "en";
  const network = isEnglish
    ? [["Works & Expression", "https://www.aquira.art/en/"], ["Origin & Archive", "/en/"], ["Public Practice", "https://www.aquira.org/en/"]]
    : content.network.map((item) => [item.label, item.href]);
  const privacyHref = isEnglish ? "/en/privacy/" : "/privacy/";
  const privacyLabel = isEnglish ? "Privacy & Analytics" : "プライバシーと解析";
  return `<footer class="site-footer"><div><p class="footer-title">Aquira1978</p><p>${isEnglish ? "Name origin, history & archive" : "名称の起点・来歴・アーカイブ"}</p></div><nav aria-label="${isEnglish ? "Aquira Official Network" : "Aquira公式ネットワーク"}"><p class="footer-label">AQUIRA OFFICIAL NETWORK</p><ul>${network.map(([label, href]) => `<li><a href="${href}"${href.startsWith("/") ? "" : ' rel="external noopener noreferrer"'}>${label}</a></li>`).join("")}<li><a href="${content.news.href}" target="_blank" rel="external noopener noreferrer" aria-label="${isEnglish ? "Open News in a new tab" : "Newsを新しいタブで開く"}">News</a></li><li><a href="${privacyHref}">${privacyLabel}</a></li></ul></nav><p class="footer-date">${isEnglish ? "Last updated" : "最終更新"} <time datetime="${content.site.lastModified}">${content.site.lastModified}</time></p></footer>`;
}

function analyticsBanner(language) {
  const isEnglish = language === "en";
  const privacyHref = isEnglish ? "/en/privacy/" : "/privacy/";
  const message = isEnglish
    ? `With your permission, Aquira1978 uses Google Analytics for aggregate site measurement. <a href="${privacyHref}">Learn about analytics and manage your choice.</a>`
    : `Aquira1978は、ご許可をいただいた場合に限り、サイト利用の集計分析のためGoogle Analyticsを使用します。<a href="${privacyHref}">解析について確認し、選択を管理する。</a>`;
  const allow = isEnglish ? "Allow analytics" : "解析を許可する";
  const decline = isEnglish ? "Continue without analytics" : "解析なしで続ける";
  return `<section class="analytics-consent" data-analytics-banner hidden role="dialog" aria-label="${isEnglish ? "Analytics consent" : "解析への同意"}"><p>${message}</p><div class="analytics-consent__actions"><button class="button" type="button" data-analytics-accept>${allow}</button><button class="analytics-consent__decline" type="button" data-analytics-decline>${decline}</button></div></section>`;
}

function schemas(page) {
  const graph = [
    { "@type": "WebSite", "@id": `${content.site.origin}/#website`, url: `${content.site.origin}/`, name: content.site.name, alternateName: content.site.shortName, inLanguage: ["ja-JP", "en-US"], description: page.language === "en" ? english.siteDescription : content.site.description },
    { "@type": page.type, "@id": `${absoluteUrl(page.pathname)}#webpage`, url: absoluteUrl(page.pathname), name: page.title, description: page.description, inLanguage: page.language === "en" ? "en-US" : "ja-JP", isPartOf: { "@id": `${content.site.origin}/#website` }, dateModified: content.site.lastModified },
  ];
  if (page.key === "home" && page.language === "en") {
    graph.unshift({
      "@type": "Organization",
      "@id": `${content.site.origin}/#organization`,
      name: content.site.name,
      alternateName: content.site.shortName,
      url: `${content.site.origin}/`,
      email: content.contact.email,
      sameAs: ["https://www.aquira.art/", "https://www.aquira.org/", content.news.href],
    });
  }
  return graph;
}

function layout(page) {
  const isEnglish = page.language === "en";
  const canonical = absoluteUrl(page.pathname);
  return `<!doctype html>\n<html lang="${isEnglish ? "en-US" : "ja-JP"}" data-ga-measurement-id="${escapeHtml(content.analytics.measurementId)}">\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <meta name="description" content="${escapeHtml(page.description)}" />\n  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />\n  <meta name="author" content="Aquira1978" />\n  <meta name="theme-color" content="#121311" />\n  <title>${escapeHtml(page.title)}</title>\n  <link rel="canonical" href="${canonical}" />\n  ${page.key === "home" ? `<link rel="preload" as="image" href="${absoluteUrl("/media/aquira-archive-interior.webp")}" type="image/webp" fetchpriority="high" />` : ""}\n  ${languageAlternates(page.pathname)}\n  <link rel="stylesheet" href="/styles.css?v=20260831c" />\n  <meta property="og:locale" content="${isEnglish ? "en_US" : "ja_JP"}" />\n  <meta property="og:type" content="website" />\n  <meta property="og:site_name" content="Aquira1978" />\n  <meta property="og:title" content="${escapeHtml(page.title)}" />\n  <meta property="og:description" content="${escapeHtml(page.description)}" />\n  <meta property="og:url" content="${canonical}" />\n  <meta property="og:image" content="${absoluteUrl("/media/aquira-archive-interior.webp")}" />\n  <meta property="og:image:width" content="2048" />\n  <meta property="og:image:height" content="1392" />\n  <meta property="og:image:alt" content="${heroAlt[page.language]}" />\n  <meta name="twitter:card" content="summary_large_image" />\n  <meta name="twitter:title" content="${escapeHtml(page.title)}" />\n  <meta name="twitter:description" content="${escapeHtml(page.description)}" />\n  <meta name="twitter:image" content="${absoluteUrl("/media/aquira-archive-interior.webp")}" />\n  <meta name="twitter:image:alt" content="${heroAlt[page.language]}" />\n  <script type="application/ld+json">${jsonForHtml({ "@context": "https://schema.org", "@graph": schemas(page) })}</script>\n  <script src="/analytics.js?v=20260831c" defer></script>\n</head>\n<body data-journey-stage="${content.journey.stage}">\n  <a class="skip-link" href="#main-content">${isEnglish ? "Skip to main content" : "本文へ移動"}</a>\n  ${header(page.pathname, page.language)}\n  <main id="main-content">${page.main}</main>\n  ${footer(page.language)}\n  ${analyticsBanner(page.language)}\n</body>\n</html>`;
}

const japanesePages = [
  { key: "home", language: "ja", pathname: "/", output: "index.html", type: "WebPage", title: "Aquira1978｜起点と記録", description: content.site.description, main: `<section class="hero hero-visual" aria-labelledby="hero-title"><picture class="hero__media"><source media="(max-width: 700px)" srcset="/media/aquira-archive-interior-mobile.webp" type="image/webp" /><img class="hero__image" src="/media/aquira-archive-interior.webp" width="2048" height="1392" alt="${heroAlt.ja}" fetchpriority="high" decoding="async" /></picture><div class="hero__content"><p class="eyebrow">${content.role.eyebrow}</p><h1 id="hero-title">${content.role.title}</h1><p class="lead">${content.role.lead}</p><a class="button" href="/about/">記録について知る</a></div></section><section class="section" aria-labelledby="purpose-title"><div class="section-heading"><p class="eyebrow">PURPOSE</p><h2 id="purpose-title">記録に、文脈を添える。</h2></div><div class="card-grid">${content.purpose.map((item) => `<article class="content-card"><h3>${item.title}</h3><p>${item.text}</p></article>`).join("")}</div></section><section class="section contact-section" aria-labelledby="home-contact-title"><div class="section-heading"><p class="eyebrow">CONTACT</p><h2 id="home-contact-title">記録の確認から、静かに。</h2></div><p class="statement">掲載内容の訂正、公式表記、名称・記録に関するご相談を受け付けています。</p><a class="button" href="/contact/">お問い合わせへ</a></section>` },
  { key: "about", language: "ja", pathname: "/about/", output: "about/index.html", type: "AboutPage", title: "記録について｜Aquira1978", description: "Aquira1978における記録の基準、更新の考え方、公式ネットワークの役割を案内します。", main: `<section class="hero hero-compact"><p class="eyebrow">ARCHIVE PRINCIPLES</p><h1>確認できることを、丁寧に残す。</h1><p class="lead">Aquira1978は、情報を増やすことではなく、参照先と文脈を保った記録を残すことを大切にします。</p></section><section class="section"><div class="prose-list">${content.archive.map((item) => `<article><h2>${item.title}</h2><p>${item.text}</p></article>`).join("")}</div></section><section class="section section-muted" aria-labelledby="about-network-title"><div class="section-heading"><p class="eyebrow">OFFICIAL NETWORK</p><h2 id="about-network-title">情報の役割を、混ぜない。</h2></div>${networkCards("ja")}</section>` },
  { key: "contact", language: "ja", pathname: "/contact/", output: "contact/index.html", type: "ContactPage", title: "お問い合わせ｜Aquira1978", description: "Aquira1978の記録、公式表記、掲載・利用に関するお問い合わせ窓口です。", main: `<section class="hero hero-compact"><p class="eyebrow">CONTACT</p><h1>${content.contact.title}</h1><p class="lead">${content.contact.lead}</p><a class="button" href="mailto:${content.contact.email}">${content.contact.email}</a></section><section class="section section-muted"><div class="prose-list"><article><h2>作品・協働のご相談</h2><p>作品、作家プロフィール、協働、利用許諾に関する情報は、<a href="https://www.aquira.art/" rel="external noopener noreferrer">aquira.art</a>からご確認ください。</p></article><article><h2>対話・プロジェクトのご相談</h2><p>社会と交わる活動、対話、協働の入口は、<a href="https://www.aquira.org/" rel="external noopener noreferrer">aquira.org</a>でご案内します。</p></article></div></section>` },
  { key: "privacy", language: "ja", pathname: "/privacy/", output: "privacy/index.html", type: "WebPage", title: "プライバシーと解析｜Aquira1978", description: "Aquira1978における任意のGoogle Analytics利用と、解析設定の選択方法を案内します。", main: `<section class="hero hero-compact"><p class="eyebrow">PRIVACY & ANALYTICS</p><h1>解析の選択を、明確に。</h1><p class="lead">Aquira1978では、同意をいただいた場合に限り、Google Analyticsによるサイト利用の集計分析を行います。</p></section><section class="section section-muted"><div class="prose-list"><article><h2>使用する情報</h2><p>許可された場合、ページ閲覧、スクロール、外部リンクの利用状況を集計的に把握します。解析を許可するまでGoogle Analyticsは読み込まれません。</p></article><article><h2>選択の変更</h2><p>解析を拒否しても、このサイトの閲覧は制限されません。下のボタンから、いつでも選択を変更できます。</p><p class="analytics-preferences"><button class="button" type="button" data-analytics-preference="granted">解析を許可する</button><button class="analytics-consent__decline" type="button" data-analytics-preference="denied">解析を拒否する</button></p></article></div></section>` },
];

const englishPages = [
  { key: "home", language: "en", pathname: "/en/", output: "en/index.html", type: "WebPage", title: "Aquira1978 | Official Aquira Origin & Archive Record", description: english.siteDescription, main: `<section class="hero hero-visual" aria-labelledby="hero-title"><picture class="hero__media"><source media="(max-width: 700px)" srcset="/media/aquira-archive-interior-mobile.webp" type="image/webp" /><img class="hero__image" src="/media/aquira-archive-interior.webp" width="2048" height="1392" alt="${heroAlt.en}" fetchpriority="high" decoding="async" /></picture><div class="hero__content"><p class="eyebrow">${english.role.eyebrow}</p><h1 id="hero-title">${english.role.title}</h1><p class="lead">${english.role.lead}</p><a class="button" href="/en/about/">About the Archive</a></div></section><section class="section" aria-labelledby="purpose-title"><div class="section-heading"><p class="eyebrow">PURPOSE</p><h2 id="purpose-title">Context for the record.</h2></div><div class="card-grid">${english.purpose.map(([title, text]) => `<article class="content-card"><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></section><section class="section contact-section" aria-labelledby="home-contact-title"><div class="section-heading"><p class="eyebrow">CONTACT</p><h2 id="home-contact-title">Begin with the record.</h2></div><p class="statement">We welcome enquiries concerning corrections to published material, official forms of the name, and the name or records.</p><a class="button" href="/en/contact/">Contact</a></section>` },
  { key: "about", language: "en", pathname: "/en/about/", output: "en/about/index.html", type: "AboutPage", title: "About the Archive | Aquira1978", description: "An introduction to Aquira1978’s standards for records, approach to updates, and the roles within its official network.", main: `<section class="hero hero-compact"><p class="eyebrow">ARCHIVE PRINCIPLES</p><h1>Preserving what can be verified, with care.</h1><p class="lead">At Aquira1978, our priority is not to increase information but to preserve records with their references and context intact.</p></section><section class="section"><div class="prose-list">${english.archive.map(([title, text]) => `<article><h2>${title}</h2><p>${text}</p></article>`).join("")}</div></section><section class="section section-muted" aria-labelledby="about-network-title"><div class="section-heading"><p class="eyebrow">OFFICIAL NETWORK</p><h2 id="about-network-title">Keeping the roles of information distinct.</h2></div>${networkCards("en")}</section>` },
  { key: "contact", language: "en", pathname: "/en/contact/", output: "en/contact/index.html", type: "ContactPage", title: "Contact | Aquira1978", description: "A contact point for enquiries concerning Aquira1978 records, official forms of the name, publication and use.", main: `<section class="hero hero-compact"><p class="eyebrow">CONTACT</p><h1>${english.contact.title}</h1><p class="lead">${english.contact.lead}</p><a class="button" href="mailto:${content.contact.email}">${content.contact.email}</a></section><section class="section section-muted"><div class="prose-list"><article><h2>Enquiries about works and collaborations</h2><p>For information about works, the artist profile, collaborations and licensing, please visit <a href="https://www.aquira.art/en/" rel="external noopener noreferrer">aquira.art</a>.</p></article><article><h2>Enquiries about dialogue and projects</h2><p>For activities engaging with society, dialogue and collaboration, <a href="https://www.aquira.org/en/" rel="external noopener noreferrer">aquira.org</a> provides the point of entry.</p></article></div></section>` },
  { key: "privacy", language: "en", pathname: "/en/privacy/", output: "en/privacy/index.html", type: "WebPage", title: "Privacy & Analytics | Aquira1978", description: "How Aquira1978 uses optional Google Analytics and how visitors can manage their analytics choice.", main: `<section class="hero hero-compact"><p class="eyebrow">PRIVACY & ANALYTICS</p><h1>${english.privacy.title}</h1><p class="lead">${english.privacy.lead}</p></section><section class="section section-muted"><div class="prose-list"><article><h2>Optional analytics</h2><p>${english.privacy.analytics}</p></article><article><h2>Manage your choice</h2><p>${english.privacy.choice}</p><p class="analytics-preferences"><button class="button" type="button" data-analytics-preference="granted">Allow analytics</button><button class="analytics-consent__decline" type="button" data-analytics-preference="denied">Decline analytics</button></p></article></div></section>` },
];

const pages = [...japanesePages, ...englishPages];
await Promise.all(pages.map(async (page) => {
  const output = path.join(root, page.output);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${layout(page).replace(/[ \t]+$/gm, "").trim()}\n`, "utf8");
}));

const sitemapAlternates = (pathname) => {
  const { japanese, english: englishPath } = localizedPaths(pathname);
  return `    <xhtml:link rel="alternate" hreflang="ja-JP" href="${absoluteUrl(japanese)}" />\n    <xhtml:link rel="alternate" hreflang="en-US" href="${absoluteUrl(englishPath)}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(englishPath)}" />`;
};
await writeFile(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${pages.map((page) => `  <url>\n    <loc>${absoluteUrl(page.pathname)}</loc>\n${sitemapAlternates(page.pathname)}\n    <lastmod>${content.site.lastModified}</lastmod>\n  </url>`).join("\n")}\n</urlset>\n`, "utf8");
await writeFile(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\nUser-agent: Google-Extended\nAllow: /\nUser-agent: OAI-SearchBot\nAllow: /\nUser-agent: ClaudeBot\nAllow: /\nUser-agent: PerplexityBot\nAllow: /\n\nSitemap: ${content.site.origin}/sitemap.xml\n`, "utf8");
console.log(`Generated ${pages.length} bilingual Aquira1978 static pages.`);
