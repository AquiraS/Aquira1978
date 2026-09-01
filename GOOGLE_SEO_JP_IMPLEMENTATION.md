# Aquira1978 日本向け Google SEO 実装記録

**更新日:** 2026-09-01  
**市場優先:** 日本語・日本  
**対象:** `https://www.aquira1978.com/`  
**実装原則:** Aquira を正確に識別できる公式アーカイブとして強化し、推測、重複コンテンツ、キーワードの詰め込み、誤認を招く提携表記は行わない。

## 結論

**本リリースは、Aquira の日本語指名検索と公式アーカイブ意図に対する基盤を、検索クローラと利用者の双方に明確化するものです。** Google 検索の順位はGoogleがクエリ、競合、検索意図、品質シグナルを総合して決定するため、1位を保証するものではありません。しかし、本実装は、サイトの表題・最上位見出し・本文・構造化データ・言語設定・内部導線を「Aquiraの公式アーカイブ」という同一の意味に揃えます。Googleは人の役に立つ信頼できる内容、自然な検索語の使用、クロール可能なリンク、適切な構造化データを推奨しています。[1] そのため、検索量だけを目的とする一般語の追加ではなく、名称の起点、来歴、確認可能な記録、公式表記という、このドメイン固有の役割を強めました。

## 公開実装

| 領域 | 実装 | Google 検索への意味 |
|---|---|---|
| 日本語の検索入口 | トップページの title を `Aquira公式アーカイブ｜起点・来歴・記録`、H1 を `Aquiraの起点と、歩みの記録。` に更新しました。 | 指名検索で、Aquiraと公式アーカイブの関係をタイトル・見出し・本文で一致させます。Googleはタイトル、H1、本文、リンク、構造化データをタイトルリンクの候補として使用します。[2] |
| エンティティの明確化 | 日本語トップページの `Organization` JSON-LD を `name: Aquira`、`alternateName: Aquira1978` とし、公式ネットワークと問い合わせ先だけを記載しました。 | 表記ゆれを抑え、検索エンジンが Aquira を公式サイト群と関連付けるための限定的かつ正確な手がかりを示します。Organization markup はホームまたは組織説明ページに置くことが推奨されています。[3] |
| 日本語優先の多言語設定 | 全16 URL の HTML と XML sitemap で `ja-JP`、`en-US`、`x-default` を相互参照し、`x-default` を日本語の正規入口に変更しました。 | 日本市場を優先しながら、英語ページを独立した対応版として保持します。相互参照と完全URLの hreflang はGoogleの推奨パターンです。[4] |
| アーカイブ導線 | 8本のアーカイブ記事に、画面上で確認できるパンくずを追加し、既存の `BreadcrumbList` 構造化データと一致させました。 | ユーザーとクローラの双方に、Aquira1978 → アーカイブ → 記録ページの関係を明示します。構造化データは画面上の情報と一致させる必要があります。[5] |
| 表示速度 | 2048px の元画像を保持したまま、1440px・366KB のデスクトップ用 WebP を追加しました。ホームの preload、`picture`、`srcset`、`sizes` を更新し、一般的なデスクトップ幅ではより軽い画像を選択します。 | ファーストビューの転送量を抑え、LCP改善の余地をつくります。Core Web VitalsではLCP 2.5秒以内、INP 200ms未満、CLS 0.1未満が良好な体験の目安です。[6] |
| インデックス発見 | `robots.txt` はクロールを許可し、`sitemap.xml` は16本の正規URL・言語代替URL・更新日を出力します。 | Google に最新の正規URLセットを発見させる入口を維持します。サイトマップはクロールのヒントであり、インデックスまたは順位の保証ではありません。[1] |

## 監査スナップショット

| 項目 | 観測結果 | 判定 |
|---|---:|---|
| HTTPS・正規ホスト | `aquira1978.com` は `www.aquira1978.com` に 301、canonical は `https://www.aquira1978.com/` | 正常 |
| インデックス制御 | `index,follow`、有効な `robots.txt`、sitemap 宣言 | 正常 |
| サイトマップ | 16 URL、各URLに `ja-JP` / `en-US` / `x-default` | 実装済み |
| ページ固有 metadata | 16ページすべてが 200、固有 title・description・self-canonical・H1を持つ | 実装済み |
| JSON-LD | 16ページに `WebSite` とページ種別、アーカイブ8ページに `BreadcrumbList`、日本語トップに `Organization` | 実装済み |
| Lighthouse（公開前のデスクトップ試験） | 実装前の試験では Performance 57、LCP 4.9秒。応答画像を生成後、未公開の本番サイトに対する再試験では Performance 59、LCP 4.0秒、SEO 92、Accessibility 96、Best Practices 100、CLS 0、TBT 30ms。 | 最大課題はヒーロー画像を含む初期表示。サイト公開後にキャッシュを分離して再計測し、Search Consoleの実ユーザーデータで確認する。 |
| GA4 | `G-ZHRCFRBR5F` を、同意取得後のみ読み込む構成 | 実装済み |

> Lighthouse は合成環境での一回のラボ計測です。実ユーザーの Core Web Vitals 判定は、Search Console のフィールドデータで確認します。[6]

## Google 運用で残る作業

Google Search Console の `https://www.aquira1978.com/` URL-prefix property は、既存の運用記録ではHTMLタグ方式で所有権確認済みです。2026-08-31時点でサイトマップは8 URLとして処理済みでした。今回の16 URL sitemapへの更新は、コードの公開後にSearch Consoleで再送信または既存エントリを更新して、Googleによる再クロールを促してください。Search Console接続はこのセッションでは利用可能ではないため、現在のインデックス数、クエリ、平均掲載順位、Core Web Vitalsのフィールドデータは取得・変更していません。

| 優先度 | 運用アクション | 成功条件 |
|---|---|---|
| 1 | コード公開後、Search Consoleで `https://www.aquira1978.com/sitemap.xml` を再送信します。 | 16 URL が検出され、取得失敗がない。 |
| 2 | ホーム、`/name-record/`、`/archive-methodology/`、`/documented-timeline/`、`/official-use-corrections/` を URL 検査します。 | 各URLがGoogleにアクセス可能で、canonical と `ja-JP` が正しく認識される。 |
| 3 | 28日単位で「Aquira」「Aquira1978」「Aquira 公式」「Aquira アーカイブ」をクエリレポートで確認します。 | 表示回数、クリック、平均掲載順位をブランドクエリと非ブランドクエリに分けて記録する。 |
| 4 | Core Web Vitals レポートを確認します。 | モバイル・デスクトップ双方でLCP、INP、CLSの実測値を改善対象として特定する。 |

## Google Business Profile の判断

現時点の `aquira1978.com` は、名称と記録を扱うアーカイブサイトです。来訪者を受け入れる実在の拠点、公開可能な住所、営業時間、電話番号、主業種がこのサイトの公開情報として確認できないため、**Google Business Profile はこのリリースでは作成しません。** 実在しない場所、私的な所在地、サービス内容を登録すると、検索意図とブランドの信頼性を損ねます。公開の来訪拠点がある場合のみ、正確なNAP（名称・住所・電話番号）、カテゴリ、営業時間、サイトURLを一貫させ、公式写真とともに別途登録します。

## 検証コマンド

```bash
npm run test
```

このコマンドは、16の日本語・英語ページ、自己参照 canonical、相互 hreflang、日本語 `x-default`、各ページ1つのH1、構造化データ、表示パンくず、同意後のみ読み込まれるGA4、sitemap、robots、応答ヒーロー画像を検査します。

## References

[1]: https://developers.google.com/search/docs/essentials "Google Search Essentials"
[2]: https://developers.google.com/search/docs/appearance/title-link "Influencing your title links in Google Search"
[3]: https://developers.google.com/search/docs/appearance/structured-data/organization "Organization structured data"
[4]: https://developers.google.com/search/docs/specialty/international/localized-versions "Tell Google about localized versions of your page"
[5]: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb "Breadcrumb structured data"
[6]: https://developers.google.com/search/docs/appearance/core-web-vitals "Understanding Core Web Vitals and Google search results"
