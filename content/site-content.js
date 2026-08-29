/**
 * Aquira1978 編集用コンテンツ
 * 原則: 検証済みでない経歴、実績、権利、サービス、料金は公開しない。
 */
const journeyChapters = [
  {
    step: "01",
    chapter: "作品と出会う",
    label: "作品・表現",
    role: "OFFICIAL ARTIST HOME",
    text: "作品、作家プロフィール、協働、利用許諾に関する公式情報。",
    href: "https://www.aquira.art/",
  },
  {
    step: "02",
    chapter: "起点をたどる",
    label: "起点・記録",
    role: "ORIGIN & ARCHIVE",
    text: "名称の由来、来歴、アーカイブ、ブランド利用に関する記録。",
    href: "https://www.aquira1978.com/",
  },
  {
    step: "03",
    chapter: "対話へひらく",
    label: "公共的実践",
    role: "PROJECTS & DIALOGUE",
    text: "対話、協働、社会と交わるプロジェクトの記録と入口。",
    href: "https://www.aquira.org/",
  },
];

const siteContent = {
  site: {
    name: "Aquira1978",
    shortName: "AQUIRA1978",
    origin: "https://www.aquira1978.com",
    description: "Aquiraの名称の起点、来歴、アーカイブ、ブランド利用に関する記録を扱う公式サイトです。",
    lastModified: "2026-08-28",
  },
  role: {
    eyebrow: "ORIGIN & ARCHIVE",
    title: "名前の起点と、歩みの記録。",
    lead: "Aquira1978は、Aquiraという名称の由来、来歴、アーカイブ、ブランド利用に関する記録を扱う公式サイトです。作品・作家情報はaquira.art、対話と協働のプロジェクトはaquira.orgでご案内します。",
  },
  purpose: [
    {
      title: "起点を記す",
      text: "名称や活動の背景について、出典を確認できる記録を静かに整理します。推測や未確認の情報は、公式な記録として扱いません。",
    },
    {
      title: "歩みを残す",
      text: "公開できる時点・文脈・参照先を添え、後から確認できるアーカイブを少しずつ育てます。",
    },
    {
      title: "利用の入口を整える",
      text: "Aquiraの名称や公式表記に関する相談は、利用目的と掲載先を確認したうえで、適切な窓口へご案内します。",
    },
  ],
  archive: [
    {
      title: "記録の基準",
      text: "掲載する内容は、公開済みの一次資料、作成日、参照先を確認できるものに限ります。事実確認中の情報は公開しません。",
    },
    {
      title: "更新の考え方",
      text: "記録の追加や訂正は、内容の正確さを優先します。断片的な情報より、出典と文脈のある記録を大切にします。",
    },
  ],
  contact: {
    title: "記録・公式表記に関するお問い合わせ",
    lead: "名称の由来、記録の訂正、公式表記、掲載・利用に関するご相談は、対象となる内容、掲載先または利用目的、予定時期を添えてお知らせください。相談だけで利用許可が成立することはありません。",
    email: "aquirae@me.com",
  },
  journey: {
    stage: "origin",
    ariaLabel: "AQUIRAをめぐる3章",
    eyebrow: "AQUIRA JOURNEY",
    eyebrowDetail: "3つの公式サイトをめぐる",
    currentLabel: "現在地",
    chapters: journeyChapters,
  },
  network: journeyChapters,
};

export default siteContent;
