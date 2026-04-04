# PWA / アプリアイコンデザインの調査メモ

Vocaboot のアイコンを決めるために参照した、プラットフォーム公式・コミュニティで広く引用される指針の要約です。最終判断はプロダクトのトーン（TOEIC・学習・オフライン）と既存 UI（ダーク基調・ゴールドのアクセント）に合わせています。

---

## 1. Web App Manifest と `icons`（W3C / MDN）

- マニフェストの [`icons`](https://developer.mozilla.org/en-US/docs/Web/Manifest/icons) は、インストール UI やスプラッシュ、OS シェルで利用されます。
- 各エントリには `src` / `sizes` / `type` に加え、任意で [`purpose`](https://developer.mozilla.org/en-US/docs/Web/Manifest/icons#purpose) を指定します。
- **`any`**（既定）: マスクなしでそのまま表示される用途向け。
- **`maskable`**: アイコンマスク適用時に、余白を含めて「塗りつぶし」として扱われる想定の画像。Android の適応型アイコンまわりで重要。
- **`monochrome`**: 単色トーンのシンボルとして使われる場合向け（テーマ取り込み等）。

出典: [MDN — icons (Web app manifest)](https://developer.mozilla.org/en-US/docs/Web/Manifest/icons)

---

## 2. Maskable アイコンと「最小安全領域」（Google / web.dev）

- Android 8 以降のランチャーでは、アイコンが円・角丸四角など**形のマスク**に合わせて切り抜かれます。従来の「透明 PNG を白い円の中に敷く」見え方から脱却するのが **maskable** 形式です。
- W3C / 実装側で共通化されている考え方として、**重要なロゴやシンボルは「幅の 40% を半径とする中央の円」内に収める**、と説明されることが多いです（外周約 10% は端末によってクロップされうる、という文脈）。
- 検証には Chrome DevTools の **Application → Icons → Show only the minimum safe area for maskable icons** や、コミュニティツール [Maskable.app](https://maskable.app/) がよく参照されます。

出典: [Adaptive icon support in PWAs with maskable icons (web.dev)](https://web.dev/articles/maskable-icon)

補足: 同記事では、`maskable` を `any` と兼用すると余白のせいでアイコンが小さく見えることがあるため、**用途別にアセットを分ける**ことが推奨される、とされています。

---

## 3. Android アダプティブアイコン（Google Developers）

- ネイティブ Android の**アダプティブアイコン**は、前景・背景の 2 レイヤー（推奨はベクター）で構成するモデルです。
- **フルブリード**の背景に対し、**中央の安全域**（端末マスクで切られない領域）にマークを置く、という発想は PWA の maskable と同じ系統です。
- ドキュメント上は **66dp 四方の安全域**（108×108dp キャンバス上）など、dp ベースの数値が明示されています。

出典: [Adaptive icons | Android Developers](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)

---

## 4. Apple のホーム画面アイコン（Human Interface Guidelines）

- iOS / iPadOS では、ホーム画面用に **180×180 pt（ピクセル）** など複数解像度が必要になるのが一般的です（Xcode のアセットカタログでマスターから派生させる運用が公式ドキュメントで説明されます）。
- アイコンは**角丸が OS 側で自動適用**される前提のため、自前で無理に角丸 PNG を切りすぎない、**セーフエリア内に主題を置く**、が実務上の定石です。

出典: [Human Interface Guidelines（Apple Developer）](https://developer.apple.com/design/human-interface-guidelines)  
出典: [Configuring your app icon using an asset catalog](https://developer.apple.com/documentation/xcode/configuring-your-app-icon)

---

## 5. Material Design 3（プロダクトアイコン / システムアイコン）

- Material では**プロダクトアイコン**と**システムアイコン**が区分され、形状・グリッド・トーンの一貫性が整理されています。
- 「ブランドの顔」であるプロダクトアイコンは、システムアイコンよりも**独自性**を持たせ、UI 内の操作アイコンと役割を混同しない、という整理です。

出典: [Icons – Material Design 3](https://m3.material.io/styles/icons/overview)

---

## 6. デザイナー・コミュニティで繰り返される実務ルール

公式文書以外で、ブログやデザインチームの記事で共通して現れる論点です。

| 論点 | 内容 |
|------|------|
| 小サイズ可読性 | ホーム画面やタブでは 29px 級でも判別できる単純なシルエットにする。細い線・小さなタイポは避ける。 |
| 一貫したブランド色 | アプリ内の primary / 背景と整合させ、ストア・PWA・favicon で同じトーンに寄せる。 |
| 透明 vs 不透明 | `maskable` では**不透明な全面背景**が前提。透明部分はプラットフォームが白などで埋めることがある。 |
| 複数解像度 | 少なくとも 192 / 512（manifest 向け）と Apple 向け 180 を用意すると運用が楽。 |
| 検証 | 実機・DevTools・Maskable.app で形のバリエーションを見る。 |

---

## 7. Vocaboot に適用した方針

1. **マスター**: `public/icon-pop-source.png` — **正方形**のキャンバスで、**スクワイクル外周は透過**（アルファ）。中身は Apple / Google のストアアイコンに近い**シンプルでポップ**なフラット寄りの図形（単語カードの積み重ねモチーフ、アクセントに **#F0BF4C** 系）。
2. **`any` 用**: マスターを **192 / 512** にリサイズ（透過は維持）。`icon-192.png` / `icon-512.png`。
3. **`maskable` 用**: **512×512 不透明の黒地**に、マスターを **約 78%** で中央合成した **icon-maskable-512.png**（Android ランチャー向け）。
4. **Apple**: **180×180** の黒地＋中央合成（約 88%）で **apple-touch-icon.png**（ホーム画面での透過白埋めを避ける）。

アセットの生成手順は `package.json` の `icons:export`（`scripts/export-pwa-icons.mjs`）に集約しています。マスター PNG を差し替えたあと必ず `npm run icons:export` を実行してください。
